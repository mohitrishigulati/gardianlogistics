import { NextRequest } from "next/server";
import { Role } from "@/lib/constants/roles";
import { requireRole } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-utils";

interface RouteParams {
  params: { zoneId: string };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole([Role.ADMIN]);
    const body = await request.json();
    const { name, countries, serviceName, currency, isActive, sortOrder, slabs } = body as {
      name?: string;
      countries?: string[] | string;
      serviceName?: string;
      currency?: string;
      isActive?: boolean;
      sortOrder?: number;
      slabs?: Array<{ weightKg: number; price: number }>;
    };

    const existing = await prisma.rateZone.findUnique({ where: { id: params.zoneId } });
    if (!existing) return jsonError("Rate zone not found.", 404);

    let countriesJson = existing.countries;
    if (countries !== undefined) {
      const countryValues = Array.isArray(countries)
        ? countries
        : String(countries)
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);
      if (!countryValues.length) return jsonError("At least one country is required.");
      countriesJson = JSON.stringify(countryValues.map((c) => c.toLowerCase()));
    }

    if (slabs !== undefined) {
      await prisma.rateSlab.deleteMany({ where: { zoneId: params.zoneId } });
      if (slabs.length) {
        await prisma.rateSlab.createMany({
          data: slabs.map((slab) => ({
            zoneId: params.zoneId,
            weightKg: Number(slab.weightKg),
            price: Number(slab.price),
          })),
        });
      }
    }

    const zone = await prisma.rateZone.update({
      where: { id: params.zoneId },
      data: {
        name: name?.trim() || undefined,
        countries: countriesJson,
        serviceName: serviceName?.trim() || undefined,
        currency: currency?.trim() || undefined,
        isActive,
        sortOrder,
      },
      include: { slabs: { orderBy: { weightKg: "asc" } } },
    });

    return jsonOk({ zone });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await requireRole([Role.ADMIN]);
    await prisma.rateZone.delete({ where: { id: params.zoneId } });
    return jsonOk({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
