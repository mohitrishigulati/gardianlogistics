/** UK & Europe DPD — Duty Paid Service rate slabs (INR). */

export const DPD_DUTY_PAID_SERVICE = {
  id: "dpd-europe-duty-paid",
  label: "DPD Europe — Duty Paid",
  currency: "INR",
  currencySymbol: "₹",
} as const;

/** France, Czech Republic, Denmark — column 4 from rate chart. */
export const FRANCE_DPD_SLABS: Record<number, number> = {
  1: 2071,
  2: 1605,
  3: 1139,
  4: 922,
  5: 852,
  6: 736,
  7: 702,
  8: 677,
  9: 658,
  10: 642,
  11: 620,
  12: 609,
  13: 600,
  14: 592,
  15: 586,
  16: 580,
  17: 575,
  19: 566,
  20: 562,
  21: 559,
  22: 556,
  23: 553,
  24: 551,
  25: 548,
  26: 546,
  27: 544,
  28: 542,
  29: 541,
  30: 539,
};

export const FRANCE_DPD_COUNTRIES = ["france", "fr", "czech republic", "czechia", "cz", "denmark", "dk"];

export function isFranceDpdCountry(country: string): boolean {
  return FRANCE_DPD_COUNTRIES.includes(country.trim().toLowerCase());
}

/** Example carton: clothes + cookware for France demo. */
export const FRANCE_EXAMPLE_CARTON = {
  lengthCm: "50",
  widthCm: "40",
  heightCm: "35",
  actualWeightKg: "10",
  goods: [
    {
      description: "Clothes — mixed apparel (shirts, jeans, dresses)",
      quantity: 15,
      declaredValue: "25000",
      hsCode: "6204",
    },
    {
      description: "Cookware — stainless steel pots & pans set",
      quantity: 1,
      declaredValue: "8500",
      hsCode: "7323",
    },
  ],
} as const;
