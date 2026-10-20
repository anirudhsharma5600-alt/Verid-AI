import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex w-full min-h-14 rounded-xl border-2 border-zinc-700 bg-zinc-900 px-4 py-3 text-lg text-white font-medium placeholder:text-zinc-500",
          "focus:border-[#FFD400] focus:outline-none focus:ring-2 focus:ring-[#FFD400]/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus:border-red-500",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
