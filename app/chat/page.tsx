"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { TopBar } from "@/components/chat/top-bar";
import { ChatContainer } from "@/components/chat/chat-container";
import { Composer } from "@/components/chat/composer";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ToolStatusCard } from "@/components/chat/tool-status-card";

type AIInput = {
  query: string;
};

type AIOutput = {
  rows: string[];
};

const SQL_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "FULL JOIN",
  "CROSS JOIN",
  "JOIN",
  "ON",
  "AS",
  "AND",
  "OR",
  "IN",
  "NOT",
  "IS",
  "NULL",
  "LIKE",
  "BETWEEN",
  "DISTINCT",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "UNION",
  "UNION ALL",
  "ASC",
  "DESC",
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
];

const SUGGESTED_PROMPTS = [
  "What is the total revenue from completed orders?",
  "Which country has the highest number of customers?",
  "What are the top 3 best-selling products by quantity sold?",
  "How many active customers placed completed orders?",
];

function getStepStatusLabel(parts: Array<{ type: string }>, stepIndex: number) {
  for (let j = stepIndex + 1; j < parts.length; j++) {
    const nextType = parts[j]?.type;

    if (nextType === "step-start") {
      break;
    }

    if (nextType === "tool-schema") {
      return "Loading schema...";
    }

    if (nextType === "tool-db") {
      return "Generating SQL query...";
    }

    if (nextType === "text") {
      return "Querying database...";
    }
  }

  return "Generating SQL...";
}

function formatSqlQuery(rawQuery: string) {
  let sql = rawQuery.trim().replace(/\s+/g, " ");

  for (const keyword of [...SQL_KEYWORDS].sort((a, b) => b.length - a.length)) {
    const pattern = new RegExp(
      `\\b${keyword.replace(/ /g, "\\\\s+")}\\b`,
      "gi",
    );
    sql = sql.replace(pattern, keyword);
  }

  const clauses = [
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    "INNER JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
    "FULL JOIN",
    "CROSS JOIN",
    "JOIN",
    "ON",
    "UNION ALL",
    "UNION",
  ];

  for (const clause of clauses) {
    const pattern = new RegExp(`\\s+${clause.replace(/ /g, "\\\\s+")}\\b`, "g");
    sql = sql.replace(pattern, `\n${clause}`);
  }

  if (sql.startsWith("SELECT ")) {
    sql = sql.replace(/^SELECT\s+/g, "SELECT\n  ");
    sql = sql.replace(/,\s*/g, ",\n  ");
  }

  return sql.replace(/\n{3,}/g, "\n\n").trim();
}

export default function Chat() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  const copySql = async (key: string, sql: string) => {
    await navigator.clipboard.writeText(sql);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((current) => (current === key ? null : current));
    }, 1500);
  };

  const handleSubmit = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopBar />
      {/*<StatusStrip isLoading={isLoading} />*/}

      <main className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <ChatContainer messages={[]} />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} role={message.role}>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div
                            key={`${message.id}-${i}`}
                            className="whitespace-pre-wrap"
                          >
                            {part.text}
                          </div>
                        );

                      case "tool-db":
                        return (
                          <div key={`${message.id}-${i}`}>
                            <ToolStatusCard
                              title="Database Query"
                              status={
                                part.state === "output-available"
                                  ? "success"
                                  : part.state === "output-error" ||
                                      part.state === "output-denied"
                                    ? "error"
                                    : "running"
                              }
                            >
                              {(part.input as unknown as AIInput)?.query && (
                                <div className="mb-2 rounded bg-background border border-border-subtle overflow-hidden">
                                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-border-subtle">
                                    <span className="text-[11px] uppercase tracking-wide text-text-muted">
                                      SQL
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const formatted = formatSqlQuery(
                                          (part.input as unknown as AIInput)
                                            .query,
                                        );
                                        copySql(
                                          `${message.id}-${i}`,
                                          formatted,
                                        );
                                      }}
                                      className="text-[11px] px-2 py-1 rounded bg-elevated hover:bg-elevated/80 text-text-secondary"
                                    >
                                      {copiedKey === `${message.id}-${i}`
                                        ? "Copied"
                                        : "Copy"}
                                    </button>
                                  </div>
                                  <SyntaxHighlighter
                                    language="sql"
                                    style={oneDark}
                                    customStyle={{
                                      margin: 0,
                                      borderRadius: 0,
                                      fontSize: "12px",
                                      padding: "10px 12px",
                                      overflowX: "auto",
                                      background: "#0d0b0c",
                                    }}
                                    codeTagProps={{
                                      style: {
                                        fontFamily:
                                          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                                      },
                                    }}
                                  >
                                    {formatSqlQuery(
                                      (part.input as unknown as AIInput).query,
                                    )}
                                  </SyntaxHighlighter>
                                </div>
                              )}
                              {part.state === "output-available" &&
                                (part.output as unknown as AIOutput) && (
                                  <div className="text-sm text-accent-positive">
                                    Returned{" "}
                                    {(part.output as unknown as AIOutput).rows
                                      ?.length || 0}{" "}
                                    rows
                                  </div>
                                )}
                            </ToolStatusCard>
                          </div>
                        );

                      case "tool-schema":
                        return (
                          <div key={`${message.id}-${i}`}>
                            <ToolStatusCard
                              title="Schema Tool"
                              status={
                                part.state === "output-available"
                                  ? "success"
                                  : part.state === "output-error" ||
                                      part.state === "output-denied"
                                    ? "error"
                                    : "running"
                              }
                            >
                              {part.state === "output-available" && (
                                <div className="text-sm text-accent-positive">
                                  Schema loaded
                                </div>
                              )}
                            </ToolStatusCard>
                          </div>
                        );

                      case "step-start":
                        return (
                          <div
                            key={`${message.id}-${i}`}
                            className="text-xs text-text-muted my-2 pt-1"
                          >
                            {getStepStatusLabel(
                              message.parts as Array<{ type: string }>,
                              i,
                            )}
                          </div>
                        );

                      case "reasoning":
                        return null;

                      default:
                        return null;
                    }
                  })}
                </MessageBubble>
              ))}
            </div>
          </div>
        )}
      </main>

      {messages.length === 0 && (
        <div className="px-4 pb-2">
          <div className="max-w-3xl mx-auto grid grid-cols-2 gap-3">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSubmit(prompt)}
                className="text-left p-4 rounded-lg border border-border-subtle bg-panel hover:bg-elevated transition-colors cursor-pointer text-sm text-text-primary"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <Composer
        onSubmit={handleSubmit}
        disabled={isLoading}
        isLoading={isLoading}
      />
    </div>
  );
}
