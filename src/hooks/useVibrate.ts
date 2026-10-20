"use client";

import { useCallback } from "react";

export function useVibrate() {
  const vibrate = useCallback((pattern: number | number[] = 50) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const vibrateShort = useCallback(() => {
    vibrate(50);
  }, [vibrate]);

  const vibrateLong = useCallback(() => {
    vibrate(200);
  }, [vibrate]);

  const vibrateAlert = useCallback(() => {
    vibrate([100, 50, 100, 50, 200]);
  }, [vibrate]);

  return { vibrate, vibrateShort, vibrateLong, vibrateAlert };
}
