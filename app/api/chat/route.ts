import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  convertToModelMessages,
  isStepCount,
  safeValidateUIMessages,
  streamText,
  tool,
} from "ai";
import { runReadOnlyQuery } from "@/lib/db-query";
import { buildInstructions } from "@/lib/prompts";
import { getRAGContext } from "@/lib/sql-rag";
import { requireEnv } from "@/lib/env";
import {
  chatRequestSchema,
  MAX_TOOL_ROWS,
  SQL_TOOL,
  sqlQueryInput,
  type ChatUIMessage,
} from "@/lib/chat-contract";

export const maxDuration = 300; // The free model can take up to five minutes.

const MODEL = "nvidia/nemotron-3.5-super-vl:free";
const RECENT_QUESTIONS = 3;
const MAX_STEPS = 10;

const dbTool = tool({
  description: `Run a read-only SQLite query. Results are capped at ${MAX_TOOL_ROWS} rows.`,
  inputSchema: sqlQueryInput,
  execute: ({ query }) => runReadOnlyQuery(query),
});

function getRecentQuestions(messages: ChatUIMessage[]): string {
  return messages
    .filter((message) => message.role === "user")
    .slice(-RECENT_QUESTIONS)
    .map((message) =>
      message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join(" "),
    )
    .filter(Boolean)
    .join(" ");
}

export async function POST(req: Request) {
  const body = chatRequestSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) {
    return Response.json({ error: "Invalid chat request." }, { status: 400 });
  }

  const { dryRun = false } = body.data;

  const parsed = await safeValidateUIMessages<ChatUIMessage>({
    messages: body.data.messages,
  });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.message }, { status: 400 });
  }

  const messages = parsed.data;
  const mode = dryRun ? "dryRun" : "run";
  const schema = await getRAGContext(getRecentQuestions(messages));

  const openrouter = createOpenRouter({
    apiKey: requireEnv("OPENROUTER_API_KEY"),
  });

  const result = streamText({
    model: openrouter(MODEL),
    messages: await convertToModelMessages(messages),
    instructions: buildInstructions({ schema, mode }),
    stopWhen: isStepCount(mode === "run" ? MAX_STEPS : 1),
    tools: mode === "run" ? { [SQL_TOOL]: dbTool } : undefined,
  });

  return result.toUIMessageStreamResponse();
}
