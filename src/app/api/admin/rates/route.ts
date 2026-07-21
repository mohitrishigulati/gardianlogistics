import { NextRequest } from "next/server";
import { Role } from "@/lib/constants/roles";
import { requireRole } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-utils";
import { ensureDefaultRateZones } from "@/lib/rates/rate-zone-utils";
import { parseZoneCountries } from "@/lib/rates/rate-zone-utils";

export async function GET() {
  try {
    await requireRole([Role.ADMIN, Role.SUB_ADMIN]);
    await ensureDefaultRateZones();

    const zones = await prisma.rateZone.findMany({
      include: { slabs: { orderBy: { weightKg: "asc" } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return jsonOk({
      zones: zones.map((zone) => ({
        ...zone,
        countryList: parseZoneCountries(zone.countries),
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole([Role.ADMIN]);
    const body = await request.json();
    const { name, countries, serviceName, currency, isActive, sortOrder, slabs } = body as {
      name: string;
      countries: string[] | string;
      serviceName?: string;
      currency?: string;
      isActive?: boolean;
      sortOrder?: number;
      slabs?: Array<{ weightKg: number; price: number }>;
    };

    if (!name?.trim()) return jsonError("Zone name is required.");
    if (!countries || (Array.isArray(countries) && countries.length === 0)) {
      return jsonError("At least one country is required.");
    }

    const countryValues = Array.isArray(countries)
      ? countries
      : String(countries)
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);

    const zone = await prisma.rateZone.create({
      data: {
        name: name.trim(),
        countries: JSON.stringify(countryValues.map((c) => c.toLowerCase())),
        serviceName: serviceName?.trim() || "DPD Europe — Duty Paid",
        currency: currency?.trim() || "INR",
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
        slabs: slabs?.length
          ? {
              create: slabs.map((slab) => ({
                weightKg: Number(slab.weightKg),
                price: Number(slab.price),
              })),
            }
          : undefined,
      },
      include: { slabs: { orderBy: { weightKg: "asc" } } },
    });

    return jsonOk({ zone }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
