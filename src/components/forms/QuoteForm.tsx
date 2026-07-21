"use client";

import { FormEvent, useState } from "react";
import { services } from "@/data/services";

interface QuoteFormState {
  origin: string;
  destination: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  serviceType: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}

const initialState: QuoteFormState = {
  origin: "",
  destination: "",
  weight: "",
  length: "",
  width: "",
  height: "",
  serviceType: "international-courier",
  name: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
};

export function QuoteForm() {
  const [form, setForm] = useState<QuoteFormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    message: string;
    estimate: { min: number; max: number; currency: string };
    referenceId: string;
  } | null>(null);

  function update(field: keyof QuoteFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "Something went wrong. Please try again.");
        return;
      }
      setSuccess(data);
      setForm(initialState);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8" role="status">
        <h3 className="text-lg font-semibold text-navy-900">Quote Request Received</h3>
        <p className="mt-2 text-sm text-navy-600">{success.message}</p>
        <p className="mt-4 text-sm text-navy-500">
          Reference: <span className="font-mono font-semibold">{success.referenceId}</span>
        </p>
        <div className="mt-4 rounded-lg bg-white p-4">
          <p className="text-sm font-medium text-navy-700">Estimated price range</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">
            {success.estimate.currency} {success.estimate.min} – {success.estimate.max}
          </p>
          <p className="mt-1 text-xs text-navy-500">
            Final rate confirmed by our team based on carrier availability and route.
          </p>
        </div>
        <button
          type="button"
          className="btn-secondary mt-6"
          onClick={() => setSuccess(null)}
        >
          Submit Another Quote
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-navy-500">
          Shipment Details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-navy-700">
              Origin *
            </label>
            <input
              id="origin"
              required
              value={form.origin}
              onChange={(e) => update("origin", e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
              placeholder="City, Country"
            />
          </div>
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-navy-700">
              Destination *
            </label>
            <input
              id="destination"
              required
              value={form.destination}
              onChange={(e) => update("destination", e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
              placeholder="City, Country"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-navy-700">
              Weight (kg) *
            </label>
            <input
              id="weight"
              type="number"
              min="0.1"
              step="0.1"
              required
              value={form.weight}
              onChange={(e) => update("weight", e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
            />
          </div>
          {(["length", "width", "height"] as const).map((dim) => (
            <div key={dim}>
              <label htmlFor={dim} className="block text-sm font-medium text-navy-700 capitalize">
                {dim} (cm)
              </label>
              <input
                id={dim}
                type="number"
                min="1"
                value={form[dim]}
                onChange={(e) => update(dim, e.target.value)}
                className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
              />
            </div>
          ))}
        </div>
        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-navy-700">
            Service Type *
          </label>
          <select
            id="serviceType"
            required
            value={form.serviceType}
            onChange={(e) => update("serviceType", e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
          >
            {services.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-navy-500">
          Contact Details
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-navy-700">
              Full Name *
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-navy-700">
              Company
            </label>
            <input
              id="company"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy-700">
              Email *
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-navy-700">
              Phone *
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
            />
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-navy-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
            placeholder="Contents, urgency, special handling..."
          />
        </div>
      </fieldset>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full py-3 sm:w-auto">
        {loading ? "Submitting..." : "Get Estimated Quote"}
      </button>
    </form>
  );
}
