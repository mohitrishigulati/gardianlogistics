"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parseBulkTrackingNumbers } from "@/lib/tracking/carrier-detection";
import type { TrackingResponse, TrackingResult } from "@/lib/tracking/types";
import { TrackingErrorState, TrackingSkeleton } from "@/components/tracking/TrackingSkeleton";
import { TrackingResults } from "@/components/tracking/TrackingResults";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function TrackPageClient() {
  const searchParams = useSearchParams();
  const initialAwb = searchParams.get("awb") ?? "";

  const [input, setInput] = useState(initialAwb);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TrackingResult[]>([]);
  const [errors, setErrors] = useState<Array<{ trackingNumber: string; message: string; code?: string }>>([]);

  const trackNumbers = useCallback(async (numbers: string[]) => {
    if (numbers.length === 0) return;

    setLoading(true);
    setResults([]);
    setErrors([]);

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumbers: numbers }),
      });

      const data = await res.json();

      if (data.results) {
        const successResults: TrackingResult[] = [];
        const errorResults: typeof errors = [];

        (data.results as TrackingResponse[]).forEach((result, i) => {
          const num = numbers[i];
          if (result.success) {
            successResults.push(result.data);
          } else {
            errorResults.push({
              trackingNumber: num,
              message: result.error.message,
              code: result.error.code,
            });
          }
        });

        setResults(successResults);
        setErrors(errorResults);
      } else if (data.success && data.data) {
        setResults([data.data]);
      } else if (!data.success) {
        setErrors([
          {
            trackingNumber: numbers[0],
            message: data.error?.message ?? "Unable to track shipment.",
            code: data.error?.code,
          },
        ]);
      }
    } catch {
      setErrors([
        {
          trackingNumber: numbers[0] ?? "",
          message: "Network error. Please check your connection and try again.",
          code: "SERVER_ERROR",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialAwb) {
      const numbers = parseBulkTrackingNumbers(initialAwb);
      if (numbers.length) trackNumbers(numbers);
    }
  }, [initialAwb, trackNumbers]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const numbers = parseBulkTrackingNumbers(input);
    if (numbers.length === 0) {
      setErrors([
        {
          trackingNumber: "",
          message: "Please enter at least one valid tracking number.",
          code: "INVALID_NUMBER",
        },
      ]);
      return;
    }
    trackNumbers(numbers.slice(0, 10));
  }

  return (
    <div className="container-site section-padding">
      <SectionHeading
        eyebrow="Track Shipment"
        title="Track Your Shipment"
        description="Enter one or more AWB / tracking numbers separated by commas or new lines. We query our partner carrier networks for real-time status."
        align="center"
        className="mb-10"
      />

      <form
        onSubmit={handleSubmit}
        className="mx-auto mb-10 max-w-2xl rounded-xl border border-navy-100 bg-white p-6 shadow-card"
        aria-label="Bulk tracking form"
      >
        <label htmlFor="bulk-tracking" className="block text-sm font-medium text-navy-700">
          Tracking Number(s)
        </label>
        <textarea
          id="bulk-tracking"
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter tracking numbers — one per line or comma-separated&#10;e.g. GL1234567890"
          className="mt-2 w-full rounded-lg border border-navy-200 px-4 py-3 font-mono text-sm focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
        />
        <p className="mt-2 text-xs text-navy-500">Up to 10 tracking numbers per search. Demo: GL1234567890</p>
        <button type="submit" disabled={loading} className="btn-primary mt-4 w-full sm:w-auto">
          {loading ? "Tracking..." : "Track Shipments"}
        </button>
      </form>

      <div className="mx-auto max-w-4xl space-y-6">
        {loading && <TrackingSkeleton />}

        {!loading && results.length === 0 && errors.length === 0 && (
          <div className="rounded-xl border border-dashed border-navy-200 bg-surface px-6 py-16 text-center">
            <p className="text-navy-500">Enter a tracking number above to see shipment status and timeline.</p>
          </div>
        )}

        {results.map((result) => (
          <TrackingResults key={result.trackingNumber} result={result} />
        ))}

        {errors.map((err) => (
          <div key={err.trackingNumber || err.message}>
            {err.trackingNumber && (
              <p className="mb-2 font-mono text-sm font-medium text-navy-600">{err.trackingNumber}</p>
            )}
            <TrackingErrorState
              title={
                err.code === "NOT_FOUND"
                  ? "Shipment Not Found"
                  : err.code === "INVALID_NUMBER"
                    ? "Invalid Tracking Number"
                    : err.code === "TIMEOUT"
                      ? "Request Timed Out"
                      : "Tracking Error"
              }
              message={err.message}
              code={err.code}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
