import { DefaultSession } from "next-auth";
import { Role } from "@/lib/constants/roles";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      agentProfileId: string | null;
      kycStatus: string | null;
      agentActive: boolean;
      dashboardUrl: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    agentProfileId?: string | null;
    kycStatus?: string | null;
    agentActive?: boolean;
  }
}

export {};
