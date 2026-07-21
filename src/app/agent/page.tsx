"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardCard, DashboardShell, StatusBadge } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/agent", label: "Dashboard" },
  { href: "/agent/bookings", label: "Bookings" },
  { href: "/agent/receipt", label: "Create Receipt" },
  { href: "/agent/shipments", label: "My Shipments" },
  { href: "/agent/kyc", label: "KYC Status" },
];

export default function AgentDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ bookings: 0, pending: 0, shipments: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/agent/bookings").then((r) => r.json()),
      fetch("/api/agent/shipments").then((r) => r.json()),
    ]).then(([bookingsData, shipmentsData]) => {
      const bookings = bookingsData.bookings ?? [];
      setStats({
        bookings: bookings.length,
        pending: bookings.filter((b: { status: string }) => b.status === "PENDING").length,
        shipments: shipmentsData.shipments?.length ?? 0,
      });
    });
  }, []);

  const kycApproved = session?.user?.kycStatus === "APPROVED" && session?.user?.agentActive;

  return (
    <DashboardShell title="Agent Panel" nav={nav}>
      <h1 className="mb-2 text-2xl font-bold text-navy-900">Agent Dashboard</h1>
      {!kycApproved && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          KYC status: <StatusBadge status={session?.user?.kycStatus ?? "NOT_SUBMITTED"} /> —{" "}
          <Link href="/agent/kyc" className="font-semibold underline">
            Complete or check KYC
          </Link>{" "}
          before creating tracker receipts.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardCard>
          <p className="text-sm text-navy-500">Total Bookings</p>
          <p className="text-3xl font-bold">{stats.bookings}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm text-navy-500">Pending Pickups</p>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </DashboardCard>
        <DashboardCard>
          <p className="text-sm text-navy-500">Tracker Receipts</p>
          <p className="text-3xl font-bold">{stats.shipments}</p>
        </DashboardCard>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/agent/bookings" className="btn-primary text-center">
          Manage Bookings
        </Link>
        <Link href="/agent/receipt" className="btn-secondary text-center">
          Create Tracker Receipt
        </Link>
      </div>
    </DashboardShell>
  );
}
