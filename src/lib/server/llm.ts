// ─── LLM provider abstraction ───
// Supports Gemini (Google) and Anthropic (Claude) via direct REST.
// Configured by env vars: LLM_PROVIDER, LLM_MODEL, GEMINI_API_KEY / ANTHROPIC_API_KEY.

import { upstreamSignal } from "./errors";

export type LLMProvider = "gemini" | "anthropic";

function getProvider(): LLMProvider {
  return (process.env.LLM_PROVIDER?.toLowerCase() === "anthropic" ? "anthropic" : "gemini");
}

function getModel(provider: LLMProvider): string {
  if (process.env.LLM_MODEL) return process.env.LLM_MODEL;
  return provider === "anthropic" ? "claude-3-5-sonnet-20241022" : "gemini-3.8-flash";
}

// ─── Prompts ────────────────────────────────────

const DESCRIBE_PROMPT_EN =
  "You are the eyes of a blind person walking. In at most 3 short sentences describe what is ahead: nearby obstacles first with left/ahead/right and rough distance, then surroundings. If unsure, say so. Never say the path is safe.";

const DESCRIBE_PROMPT_HI =
  "आप एक अंधे व्यक्ति की आँखें हैं जो चल रहा है। अधिकतम 3 छोटे वाक्यों में बताएं कि आगे क्या है: पहले पास की बाधाएं बाएं/आगे/दाएं और अनुमानित दूरी, फिर आसपास का वर्णन। अगर अनिश्चित हों तो बताएं। कभी न कहें कि रास्ता सुरक्षित है।";

const READ_PROMPT_EN =
  "Read aloud visible text (signboard, label, door sign), most prominent first, max 4 short sentences. If none visible, say so.";

const READ_PROMPT_HI =
  "दिखाई देने वाला टेक्स्ट ज़ोर से पढ़ें (साइनबोर्ड, लेबल, दरवाज़े का साइन), सबसे प्रमुख पहले, अधिकतम 4 छोटे वाक्य। अगर कुछ नहीं दिखता तो बताएं।";

function getSystemPrompt(mode: "describe" | "read", lang: "en" | "hi"): string {
  if (mode === "describe") return lang === "hi" ? DESCRIBE_PROMPT_HI : DESCRIBE_PROMPT_EN;
  return lang === "hi" ? READ_PROMPT_HI : READ_PROMPT_EN;
}

function getLangInstruction(lang: "en" | "hi"): string {
  return lang === "hi"
    ? "Reply in simple Hindi using Devanagari script. Plain text only, no markdown or emoji."
    : "Reply in simple English. Plain text only, no markdown or emoji.";
}

// ─── Gemini ─────────────────────────────────────

async function callGemini(
  base64Image: string,
  mode: "describe" | "read",
  lang: "en" | "hi"
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const model = getModel("gemini");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const systemPrompt = getSystemPrompt(mode, lang);
  const langInstr = getLangInstruction(lang);

  const body = {
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        parts: [
          { text: langInstr },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 300,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: upstreamSignal(),
  });

  if (res.status === 429) {
    throw new UpstreamBusyError();
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown");
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}

// ─── Anthropic ──────────────────────────────────

async function callAnthropic(
  base64Image: string,
  mode: "describe" | "read",
  lang: "en" | "hi"
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const model = getModel("anthropic");
  const systemPrompt = getSystemPrompt(mode, lang);
  const langInstr = getLangInstruction(lang);

  const body = {
    model,
    max_tokens: 300,
    system: systemPrompt,
    messages: [
      {
        role: "user" as const,
        content: [
          {
            type: "image" as const,
            source: {
              type: "base64" as const,
              media_type: "image/jpeg" as const,
              data: base64Image,
            },
          },
          { type: "text" as const, text: langInstr },
        ],
      },
    ],
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
    signal: upstreamSignal(),
  });

  if (res.status === 429) {
    throw new UpstreamBusyError();
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown");
    throw new Error(`Anthropic API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text =
    data?.content?.[0]?.text?.trim() ?? "";
  if (!text) throw new Error("Anthropic returned empty response");
  return text;
}

// ─── Error types ────────────────────────────────

export class UpstreamBusyError extends Error {
  constructor() {
    super("Upstream rate limited");
    this.name = "UpstreamBusyError";
  }
}

// ─── Public interface ───────────────────────────

/**
 * Call the configured vision LLM with a base64 JPEG image.
 * Returns the plain-text description.
 * Throws UpstreamBusyError on 429 from the provider.
 */
export async function describeImage(
  base64Image: string,
  mode: "describe" | "read",
  lang: "en" | "hi"
): Promise<string> {
  const provider = getProvider();
  if (provider === "anthropic") {
    return callAnthropic(base64Image, mode, lang);
  }
  return callGemini(base64Image, mode, lang);
}
