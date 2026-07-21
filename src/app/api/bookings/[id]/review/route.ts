import { NextRequest } from "next/server";
import { Role } from "@/lib/constants/roles";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/auth-options";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-utils";

interface RouteParams {
  params: { id: string };
}

const REVIEWABLE_STATUSES = [
  "ACCEPTED",
  "PICKED_UP",
  "RECEIPT_CREATED",
  "ADMIN_PENDING",
  "APPROVED",
  "IN_TRANSIT",
  "DELIVERED",
];

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await requireRole([Role.USER]);
    const review = await prisma.orderReview.findFirst({
      where: { bookingId: params.id, customerId: session.user.id },
    });
    return jsonOk({ review });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireRole([Role.USER]);
    const body = await request.json();
    const { rating, comment } = body as { rating: number; comment?: string };

    if (!rating || rating < 1 || rating > 5) {
      return jsonError("Rating must be between 1 and 5 stars.");
    }

    const booking = await prisma.shipmentBooking.findFirst({
      where: { id: params.id, customerId: session.user.id },
      include: { review: true, shipment: true },
    });

    if (!booking) return jsonError("Booking not found.", 404);
    if (booking.review) return jsonError("You already reviewed this order.", 409);
    if (!REVIEWABLE_STATUSES.includes(booking.status)) {
      return jsonError("You can review after your booking is accepted by an agent.");
    }

    const review = await prisma.orderReview.create({
      data: {
        bookingId: booking.id,
        customerId: session.user.id,
        agentId: booking.agentId,
        rating: Math.round(rating),
        comment: comment?.trim() || null,
      },
    });

    return jsonOk({ review }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
