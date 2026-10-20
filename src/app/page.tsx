"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import StartGate from "@/components/StartGate";
import CameraView from "@/components/CameraView";
import StatusBanner from "@/components/StatusBanner";
import MicButton from "@/components/MicButton";
import ActionGrid from "@/components/ActionGrid";
import LanguageToggle from "@/components/LanguageToggle";
import DestinationForm from "@/components/DestinationForm";
import NavPanel from "@/components/NavPanel";
import { Toaster, useToast } from "@/components/ui/Sonner";
import { Badge } from "@/components/ui/Badge";

import { useCamera } from "@/hooks/useCamera";
import { useSpeech, useListen } from "@/hooks/useSpeech";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useVibrate } from "@/hooks/useVibrate";
import { useDetector } from "@/hooks/useDetector";
import { useObstacles } from "@/hooks/useObstacles";
import { useNavigation } from "@/hooks/useNavigation";

import { describeImage } from "@/lib/client/api";
import { t } from "@/lib/client/i18n";
import type { Lang, DescribeMode } from "@/types/api";
import type { Detection, Alert } from "@/lib/client/alerts";

export default function VisionAssistantApp() {
  return (
    <Toaster>
      <VisionAssistantMain />
    </Toaster>
  );
}

function VisionAssistantMain() {
  const [hasStarted, setHasStarted] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [statusText, setStatusText] = useState("");
  const [statusVariant, setStatusVariant] = useState<
    "default" | "success" | "danger" | "processing"
  >("default");
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [showNavForm, setShowNavForm] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);

  const { toast } = useToast();

  // Core Hooks
  const camera = useCamera();
  const speech = useSpeech();
  const listen = useListen();
  const geo = useGeolocation();
  const { vibrateShort, vibrateAlert } = useVibrate();
  const detector = useDetector();

  // Announce helper: sets banner text + speaks aloud
  const announce = useCallback(
    (
      text: string,
      variant: "default" | "success" | "danger" | "processing" = "default",
      interrupt = true
    ) => {
      setStatusText(text);
      setStatusVariant(variant);
      speech.speak(text, lang, interrupt);
    },
    [speech, lang]
  );

  // Obstacle alert handler
  const handleAlert = useCallback(
    (alert: Alert) => {
      vibrateAlert();
      announce(alert.text, alert.interrupt ? "danger" : "default", alert.interrupt);
      toast(alert.text, alert.interrupt ? "error" : "warning");
    },
    [announce, vibrateAlert, toast]
  );

  // Hook: Obstacle avoidance engine
  useObstacles({
    detections,
    videoRef: camera.videoRef,
    lang,
    onAlert: handleAlert,
    enabled: hasStarted && camera.isReady,
  });

  // Hook: Navigation
  const navigation = useNavigation({
    currentPosition: geo.position,
    lang,
    onAnnounce: (msg) => {
      announce(msg, "default", true);
      toast(msg, "info");
    },
  });

  // Detection Loop: run object detection on camera frames
  const isDetectingRef = useRef(false);

  useEffect(() => {
    if (!hasStarted || !camera.isReady || !detector.isReady) return;

    let animId: number;
    let cancelled = false;

    const loop = async () => {
      if (cancelled) return;

      const video = camera.videoRef.current;
      if (video && video.readyState >= 2 && !isDetectingRef.current) {
        isDetectingRef.current = true;
        try {
          const results = await detector.detect(video);
          if (!cancelled) {
            setDetections(results);
          }
        } catch {
          // ignore detection frame drops
        } finally {
          isDetectingRef.current = false;
        }
      }

      // Run detection at ~4 FPS (every 250ms) to preserve battery & avoid thermal throttle
      await new Promise((r) => setTimeout(r, 250));
      if (!cancelled) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
    };
  }, [hasStarted, camera.isReady, detector.isReady, camera.videoRef, detector]);

  // Start Gate Handler
  const handleStart = useCallback(async () => {
    vibrateShort();
    setHasStarted(true);

    // Initialize camera
    await camera.start();

    // Start GPS watch
    geo.startWatching();

    // Initial greeting
    const welcome =
      lang === "en"
        ? "Vision Assistant ready. Camera active. Object detection running."
        : "विज़न सहायक तैयार है। कैमरा सक्रिय है। वस्तु पहचान चालू है।";
    announce(welcome, "success");
    toast(welcome, "success");
  }, [camera, geo, lang, announce, vibrateShort, toast]);

  // Language Toggle
  const toggleLanguage = useCallback(() => {
    vibrateShort();
    const nextLang: Lang = lang === "en" ? "hi" : "en";
    setLang(nextLang);
    const msg = nextLang === "hi" ? "भाषा हिंदी चुनी गई" : "Language set to English";
    announce(msg, "default");
    toast(msg, "info");
  }, [lang, announce, vibrateShort, toast]);

  // Perform Image Description / OCR
  const handleDescribeAction = useCallback(
    async (mode: DescribeMode) => {
      if (isProcessingAction) return;

      vibrateShort();
      setIsProcessingAction(true);
      announce(t(lang, "processing"), "processing");

      try {
        const base64 = camera.captureBase64();
        if (!base64) {
          throw new Error("Camera frame capture failed");
        }

        const res = await describeImage(base64, mode, lang);
        announce(res.text, "success");
        toast(res.text.slice(0, 80) + "...", "success");
      } catch (err) {
        const errorMsg =
          err instanceof Error && err.message === "busy"
            ? t(lang, "busy")
            : t(lang, "apiError");
        announce(errorMsg, "danger");
        toast(errorMsg, "error");
      } finally {
        setIsProcessingAction(false);
      }
    },
    [isProcessingAction, camera, lang, announce, vibrateShort, toast]
  );

  // Handle Grid Actions
  const handleAction = useCallback(
    (action: "whatInFront" | "describe" | "readThis") => {
      if (action === "readThis") {
        handleDescribeAction("read");
      } else {
        handleDescribeAction("describe");
      }
    },
    [handleDescribeAction]
  );

  // Handle Voice Command
  const handleVoiceCommand = useCallback(
    (transcript: string) => {
      const lower = transcript.toLowerCase();
      toast(`"${transcript}"`, "info");

      // Check navigation commands: e.g., "navigate to...", "go to...", "नेविगेट..."
      if (
        lower.includes("navigate to") ||
        lower.includes("go to") ||
        lower.includes("नेविगेट") ||
        lower.includes("जाओ")
      ) {
        const dest = transcript
          .replace(/navigate to/i, "")
          .replace(/go to/i, "")
          .replace(/नेविगेट करें/i, "")
          .replace(/जाओ/i, "")
          .trim();

        if (dest) {
          navigation.startNavigation(dest);
          return;
        }
      }

      // Check read commands
      if (
        lower.includes("read") ||
        lower.includes("text") ||
        lower.includes("पढ़ो") ||
        lower.includes("पढ़ें")
      ) {
        handleDescribeAction("read");
        return;
      }

      // Check describe / what's in front commands
      if (
        lower.includes("describe") ||
        lower.includes("front") ||
        lower.includes("what") ||
        lower.includes("सामने") ||
        lower.includes("वर्णन") ||
        lower.includes("तस्वीर")
      ) {
        handleDescribeAction("describe");
        return;
      }

      // Check stop command
      if (
        lower.includes("stop") ||
        lower.includes("cancel") ||
        lower.includes("रुकें") ||
        lower.includes("बंद")
      ) {
        if (navigation.isNavigating) {
          navigation.stopNavigation();
        } else {
          speech.stopSpeaking();
        }
        return;
      }

      // Fallback: describe what is in front
      announce(`Heard: ${transcript}`, "default");
      handleDescribeAction("describe");
    },
    [handleDescribeAction, navigation, speech, announce, toast]
  );

  // Push-to-Talk Pointer handlers
  const handleMicDown = useCallback(() => {
    vibrateShort();
    announce(t(lang, "listening"), "processing", false);
    listen.startListening(
      lang,
      (transcript) => handleVoiceCommand(transcript),
      () => {}
    );
  }, [lang, announce, listen, vibrateShort, handleVoiceCommand]);

  const handleMicUp = useCallback(() => {
    listen.stopListening();
  }, [listen]);

  // If StartGate is not dismissed yet, show it
  if (!hasStarted) {
    return <StartGate lang={lang} onStart={handleStart} />;
  }

  return (
    <main className="fixed inset-0 flex flex-col bg-black text-white select-none overflow-hidden touch-manipulation">
      {/* ─── Top Header & Badges ─── */}
      <header className="flex items-center justify-between px-4 py-2 bg-black/90 z-20 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <h1 className="text-xl font-black tracking-wider text-[#FFD400]">
            VISION ASSISTANT
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {detector.isLoading && (
            <Badge variant="yellow" className="text-2xs">
              AI Loading…
            </Badge>
          )}
          {detector.isReady && (
            <Badge variant="success" className="text-2xs">
              AI Ready
            </Badge>
          )}
          <LanguageToggle lang={lang} onToggle={toggleLanguage} />
        </div>
      </header>

      {/* ─── Large Status Banner (aria-live) ─── */}
      <div className="z-20">
        <StatusBanner message={statusText} variant={statusVariant} />
      </div>

      {/* ─── Full-screen Camera + Detection Overlay ─── */}
      <div className="relative flex-1 w-full bg-black">
        <CameraView
          videoRef={camera.videoRef}
          canvasRef={camera.canvasRef}
          detections={detections}
          isReady={camera.isReady}
        />

        {/* Navigation Step Overlay if Navigating */}
        {navigation.isNavigating && (
          <div className="absolute top-4 left-2 right-2 z-30">
            <NavPanel
              lang={lang}
              steps={navigation.steps}
              currentStepIndex={navigation.currentStepIndex}
              onStop={navigation.stopNavigation}
            />
          </div>
        )}
      </div>

      {/* ─── Bottom Accessible Control Console ─── */}
      <footer className="z-20 flex flex-col items-center bg-black/95 border-t border-zinc-800 pb-4 pt-2 gap-3">
        {/* Destination Form toggle / input when not in active route */}
        {!navigation.isNavigating && (
          <div className="w-full px-2">
            {showNavForm ? (
              <div className="flex flex-col gap-2">
                <DestinationForm
                  lang={lang}
                  disabled={navigation.isLoading}
                  onSubmit={(query) => {
                    navigation.startNavigation(query);
                    setShowNavForm(false);
                  }}
                />
                <button
                  onClick={() => setShowNavForm(false)}
                  className="text-xs text-zinc-400 underline self-center py-1"
                >
                  Cancel destination input
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center px-2">
                <button
                  id="toggle-nav-form"
                  onClick={() => {
                    vibrateShort();
                    setShowNavForm(true);
                  }}
                  className="flex items-center gap-1.5 text-sm font-bold text-[#FFD400] bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-700 active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {t(lang, "navigateTo")}
                </button>

                <div className="text-2xs text-zinc-400 font-mono">
                  {geo.position
                    ? `GPS ±${Math.round(geo.position.accuracy)}m`
                    : "Acquiring GPS…"}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Grid (Describe, Read, What's in front) */}
        {!navigation.isNavigating && (
          <ActionGrid
            lang={lang}
            disabled={isProcessingAction || !camera.isReady}
            onAction={handleAction}
          />
        )}

        {/* Center Giant Push-to-Talk Mic Button */}
        <div className="flex items-center justify-center">
          <MicButton
            isListening={listen.isListening}
            onPointerDown={handleMicDown}
            onPointerUp={handleMicUp}
            disabled={isProcessingAction}
          />
        </div>

        {/* Safety Disclaimer */}
        <p className="text-2xs text-zinc-500 text-center px-4">
          {t(lang, "safety")}
        </p>
      </footer>
    </main>
  );
}
