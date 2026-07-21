"use client";

import { useEffect, useState } from "react";
import { DashboardCard, DashboardShell } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/sub-admin", label: "Dashboard" },
  { href: "/sub-admin/agents", label: "Manage Agents" },
  { href: "/sub-admin/kyc", label: "KYC Review" },
];

export default function SubAdminDashboard() {
  const [data, setData] = useState({ agents: 0, pendingKyc: 0, pendingShipments: 0 });

  useEffect(() => {
    fetch("/api/sub-admin")
      .then((r) => r.json())
      .then((d) =>
        setData({
          agents: d.agents?.length ?? 0,
          pendingKyc: d.pendingKyc?.length ?? 0,
          pendingShipments: d.pendingShipments?.length ?? 0,
        })
      );
  }, []);

  return (
    <DashboardShell title="Sub-Admin Panel" nav={nav}>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Sub-Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardCard>
          <p className="text-sm text-navy-500">Agents in Region</p>
          <p className="text-3xl font-bold">{data.agents}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm text-navy-500">Pending KYC</p>
          <p className="text-3xl font-bold">{data.pendingKyc}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm text-navy-500">Awaiting Admin Approval</p>
          <p className="text-3xl font-bold">{data.pendingShipments}</p>
        </DashboardCard>
      </div>
    </DashboardShell>
  );
}
