import {
  DPD_DUTY_PAID_SERVICE,
  FRANCE_DPD_SLABS,
  isFranceDpdCountry,
} from "@/data/rates/dpd-europe-duty-paid";
import { chargeableWeightKg } from "@/lib/shipment-utils";

export type PricingMode = "per_kg" | "dpd_slab";

export interface SlabQuote {
  pricingMode: "dpd_slab";
  service: string;
  country: string;
  chargeableKg: number;
  slabKg: number;
  price: number;
  currency: string;
  currencySymbol: string;
}

export interface PerKgQuote {
  pricingMode: "per_kg";
  chargeableKg: number;
  pricePerKg: number;
  price: number;
  currency: string;
  currencySymbol: string;
}

export type BoxQuote = SlabQuote | PerKgQuote;

const SLAB_KEYS = Object.keys(FRANCE_DPD_SLABS)
  .map(Number)
  .sort((a, b) => a - b);

function resolveSlabKg(chargeableKg: number): number {
  const target = Math.max(1, Math.ceil(chargeableKg));
  if (target > 30) return 30;

  if (FRANCE_DPD_SLABS[target] !== undefined) return target;

  const next = SLAB_KEYS.find((kg) => kg >= target);
  return next ?? 30;
}

export function getFranceDpdSlabQuote(chargeableKg: number, country: string): SlabQuote | null {
  if (!isFranceDpdCountry(country)) return null;

  const slabKg = resolveSlabKg(chargeableKg);
  const price = FRANCE_DPD_SLABS[slabKg];
  if (price === undefined) return null;

  return {
    pricingMode: "dpd_slab",
    service: DPD_DUTY_PAID_SERVICE.label,
    country,
    chargeableKg: Math.round(chargeableKg * 100) / 100,
    slabKg,
    price,
    currency: DPD_DUTY_PAID_SERVICE.currency,
    currencySymbol: DPD_DUTY_PAID_SERVICE.currencySymbol,
  };
}

export function quoteBoxPrice(options: {
  pricingMode: PricingMode;
  destinationCountry: string;
  actualKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  pricePerKg: number;
}): BoxQuote | null {
  const chargeable = chargeableWeightKg(
    options.actualKg,
    options.lengthCm,
    options.widthCm,
    options.heightCm
  );

  if (!options.actualKg || !options.lengthCm || !options.widthCm || !options.heightCm) {
    return null;
  }

  if (options.pricingMode === "dpd_slab") {
    return getFranceDpdSlabQuote(chargeable, options.destinationCountry);
  }

  const price = Math.round(chargeable * options.pricePerKg * 100) / 100;
  return {
    pricingMode: "per_kg",
    chargeableKg: Math.round(chargeable * 100) / 100,
    pricePerKg: options.pricePerKg,
    price,
    currency: "USD",
    currencySymbol: "$",
  };
}

export function formatSlabLabel(slabKg: number): string {
  return `${slabKg} kg slab`;
}
