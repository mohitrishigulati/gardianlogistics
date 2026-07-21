export type ShipmentStatus =
  | "booked"
  | "picked_up"
  | "in_transit"
  | "customs_clearance"
  | "out_for_delivery"
  | "delivered"
  | "exception"
  | "unknown";

export interface TrackingEvent {
  status: ShipmentStatus;
  label: string;
  location?: string;
  timestamp: string;
  description?: string;
}

export interface TrackingResult {
  trackingNumber: string;
  carrier: string;
  status: ShipmentStatus;
  statusLabel: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  origin?: string;
  destination?: string;
  history: TrackingEvent[];
}

export interface TrackingError {
  code: "INVALID_NUMBER" | "NOT_FOUND" | "TIMEOUT" | "RATE_LIMIT" | "SERVER_ERROR";
  message: string;
}

export type TrackingResponse =
  | { success: true; data: TrackingResult }
  | { success: false; error: TrackingError };

export const STATUS_ORDER: ShipmentStatus[] = [
  "booked",
  "picked_up",
  "in_transit",
  "customs_clearance",
  "out_for_delivery",
  "delivered",
];

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  booked: "Booked",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  customs_clearance: "Customs Clearance",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  exception: "Exception",
  unknown: "Unknown",
};
