import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import z from "zod";
import { db } from "@/db/db";
import { getRAGContext } from "@/lib/sql-rag";

export const maxDuration = 120; // 2 minutes

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Get the last user message to build RAG context
  const lastUserMessage = messages
    .filter((m) => m.role === "user")
    .pop();
  const userQuestion = lastUserMessage
    ? lastUserMessage.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join(" ")
    : "";

  // Build RAG context from user question
  const ragContext = userQuestion
    ? await getRAGContext(userQuestion)
    : "No question provided yet.";

  const SYSTEM_PROMPT = `
  You are an expert SQLite AI data analyst.

  You help non-technical employees query company databases using natural language.

  You answer employee business questions by:
  1. Understanding the question
  2. Generating valid SQLite queries
  3. Executing the query
  4. Explaining the result

  You have access to a database query tool.

  RELEVANT TABLES AND SCHEMA:
  ${ragContext}

  IMPORTANT RULES:

  - ONLY use tables and columns shown in the schema above
  - NEVER invent column names
  - ONLY generate SELECT queries
  - NEVER generate DELETE, UPDATE, INSERT, DROP, ALTER, or TRUNCATE queries
  - Use SQLite syntax
  - Use joins when necessary
  - Return concise business-friendly answers
  - All database status values are lowercase
  - Example values: completed, pending, active, inactive, refunded

  If querying revenue:
  - Use orders.total_amount
  - Use orders.order_status

  If the query fails:
  - Explain the issue clearly
  - Try correcting the SQL query

  Before generating SQL:
  1. Review the schema above
  2. Identify relevant tables
  3. Generate valid SQLite SQL
  4. Execute query
  5. Explain results in plain English

  OUTPUT FORMAT:
  1. Show generated SQL
  2. Execute query
  3. Return concise natural language answer

  When returning analytics:
  - prefer human-readable names over IDs
  - use joins to retrieve names when possible
  `;

  const result = streamText({
    model: openrouter("openai/gpt-oss-120b:free"),
    messages: await convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    stopWhen: stepCountIs(10),
    tools: {
      db: tool({
        description: "Call this tool to query a database.",
        inputSchema: z.object({
          query: z.string().describe("The SQL query to be ran."),
        }),
        execute: async ({ query }) => {
          console.log("Query", query);

          const forbidden = [
            "DELETE",
            "UPDATE",
            "INSERT",
            "DROP",
            "ALTER",
            "TRUNCATE",
          ];

          const upper = query.toUpperCase();

          for (const word of forbidden) {
            if (upper.includes(word)) {
              throw new Error("Forbidden SQL operation");
            }
          }

          return await db.run(query);
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
