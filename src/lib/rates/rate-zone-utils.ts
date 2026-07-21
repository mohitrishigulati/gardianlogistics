import { FRANCE_DPD_COUNTRIES, FRANCE_DPD_SLABS } from "@/data/rates/dpd-europe-duty-paid";
import { prisma } from "@/lib/db";

export async function ensureDefaultRateZones() {
  const count = await prisma.rateZone.count();
  if (count > 0) return;

  await prisma.rateZone.create({
    data: {
      name: "France, Czech Republic, Denmark",
      countries: JSON.stringify(FRANCE_DPD_COUNTRIES),
      serviceName: "DPD Europe — Duty Paid",
      currency: "INR",
      isActive: true,
      sortOrder: 1,
      slabs: {
        create: Object.entries(FRANCE_DPD_SLABS).map(([weightKg, price]) => ({
          weightKg: Number(weightKg),
          price,
        })),
      },
    },
  });
}

export function parseZoneCountries(countries: string): string[] {
  try {
    const parsed = JSON.parse(countries);
    return Array.isArray(parsed) ? parsed.map((c) => String(c).trim().toLowerCase()) : [];
  } catch {
    return countries
      .split(",")
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);
  }
}

export function currencySymbol(currency: string): string {
  if (currency === "INR") return "₹";
  if (currency === "USD") return "$";
  if (currency === "EUR") return "€";
  if (currency === "GBP") return "£";
  return currency;
}
