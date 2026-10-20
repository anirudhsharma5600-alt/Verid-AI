"use client";

interface StatusBannerProps {
  message: string;
  variant?: "default" | "success" | "danger" | "processing";
}

const VARIANT_STYLES = {
  default: "bg-black/80 border-[#FFD400]/30 text-white",
  success: "bg-green-900/80 border-green-500/40 text-green-100",
  danger: "bg-red-900/80 border-red-500/50 text-red-100",
  processing: "bg-[#FFD400]/10 border-[#FFD400]/30 text-[#FFD400]",
};

/**
 * Large aria-live banner that announces the last spoken message.
 * Always visible at top of screen for sighted users; announced for SR.
 */
export default function StatusBanner({
  message,
  variant = "default",
}: StatusBannerProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-atomic="true"
      className={`w-full px-4 py-3 text-center text-lg font-semibold border-b backdrop-blur-sm ${VARIANT_STYLES[variant]}`}
    >
      {message}
    </div>
  );
}
