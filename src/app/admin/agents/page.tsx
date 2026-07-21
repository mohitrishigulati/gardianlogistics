"use client";

import { FormEvent, useEffect, useState } from "react";
import { DashboardCard, DashboardShell, StatusBadge } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/agents", label: "Manage Agents" },
  { href: "/admin/shipments", label: "Approve Trackers" },
  { href: "/admin/kyc", label: "Agent KYC" },
];

interface AgentRow {
  id: string;
  businessName: string | null;
  city: string;
  state: string | null;
  pincode: string | null;
  address: string;
  phone: string;
  isActive: boolean;
  kycStatus: string;
  user: { name: string | null; loginPhone: string | null };
  createdBy: { name: string | null } | null;
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
    businessName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  function loadAgents() {
    fetch("/api/admin/agents")
      .then((r) => r.json())
      .then((d) => setAgents(d.agents ?? []));
  }

  useEffect(() => {
    loadAgents();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/admin/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message ?? "Failed to create agent.");
      return;
    }

    setSuccess(`Agent created! Mobile login: ${data.agent.loginPhone}`);
    setForm({
      name: "",
      mobile: "",
      password: "",
      businessName: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
    loadAgents();
  }

  return (
    <DashboardShell title="Admin Panel" nav={nav}>
      <h1 className="mb-2 text-2xl font-bold text-navy-900">Manage Agents by Location</h1>
      <p className="mb-6 text-sm text-navy-600">
        Create agents assigned to a state and pincode. They sign in with their mobile number and password.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <DashboardCard title="Create New Agent">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-navy-700">Agent Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700">Business Name</label>
                <input
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-navy-700">Mobile (Login) *</label>
                <input
                  required
                  type="tel"
                  maxLength={10}
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })}
                  placeholder="9876543210"
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700">Password *</label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700">Office Address *</label>
              <input
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-navy-700">City *</label>
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700">State *</label>
                <input
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  placeholder="e.g. Delhi"
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700">Pincode *</label>
                <input
                  required
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                  placeholder="110001"
                  maxLength={6}
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-700">{success}</p>}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creating..." : "Create Agent"}
            </button>
          </form>
        </DashboardCard>

        <DashboardCard title={`Agents (${agents.length})`}>
          <div className="max-h-[600px] space-y-3 overflow-y-auto">
            {agents.map((a) => (
              <div key={a.id} className="rounded-lg border border-navy-100 p-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-navy-900">{a.businessName ?? a.user.name}</p>
                  <StatusBadge status={a.isActive ? "APPROVED" : "PENDING"} />
                </div>
                <p className="text-navy-600">
                  {a.city}, {a.state} — {a.pincode}
                </p>
                <p className="text-navy-500">{a.address}</p>
                <p className="mt-1 font-mono text-xs text-navy-700">
                  Login: {a.user.loginPhone ?? a.phone}
                </p>
              </div>
            ))}
            {agents.length === 0 && (
              <p className="text-navy-500">No agents yet. Create one using the form.</p>
            )}
          </div>
        </DashboardCard>
      </div>
    </DashboardShell>
  );
}
