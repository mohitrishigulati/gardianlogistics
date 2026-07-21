import { NextRequest } from "next/server";
import { BookingStatus, KycStatus, Role } from "@/lib/constants/roles";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/auth-options";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await requireRole([Role.AGENT]);
    const profile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile) return jsonError("Agent profile not found.", 404);

    const bookings = await prisma.shipmentBooking.findMany({
      where: { agentId: profile.id },
      include: {
        customer: { select: { name: true, email: true, phone: true } },
        shipment: { select: { id: true, trackingNumber: true, status: true, totalPrice: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonOk({ bookings });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireRole([Role.AGENT]);
    const body = await request.json();
    const { bookingId, status } = body;

    const profile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile || profile.kycStatus !== KycStatus.APPROVED || !profile.isActive) {
      return jsonError("Agent KYC must be approved before managing bookings.", 403);
    }

    const booking = await prisma.shipmentBooking.findFirst({
      where: { id: bookingId, agentId: profile.id },
    });
    if (!booking) return jsonError("Booking not found.", 404);

    if (!Object.values(BookingStatus).includes(status)) {
      return jsonError("Invalid status.");
    }

    const updated = await prisma.shipmentBooking.update({
      where: { id: bookingId },
      data: { status },
    });

    return jsonOk({ booking: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
