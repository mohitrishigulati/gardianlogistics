"use client";

import { FormEvent, useEffect, useState } from "react";
import { DashboardCard, DashboardShell } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/book", label: "Book Shipment" },
  { href: "/portal/bookings", label: "My Bookings" },
  { href: "/portal/profile", label: "Profile" },
  { href: "/portal/become-agent", label: "Become an Agent" },
];

export default function ProfilePage() {
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setForm({
            name: d.user.name ?? "",
            phone: d.user.phone ?? "",
            address: d.user.address ?? "",
            city: d.user.city ?? "",
          });
        }
      });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMessage(res.ok ? "Profile updated." : data.message);
  }

  return (
    <DashboardShell title="Customer Portal" nav={nav}>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">My Profile</h1>
      <DashboardCard>
        <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-700">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700">Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700">City</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            />
          </div>
          {message && <p className="text-sm text-green-700">{message}</p>}
          <button type="submit" className="btn-primary">Save Profile</button>
        </form>
      </DashboardCard>
    </DashboardShell>
  );
}
