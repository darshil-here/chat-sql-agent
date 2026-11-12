"use client";

import type { ToolUIPart } from "ai";
import type { ChatTools } from "@/lib/chat-contract";
import { CodeBlock } from "./code-block";
import { ToolStatusCard } from "./tool-status-card";

export function SqlQueryCard({ part }: { part: ToolUIPart<ChatTools> }) {
  const query = part.input?.query;
  const failed = part.state === "output-error";
  const output = part.state === "output-available" ? part.output : null;

  const rowLabel = output
    ? `${output.rowCount} ${output.rowCount === 1 ? "row" : "rows"}${
        output.truncated ? ` · first ${output.rows.length}` : ""
      }`
    : undefined;

  return (
    <ToolStatusCard
      title="Database Query Used"
      status={output ? "success" : failed ? "error" : "running"}
      meta={rowLabel}
    >
      {query && <CodeBlock code={query} language="sql" />}
      {failed && (
        <p className="text-xs text-accent-danger">
          {part.errorText ?? "The query failed."}
        </p>
      )}
    </ToolStatusCard>
  );
}
