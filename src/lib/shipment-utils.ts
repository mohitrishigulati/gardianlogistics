const ALPHANUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function formatDateSuffix(date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = String(date.getFullYear());
  return `${dd}${mm}${yyyy}`;
}

export function generateTrackingPrefix(): string {
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
  }
  return result;
}

export function generateTrackingNumber(date = new Date()): string {
  return `${generateTrackingPrefix()}${formatDateSuffix(date)}`;
}

export function parseTrackingNumber(input: string): {
  prefix: string;
  dateSuffix: string;
  isValidFormat: boolean;
} {
  const normalized = input.replace(/\s/g, "").toUpperCase();
  if (normalized.length < 18) {
    return { prefix: normalized, dateSuffix: "", isValidFormat: false };
  }
  const dateSuffix = normalized.slice(-8);
  const prefix = normalized.slice(0, -8);
  const isValidFormat =
    prefix.length === 10 && /^[A-Z0-9]{10}$/.test(prefix) && /^\d{8}$/.test(dateSuffix);
  return { prefix, dateSuffix, isValidFormat };
}

export function volumetricWeightKg(lengthCm: number, widthCm: number, heightCm: number): number {
  return Math.round(((lengthCm * widthCm * heightCm) / 5000) * 100) / 100;
}

export function chargeableWeightKg(
  actualKg: number,
  lengthCm: number,
  widthCm: number,
  heightCm: number
): number {
  const volumetric = volumetricWeightKg(lengthCm, widthCm, heightCm);
  return Math.max(actualKg, volumetric);
}

export function calculateBoxPrice(chargeableKg: number, pricePerKg: number): number {
  return Math.round(chargeableKg * pricePerKg * 100) / 100;
}

export const DEFAULT_PRICE_PER_KG = 8.5;
