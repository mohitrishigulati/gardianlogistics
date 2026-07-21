"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeTrackingNumber } from "@/lib/tracking/carrier-detection";

interface TrackingWidgetProps {
  compact?: boolean;
  defaultValue?: string;
  className?: string;
}

export function TrackingWidget({ compact = false, defaultValue = "", className = "" }: TrackingWidgetProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const normalized = normalizeTrackingNumber(value);
    if (!normalized || normalized.length < 8) {
      setError("Enter a valid tracking number (min. 8 characters).");
      return;
    }
    setError("");
    router.push(`/track?awb=${encodeURIComponent(normalized)}`);
  }

  if (compact) {
    return (
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-2 sm:flex-row sm:items-center ${className}`}
        aria-label="Track shipment"
      >
        <label htmlFor="header-tracking" className="sr-only">
          Tracking number
        </label>
        <span className="hidden text-sm font-medium text-white sm:block">Track:</span>
        <div className="flex flex-1 gap-2">
          <input
            id="header-tracking"
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            placeholder="Enter AWB / tracking number"
            className="min-w-0 flex-1 rounded-lg border border-navy-700 bg-navy-800 px-3 py-2 text-sm text-white placeholder:text-navy-400 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
            autoComplete="off"
          />
          <button type="submit" className="btn-primary shrink-0 px-4 py-2 text-sm">
            Track
          </button>
        </div>
        {error && <p className="text-xs text-accent-300 sm:absolute sm:mt-12">{error}</p>}
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-xl bg-white p-2 shadow-elevated ${className}`}
      aria-label="Track shipment"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="hero-tracking" className="sr-only">
          Tracking number
        </label>
        <input
          id="hero-tracking"
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          placeholder="Enter AWB or tracking number"
          className="min-w-0 flex-1 rounded-lg border border-navy-200 px-4 py-3.5 text-base text-navy-900 placeholder:text-navy-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
          autoComplete="off"
        />
        <button type="submit" className="btn-primary px-8 py-3.5 text-base">
          Track Shipment
        </button>
      </div>
      {error && <p className="mt-2 px-2 text-sm text-red-600" role="alert">{error}</p>}
    </form>
  );
}
