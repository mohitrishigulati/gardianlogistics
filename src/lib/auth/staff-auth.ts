import { prisma } from "@/lib/db";
import { Role } from "@/lib/constants/roles";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export interface StaffLoginResult {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

export async function validateStaffLogin(
  companyId: string,
  password: string
): Promise<StaffLoginResult | null> {
  const normalizedId = companyId.trim().toUpperCase();
  if (!normalizedId || !password) return null;

  await ensureDefaultStaffAccounts();

  const user = await prisma.user.findUnique({
    where: { companyId: normalizedId },
  });

  if (!user?.passwordHash) return null;
  if (user.role !== Role.ADMIN && user.role !== Role.SUB_ADMIN) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
  };
}

/** Creates default admin/sub-admin accounts from env on first login attempt. */
export async function ensureDefaultStaffAccounts() {
  const defaults = [
    {
      companyId: process.env.ADMIN_COMPANY_ID,
      password: process.env.ADMIN_PASSWORD,
      role: Role.ADMIN,
      name: "Gardian Admin",
      email: process.env.ADMIN_STAFF_EMAIL ?? "admin@gardianlogistics.in",
    },
    {
      companyId: process.env.SUB_ADMIN_COMPANY_ID,
      password: process.env.SUB_ADMIN_PASSWORD,
      role: Role.SUB_ADMIN,
      name: "Gardian Sub-Admin",
      email: process.env.SUB_ADMIN_STAFF_EMAIL ?? "subadmin@gardianlogistics.in",
    },
  ];

  for (const entry of defaults) {
    if (!entry.companyId || !entry.password) continue;

    const companyId = entry.companyId.trim().toUpperCase();
    const existing = await prisma.user.findUnique({ where: { companyId } });

    if (existing) {
      if (!existing.passwordHash) {
        await prisma.user.update({
          where: { id: existing.id },
          data: {
            passwordHash: await hashPassword(entry.password),
            role: entry.role,
          },
        });
      }
      continue;
    }

    const emailTaken = await prisma.user.findUnique({ where: { email: entry.email } });
    if (emailTaken) {
      await prisma.user.update({
        where: { id: emailTaken.id },
        data: {
          companyId,
          passwordHash: await hashPassword(entry.password),
          role: entry.role,
          name: entry.name,
        },
      });
      continue;
    }

    await prisma.user.create({
      data: {
        email: entry.email,
        name: entry.name,
        companyId,
        passwordHash: await hashPassword(entry.password),
        role: entry.role,
      },
    });
  }
}

export async function loadUserTokenData(userId: string) {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { agentProfile: true },
  });
  if (!dbUser) return null;
  return {
    id: dbUser.id,
    role: dbUser.role as Role,
    agentProfileId: dbUser.agentProfile?.id ?? null,
    kycStatus: dbUser.agentProfile?.kycStatus ?? null,
    agentActive: dbUser.agentProfile?.isActive ?? false,
  };
}
