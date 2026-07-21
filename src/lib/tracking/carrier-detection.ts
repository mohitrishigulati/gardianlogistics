export type DetectedCarrier =
  | "dhl"
  | "fedex"
  | "aramex"
  | "ups"
  | "generic"
  | "unknown";

export function detectCarrier(trackingNumber: string): DetectedCarrier {
  const normalized = trackingNumber.replace(/\s/g, "").toUpperCase();

  if (!normalized || normalized.length < 8) {
    return "unknown";
  }

  // DHL: 10 digits, or starts with JD/JJ + digits
  if (/^\d{10}$/.test(normalized) || /^J[DJ]\d{18,}$/.test(normalized)) {
    return "dhl";
  }

  // FedEx: 12, 15, 20, or 22 digits; or 34 chars
  if (/^\d{12}$|^\d{15}$|^\d{20}$|^\d{22}$/.test(normalized)) {
    return "fedex";
  }

  // UPS: starts with 1Z
  if (/^1Z[A-Z0-9]{16}$/.test(normalized)) {
    return "ups";
  }

  // Aramex: typically 11 digits or specific format
  if (/^\d{11}$/.test(normalized) || /^GL\d+$/.test(normalized)) {
    return "aramex";
  }

  // Gardian AWB: 10 alphanumeric + DDMMYYYY
  if (/^[A-Z0-9]{10}\d{8}$/.test(normalized)) {
    return "generic";
  }

  if (/^[A-Z0-9]{8,30}$/.test(normalized)) {
    return "generic";
  }

  return "unknown";
}

export function normalizeTrackingNumber(input: string): string {
  return input.replace(/\s/g, "").toUpperCase();
}

export function isValidTrackingNumber(input: string): boolean {
  const normalized = normalizeTrackingNumber(input);
  // Gardian format: 10 alphanumeric + DDMMYYYY (8 digits)
  if (/^[A-Z0-9]{10}\d{8}$/.test(normalized)) return true;
  return /^[A-Z0-9]{8,30}$/.test(normalized);
}

export function parseBulkTrackingNumbers(input: string): string[] {
  return input
    .split(/[\n,;]+/)
    .map((s) => normalizeTrackingNumber(s.trim()))
    .filter((s) => s.length > 0);
}

export const CARRIER_DISPLAY_NAMES: Record<DetectedCarrier, string> = {
  dhl: "DHL Network",
  fedex: "FedEx Network",
  aramex: "Aramex Network",
  ups: "UPS Network",
  generic: "Partner Carrier",
  unknown: "Unknown Carrier",
};
