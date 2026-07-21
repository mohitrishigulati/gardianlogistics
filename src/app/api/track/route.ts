import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { trackMultipleShipments, trackShipment } from "@/lib/tracking";
import { parseBulkTrackingNumbers } from "@/lib/tracking/carrier-detection";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = parseInt(process.env.TRACK_RATE_LIMIT ?? "20", 10);
  const windowMs = parseInt(process.env.TRACK_RATE_WINDOW_MS ?? "60000", 10);
  const rl = rateLimit(`track:${ip}`, limit, windowMs);

  if (!rl.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RATE_LIMIT",
          message: "Too many tracking requests. Please wait a moment and try again.",
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const trackingNumber = searchParams.get("trackingNumber");
  const carrier = searchParams.get("carrier") ?? undefined;
  const bulk = searchParams.get("bulk");

  if (bulk) {
    const numbers = parseBulkTrackingNumbers(bulk);
    if (numbers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_NUMBER",
            message: "Please provide at least one valid tracking number.",
          },
        },
        { status: 400 }
      );
    }
    if (numbers.length > 10) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_NUMBER",
            message: "Maximum 10 tracking numbers per request.",
          },
        },
        { status: 400 }
      );
    }
    const results = await trackMultipleShipments(numbers);
    return NextResponse.json({ success: true, results });
  }

  if (!trackingNumber) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_NUMBER",
          message: "Tracking number is required.",
        },
      },
      { status: 400 }
    );
  }

  const result = await trackShipment(trackingNumber, carrier ?? undefined);
  const status = result.success ? 200 : result.error.code === "NOT_FOUND" ? 404 : result.error.code === "INVALID_NUMBER" ? 400 : result.error.code === "TIMEOUT" ? 504 : 500;

  return NextResponse.json(result, { status });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = parseInt(process.env.TRACK_RATE_LIMIT ?? "20", 10);
  const windowMs = parseInt(process.env.TRACK_RATE_WINDOW_MS ?? "60000", 10);
  const rl = rateLimit(`track:${ip}`, limit, windowMs);

  if (!rl.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RATE_LIMIT",
          message: "Too many tracking requests. Please wait a moment and try again.",
        },
      },
      { status: 429 }
    );
  }

  let body: { trackingNumbers?: string[]; trackingNumber?: string; carrier?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_NUMBER", message: "Invalid request body." } },
      { status: 400 }
    );
  }

  if (body.trackingNumbers?.length) {
    const numbers = body.trackingNumbers.slice(0, 10);
    const results = await trackMultipleShipments(numbers);
    return NextResponse.json({ success: true, results });
  }

  if (body.trackingNumber) {
    const result = await trackShipment(body.trackingNumber, body.carrier);
    const status = result.success ? 200 : 400;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(
    { success: false, error: { code: "INVALID_NUMBER", message: "Tracking number is required." } },
    { status: 400 }
  );
}
