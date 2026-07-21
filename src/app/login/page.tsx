"use client";

import { FormEvent, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ROLE_DASHBOARD } from "@/lib/auth/roles";

type LoginMode = "customer" | "agent" | "staff";

function LoginContent() {
  const searchParams = useSearchParams();
  const defaultCallback = searchParams.get("callbackUrl") ?? "/portal";
  const error = searchParams.get("error");
  const modeParam = searchParams.get("mode");

  const initialMode: LoginMode =
    modeParam === "staff" || defaultCallback.startsWith("/admin") || defaultCallback.startsWith("/sub-admin")
      ? "staff"
      : modeParam === "agent" || defaultCallback.startsWith("/agent")
        ? "agent"
        : "customer";

  const [mode, setMode] = useState<LoginMode>(initialMode);
  const [companyId, setCompanyId] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentialsLogin(provider: "company-id" | "agent-mobile", payload: Record<string, string>) {
    setFormError("");
    setLoading(true);

    const result = await signIn(provider, { ...payload, redirect: false });
    setLoading(false);

    if (result?.error) {
      setFormError(
        provider === "agent-mobile"
          ? "Invalid mobile number or password."
          : "Invalid Company ID or password."
      );
      return;
    }

    const session = await getSession();
    window.location.href = session?.user?.dashboardUrl ?? "/portal";
  }

  function handleStaffLogin(e: FormEvent) {
    e.preventDefault();
    handleCredentialsLogin("company-id", {
      companyId: companyId.trim().toUpperCase(),
      password,
    });
  }

  function handleAgentLogin(e: FormEvent) {
    e.preventDefault();
    handleCredentialsLogin("agent-mobile", {
      mobile: mobile.replace(/\D/g, ""),
      password,
    });
  }

  const tabs: { id: LoginMode; label: string }[] = [
    { id: "customer", label: "Customer" },
    { id: "agent", label: "Agent" },
    { id: "staff", label: "Staff" },
  ];

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-navy-100 bg-white p-8 shadow-elevated">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-2xl font-bold text-navy-900">Sign In</h1>

        <div className="mt-6 flex rounded-lg border border-navy-100 bg-surface p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setMode(tab.id);
                setFormError("");
              }}
              className={`flex-1 rounded-md px-2 py-2 text-xs font-medium transition sm:text-sm ${
                mode === tab.id ? "bg-white text-navy-900 shadow-sm" : "text-navy-500 hover:text-navy-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {mode === "customer" && (
          <>
            <p className="mt-4 text-center text-sm text-navy-600">
              Customers sign in with Gmail to book shipments to nearby agents.
            </p>
            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                Sign in failed. Please try again.
              </p>
            )}
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: defaultCallback })}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-navy-200 bg-white px-4 py-3 text-sm font-semibold text-navy-800 shadow-sm transition hover:bg-surface"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        {mode === "agent" && (
          <>
            <p className="mt-4 text-center text-sm text-navy-600">
              Agents created by admin sign in with mobile number and password.
            </p>
            <form onSubmit={handleAgentLogin} className="mt-6 space-y-4">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-navy-700">
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  type="tel"
                  required
                  maxLength={10}
                  autoComplete="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder="9876543210"
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
                />
              </div>
              <div>
                <label htmlFor="agent-password" className="block text-sm font-medium text-navy-700">
                  Password
                </label>
                <input
                  id="agent-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
                />
              </div>
              {formError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {formError}
                </p>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? "Signing in..." : "Sign In as Agent"}
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-navy-400">
              New agent? Contact admin — accounts are created from the admin panel.
            </p>
          </>
        )}

        {mode === "staff" && (
          <>
            <p className="mt-4 text-center text-sm text-navy-600">
              Admin and sub-admin staff sign in with Company ID and password.
            </p>
            <form onSubmit={handleStaffLogin} className="mt-6 space-y-4">
              <div>
                <label htmlFor="companyId" className="block text-sm font-medium text-navy-700">
                  Company ID
                </label>
                <input
                  id="companyId"
                  type="text"
                  required
                  autoComplete="username"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value.toUpperCase())}
                  placeholder="e.g. GL-ADMIN-001"
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 font-mono text-sm uppercase focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
                />
              </div>
              <div>
                <label htmlFor="staff-password" className="block text-sm font-medium text-navy-700">
                  Password
                </label>
                <input
                  id="staff-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
                />
              </div>
              {formError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {formError}
                </p>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? "Signing in..." : "Sign In as Staff"}
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-navy-400">
              Admin → {ROLE_DASHBOARD.ADMIN} · Sub-Admin → {ROLE_DASHBOARD.SUB_ADMIN}
            </p>
          </>
        )}

        <div className="mt-8 space-y-2 border-t border-navy-100 pt-6 text-xs text-navy-500">
          <p><strong className="text-navy-700">Customers</strong> — Google sign-in</p>
          <p><strong className="text-navy-700">Agents</strong> — mobile + password (admin-created)</p>
          <p><strong className="text-navy-700">Staff</strong> — Company ID + password</p>
        </div>

        <p className="mt-6 text-center text-sm text-navy-500">
          <Link href="/" className="text-accent-600 hover:underline">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
