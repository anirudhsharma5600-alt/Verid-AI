"use client";

import { useEffect, useRef, useState } from "react";
import { createAlertEngine, type Alert, type Detection } from "@/lib/client/alerts";
import type { Lang } from "@/types/api";

interface UseObstaclesProps {
  detections: Detection[];
  videoRef: React.RefObject<HTMLVideoElement | null>;
  lang: Lang;
  onAlert: (alert: Alert) => void;
  enabled?: boolean;
}

export function useObstacles({
  detections,
  videoRef,
  lang,
  onAlert,
  enabled = true,
}: UseObstaclesProps) {
  const engineRef = useRef<ReturnType<typeof createAlertEngine> | null>(null);
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);

  if (!engineRef.current) {
    engineRef.current = createAlertEngine();
  }

  useEffect(() => {
    if (!enabled || !videoRef.current || !videoRef.current.videoWidth) return;

    const frameW = videoRef.current.videoWidth;
    const frameH = videoRef.current.videoHeight;

    const alert = engineRef.current?.process(detections, frameW, frameH, lang);
    if (alert) {
      setCurrentAlert(alert);
      onAlert(alert);
    }
  }, [detections, videoRef, lang, onAlert, enabled]);

  return { currentAlert };
}
