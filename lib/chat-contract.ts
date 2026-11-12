import type { UIMessage } from "ai";
import { z } from "zod";

export const SQL_TOOL = "db";
export const SQL_TOOL_PART = `tool-${SQL_TOOL}` as const;
export const MAX_TOOL_ROWS = 200;

export const sqlQueryInput = z.object({
  query: z.string().describe("The SQL query to run."),
});

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  truncated: boolean;
}

export type ChatMode = "run" | "dryRun";

export type ChatTools = {
  [SQL_TOOL]: { input: z.infer<typeof sqlQueryInput>; output: QueryResult };
};

export type ChatUIMessage = UIMessage<never, never, ChatTools>;

export const chatRequestSchema = z.object({
  messages: z.array(z.unknown()),
  dryRun: z.boolean().optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
