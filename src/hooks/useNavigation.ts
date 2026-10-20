"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { geocode, getRoute } from "@/lib/client/api";
import { t } from "@/lib/client/i18n";
import type { Lang, RouteStep } from "@/types/api";

function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

interface UseNavigationProps {
  currentPosition: { lat: number; lon: number } | null;
  lang: Lang;
  onAnnounce: (text: string) => void;
}

export function useNavigation({
  currentPosition,
  lang,
  onAnnounce,
}: UseNavigationProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [destinationName, setDestinationName] = useState<string | null>(null);
  const [steps, setSteps] = useState<RouteStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const lastAnnouncedStepRef = useRef<number>(-1);

  const startNavigation = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const fromLat = currentPosition?.lat ?? 28.6129;
        const fromLon = currentPosition?.lon ?? 77.2085;

        // 1. Geocode
        const destination = await geocode(query, fromLat, fromLon);
        setDestinationName(destination.name);

        // 2. Route
        const route = await getRoute(
          fromLat,
          fromLon,
          destination.lat,
          destination.lon
        );

        if (!route.steps || route.steps.length === 0) {
          throw new Error("noRoute");
        }

        setSteps(route.steps);
        setCurrentStepIndex(0);
        setIsNavigating(true);
        lastAnnouncedStepRef.current = -1;

        const firstStep = route.steps[0];
        const initialText = `${t(lang, "navMode")}. ${t(lang, "distanceLeft", {
          distance: Math.round(route.distance),
        })}. ${firstStep.name || t(lang, "straight")}`;
        onAnnounce(initialText);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "noRoute";
        setError(msg);
        onAnnounce(t(lang, "noRoute"));
      } finally {
        setIsLoading(false);
      }
    },
    [currentPosition, lang, onAnnounce]
  );

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
    setSteps([]);
    setCurrentStepIndex(0);
    setDestinationName(null);
    lastAnnouncedStepRef.current = -1;
    onAnnounce(t(lang, "cancelled"));
  }, [lang, onAnnounce]);

  // Monitor location and progress steps
  useEffect(() => {
    if (!isNavigating || !currentPosition || steps.length === 0) return;

    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    // Check distance to the step target coordinate
    const distToTarget = calculateDistanceMeters(
      currentPosition.lat,
      currentPosition.lon,
      currentStep.lat,
      currentStep.lon
    );

    // If within 15 meters and not last step, advance
    if (distToTarget < 15 && currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const nextStep = steps[nextIndex];

      if (lastAnnouncedStepRef.current !== nextIndex) {
        lastAnnouncedStepRef.current = nextIndex;
        if (nextStep.type === "arrive") {
          onAnnounce(t(lang, "arriving"));
        } else {
          onAnnounce(
            t(lang, "inMeters", {
              distance: Math.round(nextStep.distance),
              instruction: nextStep.modifier || t(lang, "straight"),
            })
          );
        }
      }
    } else if (distToTarget < 10 && currentStepIndex === steps.length - 1) {
      // Arrived at final destination
      onAnnounce(t(lang, "arrive"));
      setIsNavigating(false);
    }
  }, [isNavigating, currentPosition, steps, currentStepIndex, lang, onAnnounce]);

  return {
    isNavigating,
    isLoading,
    destinationName,
    steps,
    currentStepIndex,
    error,
    startNavigation,
    stopNavigation,
  };
}
