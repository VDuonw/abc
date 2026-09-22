import { useState, useCallback } from "react";

type Props = {
  openAiKey: string;
  onChangeAiKey: (openAiKey: string) => void;
};

export const Introduction = ({ openAiKey, onChangeAiKey }: Props) => {
  const [opened, setOpened] = useState(true);

  const handleAiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeAiKey(event.target.value);
    },
    [onChangeAiKey]
  );

  if (!opened) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in font-M_PLUS_2">
      <div className="relative w-full max-w-lg glass-card p-8 shadow-2xl">
        {/* Decorative top accent */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500" />

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gradient mb-2 tracking-tight">
            敬語マスター
          </h1>
          <p className="text-sm text-white/60 font-medium">
            Keigo Master — Japanese Honorific Speaking Game
          </p>
        </div>

        {/* Game description */}
        <div className="glass-card-light p-4 mb-6">
          <p className="text-white/80 text-sm leading-relaxed">
            🎌 Bạn là nhân viên mới tại một công ty Nhật Bản. Hãy giao tiếp với{" "}
            <span className="text-amber-300 font-bold">Trưởng phòng Yamada (山田部長)</span>{" "}
            bằng Kính ngữ (Keigo) chuẩn xác để giữ điểm thiện cảm!
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              5 lượt hội thoại
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              15s / lượt
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Chỉ nói bằng mic
            </span>
          </div>
        </div>

        {/* Gemini API Key Input */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-white/80 mb-2">
            🔑 Gemini API Key
          </label>
          <input
            type="password"
            placeholder="AIza..."
            value={openAiKey}
            onChange={handleAiKeyChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/40 transition-all text-sm"
          />
          <p className="mt-2 text-xs text-white/40">
            Lấy API key miễn phí tại{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
            >
              Google AI Studio
            </a>
            . Key được xử lý trực tiếp trên trình duyệt, không lưu trên server.
          </p>
        </div>

        {/* Start Game Button */}
        <button
          onClick={() => setOpened(false)}
          disabled={!openAiKey.trim()}
          className="w-full py-4 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-lg
            disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed disabled:shadow-none
            enabled:bg-gradient-to-r enabled:from-amber-500 enabled:via-orange-500 enabled:to-rose-500
            enabled:text-white enabled:hover:shadow-amber-500/30 enabled:hover:shadow-xl enabled:hover:scale-[1.02]
            enabled:active:scale-[0.98]"
        >
          {openAiKey.trim() ? "🎮 Start Game" : "🔒 Nhập API Key để bắt đầu"}
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-white/25 mt-4">
          Powered by Gemini 2.5 Flash • @pixiv/three-vrm
        </p>
      </div>
    </div>
  );
};
