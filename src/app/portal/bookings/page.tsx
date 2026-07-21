"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardCard, DashboardShell, StatusBadge } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/book", label: "Book Shipment" },
  { href: "/portal/bookings", label: "My Bookings" },
  { href: "/portal/profile", label: "Profile" },
  { href: "/portal/become-agent", label: "Become an Agent" },
];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings ?? []));
  }, []);

  return (
    <DashboardShell title="Customer Portal" nav={nav}>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">My Bookings</h1>
      <DashboardCard>
        {bookings.length === 0 ? (
          <p className="text-navy-500">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const booking = b as {
                id: string;
                pickupType: string;
                destination: string;
                destinationCountry: string;
                status: string;
                createdAt: string;
                agent: { businessName: string | null; city: string; user: { name: string | null } };
                shipment: { trackingNumber: string; status: string; totalPrice: number } | null;
              };
              return (
                <div key={booking.id} className="rounded-lg border border-navy-100 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-navy-900">
                        {booking.destination}, {booking.destinationCountry}
                      </p>
                      <p className="text-sm text-navy-500">
                        Agent: {booking.agent.businessName ?? booking.agent.user.name} — {booking.agent.city}
                      </p>
                      <p className="text-xs text-navy-400">
                        {booking.pickupType === "DOORSTEP" ? "Doorstep pickup" : "Drop at agent"} ·{" "}
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                  {booking.shipment && (
                    <div className="mt-3 rounded bg-surface p-3 text-sm">
                      <p>
                        Tracker:{" "}
                        <Link
                          href={`/track?awb=${booking.shipment.trackingNumber}`}
                          className="font-mono font-semibold text-accent-600 hover:underline"
                        >
                          {booking.shipment.trackingNumber}
                        </Link>
                      </p>
                      <p className="text-navy-600">
                        Status: {booking.shipment.status} · Total: ${booking.shipment.totalPrice}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DashboardCard>
    </DashboardShell>
  );
}
