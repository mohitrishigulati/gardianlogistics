"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardCard, DashboardShell, StatusBadge } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/book", label: "Book Shipment" },
  { href: "/portal/bookings", label: "My Bookings" },
  { href: "/portal/profile", label: "Profile" },
  { href: "/portal/become-agent", label: "Become an Agent" },
];

interface Booking {
  id: string;
  pickupType: string;
  destination: string;
  destinationCountry: string;
  status: string;
  createdAt: string;
  agent: { businessName: string | null; city: string; user: { name: string | null } };
  shipment: { trackingNumber: string; status: string; totalPrice: number } | null;
}

export default function PortalDashboard() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings ?? []));
  }, []);

  return (
    <DashboardShell title="Customer Portal" nav={nav}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Welcome, {session?.user?.name}</h1>
        <p className="text-navy-600">Book shipments to nearby agents and track your parcels.</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <DashboardCard>
          <p className="text-sm text-navy-500">Total Bookings</p>
          <p className="text-3xl font-bold text-navy-900">{bookings.length}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm text-navy-500">Pending</p>
          <p className="text-3xl font-bold text-navy-900">
            {bookings.filter((b) => ["PENDING", "ACCEPTED", "PICKED_UP"].includes(b.status)).length}
          </p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm text-navy-500">Approved Trackers</p>
          <p className="text-3xl font-bold text-navy-900">
            {bookings.filter((b) => b.shipment?.status === "APPROVED").length}
          </p>
        </DashboardCard>
      </div>

      <DashboardCard title="Recent Bookings">
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-navy-500">No bookings yet.</p>
            <Link href="/portal/book" className="btn-primary mt-4 inline-flex">
              Book Your First Shipment
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-navy-100 text-navy-500">
                  <th className="pb-3 pr-4">Destination</th>
                  <th className="pb-3 pr-4">Agent</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Tracker</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="border-b border-navy-50">
                    <td className="py-3 pr-4">
                      {b.destination}, {b.destinationCountry}
                    </td>
                    <td className="py-3 pr-4">
                      {b.agent.businessName ?? b.agent.user.name} — {b.agent.city}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs">
                      {b.shipment ? (
                        <Link href={`/track?awb=${b.shipment.trackingNumber}`} className="text-accent-600 hover:underline">
                          {b.shipment.trackingNumber}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>
    </DashboardShell>
  );
}
