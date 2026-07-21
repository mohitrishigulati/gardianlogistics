import { Role } from "@/lib/constants/roles";

export function parseEmailList(env?: string): string[] {
  if (!env) return [];
  return env.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function resolveRoleFromEmail(email: string): Role {
  const normalized = email.toLowerCase();
  if (parseEmailList(process.env.ADMIN_EMAILS).includes(normalized)) return Role.ADMIN;
  if (parseEmailList(process.env.SUB_ADMIN_EMAILS).includes(normalized)) return Role.SUB_ADMIN;
  return Role.USER;
}

export const ROLE_DASHBOARD: Record<Role, string> = {
  ADMIN: "/admin",
  SUB_ADMIN: "/sub-admin",
  AGENT: "/agent",
  USER: "/portal",
};

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrator",
  SUB_ADMIN: "Sub Administrator",
  AGENT: "Agent",
  USER: "Customer",
};

export function canAccessRoute(role: Role, pathname: string): boolean {
  if (role === Role.ADMIN) return pathname.startsWith("/admin");
  if (role === Role.SUB_ADMIN) return pathname.startsWith("/sub-admin");
  if (role === Role.AGENT) return pathname.startsWith("/agent");
  if (role === Role.USER) return pathname.startsWith("/portal");
  return false;
}

export function requiredRoleForPath(pathname: string): Role | null {
  if (pathname.startsWith("/admin")) return Role.ADMIN;
  if (pathname.startsWith("/sub-admin")) return Role.SUB_ADMIN;
  if (pathname.startsWith("/agent")) return Role.AGENT;
  if (pathname.startsWith("/portal")) return Role.USER;
  return null;
}

export function hasMinRole(userRole: Role, required: Role): boolean {
  const hierarchy: Role[] = [Role.USER, Role.AGENT, Role.SUB_ADMIN, Role.ADMIN];
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(required);
}
