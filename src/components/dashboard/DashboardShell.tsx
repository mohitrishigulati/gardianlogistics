"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Logo } from "@/components/ui/Logo";
import { ROLE_LABELS } from "@/lib/auth/roles";

interface NavItem {
  href: string;
  label: string;
}

interface DashboardShellProps {
  title: string;
  nav: NavItem[];
  children: React.ReactNode;
}

export function DashboardShell({ title, nav, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Logo />
            </Link>
            <span className="hidden text-sm font-medium text-navy-500 sm:block">| {title}</span>
          </div>
          <div className="flex items-center gap-3">
            {session?.user && (
              <div className="hidden text-right text-xs sm:block">
                <p className="font-medium text-navy-900">{session.user.name}</p>
                <p className="text-navy-500">{ROLE_LABELS[session.user.role]}</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="btn-secondary py-2 text-xs"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-6 space-y-1 rounded-xl border border-navy-100 bg-white p-3 shadow-card">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-navy-900 text-white"
                      : "text-navy-600 hover:bg-surface hover:text-navy-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export function DashboardCard({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-navy-100 bg-white p-6 shadow-card ${className}`}>
      {title && <h2 className="mb-4 text-lg font-semibold text-navy-900">{title}</h2>}
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    DRAFT: "bg-gray-100 text-gray-700",
    PENDING_ADMIN: "bg-orange-100 text-orange-800",
    IN_TRANSIT: "bg-blue-100 text-blue-800",
    DELIVERED: "bg-green-100 text-green-800",
    NOT_SUBMITTED: "bg-gray-100 text-gray-600",
    ACCEPTED: "bg-blue-100 text-blue-800",
    PICKED_UP: "bg-indigo-100 text-indigo-800",
    RECEIPT_CREATED: "bg-purple-100 text-purple-800",
    ADMIN_PENDING: "bg-orange-100 text-orange-800",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[status] ?? "bg-navy-100 text-navy-700"}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
