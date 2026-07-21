"use client";

import { FormEvent, useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { ROLE_DASHBOARD } from "@/lib/auth/roles";
import { siteConfig, trustSignals } from "@/data/site";

type LoginMode = "customer" | "agent" | "staff";

const modeDetails: Record<
  LoginMode,
  { title: string; subtitle: string; icon: string }
> = {
  customer: {
    title: "Customer Portal",
    subtitle: "Book shipments, track parcels, and manage your profile with Google.",
    icon: "👤",
  },
  agent: {
    title: "Agent Panel",
    subtitle: "Accept bookings, create receipts, and manage your pickup location.",
    icon: "📦",
  },
  staff: {
    title: "Staff Access",
    subtitle: "Admin and sub-admin tools for agents, KYC, and tracker approvals.",
    icon: "🛡️",
  },
};

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

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-900 shadow-sm transition placeholder:text-navy-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/25";

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Brand panel — matches home hero */}
      <section className="relative overflow-hidden bg-navy-900 px-6 py-10 text-white lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-14">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 40%, #4338ca 0%, transparent 55%), radial-gradient(circle at 85% 15%, #f59e0b 0%, transparent 45%), radial-gradient(circle at 70% 90%, #6366f1 0%, transparent 40%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <Link href="/" className="inline-block">
            <Logo variant="light" />
          </Link>
          <p className="mt-8 inline-flex items-center rounded-full border border-navy-600 bg-navy-800/60 px-4 py-1.5 text-sm font-medium text-accent-400 backdrop-blur-sm">
            Trusted since {siteConfig.founded} · India & UK
          </p>
          <h1 className="mt-6 max-w-lg text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            Welcome back to{" "}
            <span className="bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
              Gardian Logistics
            </span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-navy-200 lg:text-lg">
            {siteConfig.description.split(".").slice(0, 1).join(".")}.
          </p>
        </div>

        <div className="relative mt-10 hidden lg:block">
          <ul className="grid grid-cols-2 gap-4">
            {trustSignals.map((signal) => (
              <li
                key={signal.label}
                className="rounded-xl border border-navy-700/80 bg-navy-800/40 p-4 backdrop-blur-sm"
              >
                <p className="font-bold text-accent-400">{signal.label}</p>
                <p className="mt-1 text-sm text-navy-300">{signal.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative mt-8 text-sm text-navy-400 lg:mt-0">
          Global shipping · Best rates · Real-time tracking
        </p>
      </section>

      {/* Sign-in panel */}
      <section className="flex items-center justify-center bg-gradient-to-b from-surface to-white px-4 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-elevated sm:p-8">
            <div className="mb-6 flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-xl">
                {modeDetails[mode].icon}
              </span>
              <div>
                <h2 className="text-xl font-bold text-navy-900">{modeDetails[mode].title}</h2>
                <p className="mt-1 text-sm text-navy-500">{modeDetails[mode].subtitle}</p>
              </div>
            </div>

            <div className="flex rounded-xl border border-navy-100 bg-surface p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setMode(tab.id);
                    setFormError("");
                  }}
                  className={`flex-1 rounded-lg px-2 py-2.5 text-xs font-semibold transition sm:text-sm ${
                    mode === tab.id
                      ? "bg-navy-900 text-white shadow-sm"
                      : "text-navy-500 hover:text-navy-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {mode === "customer" && (
              <div className="mt-6">
                {error && (
                  <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    Sign in failed. Please try again.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: defaultCallback })}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-navy-200 bg-white px-4 py-3.5 text-sm font-semibold text-navy-800 shadow-sm transition hover:border-navy-300 hover:bg-surface hover:shadow-md"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
                <p className="mt-4 text-center text-xs text-navy-400">
                  Secure sign-in for customers booking international shipments.
                </p>
              </div>
            )}

            {mode === "agent" && (
              <form onSubmit={handleAgentLogin} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="mobile" className="block text-sm font-semibold text-navy-700">
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
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="agent-password" className="block text-sm font-semibold text-navy-700">
                    Password
                  </label>
                  <input
                    id="agent-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
                {formError && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    {formError}
                  </p>
                )}
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                  {loading ? "Signing in..." : "Sign In as Agent"}
                </button>
                <p className="text-center text-xs text-navy-400">
                  Accounts are created by admin with your mobile number.
                </p>
              </form>
            )}

            {mode === "staff" && (
              <form onSubmit={handleStaffLogin} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="companyId" className="block text-sm font-semibold text-navy-700">
                    Company ID
                  </label>
                  <input
                    id="companyId"
                    type="text"
                    required
                    autoComplete="username"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value.toUpperCase())}
                    placeholder="GL-ADMIN-001"
                    className={`${inputClass} font-mono uppercase tracking-wide`}
                  />
                </div>
                <div>
                  <label htmlFor="staff-password" className="block text-sm font-semibold text-navy-700">
                    Password
                  </label>
                  <input
                    id="staff-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
                {formError && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    {formError}
                  </p>
                )}
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                  {loading ? "Signing in..." : "Sign In as Staff"}
                </button>
                <p className="text-center text-xs text-navy-400">
                  Admin → {ROLE_DASHBOARD.ADMIN} · Sub-Admin → {ROLE_DASHBOARD.SUB_ADMIN}
                </p>
              </form>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/" className="font-medium text-navy-600 transition hover:text-accent-600">
              ← Back to home
            </Link>
            <span className="text-navy-300">·</span>
            <Link href="/track" className="font-medium text-navy-600 transition hover:text-accent-600">
              Track shipment
            </Link>
            <span className="text-navy-300">·</span>
            <Link href="/contact" className="font-medium text-navy-600 transition hover:text-accent-600">
              Get help
            </Link>
          </div>

          {/* Mobile trust signals */}
          <ul className="mt-8 grid grid-cols-2 gap-3 lg:hidden">
            {trustSignals.map((signal) => (
              <li
                key={signal.label}
                className="rounded-xl border border-navy-100 bg-white p-3 text-center shadow-card"
              >
                <p className="text-sm font-bold text-navy-900">{signal.label}</p>
                <p className="mt-0.5 text-xs text-navy-500">{signal.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent-400 border-t-transparent" />
        <p className="mt-4 text-sm text-navy-300">Loading sign in...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
