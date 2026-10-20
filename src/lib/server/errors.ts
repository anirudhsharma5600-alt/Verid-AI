import type { ApiError, ApiErrorCode } from "@/types/api";
import { NextResponse } from "next/server";

/** Build a typed JSON error response. */
export function errorResponse(
  code: ApiErrorCode,
  status: number
): NextResponse<ApiError> {
  return NextResponse.json({ error: code }, { status });
}

/** Extract client IP from request headers (Vercel / reverse-proxy aware). */
export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  // Fallback — not reliable in production but fine for local dev
  return "127.0.0.1";
}

/** Shared 8-second AbortSignal for upstream calls. */
export function upstreamSignal(): AbortSignal {
  return AbortSignal.timeout(8_000);
}
