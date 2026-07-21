import { NextRequest } from "next/server";
import { Role, ShipmentStatus } from "@/lib/constants/roles";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/auth-options";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireRole([Role.ADMIN]);
    const shipments = await prisma.shipment.findMany({
      include: {
        boxes: { include: { goods: true } },
        agent: { include: { user: { select: { name: true, email: true } } } },
        booking: {
          include: { customer: { select: { name: true, email: true, phone: true } } },
        },
        approvedBy: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return jsonOk({ shipments });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireRole([Role.ADMIN]);
    const body = await request.json();
    const { shipmentId, action, adminNotes } = body;

    if (!shipmentId || !["approve", "reject"].includes(action)) {
      return jsonError("shipmentId and action (approve/reject) are required.");
    }

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: { booking: true },
    });
    if (!shipment) return jsonError("Shipment not found.", 404);

    const newStatus =
      action === "approve" ? ShipmentStatus.APPROVED : ShipmentStatus.REJECTED;

    const updated = await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        status: newStatus,
        adminNotes,
        approvedAt: action === "approve" ? new Date() : null,
        approvedById: action === "approve" ? session.user.id : null,
      },
    });

    if (shipment.bookingId) {
      await prisma.shipmentBooking.update({
        where: { id: shipment.bookingId },
        data: {
          status: action === "approve" ? "APPROVED" : "RECEIPT_CREATED",
        },
      });
    }

    return jsonOk({ shipment: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
