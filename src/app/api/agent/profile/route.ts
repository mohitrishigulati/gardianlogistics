import { NextRequest } from "next/server";
import { KycStatus, Role } from "@/lib/constants/roles";
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

    return jsonOk({ profile });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([Role.USER, Role.AGENT]);
    const body = await request.json();

    const existing = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (existing) return jsonError("Agent profile already exists.");

    const { businessName, address, city, state, pincode, phone, idType, idNumber, idDocumentUrl } = body;
    if (!address || !city || !phone || !idType || !idNumber) {
      return jsonError("Complete all KYC fields including ID type and number.");
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: Role.AGENT, phone },
    });

    const profile = await prisma.agentProfile.create({
      data: {
        userId: session.user.id,
        businessName,
        address,
        city,
        state,
        pincode,
        phone,
        idType,
        idNumber,
        idDocumentUrl,
        kycStatus: KycStatus.PENDING,
        kycSubmittedAt: new Date(),
        isActive: false,
      },
    });

    return jsonOk({ success: true, profile }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireRole([Role.AGENT]);
    const body = await request.json();

    const profile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile) return jsonError("Agent profile not found.", 404);

    const updated = await prisma.agentProfile.update({
      where: { id: profile.id },
      data: {
        businessName: body.businessName ?? profile.businessName,
        address: body.address ?? profile.address,
        city: body.city ?? profile.city,
        state: body.state ?? profile.state,
        pincode: body.pincode ?? profile.pincode,
        phone: body.phone ?? profile.phone,
        idType: body.idType ?? profile.idType,
        idNumber: body.idNumber ?? profile.idNumber,
        idDocumentUrl: body.idDocumentUrl ?? profile.idDocumentUrl,
        kycStatus: KycStatus.PENDING,
        kycSubmittedAt: new Date(),
      },
    });

    return jsonOk({ profile: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
