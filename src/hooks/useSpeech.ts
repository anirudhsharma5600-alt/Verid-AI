"use client";

import { useRef, useCallback, useState } from "react";
import type { Lang } from "@/types/api";

// ─── TTS ───

const VOICE_MAP: Record<Lang, string> = {
  en: "en-US",
  hi: "hi-IN",
};

export function useSpeech() {
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string, lang: Lang, interrupt = true) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (interrupt) {
      window.speechSynthesis.cancel();
    }

    const u = new SpeechSynthesisUtterance(text);
    u.lang = VOICE_MAP[lang];
    u.rate = 1.0;
    u.pitch = 1.0;
    u.volume = 1.0;

    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);

    utterRef.current = u;
    window.speechSynthesis.speak(u);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stopSpeaking, isSpeaking };
}

// ─── STT (Speech-to-Text) ───

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export function useListen() {
  const recogRef = useRef<ReturnType<typeof createRecognition> | null>(null);
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(
    (
      lang: Lang,
      onResult: (transcript: string) => void,
      onEnd?: () => void
    ) => {
      if (typeof window === "undefined") return;

      const SpeechRecognition =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).SpeechRecognition ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) return;

      const recog = new SpeechRecognition();
      recog.lang = VOICE_MAP[lang];
      recog.interimResults = false;
      recog.maxAlternatives = 1;
      recog.continuous = false;

      recog.onresult = (e: SpeechRecognitionEvent) => {
        const transcript = e.results[0]?.[0]?.transcript ?? "";
        onResult(transcript.trim());
      };

      recog.onend = () => {
        setIsListening(false);
        onEnd?.();
      };

      recog.onerror = () => {
        setIsListening(false);
        onEnd?.();
      };

      recogRef.current = recog;
      recog.start();
      setIsListening(true);
    },
    []
  );

  const stopListening = useCallback(() => {
    recogRef.current?.stop();
    setIsListening(false);
  }, []);

  return { startListening, stopListening, isListening };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createRecognition(): any {
  return null; // type helper only
}
