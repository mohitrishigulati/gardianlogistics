"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardCard, DashboardShell, StatusBadge } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/agent", label: "Dashboard" },
  { href: "/agent/bookings", label: "Bookings" },
  { href: "/agent/receipt", label: "Create Receipt" },
  { href: "/agent/shipments", label: "My Shipments" },
  { href: "/agent/kyc", label: "KYC Status" },
];

export default function AgentShipmentsPage() {
  const [shipments, setShipments] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    fetch("/api/agent/shipments")
      .then((r) => r.json())
      .then((d) => setShipments(d.shipments ?? []));
  }, []);

  return (
    <DashboardShell title="Agent Panel" nav={nav}>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">My Tracker Receipts</h1>
      <DashboardCard>
        <div className="space-y-4">
          {shipments.map((s) => {
            const shipment = s as {
              id: string;
              trackingNumber: string;
              status: string;
              totalPrice: number;
              boxes: Array<{ boxNumber: number; chargeableWeightKg: number; boxPrice: number; goods: Array<{ description: string }> }>;
            };
            return (
              <div key={shipment.id} className="rounded-lg border border-navy-100 p-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <Link href={`/track?awb=${shipment.trackingNumber}`} className="font-mono font-semibold text-accent-600 hover:underline">
                      {shipment.trackingNumber}
                    </Link>
                    <p className="text-sm text-navy-500">{shipment.boxes.length} box(es) · ${shipment.totalPrice}</p>
                  </div>
                  <StatusBadge status={shipment.status} />
                </div>
                {shipment.boxes.map((box) => (
                  <div key={box.boxNumber} className="mt-2 rounded bg-surface p-2 text-xs text-navy-600">
                    Box {box.boxNumber}: {box.chargeableWeightKg} kg chargeable · ${box.boxPrice} —{" "}
                    {box.goods.map((g) => g.description).join(", ")}
                  </div>
                ))}
              </div>
            );
          })}
          {shipments.length === 0 && <p className="text-navy-500">No receipts created yet.</p>}
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
