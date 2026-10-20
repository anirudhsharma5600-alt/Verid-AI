"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  id,
}: SwitchProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer select-none",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-8 w-14 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD400]",
          checked ? "bg-[#FFD400]" : "bg-zinc-700"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-6 bg-black" : "translate-x-0 bg-white"
          )}
        />
      </button>
      {label && <span className="text-base font-semibold text-white">{label}</span>}
    </label>
  );
}
