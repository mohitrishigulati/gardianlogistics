import { NextRequest } from "next/server";
import { Role } from "@/lib/constants/roles";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/auth-options";
import { jsonOk, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const session = await requireRole([Role.USER]);
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, phone: true, address: true, city: true, role: true },
    });
    return jsonOk({ user });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireRole([Role.USER]);
    const body = await request.json();
    const { phone, address, city, name } = body;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { phone, address, city, name },
    });

    return jsonOk({ user });
  } catch (err) {
    return handleApiError(err);
  }
}
