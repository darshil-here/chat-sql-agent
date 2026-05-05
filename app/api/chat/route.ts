import { google, GoogleLanguageModelOptions } from "@ai-sdk/google";

import { streamText, UIMessage, convertToModelMessages } from "ai";

export const maxDuration = 120; // 2 minutes

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash-lite"),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
