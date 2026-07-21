"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardCard, DashboardShell } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/agents", label: "Manage Agents" },
  { href: "/admin/rates", label: "Rate Slabs" },
  { href: "/admin/shipments", label: "Approve Trackers" },
  { href: "/admin/kyc", label: "Agent KYC" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ pendingTrackers: 0, pendingKyc: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/shipments").then((r) => r.json()),
      fetch("/api/admin/kyc").then((r) => r.json()),
    ]).then(([shipments, kyc]) => {
      setCounts({
        pendingTrackers: (shipments.shipments ?? []).filter((s: { status: string }) => s.status === "PENDING_ADMIN").length,
        pendingKyc: (kyc.agents ?? []).length,
      });
    });
  }, []);

  return (
    <DashboardShell title="Admin Panel" nav={nav}>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard>
          <p className="text-sm text-navy-500">Pending Tracker Approvals</p>
          <p className="text-3xl font-bold">{counts.pendingTrackers}</p>
          <Link href="/admin/shipments" className="mt-3 inline-block text-sm text-accent-600 hover:underline">
            Review shipments →
          </Link>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm text-navy-500">Pending Agent KYC</p>
          <p className="text-3xl font-bold">{counts.pendingKyc}</p>
          <Link href="/admin/kyc" className="mt-3 inline-block text-sm text-accent-600 hover:underline">
            Review KYC →
          </Link>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm text-navy-500">Manage Agents</p>
          <p className="mt-2 text-sm text-navy-600">Create agents by state & pincode</p>
          <Link href="/admin/agents" className="mt-3 inline-block text-sm text-accent-600 hover:underline">
            Manage agents →
          </Link>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm text-navy-500">Rate Slab Sheets</p>
          <p className="mt-2 text-sm text-navy-600">Customize country weight slabs for agents</p>
          <Link href="/admin/rates" className="mt-3 inline-block text-sm text-accent-600 hover:underline">
            Manage rate slabs →
          </Link>
        </DashboardCard>
      </div>
    </DashboardShell>
  );
}
