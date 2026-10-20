"use client";

import React, { useEffect, useRef } from "react";
import type { Detection } from "@/lib/client/alerts";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  detections: Detection[];
  isReady: boolean;
}

const COLORS: Record<string, string> = {
  person: "#22C55E",
  car: "#EF4444",
  truck: "#EF4444",
  bus: "#EF4444",
  motorcycle: "#F59E0B",
  bicycle: "#F59E0B",
  dog: "#A78BFA",
};

function getColor(label: string): string {
  return COLORS[label] ?? "#60A5FA";
}

/**
 * Full-screen camera feed with detection bounding box overlay.
 */
export default function CameraView({
  videoRef,
  canvasRef,
  detections,
  isReady,
}: CameraViewProps) {
  const overlayRef = useRef<HTMLCanvasElement | null>(null);

  // Draw detection boxes on overlay canvas
  useEffect(() => {
    const overlay = overlayRef.current;
    const video = videoRef.current;
    if (!overlay || !video || !video.videoWidth) return;

    overlay.width = video.videoWidth;
    overlay.height = video.videoHeight;

    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    for (const det of detections) {
      const [x, y, w, h] = det.bbox;
      const color = getColor(det.class);

      // Box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);

      // Label background
      const label = `${det.class} ${Math.round(det.score * 100)}%`;
      ctx.font = "bold 14px sans-serif";
      const metrics = ctx.measureText(label);
      const pad = 4;

      ctx.fillStyle = color;
      ctx.fillRect(
        x,
        y - 20 - pad,
        metrics.width + pad * 2,
        20 + pad
      );

      // Label text
      ctx.fillStyle = "#000000";
      ctx.fillText(label, x + pad, y - pad - 2);
    }
  }, [detections, videoRef]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Camera feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Detection overlay */}
      <canvas
        ref={overlayRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Camera not ready indicator */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-xl text-gray-400 animate-pulse">
            Starting camera…
          </div>
        </div>
      )}
    </div>
  );
}
