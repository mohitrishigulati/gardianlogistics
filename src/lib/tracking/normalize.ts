import type { TrackingResult } from "./types";
import { STATUS_LABELS, type ShipmentStatus } from "./types";

interface RawCarrierEvent {
  status?: string;
  location?: string;
  timestamp?: string;
  description?: string;
}

interface RawCarrierResponse {
  tracking_number?: string;
  carrier?: string;
  status?: string;
  current_location?: string;
  estimated_delivery?: string;
  origin?: string;
  destination?: string;
  events?: RawCarrierEvent[];
}

const STATUS_MAP: Record<string, ShipmentStatus> = {
  booked: "booked",
  label_created: "booked",
  picked_up: "picked_up",
  pickup: "picked_up",
  in_transit: "in_transit",
  transit: "in_transit",
  customs: "customs_clearance",
  customs_clearance: "customs_clearance",
  out_for_delivery: "out_for_delivery",
  delivery: "out_for_delivery",
  delivered: "delivered",
  exception: "exception",
};

function mapStatus(raw?: string): ShipmentStatus {
  if (!raw) return "unknown";
  const key = raw.toLowerCase().replace(/\s+/g, "_");
  return STATUS_MAP[key] ?? "unknown";
}

export function normalizeCarrierResponse(
  raw: RawCarrierResponse,
  trackingNumber: string
): TrackingResult {
  const status = mapStatus(raw.status);
  const history = (raw.events ?? []).map((event) => {
    const eventStatus = mapStatus(event.status);
    return {
      status: eventStatus,
      label: STATUS_LABELS[eventStatus],
      location: event.location,
      timestamp: event.timestamp ?? new Date().toISOString(),
      description: event.description,
    };
  });

  return {
    trackingNumber: raw.tracking_number ?? trackingNumber,
    carrier: raw.carrier ?? "Partner Carrier",
    status,
    statusLabel: STATUS_LABELS[status],
    currentLocation: raw.current_location,
    estimatedDelivery: raw.estimated_delivery,
    origin: raw.origin,
    destination: raw.destination,
    history,
  };
}
