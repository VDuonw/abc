import { AffectionBar } from "./AffectionBar";
import { CountdownTimer } from "./CountdownTimer";
import { useState, useEffect, useCallback } from "react";

type Props = {
  isChatProcessing: boolean;
  onChatProcessStart: (text: string) => void;
  affection: number;
  timerActive: boolean;
  timerResetKey: number;
  onTimerTimeout: () => void;
  onHint: () => void;
};

/**
 * Game layout overlay on top of 3D canvas:
 * - Top: transparent header with AffectionBar (left) + CountdownTimer (right)
 * - Bottom: control bar with Mic + Hint buttons
 */
export const MessageInputContainer = ({
  isChatProcessing,
  onChatProcessStart,
  affection,
  timerActive,
  timerResetKey,
  onTimerTimeout,
  onHint,
}: Props) => {
  const [userMessage, setUserMessage] = useState("");
  const [speechRecognition, setSpeechRecognition] =
    useState<SpeechRecognition>();
  const [isMicRecording, setIsMicRecording] = useState(false);

  // Speech recognition
  const handleRecognitionResult = useCallback(
    (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      setUserMessage(text);

      if (event.results[0].isFinal) {
        setUserMessage(text);
        onChatProcessStart(text);
      }
    },
    [onChatProcessStart]
  );

  const handleRecognitionEnd = useCallback(() => {
    setIsMicRecording(false);
  }, []);

  const handleClickMicButton = useCallback(() => {
    if (isMicRecording) {
      speechRecognition?.abort();
      setIsMicRecording(false);
      return;
    }

    try {
      speechRecognition?.start();
      setIsMicRecording(true);
    } catch (e) {
      console.error("Speech recognition start error:", e);
    }
  }, [isMicRecording, speechRecognition]);

  useEffect(() => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.addEventListener("result", handleRecognitionResult);
    recognition.addEventListener("end", handleRecognitionEnd);

    setSpeechRecognition(recognition);
  }, [handleRecognitionResult, handleRecognitionEnd]);

  useEffect(() => {
    if (!isChatProcessing) {
      setUserMessage("");
    }
  }, [isChatProcessing]);

  return (
    <>
      {/* ========= TOP HEADER BAR (transparent) ========= */}
      <div className="fixed top-0 left-0 right-0 z-20 p-4 pointer-events-none">
        <div className="max-w-5xl mx-auto flex items-start justify-between pointer-events-auto">
          {/* Left: Affection Bar */}
          <div className="ml-14">
            <AffectionBar affection={affection} />
          </div>

          {/* Right: Countdown Timer */}
          <CountdownTimer
            active={timerActive}
            onTimeout={onTimerTimeout}
            resetKey={timerResetKey}
          />
        </div>
      </div>

      {/* ========= BOTTOM CONTROL BAR ========= */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pb-6 pt-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
        <div className="flex flex-col items-center gap-3 pointer-events-auto">
          {/* Live speech transcript */}
          {userMessage && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-2xl font-bold text-sm shadow-lg animate-fade-in max-w-md truncate">
              🗣️ {userMessage}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-6">
            {/* Microphone button */}
            <button
              onClick={handleClickMicButton}
              disabled={isChatProcessing}
              className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl disabled:opacity-40 disabled:cursor-not-allowed ${
                isMicRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse-red ring-4 ring-red-400/50 scale-110"
                  : "bg-emerald-500 hover:bg-emerald-400 hover:shadow-emerald-500/30 hover:shadow-2xl active:scale-95"
              }`}
            >
              {/* Mic SVG icon */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>

              {/* Recording pulse rings */}
              {isMicRecording && (
                <>
                  <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
                </>
              )}
            </button>

            {/* Hint button */}
            <button
              onClick={onHint}
              disabled={isChatProcessing}
              className="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-amber-500/30 hover:shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {/* Lightbulb SVG icon */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
              </svg>
            </button>
          </div>

          {/* Button labels */}
          <div className="flex items-center gap-10 -mt-1">
            <span className="text-xs font-bold text-white/50">
              {isMicRecording ? "Đang nghe..." : "Nhấn để nói"}
            </span>
            <span className="text-xs font-bold text-white/50">
              Gợi ý (-5đ)
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
