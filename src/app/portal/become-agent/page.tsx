"use client";

import { FormEvent, useState } from "react";
import { DashboardCard, DashboardShell, StatusBadge } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/book", label: "Book Shipment" },
  { href: "/portal/bookings", label: "My Bookings" },
  { href: "/portal/profile", label: "Profile" },
  { href: "/portal/become-agent", label: "Become an Agent" },
];

export default function BecomeAgentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    businessName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    idType: "Aadhaar",
    idNumber: "",
    idDocumentUrl: "",
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/agent/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? "Submission failed.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <DashboardShell title="Customer Portal" nav={nav}>
        <DashboardCard>
          <h1 className="text-xl font-bold text-navy-900">KYC Submitted</h1>
          <p className="mt-2 text-navy-600">
            Your agent application is pending review. Admin or sub-admin will verify your KYC
            documents. Once approved, sign in again to access the Agent Panel.
          </p>
          <StatusBadge status="PENDING" />
        </DashboardCard>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Customer Portal" nav={nav}>
      <h1 className="mb-2 text-2xl font-bold text-navy-900">Become a Gardian Agent</h1>
      <p className="mb-6 text-navy-600">
        Register as a pickup agent. Complete KYC to accept customer bookings and create tracker receipts.
      </p>

      <DashboardCard>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-navy-700">Business Name</label>
              <input
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700">Phone *</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
              <label className="block text-sm font-medium text-navy-700">State</label>
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700">Pincode</label>
              <input
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-navy-700">ID Type *</label>
              <select
                required
                value={form.idType}
                onChange={(e) => setForm({ ...form, idType: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              >
                <option>Aadhaar</option>
                <option>PAN</option>
                <option>Passport</option>
                <option>Driving License</option>
                <option>Company Registration</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700">ID Number *</label>
              <input
                required
                value={form.idNumber}
                onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700">ID Document URL (optional)</label>
            <input
              value={form.idDocumentUrl}
              onChange={(e) => setForm({ ...form, idDocumentUrl: e.target.value })}
              placeholder="Link to uploaded ID scan"
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary">Submit KYC Application</button>
        </form>
      </DashboardCard>
    </DashboardShell>
  );
}
