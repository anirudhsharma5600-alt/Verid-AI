import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { describeImage, UpstreamBusyError } from "@/lib/server/llm";
import { checkRateLimit } from "@/lib/server/ratelimit";
import { errorResponse, getClientIp } from "@/lib/server/errors";
import type { DescribeResponse } from "@/types/api";

// ~3 MB base64 ≈ 4_000_000 chars (base64 is ~4/3 of raw bytes)
const MAX_IMAGE_CHARS = 4_000_000;

const bodySchema = z.object({
  image: z
    .string()
    .min(100, "image too small")
    .max(MAX_IMAGE_CHARS, "image exceeds ~3 MB"),
  mode: z.enum(["describe", "read"]),
  lang: z.enum(["en", "hi"]),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return errorResponse("busy", 429);
    }

    // Parse & validate body
    const raw = await request.json().catch(() => null);
    if (!raw) return errorResponse("bad_request", 400);

    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return errorResponse("bad_request", 400);
    }

    const { image, mode, lang } = parsed.data;

    // Call LLM
    const text = await describeImage(image, mode, lang);

    return NextResponse.json<DescribeResponse>({ text });
  } catch (err) {
    if (err instanceof UpstreamBusyError) {
      return errorResponse("busy", 429);
    }
    console.error("[/api/describe]", err);
    return errorResponse("upstream", 502);
  }
}
