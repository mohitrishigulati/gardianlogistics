"use client";

import { useEffect, useState } from "react";
import { DashboardCard, DashboardShell, StatusBadge } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/agent", label: "Dashboard" },
  { href: "/agent/bookings", label: "Bookings" },
  { href: "/agent/receipt", label: "Create Receipt" },
  { href: "/agent/shipments", label: "My Shipments" },
  { href: "/agent/kyc", label: "KYC Status" },
];

interface Booking {
  id: string;
  pickupType: string;
  pickupAddress: string | null;
  destination: string;
  destinationCountry: string;
  status: string;
  customer: { name: string | null; email: string; phone: string | null };
  shipment: { trackingNumber: string } | null;
}

export default function AgentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  function load() {
    fetch("/api/agent/bookings")
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings ?? []));
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(bookingId: string, status: string) {
    await fetch("/api/agent/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, status }),
    });
    load();
  }

  return (
    <DashboardShell title="Agent Panel" nav={nav}>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Customer Bookings</h1>
      <DashboardCard>
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-lg border border-navy-100 p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-semibold text-navy-900">
                    {b.customer.name} — {b.destination}, {b.destinationCountry}
                  </p>
                  <p className="text-sm text-navy-500">{b.customer.email} · {b.customer.phone}</p>
                  <p className="text-xs text-navy-400">
                    {b.pickupType === "DOORSTEP" ? `Pickup: ${b.pickupAddress}` : "Customer drops at agent"}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </div>
              {!b.shipment && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {b.status === "PENDING" && (
                    <button type="button" className="btn-secondary text-xs" onClick={() => updateStatus(b.id, "ACCEPTED")}>
                      Accept
                    </button>
                  )}
                  {["ACCEPTED", "PENDING"].includes(b.status) && (
                    <button type="button" className="btn-secondary text-xs" onClick={() => updateStatus(b.id, "PICKED_UP")}>
                      Mark Picked Up
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
          {bookings.length === 0 && <p className="text-navy-500">No bookings yet.</p>}
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
