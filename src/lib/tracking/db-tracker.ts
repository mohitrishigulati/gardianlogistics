import { ShipmentStatus } from "@/lib/constants/roles";
import { prisma } from "@/lib/db";
import type { TrackingResult, TrackingEvent, ShipmentStatus as TrackingShipmentStatus } from "./types";
import { STATUS_LABELS } from "./types";

function mapDbStatus(status: string): TrackingShipmentStatus {
  const map: Record<string, TrackingShipmentStatus> = {
    DRAFT: "booked",
    PENDING_ADMIN: "booked",
    APPROVED: "picked_up",
    REJECTED: "exception",
    IN_TRANSIT: "in_transit",
    DELIVERED: "delivered",
  };
  return map[status] ?? "unknown";
}

function buildHistoryFromStatus(
  status: TrackingShipmentStatus,
  location: string,
  createdAt: Date
): TrackingEvent[] {
  const steps: TrackingShipmentStatus[] = [
    "booked",
    "picked_up",
    "in_transit",
    "customs_clearance",
    "out_for_delivery",
    "delivered",
  ];
  const currentIndex = steps.indexOf(status);
  const activeSteps: TrackingShipmentStatus[] = currentIndex >= 0 ? steps.slice(0, currentIndex + 1) : ["booked"];

  return activeSteps.map((step, i) => ({
    status: step,
    label: STATUS_LABELS[step],
    location,
    timestamp: new Date(createdAt.getTime() + i * 86400000).toISOString(),
    description: STATUS_LABELS[step],
  }));
}

export async function trackFromDatabase(trackingNumber: string): Promise<TrackingResult | null> {
  const normalized = trackingNumber.replace(/\s/g, "").toUpperCase();

  const shipment = await prisma.shipment.findUnique({
    where: { trackingNumber: normalized },
    include: {
      boxes: { include: { goods: true } },
      booking: true,
      agent: true,
    },
  });

  if (!shipment) return null;

  if (shipment.status === ShipmentStatus.DRAFT || shipment.status === ShipmentStatus.PENDING_ADMIN) {
    return null;
  }

  if (shipment.status === ShipmentStatus.REJECTED) {
    return {
      trackingNumber: shipment.trackingNumber,
      carrier: "Gardian Logistics",
      status: "exception",
      statusLabel: "Rejected",
      currentLocation: shipment.agent.city,
      origin: shipment.booking?.pickupCity ?? shipment.agent.city,
      destination: shipment.booking
        ? `${shipment.booking.destination}, ${shipment.booking.destinationCountry}`
        : undefined,
      history: [
        {
          status: "exception",
          label: "Rejected",
          location: shipment.agent.city,
          timestamp: shipment.updatedAt.toISOString(),
          description: shipment.adminNotes ?? "Shipment rejected by admin",
        },
      ],
    };
  }

  const trackingStatus = mapDbStatus(shipment.status);
  const destination = shipment.booking
    ? `${shipment.booking.destination}, ${shipment.booking.destinationCountry}`
    : "Destination";
  const origin = shipment.booking?.pickupCity ?? shipment.agent.city;

  return {
    trackingNumber: shipment.trackingNumber,
    carrier: "Gardian Logistics",
    status: trackingStatus,
    statusLabel: STATUS_LABELS[trackingStatus],
    currentLocation: shipment.agent.city,
    origin,
    destination,
    estimatedDelivery: new Date(Date.now() + 5 * 86400000).toISOString(),
    history: buildHistoryFromStatus(trackingStatus, shipment.agent.city, shipment.createdAt),
  };
}
