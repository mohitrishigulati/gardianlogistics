import { STATUS_LABELS, STATUS_ORDER, type ShipmentStatus, type TrackingResult } from "@/lib/tracking/types";

interface TrackingTimelineProps {
  result: TrackingResult;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function getStepState(
  stepStatus: ShipmentStatus,
  currentStatus: ShipmentStatus,
  historyStatuses: Set<ShipmentStatus>
): "complete" | "current" | "upcoming" {
  const stepIndex = STATUS_ORDER.indexOf(stepStatus);
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  if (historyStatuses.has(stepStatus) && stepIndex < currentIndex) return "complete";
  if (stepStatus === currentStatus) return "current";
  if (stepIndex < currentIndex) return "complete";
  return "upcoming";
}

export function TrackingTimeline({ result }: TrackingTimelineProps) {
  const historyStatuses = new Set(result.history.map((h) => h.status));

  return (
    <div className="relative">
      <ol className="space-y-0" aria-label="Shipment progress">
        {STATUS_ORDER.map((stepStatus, index) => {
          const state = getStepState(stepStatus, result.status, historyStatuses);
          const event = result.history.find((h) => h.status === stepStatus);
          const isLast = index === STATUS_ORDER.length - 1;

          return (
            <li key={stepStatus} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast && (
                <span
                  className={`absolute left-[15px] top-8 h-full w-0.5 ${
                    state === "complete" || state === "current"
                      ? "bg-accent-500"
                      : "bg-navy-200"
                  }`}
                  aria-hidden="true"
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  state === "complete"
                    ? "border-accent-500 bg-accent-500 text-navy-900"
                    : state === "current"
                      ? "border-accent-500 bg-white text-accent-600 ring-4 ring-accent-500/20"
                      : "border-navy-200 bg-white text-navy-400"
                }`}
                aria-current={state === "current" ? "step" : undefined}
              >
                {state === "complete" ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={`font-semibold ${
                    state === "upcoming" ? "text-navy-400" : "text-navy-900"
                  }`}
                >
                  {STATUS_LABELS[stepStatus]}
                </p>
                {event && (
                  <>
                    {event.location && (
                      <p className="mt-0.5 text-sm text-navy-600">{event.location}</p>
                    )}
                    {event.description && (
                      <p className="mt-0.5 text-sm text-navy-500">{event.description}</p>
                    )}
                    <time className="mt-1 block text-xs text-navy-400" dateTime={event.timestamp}>
                      {formatDate(event.timestamp)}
                    </time>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
