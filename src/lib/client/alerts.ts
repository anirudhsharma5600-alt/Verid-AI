// ─── Obstacle Alert System ───
// Ported from reference logic: left/center/right zones, distance from bbox area,
// danger classes, consecutive-frame confirmation, cooldown per label+direction+distance.

import type { Lang } from "@/types/api";
import { t } from "./i18n";

export interface Detection {
  class: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

export interface Alert {
  label: string;
  direction: "left" | "center" | "right";
  distance: "very close" | "close" | "ahead";
  text: string;
  interrupt: boolean;
}

// Classes that are dangerous
const DANGER_CLASSES = new Set([
  "car",
  "truck",
  "bus",
  "motorcycle",
  "bicycle",
  "person",
  "dog",
  "train",
]);

// Only report far vehicles if they're in center
const FAR_VEHICLE_CLASSES = new Set([
  "car",
  "truck",
  "bus",
  "motorcycle",
  "train",
]);

const COOLDOWN_MS = 4000;

interface TrackEntry {
  count: number;
  lastSeen: number;
}

interface CooldownEntry {
  expires: number;
}

// State is held per-instance
export function createAlertEngine() {
  const tracking = new Map<string, TrackEntry>(); // key → consecutive frame count
  const cooldowns = new Map<string, CooldownEntry>();

  function makeKey(label: string, dir: string, dist: string) {
    return `${label}|${dir}|${dist}`;
  }

  function getDirection(
    bboxX: number,
    bboxW: number,
    frameW: number
  ): "left" | "center" | "right" {
    const cx = bboxX + bboxW / 2;
    const third = frameW / 3;
    if (cx < third) return "left";
    if (cx > third * 2) return "right";
    return "center";
  }

  function getDistance(
    bboxArea: number,
    frameArea: number
  ): "very close" | "close" | "ahead" {
    const ratio = bboxArea / frameArea;
    if (ratio > 0.3) return "very close";
    if (ratio > 0.1) return "close";
    return "ahead";
  }

  function process(
    detections: Detection[],
    frameWidth: number,
    frameHeight: number,
    lang: Lang
  ): Alert | null {
    const now = Date.now();
    const frameArea = frameWidth * frameHeight;

    // Mark all tracking entries as potentially stale
    const seenKeys = new Set<string>();

    // Sort: danger classes first, then by area descending
    const sorted = [...detections].sort((a, b) => {
      const aDanger = DANGER_CLASSES.has(a.class) ? 0 : 1;
      const bDanger = DANGER_CLASSES.has(b.class) ? 0 : 1;
      if (aDanger !== bDanger) return aDanger - bDanger;
      const aArea = a.bbox[2] * a.bbox[3];
      const bArea = b.bbox[2] * b.bbox[3];
      return bArea - aArea;
    });

    for (const det of sorted) {
      const dir = getDirection(det.bbox[0], det.bbox[2], frameWidth);
      const area = det.bbox[2] * det.bbox[3];
      const dist = getDistance(area, frameArea);

      // Far vehicles only matter in center
      if (
        dist === "ahead" &&
        FAR_VEHICLE_CLASSES.has(det.class) &&
        dir !== "center"
      ) {
        continue;
      }

      const key = makeKey(det.class, dir, dist);
      seenKeys.add(key);

      // Update tracking
      const track = tracking.get(key);
      if (track) {
        track.count += 1;
        track.lastSeen = now;
      } else {
        tracking.set(key, { count: 1, lastSeen: now });
      }

      // Need 2 consecutive frames
      const current = tracking.get(key)!;
      if (current.count < 2) continue;

      // Check cooldown
      const cd = cooldowns.get(key);
      if (cd && now < cd.expires) continue;

      // Build alert text
      let text: string;
      if (dist === "ahead") {
        text = t(lang, "ahead", { object: det.class });
      } else {
        const dirKey = dir as "left" | "right" | "center";
        text = t(lang, dist === "very close" ? "veryClose" : "close", {
          object: det.class,
          direction: t(lang, dirKey),
        });
      }

      // Set cooldown
      cooldowns.set(key, { expires: now + COOLDOWN_MS });

      // Reset tracking
      current.count = 0;

      return {
        label: det.class,
        direction: dir,
        distance: dist,
        text,
        interrupt: dist === "very close",
      };
    }

    // Prune stale tracking entries (not seen this frame)
    for (const [key] of tracking) {
      if (!seenKeys.has(key)) {
        tracking.delete(key);
      }
    }

    // Prune expired cooldowns
    for (const [key, cd] of cooldowns) {
      if (now > cd.expires) {
        cooldowns.delete(key);
      }
    }

    return null;
  }

  return { process };
}
