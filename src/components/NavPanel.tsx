"use client";

import { t } from "@/lib/client/i18n";
import type { Lang } from "@/types/api";
import type { RouteStep } from "@/types/api";

interface NavPanelProps {
  lang: Lang;
  steps: RouteStep[];
  currentStepIndex: number;
  onStop: () => void;
}

function formatInstruction(step: RouteStep, lang: Lang): string {
  if (step.type === "depart") return t(lang, "straight");
  if (step.type === "arrive") return t(lang, "arrive");

  // Map modifier to instruction
  const modifierMap: Record<string, string> = {
    left: t(lang, "turnLeft"),
    right: t(lang, "turnRight"),
    "slight left": t(lang, "turnSlightLeft"),
    "slight right": t(lang, "turnSlightRight"),
    "sharp left": t(lang, "turnSharpLeft"),
    "sharp right": t(lang, "turnSharpRight"),
    uturn: t(lang, "uturn"),
    straight: t(lang, "straight"),
  };

  const instruction = modifierMap[step.modifier ?? ""] ?? t(lang, "straight");
  let text = t(lang, "inMeters", {
    distance: Math.round(step.distance),
    instruction,
  });

  if (step.name) {
    text += " " + t(lang, "onto", { road: step.name });
  }

  return text;
}

/**
 * Navigation panel — shows current step with progress and Stop button.
 */
export default function NavPanel({
  lang,
  steps,
  currentStepIndex,
  onStop,
}: NavPanelProps) {
  const currentStep = steps[currentStepIndex];
  if (!currentStep) return null;

  const isArriving = currentStep.type === "arrive";
  const totalDist = steps.reduce((acc, s) => acc + s.distance, 0);
  const doneDist = steps
    .slice(0, currentStepIndex)
    .reduce((acc, s) => acc + s.distance, 0);
  const remainDist = Math.max(0, totalDist - doneDist);
  const progress =
    totalDist > 0 ? Math.min(100, (doneDist / totalDist) * 100) : 0;

  return (
    <div className="w-full px-2 space-y-3">
      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#FFD400] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step info */}
      <div className="bg-gray-900/80 border-2 border-gray-700 rounded-2xl p-4 space-y-2">
        <div className="text-sm text-gray-400 font-semibold">
          {t(lang, "stepN", {
            n: currentStepIndex + 1,
            total: steps.length,
          })}
        </div>

        <div className="text-xl font-bold text-white leading-snug">
          {isArriving
            ? t(lang, "arriving")
            : formatInstruction(currentStep, lang)}
        </div>

        <div className="text-sm text-[#FFD400] font-medium">
          {t(lang, "distanceLeft", { distance: Math.round(remainDist) })}
        </div>
      </div>

      {/* Stop button */}
      <button
        id="nav-stop-button"
        onClick={onStop}
        aria-label={t(lang, "stop")}
        className="
          w-full min-h-14 rounded-2xl font-bold text-lg
          bg-red-600 text-white
          active:scale-95 active:bg-red-700 transition-all
        "
      >
        {t(lang, "stop")}
      </button>
    </div>
  );
}
