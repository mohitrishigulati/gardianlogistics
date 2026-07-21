import { NextRequest } from "next/server";
import { BookingStatus, KycStatus, PickupType, Role } from "@/lib/constants/roles";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/auth-options";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await requireRole([Role.USER]);
    const bookings = await prisma.shipmentBooking.findMany({
      where: { customerId: session.user.id },
      include: {
        agent: { include: { user: { select: { name: true } } } },
        shipment: { select: { trackingNumber: true, status: true, totalPrice: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ bookings });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([Role.USER]);
    const body = await request.json();

    const {
      agentId,
      pickupType,
      pickupAddress,
      pickupCity,
      destination,
      destinationCountry,
      recipientName,
      recipientPhone,
      notes,
    } = body;

    if (!agentId || !pickupType || !destination || !destinationCountry || !recipientName || !recipientPhone) {
      return jsonError("Missing required booking fields.");
    }

    if (!Object.values(PickupType).includes(pickupType)) {
      return jsonError("Invalid pickup type.");
    }

    if (pickupType === PickupType.DOORSTEP && !pickupAddress) {
      return jsonError("Pickup address is required for doorstep pickup.");
    }

    const agent = await prisma.agentProfile.findFirst({
      where: { id: agentId, kycStatus: KycStatus.APPROVED, isActive: true },
    });
    if (!agent) return jsonError("Selected agent is not available.", 404);

    const booking = await prisma.shipmentBooking.create({
      data: {
        customerId: session.user.id,
        agentId,
        pickupType,
        pickupAddress: pickupType === PickupType.DOORSTEP ? pickupAddress : agent.address,
        pickupCity: pickupCity ?? agent.city,
        destination,
        destinationCountry,
        recipientName,
        recipientPhone,
        notes,
        status: BookingStatus.PENDING,
      },
      include: {
        agent: { include: { user: { select: { name: true } } } },
      },
    });

    return jsonOk({ success: true, booking }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
