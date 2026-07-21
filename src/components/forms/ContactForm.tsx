"use client";

import { FormEvent, useState } from "react";
import { offices } from "@/data/offices";
import { siteConfig } from "@/data/site";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    office: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message ?? "Something went wrong.");
        return;
      }
      setSuccess(data.message);
      setForm({ name: "", email: "", phone: "", subject: "", message: "", office: "" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3">
        <a
          href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex gap-2"
        >
          WhatsApp Us
        </a>
        <a href={`tel:${siteConfig.phone.india.replace(/\s/g, "")}`} className="btn-secondary">
          Call India Office
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-navy-700">
              Name *
            </label>
            <input
              id="contact-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-navy-700">
              Email *
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-phone" className="block text-sm font-medium text-navy-700">
              Phone
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
            />
          </div>
          <div>
            <label htmlFor="contact-office" className="block text-sm font-medium text-navy-700">
              Preferred Office
            </label>
            <select
              id="contact-office"
              value={form.office}
              onChange={(e) => setForm({ ...form, office: e.target.value })}
              className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
            >
              <option value="">Any office</option>
              {offices.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.city}, {o.country}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium text-navy-700">
            Subject *
          </label>
          <input
            id="contact-subject"
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-navy-700">
            Message *
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800" role="status">
            {success}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
