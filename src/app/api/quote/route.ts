import { NextRequest, NextResponse } from "next/server";

interface QuotePayload {
  origin: string;
  destination: string;
  weight: string;
  length?: string;
  width?: string;
  height?: string;
  serviceType: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
}

function validateQuote(data: QuotePayload): string | null {
  if (!data.origin?.trim()) return "Origin is required.";
  if (!data.destination?.trim()) return "Destination is required.";
  if (!data.weight?.trim() || isNaN(parseFloat(data.weight))) return "Valid weight is required.";
  if (!data.serviceType?.trim()) return "Service type is required.";
  if (!data.name?.trim()) return "Name is required.";
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Valid email is required.";
  if (!data.phone?.trim()) return "Phone number is required.";
  return null;
}

function estimatePriceRange(weight: number, serviceType: string): { min: number; max: number; currency: string } {
  const baseRates: Record<string, number> = {
    "international-courier": 45,
    "domestic-courier": 12,
    "freight-cargo": 80,
    "document-express": 25,
    "ecommerce-shipping": 35,
    "customs-clearance": 50,
  };
  const rate = baseRates[serviceType] ?? 40;
  const min = Math.round(rate * weight * 0.9);
  const max = Math.round(rate * weight * 1.3);
  return { min: Math.max(min, 15), max: Math.max(max, min + 10), currency: "USD" };
}

export async function POST(request: NextRequest) {
  let data: QuotePayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const error = validateQuote(data);
  if (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }

  const weight = parseFloat(data.weight);
  const estimate = estimatePriceRange(weight, data.serviceType);

  // TODO: persist to database and send notification email
  console.log("[Quote Request]", { ...data, estimate, receivedAt: new Date().toISOString() });

  return NextResponse.json({
    success: true,
    message: "Thank you! Our team will confirm the best rate for your shipment within 2 business hours.",
    estimate,
    referenceId: `QT-${Date.now().toString(36).toUpperCase()}`,
  });
}
