import { NextRequest, NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  office?: string;
}

function validateContact(data: ContactPayload): string | null {
  if (!data.name?.trim()) return "Name is required.";
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Valid email is required.";
  if (!data.subject?.trim()) return "Subject is required.";
  if (!data.message?.trim() || data.message.trim().length < 10) return "Message must be at least 10 characters.";
  return null;
}

export async function POST(request: NextRequest) {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }

  const error = validateContact(data);
  if (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }

  // TODO: send email or store in database
  console.log("[Contact Form]", { ...data, receivedAt: new Date().toISOString() });

  return NextResponse.json({
    success: true,
    message: "Thank you for contacting Gardian Logistics. We will respond within 1 business day.",
  });
}
