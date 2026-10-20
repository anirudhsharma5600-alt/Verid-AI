// ─── Hardcoded demo places ───
// Checked before hitting Nominatim so demos work offline / fast.
// Add campus spots, hackathon venues, etc.

export interface DemoPlace {
  lat: number;
  lon: number;
  name: string;
}

/** Lowercase keyword → place. First match wins. */
const PLACES: Record<string, DemoPlace> = {
  canteen: {
    lat: 28.6139,
    lon: 77.209,
    name: "Canteen",
  },
  library: {
    lat: 28.6145,
    lon: 77.2095,
    name: "Library",
  },
  auditorium: {
    lat: 28.6135,
    lon: 77.2088,
    name: "Auditorium",
  },
  "main gate": {
    lat: 28.6148,
    lon: 77.2082,
    name: "Main Gate",
  },
  hostel: {
    lat: 28.6128,
    lon: 77.2098,
    name: "Hostel",
  },
  "computer lab": {
    lat: 28.6142,
    lon: 77.2092,
    name: "Computer Lab",
  },
  office: {
    lat: 28.6137,
    lon: 77.2086,
    name: "Admin Office",
  },
};

/**
 * Look up a query in the hardcoded places map.
 * Returns the first matching place or `null`.
 */
export function lookupDemoPlace(query: string): DemoPlace | null {
  const q = query.toLowerCase().trim();
  for (const [keyword, place] of Object.entries(PLACES)) {
    if (q.includes(keyword)) return place;
  }
  return null;
}
