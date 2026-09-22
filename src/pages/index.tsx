import { useCallback, useContext, useEffect, useState } from "react";
import VrmViewer from "@/components/vrmViewer";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import { Message, Screenplay } from "@/features/messages/messages";
import { speakCharacter } from "@/features/messages/speakCharacter";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { SYSTEM_PROMPT } from "@/features/constants/systemPromptConstants";
import { getChatResponse, getHintKeywords } from "@/features/chat/openAiChat";
import { Introduction } from "@/components/introduction";
import { Menu } from "@/components/menu";
import { Meta } from "@/components/meta";
import { HintModal } from "@/components/HintModal";
import { PostGameSummary } from "@/components/PostGameSummary";

export default function Home() {
  const { viewer } = useContext(ViewerContext);

  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT);
  const [openAiKey, setOpenAiKey] = useState("");
  const [chatProcessing, setChatProcessing] = useState(false);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [assistantMessage, setAssistantMessage] = useState("");

  // Game states
  const [affection, setAffection] = useState(100);
  const [timerActive, setTimerActive] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [hintKeywords, setHintKeywords] = useState<string[]>([]);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);

  // Track mistake history and turn count
  type Mistake = {
    wrong: string;
    correct: string;
    detail: string;
  };
  const [mistakeHistory, setMistakeHistory] = useState<Mistake[]>([]);
  const [turnCount, setTurnCount] = useState(0);
  const [gameResult, setGameResult] = useState<"Win" | "Lose" | null>(null);

  // Load persisted params + API key
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("chatVRMParams");
      if (stored) {
        try {
          const params = JSON.parse(stored);
          setSystemPrompt(params.systemPrompt ?? SYSTEM_PROMPT);
          setChatLog(params.chatLog ?? []);
        } catch (e) {
          console.error(e);
        }
      }
      const apiKey = window.localStorage.getItem("chatVRMApiKey");
      if (apiKey) setOpenAiKey(apiKey);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "chatVRMParams",
        JSON.stringify({ systemPrompt, chatLog })
      );
    }
  }, [systemPrompt, chatLog]);

  useEffect(() => {
    if (typeof window !== "undefined" && openAiKey) {
      window.localStorage.setItem("chatVRMApiKey", openAiKey);
    }
  }, [openAiKey]);

  const handleChangeChatLog = useCallback(
    (targetIndex: number, text: string) => {
      const newLog = chatLog.map((v, i) =>
        i === targetIndex ? { role: v.role, content: text } : v
      );
      setChatLog(newLog);
    },
    [chatLog]
  );

  const handleSpeakAi = useCallback(
    async (
      screenplay: Screenplay,
      onStart?: () => void,
      onEnd?: () => void
    ) => {
      speakCharacter(screenplay, viewer, onStart, onEnd);
    },
    [viewer]
  );

  const handleSendChat = useCallback(
    async (text: string, isAutoTimeout: boolean = false) => {
      if (!openAiKey) {
        setAssistantMessage("Vui lòng nhập API Key.");
        return;
      }
      if (!text) return;

      // Stop timer while processing
      setTimerActive(false);
      setChatProcessing(true);

      const newLog: Message[] = [...chatLog, { role: "user", content: text }];
      setChatLog(newLog);

      const messages: Message[] = [
        { role: "system", content: systemPrompt },
        ...newLog,
      ];

      try {
        const result = await getChatResponse(messages, openAiKey);
        if (!result) return;

        let data: any = {};
        try {
          data = JSON.parse(result.message);
        } catch (e) {
          console.error("JSON parse error", e);
          data = {
            npc_reply: result.message,
            affection_change: isAutoTimeout ? -10 : 0,
            expression: isAutoTimeout ? "angry" : "neutral",
            user_mistakes: null,
          };
        }

        const { npc_reply, affection_change, expression, user_mistakes } = data;

        // Update affection
        setAffection((prev) => {
          const delta = isAutoTimeout ? -10 : (affection_change ?? 0);
          return Math.max(0, Math.min(100, prev + delta));
        });

        // Record mistakes if present
        if (user_mistakes && user_mistakes.has_error) {
          const entry: Mistake = {
            wrong: user_mistakes.wrong || "",
            correct: user_mistakes.correct || "",
            detail: user_mistakes.detail || "",
          };
          setMistakeHistory((h) => [...h, entry]);
        }

        // Build NPC screenplay
        const npcScreenplay: Screenplay = {
          expression: (expression ||
            (isAutoTimeout ? "angry" : "neutral")) as any,
          talk: {
            style:
              expression === "angry" || isAutoTimeout ? "angry" : "talk",
            speakerX: 0,
            speakerY: 0,
            message: npc_reply,
          },
        };

        setAssistantMessage(npc_reply);
        // Speak and restart timer after speech ends
        handleSpeakAi(
          npcScreenplay,
          () => setAssistantMessage(npc_reply),
          () => {
            // Increment turn count only after NPC finishes speaking
            setTurnCount((c) => c + 1);
            setTimerResetKey((k) => k + 1);
            setTimerActive(true);
          }
        );

        const assistantMsg: Message = {
          role: "assistant",
          content: npc_reply,
        };
        setChatLog([...newLog, assistantMsg]);
      } catch (e) {
        console.error(e);
      } finally {
        setChatProcessing(false);
      }
    },
    [systemPrompt, chatLog, handleSpeakAi, openAiKey]
  );

  // Timer timeout -> user silent
  const handleTimerTimeout = useCallback(() => {
    if (chatProcessing) return;
    handleSendChat("[USER_SILENT]", true);
  }, [chatProcessing, handleSendChat]);

  // Hint button handler
  const handleHint = useCallback(async () => {
    if (!openAiKey) {
      alert("Vui lòng nhập API Key.");
      return;
    }
    setTimerActive(false);
    setAffection((p) => Math.max(0, p - 5));
    setIsHintOpen(true);
    setIsHintLoading(true);
    try {
      const keywords = await getHintKeywords(chatLog, openAiKey);
      setHintKeywords(keywords);
    } catch (e) {
      console.error(e);
      setHintKeywords([
        "承知いたしました",
        "かしこまりました",
        "申し訳ございません",
      ]);
    } finally {
      setIsHintLoading(false);
    }
  }, [chatLog, openAiKey]);

  const handleCloseHint = useCallback(() => {
    setIsHintOpen(false);
    setTimerActive(true);
  }, []);

  const handleSelectKeyword = useCallback(
    (kw: string) => {
      setIsHintOpen(false);
      const clean = kw.split("(")[0].trim();
      handleSendChat(clean);
    },
    [handleSendChat]
  );

  // Detect game end conditions
  useEffect(() => {
    if (gameResult) return;
    if (affection <= 0) {
      setGameResult("Lose");
      setTimerActive(false);
    } else if (turnCount >= 5) {
      setGameResult("Win");
      setTimerActive(false);
    }
  }, [affection, turnCount, gameResult]);

  // Restart handler
  const handleRestart = useCallback(() => {
    setAffection(100);
    setTimerActive(false);
    setTimerResetKey(0);
    setChatLog([]);
    setAssistantMessage("");
    setMistakeHistory([]);
    setTurnCount(0);
    setGameResult(null);
    setHintKeywords([]);
    setIsHintOpen(false);
  }, []);

  // Render UI – hide main chat when game ended
  const inGame = gameResult === null;

  return (
    <div className="font-M_PLUS_2">
      <Meta />
      <Introduction openAiKey={openAiKey} onChangeAiKey={setOpenAiKey} />
      <VrmViewer />

      {/* ===== Visual Novel Dialog Box (NPC subtitle) ===== */}
      {assistantMessage && inGame && (
        <div className="fixed bottom-36 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-2xl animate-fade-in pointer-events-none">
          <div className="relative bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-2xl">
            {/* Character name badge */}
            <div className="absolute -top-3 left-5">
              <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-extrabold px-4 py-1 rounded-full shadow-lg">
                山田部長
              </span>
            </div>
            {/* Dialog text */}
            <div className="mt-1 text-white text-sm leading-relaxed font-medium">
              {assistantMessage}
            </div>
            {/* Decorative bottom dots (typing indicator style) */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      )}

      {/* Game UI */}
      {inGame ? (
        <>
          <MessageInputContainer
            isChatProcessing={chatProcessing}
            onChatProcessStart={(t) => handleSendChat(t)}
            affection={affection}
            timerActive={timerActive}
            timerResetKey={timerResetKey}
            onTimerTimeout={handleTimerTimeout}
            onHint={handleHint}
          />
          <HintModal
            isOpen={isHintOpen}
            isLoading={isHintLoading}
            keywords={hintKeywords}
            onClose={handleCloseHint}
            onSelectKeyword={handleSelectKeyword}
          />
          <Menu
            openAiKey={openAiKey}
            systemPrompt={systemPrompt}
            chatLog={chatLog}
            assistantMessage={assistantMessage}
            onChangeAiKey={setOpenAiKey}
            onChangeSystemPrompt={setSystemPrompt}
            onChangeChatLog={handleChangeChatLog}
            handleClickResetChatLog={() => {
              setChatLog([]);
              setAffection(100);
              setTimerActive(false);
            }}
            handleClickResetSystemPrompt={() => setSystemPrompt(SYSTEM_PROMPT)}
          />
        </>
      ) : (
        <PostGameSummary
          result={gameResult!}
          affection={affection}
          mistakes={mistakeHistory}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
