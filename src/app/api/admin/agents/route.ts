import { NextRequest } from "next/server";
import { Role } from "@/lib/constants/roles";
import { requireRole } from "@/lib/auth/auth-options";
import { createAgentByAdmin } from "@/lib/auth/agent-auth";
import { prisma } from "@/lib/db";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    await requireRole([Role.ADMIN, Role.SUB_ADMIN]);

    const agents = await prisma.agentProfile.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, loginPhone: true, createdAt: true } },
        createdBy: { select: { name: true, email: true } },
      },
      orderBy: [{ state: "asc" }, { pincode: "asc" }, { city: "asc" }],
    });

    return jsonOk({ agents });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([Role.ADMIN, Role.SUB_ADMIN]);
    const body = await request.json();

    const { name, mobile, password, businessName, address, city, state, pincode } = body;

    if (!name?.trim() || !mobile || !password || !address?.trim() || !city?.trim()) {
      return jsonError("Name, mobile, password, address, and city are required.");
    }

    try {
      const result = await createAgentByAdmin({
        name,
        mobile,
        password,
        businessName,
        address,
        city,
        state: state ?? "",
        pincode: pincode ?? "",
        createdById: session.user.id,
      });

      return jsonOk(
        {
          success: true,
          agent: {
            id: result.agentProfile.id,
            name: result.user.name,
            loginPhone: result.user.loginPhone,
            state: result.agentProfile.state,
            pincode: result.agentProfile.pincode,
            city: result.agentProfile.city,
          },
        },
        201
      );
    } catch (e) {
      if (e instanceof Error) {
        const messages: Record<string, string> = {
          INVALID_PHONE: "Enter a valid 10-digit mobile number.",
          WEAK_PASSWORD: "Password must be at least 6 characters.",
          LOCATION_REQUIRED: "State and pincode are required.",
          PHONE_EXISTS: "An agent with this mobile number already exists.",
        };
        if (messages[e.message]) return jsonError(messages[e.message], 409);
      }
      throw e;
    }
  } catch (err) {
    return handleApiError(err);
  }
}
