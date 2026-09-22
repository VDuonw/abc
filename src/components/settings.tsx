import React from "react";
import { IconButton } from "./iconButton";
import { TextButton } from "./textButton";
import { Message } from "@/features/messages/messages";
import { Link } from "./link";

type Props = {
  openAiKey: string;
  systemPrompt: string;
  chatLog: Message[];
  onClickClose: () => void;
  onChangeAiKey: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSystemPrompt: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeChatLog: (index: number, text: string) => void;
  onClickOpenVrmFile: () => void;
  onClickResetChatLog: () => void;
  onClickResetSystemPrompt: () => void;
};

export const Settings = ({
  openAiKey,
  chatLog,
  systemPrompt,
  onClickClose,
  onChangeSystemPrompt,
  onChangeAiKey,
  onChangeChatLog,
  onClickOpenVrmFile,
  onClickResetChatLog,
  onClickResetSystemPrompt,
}: Props) => {
  return (
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xl animate-fade-in">
      {/* Close button */}
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={onClickClose}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="max-h-full overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-16 text-white">
          <h2 className="text-2xl font-extrabold text-gradient mb-8">⚙️ Cài đặt Game</h2>

          {/* Gemini API Key */}
          <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-bold text-amber-300 mb-3">🔑 Gemini API Key</h3>
            <input
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/60 text-sm"
              type="password"
              placeholder="AIza..."
              value={openAiKey}
              onChange={onChangeAiKey}
            />
            <p className="mt-2 text-xs text-white/40">
              Lấy key miễn phí tại{" "}
              <Link url="https://aistudio.google.com/apikey" label="Google AI Studio" />
            </p>
          </div>

          {/* Character Model */}
          <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-bold text-purple-300 mb-3">🧑‍💼 Mô hình nhân vật</h3>
            <TextButton onClick={onClickOpenVrmFile}>Mở file VRM</TextButton>
          </div>

          {/* System Prompt */}
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-blue-300">📝 System Prompt</h3>
              <TextButton onClick={onClickResetSystemPrompt}>
                Reset
              </TextButton>
            </div>
            <textarea
              value={systemPrompt}
              onChange={onChangeSystemPrompt}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white/80 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/60 h-40 text-sm resize-y"
            />
          </div>

          {/* Chat Log */}
          {chatLog.length > 0 && (
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-green-300">💬 Lịch sử hội thoại</h3>
                <TextButton onClick={onClickResetChatLog}>
                  Xóa lịch sử
                </TextButton>
              </div>
              <div className="space-y-2 max-h-60 overflow-auto scroll-hidden">
                {chatLog.map((value, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3"
                  >
                    <span className={`text-xs font-bold shrink-0 w-16 ${value.role === "assistant" ? "text-amber-400" : "text-blue-400"}`}>
                      {value.role === "assistant" ? "NPC" : "You"}
                    </span>
                    <input
                      className="flex-1 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 text-sm text-white/70 border border-white/10"
                      type="text"
                      value={value.content}
                      onChange={(event) => {
                        onChangeChatLog(index, event.target.value);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
