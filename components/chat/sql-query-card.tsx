"use client";

import type { ToolUIPart } from "ai";
import type { ChatTools } from "@/lib/chat-contract";
import { CodeBlock } from "./code-block";
import { ToolStatusCard } from "./tool-status-card";

export function SqlQueryCard({ part }: { part: ToolUIPart<ChatTools> }) {
  const query = part.input?.query;
  const failed = part.state === "output-error";
  const output = part.state === "output-available" ? part.output : null;

  return (
    <ToolStatusCard
      title="Database Query Used"
      status={output ? "success" : failed ? "error" : "running"}
    >
      {query && <CodeBlock code={query} language="sql" />}
      {failed && (
        <p className="text-xs text-accent-danger">
          {part.errorText ?? "The query failed."}
        </p>
      )}
      {output && (
        <p className="text-xs text-text-secondary">
          Returned {output.rowCount} rows
          {output.truncated ? ` (showing first ${output.rows.length})` : ""}
        </p>
      )}
    </ToolStatusCard>
  );
}
