"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { DashboardCard, DashboardShell, StatusBadge } from "@/components/dashboard/DashboardShell";
import { OrderReviewForm } from "@/components/reviews/OrderReviewForm";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { buildWhatsAppUrl } from "@/lib/chat/chatbot";
import { siteConfig } from "@/data/site";

const nav = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/book", label: "Book Shipment" },
  { href: "/portal/bookings", label: "My Bookings" },
  { href: "/portal/profile", label: "Profile" },
  { href: "/portal/become-agent", label: "Become an Agent" },
];

const REVIEWABLE = ["ACCEPTED", "PICKED_UP", "RECEIPT_CREATED", "ADMIN_PENDING", "APPROVED", "IN_TRANSIT", "DELIVERED"];

interface BookingRow {
  id: string;
  pickupType: string;
  destination: string;
  destinationCountry: string;
  status: string;
  createdAt: string;
  agent: {
    businessName: string | null;
    city: string;
    phone: string;
    user: { name: string | null };
  };
  shipment: { trackingNumber: string; status: string; totalPrice: number } | null;
  review: { rating: number; comment: string | null } | null;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);

  const loadBookings = useCallback(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings ?? []));
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  function whatsappHelpMessage(booking: BookingRow) {
    const parts = [
      "Hi Gardian Logistics, I need help with my order.",
      `Booking: ${booking.id.slice(-8).toUpperCase()}`,
      `Route: ${booking.destination}, ${booking.destinationCountry}`,
    ];
    if (booking.shipment?.trackingNumber) {
      parts.push(`AWB: ${booking.shipment.trackingNumber}`);
    }
    return parts.join("\n");
  }

  return (
    <DashboardShell title="Customer Portal" nav={nav}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">My Bookings</h1>
          <p className="mt-1 text-sm text-navy-600">
            Track orders, leave a review, or get WhatsApp assistance anytime.
          </p>
        </div>
        <WhatsAppButton
          message="Hi Gardian Logistics, I need help with my booking."
          variant="secondary"
          label="WhatsApp Support"
        />
      </div>

      <DashboardCard>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-navy-500">No bookings found.</p>
            <Link href="/portal/book" className="btn-primary mt-4 inline-block">
              Book your first shipment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const canReview = REVIEWABLE.includes(booking.status);
              return (
                <div key={booking.id} className="rounded-xl border border-navy-100 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-navy-900">
                        {booking.destination}, {booking.destinationCountry}
                      </p>
                      <p className="text-sm text-navy-500">
                        Agent: {booking.agent.businessName ?? booking.agent.user.name} —{" "}
                        {booking.agent.city}
                      </p>
                      <p className="text-xs text-navy-400">
                        {booking.pickupType === "DOORSTEP" ? "Doorstep pickup" : "Drop at agent"} ·{" "}
                        {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  {booking.shipment && (
                    <div className="mt-3 rounded-lg bg-surface p-3 text-sm">
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
                        Status: {booking.shipment.status} · Total: ₹{booking.shipment.totalPrice}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={buildWhatsAppUrl(siteConfig.whatsapp, whatsappHelpMessage(booking))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-800 hover:bg-green-100"
                    >
                      💬 WhatsApp help for this order
                    </a>
                  </div>

                  {canReview && (
                    <OrderReviewForm
                      bookingId={booking.id}
                      existingReview={booking.review}
                      onSubmitted={loadBookings}
                    />
                  )}

                  {booking.review && !canReview && (
                    <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-800">
                      Reviewed: {"★".repeat(booking.review.rating)}
                      {booking.review.comment && ` — ${booking.review.comment}`}
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
