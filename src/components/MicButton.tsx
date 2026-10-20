"use client";

interface MicButtonProps {
  isListening: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
  disabled?: boolean;
}

/**
 * Very large mic button (80px) — hold-to-speak pattern.
 * Pulses red when listening, yellow when idle.
 */
export default function MicButton({
  isListening,
  onPointerDown,
  onPointerUp,
  disabled = false,
}: MicButtonProps) {
  return (
    <button
      id="mic-button"
      aria-label={isListening ? "Listening" : "Hold to speak"}
      disabled={disabled}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onContextMenu={(e) => e.preventDefault()}
      className={`
        w-20 h-20 rounded-full flex items-center justify-center
        transition-all duration-200 select-none touch-none
        ${
          isListening
            ? "bg-red-500 listening-pulse scale-110"
            : disabled
            ? "bg-gray-600 opacity-50"
            : "bg-[#FFD400] active:scale-95"
        }
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isListening ? "white" : "black"}
        className="w-10 h-10"
      >
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
      </svg>
    </button>
  );
}
