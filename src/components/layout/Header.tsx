"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { navLinks } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { TrackingWidget } from "@/components/tracking/TrackingWidget";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="border-b border-navy-50 bg-navy-900">
        <div className="container-site py-2">
          <TrackingWidget compact />
        </div>
      </div>

      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Gardian Logistics home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-navy-50 text-navy-900"
                    : "text-navy-600 hover:bg-surface hover:text-navy-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {session?.user ? (
            <Link href={session.user.dashboardUrl} className="btn-secondary text-sm">
              My Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn-secondary text-sm">
              Sign In
            </Link>
          )}
          <Link href="/track" className="btn-secondary text-sm">
            Track
          </Link>
          <Link href="/quote" className="btn-primary text-sm">
            Get a Quote
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-navy-700 hover:bg-surface lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-menu"
          className="border-t border-navy-100 bg-white px-4 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-navy-700 hover:bg-surface"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quote"
              className="btn-primary mt-3 text-center text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
