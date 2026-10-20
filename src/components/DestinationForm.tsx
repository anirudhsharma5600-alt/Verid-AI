"use client";

import { useState } from "react";
import { t } from "@/lib/client/i18n";
import type { Lang } from "@/types/api";

interface DestinationFormProps {
  lang: Lang;
  disabled?: boolean;
  onSubmit: (destination: string) => void;
}

/**
 * Destination input for navigation mode.
 * Large input + Go button, accessible.
 */
export default function DestinationForm({
  lang,
  disabled = false,
  onSubmit,
}: DestinationFormProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setValue("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 w-full px-2"
    >
      <input
        id="destination-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t(lang, "enterDestination")}
        disabled={disabled}
        aria-label={t(lang, "enterDestination")}
        className="
          flex-1 min-h-14 px-4 rounded-xl
          bg-gray-900 border-2 border-gray-700
          text-white text-lg placeholder-gray-500
          focus:border-[#FFD400] focus:outline-none
          disabled:opacity-50
        "
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="
          min-h-14 px-6 rounded-xl font-bold text-lg
          bg-[#FFD400] text-black
          active:scale-95 transition-all
          disabled:opacity-50 disabled:bg-gray-600
        "
      >
        {t(lang, "go")}
      </button>
    </form>
  );
}
