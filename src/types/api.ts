// ─── Shared API Contract ─── (written by Anirudh, read-only for Ayush)

// POST /api/describe
export interface DescribeRequest {
  image: string; // base64 jpeg, NO "data:" prefix
  mode: "describe" | "read";
  lang: "en" | "hi";
}

export interface DescribeResponse {
  text: string;
}

// GET /api/geocode?q=<text>&lat=<num>&lon=<num>
export interface GeocodeResponse {
  lat: number;
  lon: number;
  name: string;
}

// GET /api/route?fromLat&fromLon&toLat&toLon
export interface RouteStep {
  type: string;
  modifier?: string;
  name: string;
  distance: number;
  lat: number;
  lon: number;
}

export interface RouteResponse {
  distance: number;
  steps: RouteStep[];
}

// Error shapes
export interface ApiError {
  error: "bad_request" | "busy" | "upstream" | "not_found";
}

export type Lang = "en" | "hi";
export type DescribeMode = "describe" | "read";
