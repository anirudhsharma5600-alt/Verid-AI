"use client";

import { t } from "@/lib/client/i18n";
import type { Lang } from "@/types/api";

type Action = "whatInFront" | "describe" | "readThis";

interface ActionGridProps {
  lang: Lang;
  disabled?: boolean;
  onAction: (action: Action) => void;
}

const ACTIONS: { key: Action; icon: string }[] = [
  {
    key: "whatInFront",
    icon: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
  },
  {
    key: "describe",
    icon: "M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 15h14v3H5z",
  },
  {
    key: "readThis",
    icon: "M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z",
  },
];

/**
 * 3 large action buttons: "What is in front?", "Describe", "Read this"
 */
export default function ActionGrid({
  lang,
  disabled = false,
  onAction,
}: ActionGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-full px-2">
      {ACTIONS.map((action) => (
        <button
          key={action.key}
          id={`action-${action.key}`}
          aria-label={t(lang, action.key)}
          disabled={disabled}
          onClick={() => onAction(action.key)}
          className={`
            flex flex-col items-center justify-center gap-1.5
            min-h-20 rounded-2xl border-2 transition-all duration-200
            ${
              disabled
                ? "border-gray-700 bg-gray-900/50 text-gray-500 opacity-50"
                : "border-[#FFD400]/30 bg-[#FFD400]/10 text-[#FFD400] active:bg-[#FFD400]/30 active:scale-95"
            }
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7"
          >
            <path d={action.icon} />
          </svg>
          <span className="text-xs font-bold leading-tight text-center px-1">
            {t(lang, action.key)}
          </span>
        </button>
      ))}
    </div>
  );
}
