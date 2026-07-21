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

interface Agent {
  id: string;
  businessName: string;
  city: string;
  state?: string;
  address: string;
  phone: string;
  pincode?: string;
}

export default function BookShipmentPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [pincodeFilter, setPincodeFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    agentId: "",
    pickupType: "DROP_AT_AGENT",
    pickupAddress: "",
    pickupCity: "",
    destination: "",
    destinationCountry: "",
    recipientName: "",
    recipientPhone: "",
    notes: "",
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (cityFilter) params.set("city", cityFilter);
    if (stateFilter) params.set("state", stateFilter);
    if (pincodeFilter) params.set("pincode", pincodeFilter);
    const qs = params.toString();
    fetch(`/api/agents${qs ? `?${qs}` : ""}`)
      .then((r) => r.json())
      .then((d) => setAgents(d.agents ?? []));
  }, [cityFilter, stateFilter, pincodeFilter]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message ?? "Booking failed.");
      return;
    }
    setSuccess("Booking submitted! Your agent will confirm pickup shortly.");
    setForm({
      agentId: "",
      pickupType: "DROP_AT_AGENT",
      pickupAddress: "",
      pickupCity: "",
      destination: "",
      destinationCountry: "",
      recipientName: "",
      recipientPhone: "",
      notes: "",
    });
  }

  return (
    <DashboardShell title="Customer Portal" nav={nav}>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Book Shipment to Nearby Agent</h1>

      <DashboardCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-navy-700">State</label>
              <input
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                placeholder="e.g. Delhi, Maharashtra"
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700">Pincode</label>
              <input
                value={pincodeFilter}
                onChange={(e) => setPincodeFilter(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="110001"
                maxLength={6}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700">City</label>
              <input
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="e.g. New Delhi"
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700">Select Agent *</label>
            <select
              required
              value={form.agentId}
              onChange={(e) => setForm({ ...form, agentId: e.target.value })}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            >
              <option value="">Choose a nearby agent...</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.businessName} — {a.city}, {a.state} ({a.pincode}) — {a.address}
                </option>
              ))}
            </select>
            {agents.length === 0 && (stateFilter || pincodeFilter || cityFilter) && (
              <p className="mt-1 text-xs text-navy-500">No agents found for this location. Try different filters.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700">Pickup Method *</label>
            <div className="mt-2 flex gap-4">
              {[
                { value: "DOORSTEP", label: "Agent picks up from my doorstep" },
                { value: "DROP_AT_AGENT", label: "I drop at agent location" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="pickupType"
                    value={opt.value}
                    checked={form.pickupType === opt.value}
                    onChange={(e) => setForm({ ...form, pickupType: e.target.value })}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {form.pickupType === "DOORSTEP" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-navy-700">Pickup Address *</label>
                <input
                  required
                  value={form.pickupAddress}
                  onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700">Pickup City</label>
                <input
                  value={form.pickupCity}
                  onChange={(e) => setForm({ ...form, pickupCity: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-navy-700">Destination City *</label>
              <input
                required
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700">Destination Country *</label>
              <input
                required
                value={form.destinationCountry}
                onChange={(e) => setForm({ ...form, destinationCountry: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-navy-700">Recipient Name *</label>
              <input
                required
                value={form.recipientName}
                onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700">Recipient Phone *</label>
              <input
                required
                value={form.recipientPhone}
                onChange={(e) => setForm({ ...form, recipientPhone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-700">Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Submitting..." : "Submit Booking"}
          </button>
        </form>
      </DashboardCard>
    </DashboardShell>
  );
}
