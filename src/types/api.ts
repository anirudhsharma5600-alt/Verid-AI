<<<<<<< HEAD
// ─── Shared API Contract ─── (written by Anirudh, read-only for Ayush)

// POST /api/describe
export interface DescribeRequest {
  image: string; // base64 jpeg, NO "data:" prefix
  mode: "describe" | "read";
  lang: "en" | "hi";
}

=======
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
>>>>>>> 487757b4aba9ef35aac004dd409086a1aa3d44eb
export interface DescribeResponse {
  text: string;
}

<<<<<<< HEAD
// GET /api/geocode?q=<text>&lat=<num>&lon=<num>
=======
// ────────────────────────────────────────────────
// GET /api/geocode?q=<text>&lat=<num>&lon=<num>
// ────────────────────────────────────────────────

/** 200 response from /api/geocode */
>>>>>>> 487757b4aba9ef35aac004dd409086a1aa3d44eb
export interface GeocodeResponse {
  lat: number;
  lon: number;
  name: string;
}

<<<<<<< HEAD
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
=======
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
>>>>>>> 487757b4aba9ef35aac004dd409086a1aa3d44eb
  distance: number;
  steps: RouteStep[];
}

<<<<<<< HEAD
// Error shapes
export interface ApiError {
  error: "bad_request" | "busy" | "upstream" | "not_found";
}

export type Lang = "en" | "hi";
export type DescribeMode = "describe" | "read";
=======
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
>>>>>>> 487757b4aba9ef35aac004dd409086a1aa3d44eb
