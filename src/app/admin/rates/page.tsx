"use client";

import { FormEvent, useEffect, useState } from "react";
import { DashboardCard, DashboardShell } from "@/components/dashboard/DashboardShell";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/agents", label: "Manage Agents" },
  { href: "/admin/rates", label: "Rate Slabs" },
  { href: "/admin/shipments", label: "Approve Trackers" },
  { href: "/admin/kyc", label: "Agent KYC" },
];

interface RateSlabRow {
  weightKg: number;
  price: number;
}

interface RateZoneRow {
  id: string;
  name: string;
  countries: string;
  countryList: string[];
  serviceName: string;
  currency: string;
  isActive: boolean;
  sortOrder: number;
  slabs: RateSlabRow[];
}

const emptySlab = (): RateSlabRow => ({ weightKg: 1, price: 0 });

export default function AdminRatesPage() {
  const [zones, setZones] = useState<RateZoneRow[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    countries: "",
    serviceName: "DPD Europe — Duty Paid",
    currency: "INR",
    isActive: true,
    sortOrder: 0,
    slabs: [emptySlab()] as RateSlabRow[],
  });

  const selectedZone = zones.find((zone) => zone.id === selectedZoneId);

  function loadZones() {
    fetch("/api/admin/rates")
      .then((r) => r.json())
      .then((d) => setZones(d.zones ?? []));
  }

  useEffect(() => {
    loadZones();
  }, []);

  useEffect(() => {
    if (!selectedZone) return;
    setForm({
      name: selectedZone.name,
      countries: selectedZone.countryList.join(", "),
      serviceName: selectedZone.serviceName,
      currency: selectedZone.currency,
      isActive: selectedZone.isActive,
      sortOrder: selectedZone.sortOrder,
      slabs: selectedZone.slabs.length ? selectedZone.slabs : [emptySlab()],
    });
  }, [selectedZone]);

  function updateSlab(index: number, field: keyof RateSlabRow, value: string) {
    setForm((prev) => ({
      ...prev,
      slabs: prev.slabs.map((slab, i) =>
        i === index
          ? {
              ...slab,
              [field]: field === "weightKg" ? parseInt(value) || 0 : parseFloat(value) || 0,
            }
          : slab
      ),
    }));
  }

  function addSlabRow() {
    setForm((prev) => ({
      ...prev,
      slabs: [...prev.slabs, { weightKg: prev.slabs.length + 1, price: 0 }],
    }));
  }

  function removeSlabRow(index: number) {
    setForm((prev) => ({
      ...prev,
      slabs: prev.slabs.filter((_, i) => i !== index),
    }));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      name: form.name,
      countries: form.countries,
      serviceName: form.serviceName,
      currency: form.currency,
      isActive: form.isActive,
      sortOrder: form.sortOrder,
      slabs: form.slabs.filter((slab) => slab.weightKg > 0),
    };

    const url = selectedZoneId ? `/api/admin/rates/${selectedZoneId}` : "/api/admin/rates";
    const method = selectedZoneId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message ?? "Failed to save rate zone.");
      return;
    }

    setSuccess(selectedZoneId ? "Rate zone updated." : "Rate zone created.");
    loadZones();
    if (!selectedZoneId && data.zone?.id) setSelectedZoneId(data.zone.id);
  }

  function startNewZone() {
    setSelectedZoneId("");
    setForm({
      name: "",
      countries: "",
      serviceName: "DPD Europe — Duty Paid",
      currency: "INR",
      isActive: true,
      sortOrder: zones.length + 1,
      slabs: [emptySlab()],
    });
  }

  async function handleDelete() {
    if (!selectedZoneId || !confirm("Delete this rate zone and all its slabs?")) return;

    setLoading(true);
    const res = await fetch(`/api/admin/rates/${selectedZoneId}`, { method: "DELETE" });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.message ?? "Failed to delete zone.");
      return;
    }

    setSuccess("Rate zone deleted.");
    startNewZone();
    loadZones();
  }

  return (
    <DashboardShell title="Admin Panel" nav={nav}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Rate Slab Sheets</h1>
          <p className="mt-1 text-sm text-navy-600">
            Customize country groups and weight slabs. Agents see reference slab prices and set their
            own customer charge.
          </p>
        </div>
        <button type="button" className="btn-secondary" onClick={startNewZone}>
          + New Zone
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <DashboardCard title="Country Zones">
          <div className="space-y-2">
            {zones.map((zone) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => setSelectedZoneId(zone.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                  selectedZoneId === zone.id
                    ? "border-accent-400 bg-accent-50"
                    : "border-navy-100 hover:bg-surface"
                }`}
              >
                <p className="font-medium text-navy-900">{zone.name}</p>
                <p className="text-xs text-navy-500">{zone.slabs.length} slabs · {zone.currency}</p>
              </button>
            ))}
            {!zones.length && (
              <p className="text-sm text-navy-500">No zones yet. Create one to get started.</p>
            )}
          </div>
        </DashboardCard>

        <form onSubmit={handleSave} className="space-y-6">
          <DashboardCard title={selectedZoneId ? "Edit Zone" : "Create Zone"}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-navy-700">Zone name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="France, Czech Republic, Denmark"
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-navy-700">Countries *</label>
                <input
                  required
                  value={form.countries}
                  onChange={(e) => setForm((prev) => ({ ...prev, countries: e.target.value }))}
                  placeholder="france, fr, czech republic, denmark"
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-navy-500">Comma-separated country names or codes.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700">Service name</label>
                <input
                  value={form.serviceName}
                  onChange={(e) => setForm((prev) => ({ ...prev, serviceName: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700">Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 text-sm"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Weight Slabs">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100 text-left text-navy-600">
                    <th className="px-2 py-2">Weight (kg)</th>
                    <th className="px-2 py-2">Reference price</th>
                    <th className="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {form.slabs.map((slab, index) => (
                    <tr key={index} className="border-b border-navy-50">
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min="1"
                          value={slab.weightKg}
                          onChange={(e) => updateSlab(index, "weightKg", e.target.value)}
                          className="w-24 rounded border border-navy-200 px-2 py-1.5"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={slab.price}
                          onChange={(e) => updateSlab(index, "price", e.target.value)}
                          className="w-32 rounded border border-navy-200 px-2 py-1.5"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() => removeSlabRow(index)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="mt-3 text-sm text-accent-600 hover:underline" onClick={addSlabRow}>
              + Add slab row
            </button>
          </DashboardCard>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : selectedZoneId ? "Update Zone" : "Create Zone"}
            </button>
            {selectedZoneId && (
              <button type="button" disabled={loading} className="btn-secondary" onClick={handleDelete}>
                Delete Zone
              </button>
            )}
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
