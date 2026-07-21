import {
  detectCarrier,
  isValidTrackingNumber,
  normalizeTrackingNumber,
} from "./carrier-detection";
import { trackFromDatabase } from "./db-tracker";
import { fetchMockTracking } from "./mock-data";
import { normalizeCarrierResponse } from "./normalize";
import type { TrackingResponse } from "./types";

const USE_MOCK = process.env.USE_MOCK_TRACKING === "true";

async function fetchFromCarrierApi(
  trackingNumber: string,
  carrier?: string
): Promise<TrackingResponse> {
  const baseUrl = process.env.COURIER_API_BASE_URL;
  const apiKey = process.env.COURIER_API_KEY;

  if (!baseUrl || !apiKey) {
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Courier API is not configured. Enable mock mode or add API credentials.",
      },
    };
  }

  const detectedCarrier = carrier ?? detectCarrier(trackingNumber);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(
      `${baseUrl}/track/${encodeURIComponent(trackingNumber)}?carrier=${detectedCarrier}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        signal: controller.signal,
        cache: "no-store",
      }
    );

    if (response.status === 404) {
      return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "No shipment found for this tracking number.",
        },
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Unable to retrieve tracking information at this time.",
        },
      };
    }

    const raw = await response.json();
    return {
      success: true,
      data: normalizeCarrierResponse(raw, trackingNumber),
    };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return {
        success: false,
        error: {
          code: "TIMEOUT",
          message: "Tracking request timed out. Please try again.",
        },
      };
    }
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "An unexpected error occurred while tracking your shipment.",
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function trackShipment(
  trackingNumber: string,
  carrier?: string
): Promise<TrackingResponse> {
  const normalized = normalizeTrackingNumber(trackingNumber);

  if (!isValidTrackingNumber(normalized)) {
    return {
      success: false,
      error: {
        code: "INVALID_NUMBER",
        message: "Please enter a valid tracking number (10 alphanumeric + date, or 8–30 characters).",
      },
    };
  }

  // Check Gardian database shipments first
  try {
    const dbResult = await trackFromDatabase(normalized);
    if (dbResult) {
      return { success: true, data: dbResult };
    }
  } catch (err) {
    console.error("DB tracking error:", err);
  }

  if (USE_MOCK) {
    try {
      const result = await fetchMockTracking(normalized);
      if (!result) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "No shipment found for this tracking number.",
          },
        };
      }
      return { success: true, data: result };
    } catch {
      return {
        success: false,
        error: {
          code: "TIMEOUT",
          message: "Tracking request timed out. Please try again.",
        },
      };
    }
  }

  return fetchFromCarrierApi(normalized, carrier);
}

export async function trackMultipleShipments(
  trackingNumbers: string[]
): Promise<TrackingResponse[]> {
  const unique = Array.from(new Set(trackingNumbers.map(normalizeTrackingNumber)));
  return Promise.all(unique.map((num) => trackShipment(num)));
}
