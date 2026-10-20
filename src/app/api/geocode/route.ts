import { NextRequest, NextResponse } from "next/server";
import { lookupDemoPlace } from "@/lib/server/places";
import { errorResponse, getClientIp, upstreamSignal } from "@/lib/server/errors";
import { checkRateLimit } from "@/lib/server/ratelimit";
import type { GeocodeResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) return errorResponse("busy", 429);

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const lat = parseFloat(searchParams.get("lat") ?? "");
    const lon = parseFloat(searchParams.get("lon") ?? "");

    if (!q) return errorResponse("bad_request", 400);

    // 1. Check hardcoded demo places first
    const demo = lookupDemoPlace(q);
    if (demo) {
      return NextResponse.json<GeocodeResponse>(demo);
    }

    // 2. Forward to Nominatim
    const params = new URLSearchParams({
      q,
      format: "json",
      limit: "1",
      addressdetails: "0",
    });

    // Bias results around user's location if provided
    if (!isNaN(lat) && !isNaN(lon)) {
      const delta = 0.15;
      params.set("viewbox", [
        (lon - delta).toFixed(4),
        (lat + delta).toFixed(4),
        (lon + delta).toFixed(4),
        (lat - delta).toFixed(4),
      ].join(","));
      params.set("bounded", "0"); // prefer but don't restrict
    }

    const url = `https://nominatim.openstreetmap.org/search?${params}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "VisionAssistant/1.0 (hackathon assistive-app)",
        Accept: "application/json",
      },
      signal: upstreamSignal(),
    });

    if (!res.ok) {
      console.error("[/api/geocode] Nominatim error", res.status);
      return errorResponse("upstream", 502);
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return errorResponse("not_found", 404);
    }

    const top = data[0];
    const result: GeocodeResponse = {
      lat: parseFloat(top.lat),
      lon: parseFloat(top.lon),
      name: top.display_name?.split(",")[0] ?? q,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/geocode]", err);
    return errorResponse("upstream", 502);
  }
}
