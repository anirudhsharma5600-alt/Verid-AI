// ─── Mock + Real API Client ───
// When NEXT_PUBLIC_USE_MOCK=true, returns mock data instead of hitting the backend.

import type {
  DescribeRequest,
  DescribeResponse,
  GeocodeResponse,
  RouteResponse,
  ApiError,
  Lang,
  DescribeMode,
} from "@/types/api";

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === undefined ||
  process.env.NEXT_PUBLIC_USE_MOCK === "true";

// ─── Mock responses ───
const MOCK_DESCRIBE: Record<DescribeMode, Record<Lang, string>> = {
  describe: {
    en: "I can see a road ahead with buildings on both sides. There appears to be a pedestrian crossing about 10 meters ahead. The sidewalk continues straight. I notice some vehicles parked on the left side.",
    hi: "मुझे सामने एक सड़क दिखाई दे रही है जिसके दोनों तरफ इमारतें हैं। लगभग 10 मीटर आगे एक पैदल यात्री क्रॉसिंग दिखाई दे रही है। फुटपाथ सीधे जारी है। बाईं ओर कुछ वाहन खड़े हैं।",
  },
  read: {
    en: "The sign reads: 'Main Street — Speed Limit 30 km/h'. Below it there is a smaller sign that says 'School Zone Ahead'.",
    hi: "संकेत पर लिखा है: 'मुख्य सड़क — गति सीमा 30 किमी/घंटा'। इसके नीचे एक छोटा संकेत है जिस पर लिखा है 'आगे स्कूल ज़ोन'।",
  },
};

const MOCK_GEOCODE: GeocodeResponse = {
  lat: 28.6139,
  lon: 77.209,
  name: "India Gate, New Delhi",
};

const MOCK_ROUTE: RouteResponse = {
  distance: 450,
  steps: [
    {
      type: "depart",
      name: "Current Location",
      distance: 0,
      lat: 28.6129,
      lon: 77.2085,
    },
    {
      type: "turn",
      modifier: "right",
      name: "Rajpath Road",
      distance: 150,
      lat: 28.6135,
      lon: 77.2088,
    },
    {
      type: "turn",
      modifier: "left",
      name: "Janpath Lane",
      distance: 200,
      lat: 28.6138,
      lon: 77.209,
    },
    {
      type: "arrive",
      name: "India Gate",
      distance: 100,
      lat: 28.6139,
      lon: 77.209,
    },
  ],
};

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Real fetch helpers ───

export async function describeImage(
  image: string,
  mode: DescribeMode,
  lang: Lang
): Promise<DescribeResponse> {
  if (USE_MOCK) {
    await delay(1500);
    return { text: MOCK_DESCRIBE[mode][lang] };
  }

  const body: DescribeRequest = { image, mode, lang };
  const res = await fetch("/api/describe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.error);
  }
  return res.json();
}

export async function geocode(
  q: string,
  lat: number,
  lon: number
): Promise<GeocodeResponse> {
  if (USE_MOCK) {
    await delay(800);
    return { ...MOCK_GEOCODE, name: q };
  }

  const params = new URLSearchParams({
    q,
    lat: String(lat),
    lon: String(lon),
  });
  const res = await fetch(`/api/geocode?${params}`);
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.error);
  }
  return res.json();
}

export async function getRoute(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): Promise<RouteResponse> {
  if (USE_MOCK) {
    await delay(1000);
    return MOCK_ROUTE;
  }

  const params = new URLSearchParams({
    fromLat: String(fromLat),
    fromLon: String(fromLon),
    toLat: String(toLat),
    toLon: String(toLon),
  });
  const res = await fetch(`/api/route?${params}`);
  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.error);
  }
  return res.json();
}
