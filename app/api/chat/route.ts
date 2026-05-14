import { google, GoogleLanguageModelOptions } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from "ai";
import z from "zod";
import { db } from "@/db/db";

export const maxDuration = 120; // 2 minutes

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using natural language.

    ${new Date().toLocaleString("sv-SE")}
    You have access to following tools:
    1. db tool - call this tool to query the database.
    2. schema tool - call this tool to get the database schema which will help you to write sql query.

    Rules:
    - Generate ONLY SELECT queries (no INSERT, UPDATE, DELETE, DROP)
    - Always use the schema provided by the schema tool
    - Pass in valid SQL syntax in db tool.
    - IMPORTANT: To query database call db tool, Don't return just SQL query.

    Always respond in a helpful, conversational tone while being technically accurate.`;

  const result = streamText({
    model: google("gemini-2.5-flash-lite"),
    messages: await convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
    stopWhen: stepCountIs(10),
    tools: {
      schema: tool({
        description: "Call this tool to get database schema information.",
        inputSchema: z.object({}),
        execute: async () => {
          return ``;
        },
      }),
      db: tool({
        description: "Call this tool to query a database.",
        inputSchema: z.object({
          query: z.string().describe("The SQL query to be ran."),
        }),
        execute: async ({ query }) => {
          console.log("Query", query);
          // Important: make sure you sanitize / validate (somehow) check the query
          // string search [delete, update] -> Guardrails
          return await db.run(query);
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
