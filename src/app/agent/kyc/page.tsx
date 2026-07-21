"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DashboardCard, DashboardShell, StatusBadge } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/agent", label: "Dashboard" },
  { href: "/agent/bookings", label: "Bookings" },
  { href: "/agent/receipt", label: "Create Receipt" },
  { href: "/agent/shipments", label: "My Shipments" },
  { href: "/agent/kyc", label: "KYC Status" },
];

export default function AgentKycPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/agent/profile")
      .then((r) => r.json())
      .then((d) => setProfile(d.profile ?? null));
  }, []);

  return (
    <DashboardShell title="Agent Panel" nav={nav}>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">KYC Status</h1>
      <DashboardCard>
        <p className="text-sm text-navy-600">
          Current status: <StatusBadge status={(profile?.kycStatus as string) ?? session?.user?.kycStatus ?? "NOT_SUBMITTED"} />
        </p>
        {profile ? (
          <dl className="mt-4 space-y-2 text-sm">
            <div><dt className="font-medium text-navy-700">Business</dt><dd>{String(profile.businessName ?? "—")}</dd></div>
            <div><dt className="font-medium text-navy-700">Address</dt><dd>{String(profile.address)}</dd></div>
            <div><dt className="font-medium text-navy-700">City</dt><dd>{String(profile.city)}</dd></div>
            <div><dt className="font-medium text-navy-700">ID</dt><dd>{String(profile.idType)} — {String(profile.idNumber)}</dd></div>
            {profile.kycNotes ? (
              <div><dt className="font-medium text-navy-700">Review Notes</dt><dd>{String(profile.kycNotes)}</dd></div>
            ) : null}
          </dl>
        ) : (
          <p className="mt-4 text-navy-500">
            No agent profile found. Apply from{" "}
            <a href="/portal/become-agent" className="text-accent-600 underline">Become an Agent</a>.
          </p>
        )}
      </DashboardCard>
    </DashboardShell>
  );
}
