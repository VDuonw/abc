import React, { useState } from "react";
import { Message } from "@/features/messages/messages";

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

// ── Design tokens (mirror the CSS :root vars) ──────────────────────────────
const T = {
  bg0: "#0c0a16",
  bg1: "#130f22",
  panel: "#181330",
  panel2: "#1e1836",
  field: "#231c42",
  border: "rgba(255,255,255,0.08)",
  borderSt: "rgba(255,255,255,0.16)",
  text1: "#f4f2fb",
  text2: "#a79fc4",
  text3: "#726b8f",
  pink: "#ff5f8f",
  pinkDim: "#ff5f8f22",
  orange: "#ffb648",
  lav: "#9d8cf5",
  lavDim: "#9d8cf522",
  teal: "#3fd6ae",
  tealDim: "#3fd6ae22",
  red: "#ff6b6b",
  redDim: "#ff6b6b22",
  amber: "#ffc247",
  amberDim: "#ffc24722",
  blue: "#5ba8ff",
  blueDim: "#5ba8ff22",
};

const CHIPS = [
  { label: "neutral — bình thường", dot: T.text3, bg: T.field, color: T.text2, border: T.border },
  { label: "happy — vui vẻ", dot: T.amber, bg: T.amberDim, color: T.amber, border: "transparent" },
  { label: "angry — tức giận", dot: T.red, bg: T.redDim, color: T.red, border: "transparent" },
  { label: "sad — buồn bã", dot: T.blue, bg: T.blueDim, color: T.blue, border: "transparent" },
  { label: "relaxed — thư giãn", dot: T.teal, bg: T.tealDim, color: T.teal, border: "transparent" },
];

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
  const [showKey, setShowKey] = useState(false);

  return (
    /* Overlay */
    <div
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
      className="fixed inset-0 z-40 flex items-center justify-center px-4 animate-fade-in"
    >
      {/* Stage */}
      <div style={{ position: "relative", width: "100%", maxWidth: 880 }}>

        {/* Glow accent */}
        <div style={{
          position: "absolute", top: -60, right: -40,
          width: 340, height: 340,
          background: "radial-gradient(circle, #ff5f8f30 0%, transparent 70%)",
          filter: "blur(10px)", pointerEvents: "none",
        }} />

        {/* Modal */}
        <div style={{
          background: `linear-gradient(180deg, ${T.panel} 0%, ${T.bg1} 100%)`,
          border: `1px solid ${T.border}`,
          borderRadius: 20,
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
          overflow: "hidden",
          fontFamily: "'Inter', sans-serif",
          color: T.text1,
        }}>

          {/* ── Titlebar ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "22px 26px",
            borderBottom: `1px solid ${T.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Icon badge */}
              <div style={{
                width: 38, height: 38, borderRadius: 11,
                background: T.lavDim,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: T.lav, flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 700, fontSize: 22, margin: 0,
                background: `linear-gradient(90deg, ${T.pink}, ${T.orange})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Cài đặt Game
              </h1>
            </div>

            {/* Close button */}
            <button
              onClick={onClickClose}
              aria-label="Đóng"
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "transparent",
                border: `1px solid ${T.border}`,
                color: T.text2,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                transition: "background .15s, color .15s, border-color .15s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = T.field;
                (e.currentTarget as HTMLButtonElement).style.color = T.text1;
                (e.currentTarget as HTMLButtonElement).style.borderColor = T.borderSt;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = T.text2;
                (e.currentTarget as HTMLButtonElement).style.borderColor = T.border;
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Content ── */}
          <div style={{ padding: "24px 26px 26px", display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Row: 2 columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18 }}>

              {/* Card: API Key */}
              <div style={{ background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: "'Baloo 2',sans-serif", fontWeight: 600, fontSize: 15, color: T.text1, marginBottom: 14 }}>
                  <span style={{ color: T.pink, display: "flex" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
                    </svg>
                  </span>
                  Gemini API key
                </div>

                <label style={{ display: "block", fontSize: 12.5, color: T.text2, marginBottom: 7 }} htmlFor="settings-apikey">
                  Khóa API
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="settings-apikey"
                    type={showKey ? "text" : "password"}
                    placeholder="AIza..."
                    value={openAiKey}
                    onChange={onChangeAiKey}
                    style={{
                      width: "100%",
                      background: T.field,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      padding: "11px 40px 11px 13px",
                      fontFamily: "'Inter',sans-serif",
                      fontSize: 14,
                      color: T.text1,
                      outline: "none",
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = T.lav;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${T.lavDim}`;
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    aria-label="Hiện khóa"
                    style={{
                      position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                      color: T.text3, cursor: "pointer", background: "none", border: "none", padding: 4, display: "flex",
                    }}
                  >
                    {showKey ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                <p style={{ fontSize: 12.5, color: T.text3, marginTop: 9, marginBottom: 0 }}>
                  Lấy khóa miễn phí tại{" "}
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: T.lav, textDecoration: "none", fontWeight: 500 }}
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>

              {/* Card: Character Model */}
              <div style={{ background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: "'Baloo 2',sans-serif", fontWeight: 600, fontSize: 15, color: T.text1, marginBottom: 14 }}>
                  <span style={{ color: T.pink, display: "flex" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  Mô hình nhân vật
                </div>

                {/* Avatar row */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {/* Avatar thumb — gradient mimicking the face shape */}
                  <div style={{
                    width: 56, height: 56, borderRadius: 8,
                    background: "radial-gradient(circle at 50% 30%, #ffd8b0 0%, #f5a97f 45%, transparent 46%), linear-gradient(160deg, #3a2f5c, #241a3d)",
                    border: `1px solid ${T.border}`,
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: T.text1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      User.vrm
                    </div>
                    <div style={{ fontSize: 12, color: T.text3, marginTop: 2 }}>
                      Chưa có tệp nào khác được tải
                    </div>
                  </div>
                </div>

                {/* Open VRM button */}
                <button
                  onClick={onClickOpenVrmFile}
                  style={{
                    marginTop: 14,
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 13.5,
                    padding: "9px 16px", borderRadius: 999, border: "none", cursor: "pointer",
                    background: `linear-gradient(90deg, ${T.pink}, #ff8f6b)`,
                    color: "#2a0e1a",
                    transition: "filter .15s, transform .1s",
                    width: "100%",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.08)")}
                  onMouseLeave={e => (e.currentTarget.style.filter = "none")}
                  onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
                  onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <path d="M17 8l-5-5-5 5" />
                    <path d="M12 3v12" />
                  </svg>
                  Mở tệp VRM
                </button>
              </div>
            </div>

            {/* Card: System Prompt */}
            <div style={{ background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: "'Baloo 2',sans-serif", fontWeight: 600, fontSize: 15, color: T.text1 }}>
                  <span style={{ color: T.pink, display: "flex" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17v3z" />
                    </svg>
                  </span>
                  System prompt
                </div>

                {/* Đặt lại button */}
                <button
                  onClick={onClickResetSystemPrompt}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 13.5,
                    padding: "9px 16px", borderRadius: 999, border: `1px solid ${T.border}`, cursor: "pointer",
                    background: T.field, color: T.text2,
                    transition: "filter .15s, transform .1s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = T.text1;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = T.borderSt;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = T.text2;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = T.border;
                  }}
                  onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
                  onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 4v6h-6" />
                    <path d="M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                  Đặt lại
                </button>
              </div>

              <textarea
                value={systemPrompt}
                onChange={onChangeSystemPrompt}
                style={{
                  width: "100%", minHeight: 120, resize: "vertical",
                  background: T.field,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  padding: "13px 14px",
                  fontFamily: "'Inter',sans-serif",
                  fontSize: 13.5, lineHeight: 1.65,
                  color: T.text1, outline: "none",
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = T.lav;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${T.lavDim}`;
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              />

              {/* Emotion chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {CHIPS.map((chip) => (
                  <span
                    key={chip.label}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      fontSize: 12.5, fontWeight: 500,
                      padding: "6px 12px 6px 8px",
                      borderRadius: 999,
                      border: `1px solid ${chip.border}`,
                      background: chip.bg,
                      color: chip.color,
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: chip.dot, display: "inline-block", flexShrink: 0 }} />
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Chat Log (if exists) */}
            {chatLog.length > 0 && (
              <div style={{ background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: "'Baloo 2',sans-serif", fontWeight: 600, fontSize: 15, color: T.text1 }}>
                    <span style={{ color: T.teal, display: "flex" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </span>
                    Lịch sử hội thoại
                  </div>
                  <button
                    onClick={onClickResetChatLog}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 13.5,
                      padding: "9px 16px", borderRadius: 999, border: `1px solid ${T.border}`, cursor: "pointer",
                      background: T.field, color: T.text2,
                    }}
                  >
                    Xóa lịch sử
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflowY: "auto" }}>
                  {chatLog.map((value, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, width: 48, flexShrink: 0, color: value.role === "assistant" ? T.amber : T.blue }}>
                        {value.role === "assistant" ? "NPC" : "You"}
                      </span>
                      <input
                        type="text"
                        value={value.content}
                        onChange={(e) => onChangeChatLog(index, e.target.value)}
                        style={{
                          flex: 1, background: T.field, border: `1px solid ${T.border}`,
                          borderRadius: 8, padding: "8px 12px",
                          fontFamily: "'Inter',sans-serif", fontSize: 13.5,
                          color: T.text2, outline: "none",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div style={{
            display: "flex", justifyContent: "flex-end", gap: 10,
            padding: "18px 26px",
            borderTop: `1px solid ${T.border}`,
            background: T.bg1,
          }}>
            {/* Hủy */}
            <button
              onClick={onClickClose}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 13.5,
                padding: "9px 16px", borderRadius: 999,
                border: `1px solid ${T.border}`, cursor: "pointer",
                background: T.field, color: T.text2,
                transition: "filter .15s, transform .1s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = T.text1;
                (e.currentTarget as HTMLButtonElement).style.borderColor = T.borderSt;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = T.text2;
                (e.currentTarget as HTMLButtonElement).style.borderColor = T.border;
              }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Hủy
            </button>

            {/* Lưu thay đổi */}
            <button
              onClick={onClickClose}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "'Inter',sans-serif", fontWeight: 500, fontSize: 13.5,
                padding: "9px 16px", borderRadius: 999, border: "none", cursor: "pointer",
                background: `linear-gradient(90deg, ${T.pink}, #ff8f6b)`,
                color: "#2a0e1a",
                transition: "filter .15s, transform .1s",
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.08)")}
              onMouseLeave={e => (e.currentTarget.style.filter = "none")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
