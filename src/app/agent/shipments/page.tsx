"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardCard, DashboardShell, StatusBadge } from "@/components/dashboard/DashboardShell";
import { formatMoney } from "@/lib/shipment-pricing";

const nav = [
  { href: "/agent", label: "Dashboard" },
  { href: "/agent/bookings", label: "Bookings" },
  { href: "/agent/receipt", label: "Create Receipt" },
  { href: "/agent/shipments", label: "My Shipments" },
  { href: "/agent/kyc", label: "KYC Status" },
];

interface ShipmentRow {
  id: string;
  trackingNumber: string;
  status: string;
  totalPrice: number;
  totalCompanyCharge: number;
  agentProfit: number;
  currency: string;
  boxes: Array<{
    boxNumber: number;
    chargeableWeightKg: number;
    referenceSlabPrice?: number | null;
    boxPrice: number;
    goods: Array<{ description: string }>;
  }>;
}

export default function AgentShipmentsPage() {
  const [shipments, setShipments] = useState<ShipmentRow[]>([]);

  useEffect(() => {
    fetch("/api/agent/shipments")
      .then((r) => r.json())
      .then((d) => setShipments(d.shipments ?? []));
  }, []);

  const totalEarnings = shipments.reduce((sum, s) => sum + (s.agentProfit ?? 0), 0);

  return (
    <DashboardShell title="Agent Panel" nav={nav}>
      <h1 className="mb-2 text-2xl font-bold text-navy-900">My Tracker Receipts</h1>
      <p className="mb-6 text-sm text-navy-600">
        View company charges, customer charges, and your profit. Print customer slip or agent
        invoice anytime.
      </p>

      {shipments.length > 0 && (
        <DashboardCard className="mb-6">
          <p className="text-sm text-navy-500">Total earnings across all receipts</p>
          <p className="text-3xl font-bold text-green-700">
            {formatMoney(totalEarnings, shipments[0]?.currency ?? "INR")}
          </p>
        </DashboardCard>
      )}

      <DashboardCard>
        <div className="space-y-4">
          {shipments.map((shipment) => (
            <div key={shipment.id} className="rounded-lg border border-navy-100 p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <Link
                    href={`/track?awb=${shipment.trackingNumber}`}
                    className="font-mono font-semibold text-accent-600 hover:underline"
                  >
                    {shipment.trackingNumber}
                  </Link>
                  <p className="mt-1 text-sm text-navy-500">{shipment.boxes.length} carton(s)</p>
                </div>
                <StatusBadge status={shipment.status} />
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
                <div className="rounded bg-surface p-2">
                  <p className="text-xs text-navy-500">Company charge</p>
                  <p className="font-semibold">
                    {formatMoney(shipment.totalCompanyCharge ?? 0, shipment.currency)}
                  </p>
                </div>
                <div className="rounded bg-surface p-2">
                  <p className="text-xs text-navy-500">Customer charge</p>
                  <p className="font-semibold">
                    {formatMoney(shipment.totalPrice, shipment.currency)}
                  </p>
                </div>
                <div className="rounded bg-green-50 p-2">
                  <p className="text-xs text-green-700">Your profit</p>
                  <p className="font-semibold text-green-800">
                    {formatMoney(shipment.agentProfit ?? 0, shipment.currency)}
                  </p>
                </div>
              </div>

              {shipment.boxes.map((box) => (
                <div key={box.boxNumber} className="mt-2 rounded bg-surface p-2 text-xs text-navy-600">
                  Carton {box.boxNumber}: {box.chargeableWeightKg} kg · Company{" "}
                  {formatMoney(box.referenceSlabPrice ?? 0, shipment.currency)} · Customer{" "}
                  {formatMoney(box.boxPrice, shipment.currency)} —{" "}
                  {box.goods.map((g) => g.description).join(", ")}
                </div>
              ))}

              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/agent/shipments/${shipment.id}/customer-slip`}
                  className="text-sm text-accent-600 hover:underline"
                >
                  Customer Slip →
                </Link>
                <Link
                  href={`/agent/shipments/${shipment.id}/agent-invoice`}
                  className="text-sm text-accent-600 hover:underline"
                >
                  Agent Invoice →
                </Link>
              </div>
            </div>
          ))}
          {shipments.length === 0 && <p className="text-navy-500">No receipts created yet.</p>}
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
