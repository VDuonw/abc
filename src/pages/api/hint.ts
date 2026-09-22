import type { NextApiRequest, NextApiResponse } from "next";
import { getHintKeywords } from "@/features/chat/openAiChat";
import { Message } from "@/features/messages/messages";

type Data = {
  keywords?: string[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, apiKey } = req.body as {
    messages?: Message[];
    apiKey?: string;
  };

  if (!apiKey) {
    return res.status(400).json({ error: "API Key is required" });
  }

  try {
    const keywords = await getHintKeywords(messages || [], apiKey);
    return res.status(200).json({ keywords });
  } catch (error: any) {
    console.error("Hint API error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate hints" });
  }
}
