import type { TrackingResult } from "@/lib/tracking/types";
import { TrackingTimeline } from "./TrackingTimeline";

interface TrackingResultsProps {
  result: TrackingResult;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "full" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function TrackingResults({ result }: TrackingResultsProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
      <div className="border-b border-navy-100 bg-surface px-6 py-5 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-navy-500">Tracking Number</p>
            <p className="mt-1 font-mono text-lg font-bold text-navy-900">{result.trackingNumber}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-sm font-semibold text-accent-700">
              {result.statusLabel}
            </span>
            <p className="mt-2 text-sm text-navy-500">via {result.carrier}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-3 md:p-8">
        <div className="md:col-span-1">
          <dl className="space-y-4">
            {result.origin && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-navy-500">Origin</dt>
                <dd className="mt-1 text-sm font-medium text-navy-900">{result.origin}</dd>
              </div>
            )}
            {result.destination && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-navy-500">Destination</dt>
                <dd className="mt-1 text-sm font-medium text-navy-900">{result.destination}</dd>
              </div>
            )}
            {result.currentLocation && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-navy-500">Current Location</dt>
                <dd className="mt-1 text-sm font-medium text-navy-900">{result.currentLocation}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-navy-500">Estimated Delivery</dt>
              <dd className="mt-1 text-sm font-medium text-navy-900">{formatDate(result.estimatedDelivery)}</dd>
            </div>
          </dl>
        </div>
        <div className="md:col-span-2">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-navy-500">
            Shipment Timeline
          </h3>
          <TrackingTimeline result={result} />
        </div>
      </div>
    </article>
  );
}
