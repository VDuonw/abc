import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "@/features/messages/messages";

export async function getChatResponse(messages: Message[], apiKey: string) {
  if (!apiKey) {
    throw new Error("Invalid API Key");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
    systemInstruction: `Ngươi là Trưởng phòng Yamada (山田部長), một sếp người Nhật khó tính, nghiêm khắc nhưng chuyên nghiệp trong công ty thương mại Nhật Bản.
Người dùng là nhân viên cấp dưới mới vào công ty.
Nhiệm vụ của bạn:
1. Đánh giá câu thoại của người dùng xem họ có sử dụng Kính ngữ (Keigo: Sonkeigo, Kenjougo, Teineigo) phù hợp với bối cảnh giao tiếp cấp trên - cấp dưới hay không.
2. Nếu người dùng nói trống không (tameguchi), sai kính ngữ, hoặc im lặng quá lâu: Hãy trừ điểm thiện cảm (affection_change âm), tỏ thái độ tức giận/khó chịu (expression: "angry"), và chỉnh đốn nhân viên.
3. Nếu người dùng dùng kính ngữ chuẩn xác, lịch sự: Hãy khen ngợi, cộng điểm thiện cảm (affection_change dương), và biểu cảm hài lòng (expression: "happy" hoặc "neutral").

Hãy luôn phản hồi theo định dạng JSON với cấu trúc:
{
  "npc_reply": "Câu thoại tiếng Nhật của Trưởng phòng Yamada kèm ngữ điệu phù hợp",
  "affection_change": 0, // số nguyên thay đổi điểm thiện cảm, ví dụ -10, -5, +5, +10
  "expression": "neutral", // một trong các giá trị: "neutral", "happy", "angry", "sad", "relaxed"
  "user_mistakes": {
    "has_error": false,
    "detail": "Giải thích ngắn gọn lỗi kính ngữ nếu có bằng tiếng Việt"
  }
}`,
  });

  // Convert messages to Gemini chat history format (only user and model roles supported in history)
  const history = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const lastMessage = messages[messages.length - 1]?.content || "";
  const chat = model.startChat({
    history: history.slice(0, -1),
  });

  const result = await chat.sendMessage(lastMessage);
  const responseText = await result.response.text();
  return { message: responseText };
}

export async function getHintKeywords(messages: Message[], apiKey: string): Promise<string[]> {
  if (!apiKey) {
    throw new Error("Invalid API Key");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    },
    systemInstruction: `Bạn là trợ lý học tiếng Nhật. Dựa vào cuộc hội thoại giữa Trưởng phòng Yamada và nhân viên, hãy gợi ý 3 cụm từ/mẫu câu kính ngữ (Keigo) phù hợp nhất để nhân viên có thể sử dụng trả lời ngay lúc này.
Phản hồi bắt buộc là JSON mảng 3 chuỗi tiếng Nhật kèm phiên âm/nghĩa ngắn gọn:
{
  "keywords": [
    "承知いたしました (Tôi đã hiểu rõ ạ)",
    "かしこまりました (Tôi xin tuân lệnh ạ)",
    "少々お待ちいただけますでしょうか (Xin ngài vui lòng đợi một lát được không ạ)"
  ]
}`,
  });

  const contextText = messages
    .map((m) => `${m.role}: ${m.content}`)
    .slice(-4)
    .join("\n");

  const prompt = `Tình huống hiện tại:\n${contextText}\nHãy gợi ý 3 cụm từ kính ngữ phù hợp cho nhân viên trả lời.`;
  const result = await model.generateContent(prompt);
  const responseText = await result.response.text();
  try {
    const data = JSON.parse(responseText);
    return Array.isArray(data.keywords) ? data.keywords : ["承知いたしました", "かしこまりました", "申し訳ございません"];
  } catch {
    return ["承知いたしました", "かしこまりました", "申し訳ございません"];
  }
}

export async function getChatResponseStream(
  messages: Message[],
  apiKey: string
) {
  const { message } = await getChatResponse(messages, apiKey);
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(message));
      controller.close();
    },
  });
  return stream;
}
