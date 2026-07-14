"use client";

import { useChat } from "@ai-sdk/react";
import { useState, type ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { TopBar } from "@/components/chat/top-bar";
import { ChatContainer } from "@/components/chat/chat-container";
import { Composer } from "@/components/chat/composer";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ToolStatusCard } from "@/components/chat/tool-status-card";
import { DatabaseGuide } from "@/components/chat/database-guide";

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

function isLastToolDb(
  parts: Array<{ type: string }>,
  currentIndex: number,
): boolean {
  for (let j = parts.length - 1; j > currentIndex; j--) {
    if (parts[j]?.type === "tool-db") return false;
  }
  return true;
}

function getStepStatusLabel(
  parts: Array<{ type: string }>,
  stepIndex: number,
) {
  // Find what comes after this step-start
  for (let j = stepIndex + 1; j < parts.length; j++) {
    const nextType = parts[j]?.type;

    if (nextType === "step-start") {
      break;
    }

    if (nextType === "tool-db") {
      return "Generating SQL query...";
    }

    if (nextType === "text") {
      // Check if there was a tool-db before this step
      let hasToolDb = false;
      for (let k = stepIndex - 1; k >= 0; k--) {
        if (parts[k]?.type === "tool-db") {
          hasToolDb = true;
          break;
        }
        if (parts[k]?.type === "step-start") {
          break;
        }
      }
      return hasToolDb ? "Generating answer..." : "Generating answer...";
    }
  }

  return "Thinking...";
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
  const [dryRun, setDryRun] = useState(false);

  const { messages, sendMessage, status, error } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  const errorMessage = error
    ? "The AI model is temporarily unavailable. Please retry in a few moments."
    : null;

  const copySql = async (key: string, sql: string) => {
    await navigator.clipboard.writeText(sql);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((current) => (current === key ? null : current));
    }, 1500);
  };

  const handleSubmit = (text: string) => {
    sendMessage({ text }, { body: { dryRun } });
  };

  const toggleDryRun = () => setDryRun((prev) => !prev);

  const markdownComponents = {
    code({
      className,
      children,
      ...props
    }: React.HTMLAttributes<HTMLElement> & { children?: ReactNode }) {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");
      const codeKey = `md-${codeString.slice(0, 50)}`;

      if (match) {
        return (
          <div className="my-3 rounded-lg border border-border-subtle overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-elevated border-b border-border-subtle">
              <span className="text-[11px] uppercase tracking-wide text-text-muted font-mono">
                {match[1]}
              </span>
              <button
                type="button"
                onClick={() => copySql(codeKey, codeString)}
                className="text-[11px] px-2 py-1 rounded bg-background hover:bg-background/80 text-text-secondary"
              >
                {copiedKey === codeKey ? "Copied" : "Copy"}
              </button>
            </div>
            <SyntaxHighlighter
              language={match[1]}
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: "13px",
                lineHeight: "1.5",
                padding: "12px 14px",
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
              {codeString}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code
          className="px-1.5 py-0.5 rounded bg-elevated text-accent-danger font-mono text-[13px]"
          {...props}
        >
          {children}
        </code>
      );
    },
    table({ children }: { children?: ReactNode }) {
      return (
        <div className="my-3 overflow-x-auto rounded-lg border border-border-subtle">
          <table className="w-full text-sm">{children}</table>
        </div>
      );
    },
    th({ children }: { children?: ReactNode }) {
      return (
        <th className="px-3 py-2 text-left text-xs font-medium text-text-muted uppercase tracking-wider bg-elevated border-b border-border-subtle">
          {children}
        </th>
      );
    },
    td({ children }: { children?: ReactNode }) {
      return (
        <td className="px-3 py-2 border-b border-border-subtle text-text-primary">
          {children}
        </td>
      );
    },
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopBar />

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
                        return message.role === "assistant" ? (
                          <div
                            key={`${message.id}-${i}`}
                            className="prose prose-invert prose-sm max-w-none"
                          >
                            <Markdown
                              remarkPlugins={[remarkGfm]}
                              components={markdownComponents}
                            >
                              {part.text}
                            </Markdown>
                          </div>
                        ) : (
                          <div
                            key={`${message.id}-${i}`}
                            className="whitespace-pre-wrap"
                          >
                            {part.text}
                          </div>
                        );

                      case "tool-db":
                        if (
                          !isLastToolDb(
                            message.parts as Array<{ type: string }>,
                            i,
                          )
                        ) {
                          return null;
                        }
                        return (
                          <div key={`${message.id}-${i}`}>
                            <ToolStatusCard
                              title="Database Query Used"
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
                                  <div className="text-xs text-text-secondary">
                                    Returned{" "}
                                    {(part.output as unknown as AIOutput).rows
                                      ?.length || 0}{" "}
                                    rows
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
        error={errorMessage}
        dryRun={dryRun}
        onToggleDryRun={toggleDryRun}
      />

      <DatabaseGuide />
    </div>
  );
}
