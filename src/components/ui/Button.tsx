import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "yellow";
  size?: "sm" | "md" | "lg" | "xl";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD400] disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97] select-none";

    const variants = {
      primary:
        "bg-[#FFD400] text-black hover:bg-[#E6BE00] active:bg-[#CCA800] border-2 border-[#FFD400]",
      yellow:
        "bg-[#FFD400] text-black hover:bg-[#E6BE00] active:bg-[#CCA800] border-2 border-[#FFD400]",
      secondary:
        "bg-zinc-900 text-white hover:bg-zinc-800 border-2 border-zinc-700",
      outline:
        "border-2 border-[#FFD400] text-[#FFD400] bg-black hover:bg-[#FFD400]/10",
      ghost:
        "text-white hover:bg-zinc-900 border-2 border-transparent",
      danger:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border-2 border-red-500",
    };

    const sizes = {
      sm: "px-3 py-2 text-sm rounded-lg min-h-10",
      md: "px-5 py-3 text-base rounded-xl min-h-12",
      lg: "px-6 py-4 text-lg rounded-2xl min-h-14 font-extrabold",
      xl: "px-8 py-5 text-xl rounded-2xl min-h-16 font-extrabold tracking-wide",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
