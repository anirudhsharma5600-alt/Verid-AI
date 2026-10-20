import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "yellow" | "success" | "danger" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-zinc-800 text-zinc-200 border-zinc-700",
    yellow: "bg-[#FFD400] text-black font-extrabold border-[#FFD400]",
    success: "bg-emerald-950 text-emerald-300 border-emerald-700",
    danger: "bg-red-950 text-red-300 border-red-700",
    outline: "text-zinc-200 border-zinc-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
