import { NextRequest } from "next/server";
import { KycStatus } from "@/lib/constants/roles";
import { prisma } from "@/lib/db";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.trim();
    const state = searchParams.get("state")?.trim();
    const pincode = searchParams.get("pincode")?.trim();

    const agents = await prisma.agentProfile.findMany({
      where: {
        kycStatus: KycStatus.APPROVED,
        isActive: true,
        ...(city ? { city: { contains: city } } : {}),
        ...(state ? { state: { contains: state } } : {}),
        ...(pincode ? { pincode } : {}),
      },
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: [{ state: "asc" }, { pincode: "asc" }, { city: "asc" }],
    });

    return jsonOk({
      agents: agents.map((a) => ({
        id: a.id,
        businessName: a.businessName ?? a.user.name,
        city: a.city,
        state: a.state,
        address: a.address,
        phone: a.phone,
        pincode: a.pincode,
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
