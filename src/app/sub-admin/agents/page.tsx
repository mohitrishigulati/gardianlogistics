"use client";

import { useEffect, useState } from "react";
import { DashboardCard, DashboardShell, StatusBadge } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/sub-admin", label: "Dashboard" },
  { href: "/sub-admin/agents", label: "Manage Agents" },
  { href: "/sub-admin/kyc", label: "KYC Review" },
];

export default function SubAdminAgentsPage() {
  const [agents, setAgents] = useState<Array<Record<string, unknown>>>([]);

  function load() {
    fetch("/api/sub-admin")
      .then((r) => r.json())
      .then((d) => setAgents(d.agents ?? []));
  }

  useEffect(() => {
    load();
  }, []);

  async function assignAgent(agentProfileId: string) {
    await fetch("/api/sub-admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentProfileId }),
    });
    load();
  }

  return (
    <DashboardShell title="Sub-Admin Panel" nav={nav}>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Manage Agents</h1>
      <DashboardCard>
        <div className="space-y-3">
          {agents.map((a) => {
            const agent = a as {
              id: string;
              city: string;
              kycStatus: string;
              isActive: boolean;
              subAdminId: string | null;
              user: { name: string | null; email: string };
              _count: { bookings: number; shipments: number };
            };
            return (
              <div key={agent.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-navy-100 p-3">
                <div>
                  <p className="font-medium text-navy-900">{agent.user.name ?? agent.user.email}</p>
                  <p className="text-sm text-navy-500">
                    {agent.city} · {agent._count.bookings} bookings · {agent._count.shipments} shipments
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={agent.kycStatus} />
                  {!agent.subAdminId && (
                    <button type="button" className="btn-secondary text-xs" onClick={() => assignAgent(agent.id)}>
                      Assign to Me
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DashboardCard>
    </DashboardShell>
  );
}
