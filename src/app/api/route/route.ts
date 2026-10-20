import { NextRequest, NextResponse } from "next/server";
import { errorResponse, getClientIp, upstreamSignal } from "@/lib/server/errors";
import { checkRateLimit } from "@/lib/server/ratelimit";
import type { RouteResponse, RouteStep } from "@/types/api";

const OSRM_BASE = "https://routing.openstreetmap.de/routed-foot/route/v1/foot";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) return errorResponse("busy", 429);

    const { searchParams } = new URL(request.url);
    const fromLat = parseFloat(searchParams.get("fromLat") ?? "");
    const fromLon = parseFloat(searchParams.get("fromLon") ?? "");
    const toLat = parseFloat(searchParams.get("toLat") ?? "");
    const toLon = parseFloat(searchParams.get("toLon") ?? "");

    if ([fromLat, fromLon, toLat, toLon].some(isNaN)) {
      return errorResponse("bad_request", 400);
    }

    // OSRM expects lon,lat (not lat,lon)
    const coords = `${fromLon},${fromLat};${toLon},${toLat}`;
    const url = `${OSRM_BASE}/${coords}?overview=false&steps=true`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "VisionAssistant/1.0 (hackathon assistive-app)",
      },
      signal: upstreamSignal(),
    });

    if (!res.ok) {
      console.error("[/api/route] OSRM error", res.status);
      return errorResponse("upstream", 502);
    }

    const data = await res.json();

    if (data.code !== "Ok" || !data.routes?.length) {
      return errorResponse("upstream", 502);
    }

    const route = data.routes[0];
    const totalDistance: number = route.distance ?? 0;

    // Flatten all steps from all legs
    const steps: RouteStep[] = [];
    for (const leg of route.legs ?? []) {
      for (const step of leg.steps ?? []) {
        const maneuver = step.maneuver ?? {};
        const loc = maneuver.location ?? [0, 0]; // [lon, lat]
        steps.push({
          type: maneuver.type ?? "unknown",
          modifier: maneuver.modifier ?? undefined,
          name: step.name || "unnamed road",
          distance: step.distance ?? 0,
          lat: loc[1],
          lon: loc[0],
        });
      }
    }

    const result: RouteResponse = {
      distance: totalDistance,
      steps,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/route]", err);
    return errorResponse("upstream", 502);
  }
}
