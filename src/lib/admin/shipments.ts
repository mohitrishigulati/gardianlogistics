export interface AdminShipment {
  id: string;
  trackingNumber: string;
  carrier: string;
  status: string;
  origin: string;
  destination: string;
  customerName: string;
  customerEmail: string;
  bookedAt: string;
  estimatedDelivery?: string;
  notes?: string;
  updatedAt: string;
}

/**
 * Admin-ready in-memory store for manual shipment management.
 * Replace with database persistence when admin panel auth is added.
 */
const shipments: AdminShipment[] = [];

export function listShipments(): AdminShipment[] {
  return [...shipments];
}

export function getShipmentByTracking(trackingNumber: string): AdminShipment | undefined {
  return shipments.find(
    (s) => s.trackingNumber.toUpperCase() === trackingNumber.toUpperCase()
  );
}

export function upsertShipment(shipment: AdminShipment): AdminShipment {
  const index = shipments.findIndex((s) => s.id === shipment.id);
  if (index >= 0) {
    shipments[index] = { ...shipment, updatedAt: new Date().toISOString() };
    return shipments[index];
  }
  shipments.push({ ...shipment, updatedAt: new Date().toISOString() });
  return shipment;
}

export function deleteShipment(id: string): boolean {
  const index = shipments.findIndex((s) => s.id === id);
  if (index < 0) return false;
  shipments.splice(index, 1);
  return true;
}
