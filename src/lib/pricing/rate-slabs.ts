import { prisma } from "@/lib/db";
import { currencySymbol, parseZoneCountries } from "@/lib/rates/rate-zone-utils";

export interface SlabLookupResult {
  zoneId: string;
  zoneName: string;
  serviceName: string;
  country: string;
  weightKg: number;
  referencePrice: number;
  currency: string;
  currencySymbol: string;
}

function resolveSlabWeight(requestedKg: number, availableWeights: number[]): number | null {
  if (!availableWeights.length) return null;

  const target = Math.max(1, Math.ceil(requestedKg));
  const sorted = [...availableWeights].sort((a, b) => a - b);

  if (target > sorted[sorted.length - 1]) return sorted[sorted.length - 1];

  const exact = sorted.find((kg) => kg === target);
  if (exact !== undefined) return exact;

  return sorted.find((kg) => kg >= target) ?? sorted[sorted.length - 1];
}

export async function findZoneForCountry(country: string) {
  const normalized = country.trim().toLowerCase();
  const zones = await prisma.rateZone.findMany({
    where: { isActive: true },
    include: { slabs: { orderBy: { weightKg: "asc" } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return zones.find((zone) => parseZoneCountries(zone.countries).includes(normalized)) ?? null;
}

export async function lookupSlabPrice(
  country: string,
  weightKg: number
): Promise<SlabLookupResult | null> {
  const zone = await findZoneForCountry(country);
  if (!zone || !zone.slabs.length) return null;

  const availableWeights = zone.slabs.map((slab) => slab.weightKg);
  const resolvedWeight = resolveSlabWeight(weightKg, availableWeights);
  if (resolvedWeight === null) return null;

  const slab = zone.slabs.find((item) => item.weightKg === resolvedWeight);
  if (!slab) return null;

  return {
    zoneId: zone.id,
    zoneName: zone.name,
    serviceName: zone.serviceName,
    country,
    weightKg: slab.weightKg,
    referencePrice: slab.price,
    currency: zone.currency,
    currencySymbol: currencySymbol(zone.currency),
  };
}

export async function listActiveZonesWithSlabs() {
  return prisma.rateZone.findMany({
    include: { slabs: { orderBy: { weightKg: "asc" } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export function suggestedSlabWeight(chargeableKg: number, availableWeights: number[]): number | null {
  if (!availableWeights.length || !chargeableKg) return null;
  return resolveSlabWeight(chargeableKg, availableWeights);
}
