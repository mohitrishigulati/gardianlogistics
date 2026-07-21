export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { Role } from "@/lib/constants/roles";
import { requireRole } from "@/lib/auth/auth-options";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-utils";
import { ensureDefaultRateZones } from "@/lib/rates/rate-zone-utils";
import { findZoneForCountry, lookupSlabPrice } from "@/lib/pricing/rate-slabs";

export async function GET(request: NextRequest) {
  try {
    await requireRole([Role.AGENT, Role.ADMIN, Role.SUB_ADMIN]);
    await ensureDefaultRateZones();

    const country = request.nextUrl.searchParams.get("country")?.trim();
    const weightParam = request.nextUrl.searchParams.get("weightKg");

    if (!country) return jsonError("country is required.");

    const zone = await findZoneForCountry(country);
    if (!zone) {
      return jsonOk({ zone: null, lookup: null });
    }

    if (!weightParam) {
      return jsonOk({
        zone: {
          id: zone.id,
          name: zone.name,
          serviceName: zone.serviceName,
          currency: zone.currency,
          slabs: zone.slabs,
        },
        lookup: null,
      });
    }

    const weightKg = parseFloat(weightParam);
    if (!weightKg || weightKg <= 0) return jsonError("weightKg must be greater than 0.");

    const lookup = await lookupSlabPrice(country, weightKg);
    return jsonOk({ zone, lookup });
  } catch (err) {
    return handleApiError(err);
  }
}
