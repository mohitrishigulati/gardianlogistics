"use client";

import { useEffect, useState } from "react";
import { DashboardCard, DashboardShell } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/sub-admin", label: "Dashboard" },
  { href: "/sub-admin/agents", label: "Manage Agents" },
  { href: "/sub-admin/kyc", label: "KYC Review" },
];

export default function SubAdminKycPage() {
  const [agents, setAgents] = useState<Array<Record<string, unknown>>>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  function load() {
    fetch("/api/sub-admin")
      .then((r) => r.json())
      .then((d) => setAgents(d.pendingKyc ?? []));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleKyc(agentProfileId: string, action: "approve" | "reject") {
    await fetch("/api/admin/kyc", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentProfileId, action, kycNotes: notes[agentProfileId] }),
    });
    load();
  }

  return (
    <DashboardShell title="Sub-Admin Panel" nav={nav}>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Agent KYC Review</h1>
      <DashboardCard>
        <div className="space-y-4">
          {agents.map((a) => {
            const agent = a as {
              id: string;
              businessName: string | null;
              city: string;
              idType: string | null;
              idNumber: string | null;
              user: { name: string | null; email: string };
            };
            return (
              <div key={agent.id} className="rounded-lg border border-navy-100 p-4">
                <p className="font-semibold">{agent.user.name ?? agent.businessName}</p>
                <p className="text-sm text-navy-500">{agent.user.email} · {agent.city}</p>
                <p className="text-sm text-navy-600">{agent.idType} — {agent.idNumber}</p>
                <textarea
                  value={notes[agent.id] ?? ""}
                  onChange={(e) => setNotes({ ...notes, [agent.id]: e.target.value })}
                  className="mt-2 w-full rounded border border-navy-200 px-3 py-2 text-sm"
                  rows={2}
                  placeholder="Review notes"
                />
                <div className="mt-2 flex gap-2">
                  <button type="button" className="btn-primary text-sm" onClick={() => handleKyc(agent.id, "approve")}>
                    Approve
                  </button>
                  <button type="button" className="btn-secondary text-sm" onClick={() => handleKyc(agent.id, "reject")}>
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
          {agents.length === 0 && <p className="text-navy-500">No pending KYC.</p>}
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
