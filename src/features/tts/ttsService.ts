/**
 * TTS Service — Text-to-Speech abstraction layer
 *
 * Strategy:
 *  1. Try VOICEVOX public API (free, no key needed) → returns ArrayBuffer for real lip-sync
 *  2. Fallback to Web Speech API → returns null (lip-sync will be simulated)
 */

const VOICEVOX_API = "https://api.tts.quest/v3/voicevox/synthesis";
const VOICEVOX_SPEAKER = 3; // ずんだもん (Zundamon) — natural female voice

/**
 * Attempt to synthesize speech via VOICEVOX public API.
 * Returns ArrayBuffer of WAV audio on success, or null on failure.
 */
async function synthesizeWithVoicevox(text: string): Promise<ArrayBuffer | null> {
  try {
    const params = new URLSearchParams({
      text,
      speaker: String(VOICEVOX_SPEAKER),
    });

    const res = await fetch(`${VOICEVOX_API}?${params.toString()}`, {
      method: "GET",
    });

    if (!res.ok) {
      console.warn(`[TTS] VOICEVOX API returned ${res.status}, falling back...`);
      return null;
    }

    const data = await res.json();

    // The API returns JSON with mp3StreamingUrl or wavDownloadUrl
    if (data.wavDownloadUrl) {
      const audioRes = await fetch(data.wavDownloadUrl);
      if (!audioRes.ok) return null;
      return await audioRes.arrayBuffer();
    }

    if (data.mp3StreamingUrl) {
      const audioRes = await fetch(data.mp3StreamingUrl);
      if (!audioRes.ok) return null;
      return await audioRes.arrayBuffer();
    }

    console.warn("[TTS] VOICEVOX response missing audio URL", data);
    return null;
  } catch (err) {
    console.warn("[TTS] VOICEVOX failed:", err);
    return null;
  }
}

/**
 * Speak text using Web Speech API (browser built-in).
 * Returns a Promise that resolves when speech ends.
 * The onBoundary callback fires during speech for lip-sync simulation.
 */
export function speakWithWebSpeechAPI(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onBoundary?: (event: SpeechSynthesisEvent) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.warn("[TTS] Web Speech API not available");
      onEnd?.();
      resolve();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    // Try to find a Japanese voice
    const voices = window.speechSynthesis.getVoices();
    const japaneseVoice = voices.find(
      (v) => v.lang === "ja-JP" || v.lang.startsWith("ja")
    );
    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      onEnd?.();
      resolve();
    };

    utterance.onerror = (event) => {
      console.error("[TTS] Web Speech API error:", event);
      onEnd?.();
      resolve(); // resolve anyway to not block the game
    };

    if (onBoundary) {
      utterance.onboundary = onBoundary;
    }

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Main TTS entry point.
 *
 * Attempts VOICEVOX first (returns ArrayBuffer for real lip-sync),
 * falls back to Web Speech API (returns null — caller should use simulated lip-sync).
 */
export async function synthesizeSpeech(text: string): Promise<ArrayBuffer | null> {
  if (!text || text.trim().length === 0) return null;

  // Try VOICEVOX first
  const buffer = await synthesizeWithVoicevox(text);
  if (buffer) {
    return buffer;
  }

  // Will use Web Speech API as fallback — return null to signal caller
  return null;
}
