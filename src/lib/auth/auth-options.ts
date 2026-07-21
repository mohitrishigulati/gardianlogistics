import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Role } from "@/lib/constants/roles";
import { prisma } from "@/lib/db";
import { resolveRoleFromEmail, ROLE_DASHBOARD } from "@/lib/auth/roles";
import { loadUserTokenData, validateStaffLogin } from "@/lib/auth/staff-auth";
import { validateAgentMobileLogin } from "@/lib/auth/agent-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      id: "agent-mobile",
      name: "Agent Mobile",
      credentials: {
        mobile: { label: "Mobile Number", type: "tel" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.mobile || !credentials?.password) return null;

        const agent = await validateAgentMobileLogin(credentials.mobile, credentials.password);
        if (!agent) return null;

        return {
          id: agent.id,
          email: agent.email,
          name: agent.name,
          role: agent.role,
        };
      },
    }),
    CredentialsProvider({
      id: "company-id",
      name: "Company ID",
      credentials: {
        companyId: { label: "Company ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.companyId || !credentials?.password) return null;

        const staff = await validateStaffLogin(credentials.companyId, credentials.password);
        if (!staff) return null;

        return {
          id: staff.id,
          email: staff.email,
          name: staff.name,
          role: staff.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "company-id" || account?.provider === "agent-mobile") return true;
      if (!user.email) return false;
      return true;
    },
    async jwt({ token, user, trigger, account }) {
      if (user?.id) {
        if (account?.provider === "company-id" || account?.provider === "agent-mobile") {
          const data = await loadUserTokenData(user.id);
          if (data) {
            token.id = data.id;
            token.role = data.role;
            token.agentProfileId = data.agentProfileId;
            token.kycStatus = data.kycStatus;
            token.agentActive = data.agentActive;
          }
          return token;
        }
      }

      if (user?.email) {
        const envRole = resolveRoleFromEmail(user.email);
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { agentProfile: true },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: envRole,
            },
            include: { agentProfile: true },
          });
        } else if (trigger === "signIn" || trigger === "update") {
          const role =
            envRole === Role.ADMIN || envRole === Role.SUB_ADMIN
              ? envRole
              : dbUser.agentProfile && dbUser.role !== Role.ADMIN && dbUser.role !== Role.SUB_ADMIN
                ? Role.AGENT
                : dbUser.role;
          if (role !== dbUser.role) {
            dbUser = await prisma.user.update({
              where: { id: dbUser.id },
              data: { role },
              include: { agentProfile: true },
            });
          }
        }

        token.id = dbUser.id;
        token.role = dbUser.role as Role;
        token.agentProfileId = dbUser.agentProfile?.id ?? null;
        token.kycStatus = dbUser.agentProfile?.kycStatus ?? null;
        token.agentActive = dbUser.agentProfile?.isActive ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.agentProfileId = (token.agentProfileId as string | null) ?? null;
        session.user.kycStatus = token.kycStatus as string | null;
        session.user.agentActive = token.agentActive as boolean;
        session.user.dashboardUrl = ROLE_DASHBOARD[token.role as Role] ?? "/portal";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
};

export function getSession() {
  return getServerSession(authOptions);
}

export async function requireSession() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireRole(roles: Role[]) {
  const session = await requireSession();
  if (!roles.includes(session.user.role)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}
