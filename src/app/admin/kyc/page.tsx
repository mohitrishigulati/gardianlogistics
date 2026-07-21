"use client";

import { useEffect, useState } from "react";
import { DashboardCard, DashboardShell, StatusBadge } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/agents", label: "Manage Agents" },
  { href: "/admin/rates", label: "Rate Slabs" },
  { href: "/admin/shipments", label: "Approve Trackers" },
  { href: "/admin/kyc", label: "Agent KYC" },
];

export default function AdminKycPage() {
  const [agents, setAgents] = useState<Array<Record<string, unknown>>>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  function load() {
    fetch("/api/admin/kyc")
      .then((r) => r.json())
      .then((d) => setAgents(d.agents ?? []));
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
    <DashboardShell title="Admin Panel" nav={nav}>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Agent KYC Review</h1>
      <DashboardCard>
        <div className="space-y-4">
          {agents.map((a) => {
            const agent = a as {
              id: string;
              businessName: string | null;
              address: string;
              city: string;
              phone: string;
              idType: string | null;
              idNumber: string | null;
              kycStatus: string;
              user: { name: string | null; email: string; phone: string | null };
            };
            return (
              <div key={agent.id} className="rounded-lg border border-navy-100 p-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-semibold text-navy-900">{agent.user.name ?? agent.businessName}</p>
                    <p className="text-sm text-navy-500">{agent.user.email}</p>
                    <p className="text-sm text-navy-600">{agent.address}, {agent.city}</p>
                    <p className="text-sm text-navy-600">ID: {agent.idType} — {agent.idNumber}</p>
                  </div>
                  <StatusBadge status={agent.kycStatus} />
                </div>
                <textarea
                  placeholder="Review notes"
                  value={notes[agent.id] ?? ""}
                  onChange={(e) => setNotes({ ...notes, [agent.id]: e.target.value })}
                  className="mt-3 w-full rounded border border-navy-200 px-3 py-2 text-sm"
                  rows={2}
                />
                <div className="mt-3 flex gap-2">
                  <button type="button" className="btn-primary text-sm" onClick={() => handleKyc(agent.id, "approve")}>
                    Approve KYC
                  </button>
                  <button type="button" className="btn-secondary text-sm" onClick={() => handleKyc(agent.id, "reject")}>
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
          {agents.length === 0 && <p className="text-navy-500">No pending KYC applications.</p>}
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
