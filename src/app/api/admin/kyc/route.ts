import { NextRequest } from "next/server";
import { KycStatus, Role } from "@/lib/constants/roles";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/auth-options";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireRole([Role.ADMIN, Role.SUB_ADMIN]);
    const agents = await prisma.agentProfile.findMany({
      where: { kycStatus: KycStatus.PENDING },
      include: { user: { select: { name: true, email: true, phone: true } } },
      orderBy: { kycSubmittedAt: "asc" },
    });
    return jsonOk({ agents });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireRole([Role.ADMIN, Role.SUB_ADMIN]);
    const body = await request.json();
    const { agentProfileId, action, kycNotes } = body;

    if (!agentProfileId || !["approve", "reject"].includes(action)) {
      return jsonError("agentProfileId and action required.");
    }

    const profile = await prisma.agentProfile.findUnique({
      where: { id: agentProfileId },
      include: { user: true },
    });
    if (!profile) return jsonError("Agent not found.", 404);

    if (session.user.role === Role.SUB_ADMIN && profile.subAdminId !== session.user.id) {
      // Sub-admin can review unassigned agents or their assigned agents
      if (profile.subAdminId && profile.subAdminId !== session.user.id) {
        return jsonError("This agent is assigned to another sub-admin.", 403);
      }
    }

    const kycStatus = action === "approve" ? KycStatus.APPROVED : KycStatus.REJECTED;

    const updated = await prisma.$transaction(async (tx) => {
      const agent = await tx.agentProfile.update({
        where: { id: agentProfileId },
        data: {
          kycStatus,
          kycNotes,
          kycReviewedAt: new Date(),
          isActive: action === "approve",
          subAdminId: session.user.role === Role.SUB_ADMIN ? session.user.id : profile.subAdminId,
        },
      });

      if (action === "approve") {
        await tx.user.update({
          where: { id: profile.userId },
          data: { role: Role.AGENT },
        });
      }

      return agent;
    });

    return jsonOk({ profile: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
