"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import type { Detection } from "@/lib/client/alerts";

// Coco-SSD is loaded via CDN script tags in layout.tsx.
// We access it via the global `cocoSsd` namespace.

interface UseDetectorResult {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  detect: (video: HTMLVideoElement) => Promise<Detection[]>;
}

export function useDetector(): UseDetectorResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadAttempted = useRef(false);

  useEffect(() => {
    if (loadAttempted.current) return;
    loadAttempted.current = true;

    let cancelled = false;

    async function loadModel() {
      setIsLoading(true);
      setError(null);

      // Wait for cocoSsd to be available (loaded async from CDN)
      let retries = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      while (!(window as any).cocoSsd && retries < 60) {
        await new Promise((r) => setTimeout(r, 500));
        retries++;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(window as any).cocoSsd) {
        if (!cancelled) {
          setError("Detection model failed to load");
          setIsLoading(false);
        }
        return;
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const model = await (window as any).cocoSsd.load({
          base: "lite_mobilenet_v2",
        });
        if (!cancelled) {
          modelRef.current = model;
          setIsReady(true);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load detection model"
          );
          setIsLoading(false);
        }
      }
    }

    loadModel();

    return () => {
      cancelled = true;
    };
  }, []);

  const detect = useCallback(
    async (video: HTMLVideoElement): Promise<Detection[]> => {
      if (!modelRef.current || !video.videoWidth) return [];

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const predictions: any[] = await modelRef.current.detect(video);
        return predictions.map((p) => ({
          class: p.class,
          score: p.score,
          bbox: p.bbox as [number, number, number, number],
        }));
      } catch {
        return [];
      }
    },
    []
  );

  return { isLoading, isReady, error, detect };
}
