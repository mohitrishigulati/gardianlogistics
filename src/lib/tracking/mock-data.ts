import type { ShipmentStatus, TrackingEvent, TrackingResult } from "./types";
import { STATUS_LABELS } from "./types";
import {
  CARRIER_DISPLAY_NAMES,
  type DetectedCarrier,
  detectCarrier,
} from "./carrier-detection";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const MOCK_ROUTES = [
  { origin: "New Delhi, India", destination: "London, UK" },
  { origin: "Mumbai, India", destination: "Dubai, UAE" },
  { origin: "London, UK", destination: "New York, USA" },
  { origin: "Bangalore, India", destination: "Singapore" },
  { origin: "Chennai, India", destination: "Sydney, Australia" },
];

const TRANSIT_HUBS = [
  "Delhi Hub, India",
  "Mumbai Gateway, India",
  "London Heathrow Gateway, UK",
  "Dubai Sort Facility, UAE",
  "Frankfurt Transit Hub, Germany",
];

function buildHistory(
  trackingNumber: string,
  currentStatus: ShipmentStatus
): TrackingEvent[] {
  const route = MOCK_ROUTES[hashString(trackingNumber) % MOCK_ROUTES.length];
  const hub = TRANSIT_HUBS[hashString(trackingNumber + "hub") % TRANSIT_HUBS.length];

  const allEvents: TrackingEvent[] = [
    {
      status: "booked",
      label: STATUS_LABELS.booked,
      location: route.origin,
      timestamp: daysAgo(5),
      description: "Shipment booked and label generated",
    },
    {
      status: "picked_up",
      label: STATUS_LABELS.picked_up,
      location: route.origin,
      timestamp: daysAgo(4),
      description: "Collected from sender",
    },
    {
      status: "in_transit",
      label: STATUS_LABELS.in_transit,
      location: hub,
      timestamp: daysAgo(3),
      description: "Departed origin facility",
    },
    {
      status: "customs_clearance",
      label: STATUS_LABELS.customs_clearance,
      location: route.destination.split(",")[0] + " Customs",
      timestamp: daysAgo(1),
      description: "Customs processing initiated",
    },
    {
      status: "out_for_delivery",
      label: STATUS_LABELS.out_for_delivery,
      location: route.destination,
      timestamp: daysAgo(0),
      description: "With local delivery courier",
    },
    {
      status: "delivered",
      label: STATUS_LABELS.delivered,
      location: route.destination,
      timestamp: daysFromNow(0),
      description: "Delivered to recipient",
    },
  ];

  const statusIndex = allEvents.findIndex((e) => e.status === currentStatus);
  return statusIndex >= 0 ? allEvents.slice(0, statusIndex + 1) : allEvents.slice(0, 3);
}

const STATUS_VARIANTS: ShipmentStatus[] = [
  "in_transit",
  "customs_clearance",
  "out_for_delivery",
  "delivered",
  "picked_up",
];

export function generateMockTracking(trackingNumber: string): TrackingResult {
  const carrierKey = detectCarrier(trackingNumber);
  const carrier = CARRIER_DISPLAY_NAMES[carrierKey];
  const route = MOCK_ROUTES[hashString(trackingNumber) % MOCK_ROUTES.length];
  const status =
    STATUS_VARIANTS[hashString(trackingNumber + "status") % STATUS_VARIANTS.length];
  const history = buildHistory(trackingNumber, status);
  const lastEvent = history[history.length - 1];

  return {
    trackingNumber,
    carrier,
    status,
    statusLabel: STATUS_LABELS[status],
    currentLocation: lastEvent.location,
    estimatedDelivery:
      status === "delivered" ? lastEvent.timestamp : daysFromNow(2),
    origin: route.origin,
    destination: route.destination,
    history,
  };
}

export function getMockNotFoundNumbers(): string[] {
  return ["NOTFOUND000", "INVALID123"];
}

export async function fetchMockTracking(
  trackingNumber: string
): Promise<TrackingResult | null> {
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

  if (getMockNotFoundNumbers().includes(trackingNumber)) {
    return null;
  }

  if (trackingNumber.includes("TIMEOUT")) {
    throw new Error("TIMEOUT");
  }

  return generateMockTracking(trackingNumber);
}

export function carrierToApiSlug(carrier: DetectedCarrier): string {
  const map: Record<DetectedCarrier, string> = {
    dhl: "dhl",
    fedex: "fedex",
    aramex: "aramex",
    ups: "ups",
    generic: "generic",
    unknown: "generic",
  };
  return map[carrier];
}
