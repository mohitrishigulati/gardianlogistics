"use client";

import { useEffect, useState } from "react";
import { DashboardCard, DashboardShell, StatusBadge } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/agents", label: "Manage Agents" },
  { href: "/admin/shipments", label: "Approve Trackers" },
  { href: "/admin/kyc", label: "Agent KYC" },
];

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Array<Record<string, unknown>>>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  function load() {
    fetch("/api/admin/shipments")
      .then((r) => r.json())
      .then((d) => setShipments(d.shipments ?? []));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAction(shipmentId: string, action: "approve" | "reject") {
    await fetch("/api/admin/shipments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shipmentId, action, adminNotes: notes[shipmentId] }),
    });
    load();
  }

  const pending = shipments.filter((s) => (s as { status: string }).status === "PENDING_ADMIN");

  return (
    <DashboardShell title="Admin Panel" nav={nav}>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Approve Tracker Numbers</h1>
      <DashboardCard>
        <div className="space-y-6">
          {pending.map((s) => {
            const shipment = s as {
              id: string;
              trackingNumber: string;
              status: string;
              totalPrice: number;
              agent: { user: { name: string; email: string }; city: string };
              booking: { customer: { name: string; email: string }; destination: string; destinationCountry: string } | null;
              boxes: Array<{
                boxNumber: number;
                lengthCm: number;
                widthCm: number;
                heightCm: number;
                actualWeightKg: number;
                volumetricWeightKg: number;
                chargeableWeightKg: number;
                boxPrice: number;
                goods: Array<{ description: string; quantity: number }>;
              }>;
            };
            return (
              <div key={shipment.id} className="rounded-lg border border-navy-100 p-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-mono text-lg font-bold text-navy-900">{shipment.trackingNumber}</p>
                    <p className="text-sm text-navy-500">
                      Agent: {shipment.agent.user.name} ({shipment.agent.city})
                    </p>
                    {shipment.booking && (
                      <p className="text-sm text-navy-500">
                        Customer: {shipment.booking.customer.name} → {shipment.booking.destination},{" "}
                        {shipment.booking.destinationCountry}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <StatusBadge status={shipment.status} />
                    <p className="mt-1 text-lg font-bold text-navy-900">${shipment.totalPrice}</p>
                  </div>
                </div>

                {shipment.boxes.map((box) => (
                  <div key={box.boxNumber} className="mt-3 rounded bg-surface p-3 text-sm">
                    <p className="font-medium text-navy-800">
                      Box {box.boxNumber}: {box.lengthCm}×{box.widthCm}×{box.heightCm} cm
                    </p>
                    <p className="text-navy-600">
                      Actual {box.actualWeightKg} kg · Volumetric {box.volumetricWeightKg} kg · Chargeable{" "}
                      {box.chargeableWeightKg} kg · ${box.boxPrice}
                    </p>
                    <ul className="mt-1 list-inside list-disc text-navy-600">
                      {box.goods.map((g, i) => (
                        <li key={i}>{g.description} (×{g.quantity})</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <textarea
                  placeholder="Admin notes (optional)"
                  value={notes[shipment.id] ?? ""}
                  onChange={(e) => setNotes({ ...notes, [shipment.id]: e.target.value })}
                  className="mt-3 w-full rounded border border-navy-200 px-3 py-2 text-sm"
                  rows={2}
                />
                <div className="mt-3 flex gap-2">
                  <button type="button" className="btn-primary text-sm" onClick={() => handleAction(shipment.id, "approve")}>
                    Approve Tracker
                  </button>
                  <button type="button" className="btn-secondary text-sm" onClick={() => handleAction(shipment.id, "reject")}>
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
          {pending.length === 0 && <p className="text-navy-500">No pending tracker approvals.</p>}
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
