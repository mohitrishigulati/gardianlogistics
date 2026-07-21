export const Role = {
  USER: "USER",
  AGENT: "AGENT",
  SUB_ADMIN: "SUB_ADMIN",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const KycStatus = {
  NOT_SUBMITTED: "NOT_SUBMITTED",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type KycStatus = (typeof KycStatus)[keyof typeof KycStatus];

export const PickupType = {
  DOORSTEP: "DOORSTEP",
  DROP_AT_AGENT: "DROP_AT_AGENT",
} as const;

export type PickupType = (typeof PickupType)[keyof typeof PickupType];

export const BookingStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
  RECEIPT_CREATED: "RECEIPT_CREATED",
  ADMIN_PENDING: "ADMIN_PENDING",
  APPROVED: "APPROVED",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const ShipmentStatus = {
  DRAFT: "DRAFT",
  PENDING_ADMIN: "PENDING_ADMIN",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
} as const;

export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus];
