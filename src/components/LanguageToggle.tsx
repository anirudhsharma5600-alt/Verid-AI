"use client";

import type { Lang } from "@/types/api";

interface LanguageToggleProps {
  lang: Lang;
  onToggle: () => void;
}

/**
 * EN / हिंदी toggle — large touch target, clear visual state.
 */
export default function LanguageToggle({ lang, onToggle }: LanguageToggleProps) {
  return (
    <button
      id="language-toggle"
      onClick={onToggle}
      aria-label={lang === "en" ? "Switch to Hindi" : "Switch to English"}
      className="
        flex items-center gap-1.5 px-4 py-2 rounded-full
        border-2 border-[#FFD400]/30 bg-[#FFD400]/10
        text-sm font-bold text-[#FFD400]
        transition-all active:scale-95 active:bg-[#FFD400]/30
      "
    >
      <span className={lang === "en" ? "opacity-100" : "opacity-40"}>EN</span>
      <span className="text-[#FFD400]/30">/</span>
      <span className={lang === "hi" ? "opacity-100" : "opacity-40"}>हिंदी</span>
    </button>
  );
}
