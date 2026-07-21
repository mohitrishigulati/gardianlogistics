import { NextRequest } from "next/server";
import { Role, ShipmentStatus } from "@/lib/constants/roles";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/auth-options";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await requireRole([Role.SUB_ADMIN]);

    const agents = await prisma.agentProfile.findMany({
      where: {
        OR: [{ subAdminId: session.user.id }, { subAdminId: null }],
      },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        _count: { select: { bookings: true, shipments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const pendingShipments = await prisma.shipment.findMany({
      where: {
        status: ShipmentStatus.PENDING_ADMIN,
        agent: {
          OR: [{ subAdminId: session.user.id }, { subAdminId: null }],
        },
      },
      include: {
        agent: { include: { user: { select: { name: true } } } },
        booking: { include: { customer: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const pendingKyc = agents.filter((a) => a.kycStatus === "PENDING");

    return jsonOk({ agents, pendingKyc, pendingShipments });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireRole([Role.SUB_ADMIN]);
    const body = await request.json();
    const { agentProfileId } = body;

    if (!agentProfileId) return jsonError("agentProfileId required.");

    const updated = await prisma.agentProfile.update({
      where: { id: agentProfileId },
      data: { subAdminId: session.user.id },
    });

    return jsonOk({ profile: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
