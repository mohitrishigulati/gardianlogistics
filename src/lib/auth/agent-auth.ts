import { prisma } from "@/lib/db";
import { Role, KycStatus } from "@/lib/constants/roles";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { agentEmailFromPhone, isValidLoginPhone, normalizeLoginPhone } from "@/lib/auth/phone";

export interface AgentLoginResult {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

export async function validateAgentMobileLogin(
  mobile: string,
  password: string
): Promise<AgentLoginResult | null> {
  const loginPhone = normalizeLoginPhone(mobile);
  if (!isValidLoginPhone(loginPhone) || !password) return null;

  const user = await prisma.user.findUnique({
    where: { loginPhone },
    include: { agentProfile: true },
  });

  if (!user?.passwordHash || user.role !== Role.AGENT) return null;
  if (!user.agentProfile?.isActive || user.agentProfile.kycStatus !== KycStatus.APPROVED) {
    return null;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: Role.AGENT,
  };
}

export interface CreateAgentInput {
  name: string;
  mobile: string;
  password: string;
  businessName?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  createdById: string;
}

export async function createAgentByAdmin(input: CreateAgentInput) {
  const loginPhone = normalizeLoginPhone(input.mobile);
  if (!isValidLoginPhone(loginPhone)) {
    throw new Error("INVALID_PHONE");
  }
  if (input.password.length < 6) {
    throw new Error("WEAK_PASSWORD");
  }
  if (!input.state.trim() || !input.pincode.trim()) {
    throw new Error("LOCATION_REQUIRED");
  }

  const existingPhone = await prisma.user.findUnique({ where: { loginPhone } });
  if (existingPhone) throw new Error("PHONE_EXISTS");

  const email = agentEmailFromPhone(loginPhone);
  const passwordHash = await hashPassword(input.password);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        name: input.name.trim(),
        role: Role.AGENT,
        loginPhone,
        phone: loginPhone,
        passwordHash,
      },
    });

    const agentProfile = await tx.agentProfile.create({
      data: {
        userId: user.id,
        businessName: input.businessName?.trim() || input.name.trim(),
        address: input.address.trim(),
        city: input.city.trim(),
        state: input.state.trim(),
        pincode: input.pincode.trim(),
        phone: loginPhone,
        kycStatus: KycStatus.APPROVED,
        kycSubmittedAt: new Date(),
        kycReviewedAt: new Date(),
        isActive: true,
        createdById: input.createdById,
      },
    });

    return { user, agentProfile };
  });
}
