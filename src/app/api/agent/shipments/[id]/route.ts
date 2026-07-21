import { Role } from "@/lib/constants/roles";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/auth-options";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-utils";

interface RouteParams {
  params: { id: string };
}

const shipmentInclude = {
  boxes: { include: { goods: true }, orderBy: { boxNumber: "asc" as const } },
  booking: {
    include: {
      customer: { select: { name: true, email: true, phone: true } },
    },
  },
  agent: {
    include: {
      user: { select: { name: true, email: true } },
    },
  },
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await requireRole([Role.AGENT]);
    const profile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile) return jsonError("Agent profile not found.", 404);

    const shipment = await prisma.shipment.findFirst({
      where: { id: params.id, agentId: profile.id },
      include: shipmentInclude,
    });

    if (!shipment) return jsonError("Shipment not found.", 404);

    return jsonOk({ shipment });
  } catch (err) {
    return handleApiError(err);
  }
}
