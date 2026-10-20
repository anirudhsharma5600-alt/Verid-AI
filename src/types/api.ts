// ─── Vision Assistant — Shared API Contract ───
// Written by Anirudh (backend). Read-only for Ayush (frontend).
// Both branches import from "@/types/api".

// ────────────────────────────────────────────────
// POST /api/describe
// ────────────────────────────────────────────────

/** Modes the vision endpoint supports. */
export type DescribeMode = "describe" | "read";

/** Languages the vision endpoint supports. */
export type DescribeLang = "en" | "hi";

/** POST body for /api/describe */
export interface DescribeRequest {
  /** Base-64 encoded JPEG. No "data:…" prefix. Max ~3 MB. */
  image: string;
  mode: DescribeMode;
  lang: DescribeLang;
}

/** 200 response from /api/describe */
export interface DescribeResponse {
  text: string;
}

// ────────────────────────────────────────────────
// GET /api/geocode?q=<text>&lat=<num>&lon=<num>
// ────────────────────────────────────────────────

/** 200 response from /api/geocode */
export interface GeocodeResponse {
  lat: number;
  lon: number;
  name: string;
}

// ────────────────────────────────────────────────
// GET /api/route?fromLat&fromLon&toLat&toLon
// ────────────────────────────────────────────────

/** A single step in a walking route. */
export interface RouteStep {
  /** Maneuver type, e.g. "turn", "depart", "arrive" */
  type: string;
  /** Direction modifier, e.g. "left", "right", "straight" */
  modifier?: string;
  /** Street / place name */
  name: string;
  /** Distance of this leg in metres */
  distance: number;
  /** Latitude of the maneuver point */
  lat: number;
  /** Longitude of the maneuver point */
  lon: number;
}

/** 200 response from /api/route */
export interface RouteResponse {
  /** Total distance in metres */
  distance: number;
  steps: RouteStep[];
}

// ────────────────────────────────────────────────
// Error envelope (all endpoints)
// ────────────────────────────────────────────────

export type ApiErrorCode =
  | "bad_request"
  | "busy"
  | "upstream"
  | "not_found";

/** Non-200 response body */
export interface ApiError {
  error: ApiErrorCode;
}
