import { NextRequest } from "next/server";
import { BookingStatus, KycStatus, Role, ShipmentStatus } from "@/lib/constants/roles";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/auth-options";
import {
  chargeableWeightKg,
  generateTrackingNumber,
  volumetricWeightKg,
} from "@/lib/shipment-utils";
import { lookupSlabPrice, findZoneForCountry } from "@/lib/pricing/rate-slabs";
import { calcShipmentTotals } from "@/lib/shipment-pricing";
import { jsonOk, jsonError, handleApiError } from "@/lib/api-utils";

interface GoodsInput {
  description: string;
  quantity?: number;
  declaredValue?: number;
  hsCode?: string;
}

interface BoxInput {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  actualWeightKg: number;
  slabWeightKg?: number;
  customerCharge?: number;
  goods: GoodsInput[];
}

export async function GET() {
  try {
    const session = await requireRole([Role.AGENT]);
    const profile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile) return jsonError("Agent profile not found.", 404);

    const shipments = await prisma.shipment.findMany({
      where: { agentId: profile.id },
      include: {
        boxes: { include: { goods: true } },
        booking: {
          include: { customer: { select: { name: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return jsonOk({ shipments });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([Role.AGENT]);
    const body = await request.json();
    const { bookingId, boxes } = body as { bookingId: string; boxes: BoxInput[] };

    const profile = await prisma.agentProfile.findUnique({
      where: { userId: session.user.id },
    });
    if (!profile || profile.kycStatus !== KycStatus.APPROVED || !profile.isActive) {
      return jsonError("Agent KYC must be approved to create tracker receipts.", 403);
    }

    if (!bookingId || !boxes?.length) {
      return jsonError("Booking ID and at least one box are required.");
    }

    const booking = await prisma.shipmentBooking.findFirst({
      where: { id: bookingId, agentId: profile.id },
      include: { shipment: true },
    });
    if (!booking) return jsonError("Booking not found.", 404);
    if (booking.shipment) return jsonError("Tracker receipt already created for this booking.", 409);

    for (const box of boxes) {
      if (!box.lengthCm || !box.widthCm || !box.heightCm || !box.actualWeightKg) {
        return jsonError("Each box must have dimensions and weight.");
      }
      if (!box.goods?.length) {
        return jsonError("Each box must have at least one goods item listed.");
      }
      if (box.customerCharge === undefined || box.customerCharge < 0) {
        return jsonError("Each box must have a valid customer charge.");
      }
    }

    let trackingNumber = generateTrackingNumber();
    let attempts = 0;
    while (attempts < 5) {
      const exists = await prisma.shipment.findUnique({ where: { trackingNumber } });
      if (!exists) break;
      trackingNumber = generateTrackingNumber();
      attempts++;
    }

    const boxRecords = await Promise.all(
      boxes.map(async (box, index) => {
        const volWeight = volumetricWeightKg(box.lengthCm, box.widthCm, box.heightCm);
        const chargeable = chargeableWeightKg(box.actualWeightKg, box.lengthCm, box.widthCm, box.heightCm);

        let slabWeightKg = box.slabWeightKg ?? null;
        let referenceSlabPrice: number | null = null;

        if (slabWeightKg) {
          const lookup = await lookupSlabPrice(booking.destinationCountry, slabWeightKg);
          if (lookup) {
            slabWeightKg = lookup.weightKg;
            referenceSlabPrice = lookup.referencePrice;
          }
        }

        const boxPrice = Math.round(box.customerCharge! * 100) / 100;

        return {
          boxNumber: index + 1,
          lengthCm: box.lengthCm,
          widthCm: box.widthCm,
          heightCm: box.heightCm,
          actualWeightKg: box.actualWeightKg,
          volumetricWeightKg: volWeight,
          chargeableWeightKg: chargeable,
          slabWeightKg,
          referenceSlabPrice,
          pricePerKg: chargeable > 0 ? Math.round((boxPrice / chargeable) * 100) / 100 : 0,
          boxPrice,
          goods: {
            create: box.goods.map((g) => ({
              description: g.description,
              quantity: g.quantity ?? 1,
              declaredValue: g.declaredValue,
              hsCode: g.hsCode,
            })),
          },
        };
      })
    );

    const zone = await findZoneForCountry(booking.destinationCountry);
    const currency = zone?.currency ?? "INR";
    const totals = calcShipmentTotals(
      boxRecords.map((box) => ({
        boxPrice: box.boxPrice,
        referenceSlabPrice: box.referenceSlabPrice,
      }))
    );

    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber,
        bookingId: booking.id,
        agentId: profile.id,
        status: ShipmentStatus.PENDING_ADMIN,
        totalPrice: totals.totalCustomerCharge,
        totalCompanyCharge: totals.totalCompanyCharge,
        agentProfit: totals.agentProfit,
        currency,
        boxes: { create: boxRecords },
      },
      include: {
        boxes: { include: { goods: true } },
        booking: { include: { customer: { select: { name: true, email: true } } } },
      },
    });

    await prisma.shipmentBooking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.ADMIN_PENDING },
    });

    return jsonOk({ success: true, shipment }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
