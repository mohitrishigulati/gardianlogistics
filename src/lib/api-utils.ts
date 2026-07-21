import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export function handleApiError(err: unknown) {
  if (err instanceof Error) {
    if (err.message === "UNAUTHORIZED") return jsonError("Unauthorized.", 401);
    if (err.message === "FORBIDDEN") return jsonError("Forbidden.", 403);
  }
  console.error(err);
  return jsonError("Internal server error.", 500);
}
