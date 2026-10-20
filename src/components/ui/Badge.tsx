import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-transparent",
    secondary:
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-transparent",
    success:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-transparent",
    outline:
      "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
