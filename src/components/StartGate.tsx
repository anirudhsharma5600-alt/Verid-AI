"use client";

import { t } from "@/lib/client/i18n";
import type { Lang } from "@/types/api";

interface StartGateProps {
  lang: Lang;
  onStart: () => void;
}

/**
 * Full-screen gate shown on first load.
 * Tap anywhere to start — required by browsers to allow
 * getUserMedia, SpeechSynthesis, and AudioContext.
 */
export default function StartGate({ lang, onStart }: StartGateProps) {
  return (
    <button
      id="start-gate"
      onClick={onStart}
      aria-label={t(lang, "tapToStart")}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
    >
      {/* Pulsing circle */}
      <div className="relative mb-8">
        <div className="w-40 h-40 rounded-full bg-[#FFD400] flex items-center justify-center radar-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            className="w-20 h-20"
          >
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
        </div>
      </div>

      <h1 className="text-4xl font-extrabold text-[#FFD400] tracking-tight">
        {t(lang, "tapToStart")}
      </h1>
      <p className="text-xl text-gray-300 mt-4 max-w-xs text-center">
        {t(lang, "tapToStartSub")}
      </p>

      {/* Safety disclaimer */}
      <p className="absolute bottom-8 left-4 right-4 text-center text-sm text-gray-500">
        {t(lang, "safety")}
      </p>
    </button>
  );
}
