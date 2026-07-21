import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "@/lib/constants/roles";
import { ROLE_DASHBOARD } from "@/lib/auth/roles";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (!token?.role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as Role;

    if (pathname.startsWith("/admin") && role !== Role.ADMIN) {
      return NextResponse.redirect(new URL(ROLE_DASHBOARD[role], req.url));
    }
    if (pathname.startsWith("/sub-admin") && role !== Role.SUB_ADMIN) {
      return NextResponse.redirect(new URL(ROLE_DASHBOARD[role], req.url));
    }
    if (pathname.startsWith("/agent") && role !== Role.AGENT) {
      return NextResponse.redirect(new URL(ROLE_DASHBOARD[role], req.url));
    }
    if (pathname.startsWith("/portal") && role !== Role.USER) {
      return NextResponse.redirect(new URL(ROLE_DASHBOARD[role], req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        const protectedPrefixes = ["/admin", "/sub-admin", "/agent", "/portal"];
        const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
        if (!isProtected) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/sub-admin/:path*", "/agent/:path*", "/portal/:path*"],
};
