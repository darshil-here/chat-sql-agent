"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, CircleUserRound, Bot } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type AIInput = {
  query: string;
};

type AIOutputput = {
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
  const [input, setInput] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, sendMessage } = useChat();

  const copySql = async (key: string, sql: string) => {
    await navigator.clipboard.writeText(sql);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((current) => (current === key ? null : current));
    }, 1500);
  };

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [input]);
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap mb-4">
          <div className="font-bold mb-2">
            {message.role === "user" ? (
              <span className="text-3xl">
                <CircleUserRound />
              </span>
            ) : (
              <span className="text-3xl">
                <Bot />
              </span>
            )}
          </div>
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <div key={`${message.id}-${i}`} className="mb-2">
                    {part.text}
                  </div>
                );

              case "tool-db":
                return (
                  <div
                    key={`${message.id}-${i}`}
                    className="my-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
                  >
                    <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      🔍 Database Query
                    </div>

                    {(part.input as unknown as AIInput)?.query && (
                      <div className="mb-2 rounded bg-white dark:bg-zinc-900 border border-blue-100 dark:border-blue-800/50 overflow-hidden">
                        <div className="flex items-center justify-between px-2 py-1.5 border-b border-blue-100 dark:border-blue-800/50">
                          <span className="text-[11px] uppercase tracking-wide text-zinc-500">
                            SQL
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const formatted = formatSqlQuery(
                                (part.input as unknown as AIInput).query,
                              );
                              copySql(`${message.id}-${i}`, formatted);
                            }}
                            className="text-[11px] px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200"
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
                            background: "#09090b",
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
                      (part.output as unknown as AIOutputput) && (
                        <div className="text-sm text-green-700 dark:text-green-300">
                          ✅ Returned{" "}
                          {(part.output as unknown as AIOutputput).rows
                            ?.length || 0}{" "}
                          rows
                        </div>
                      )}
                  </div>
                );

              case "tool-schema":
                return (
                  <div
                    key={`${message.id}-${i}`}
                    className="my-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800"
                  >
                    <div className="font-semibold text-purple-700 dark:text-purple-300">
                      📋 Schema Tool
                    </div>
                    {part.state === "output-available" && (
                      <div className="text-sm text-green-700 dark:text-green-300 py-2">
                        ✅ Schema loaded
                      </div>
                    )}
                  </div>
                );

              case "step-start":
                return (
                  <div
                    key={`${message.id}-${i}`}
                    className="text-xs text-gray-500 dark:text-gray-400 my-3 pt-2"
                  >
                    {""}
                    {getStepStatusLabel(
                      message.parts as Array<{ type: string }>,
                      i,
                    )}
                  </div>
                );

              case "reasoning":
                // Optional: show reasoning
                return null;

              default:
                return null;
            }
          })}
        </div>
      ))}

      <form
        className="fixed bottom-8 w-full max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
      >
        <div className="flex items-center gap-1 w-full max-w-2xl rounded-[28px] border border-white/10 bg-zinc-900/95 shadow-[0_6px_20px_rgba(0,0,0,0.24)] px-3 py-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            placeholder="Ask about your database..."
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!input.trim()) return;
                sendMessage({ text: input });
                setInput("");
              }
            }}
            className="
              flex-1
              resize-none
              overflow-hidden
              bg-transparent
              text-sm
              leading-5
              text-white
              placeholder:text-zinc-500
              focus:outline-none
              pl-2
            "
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="
              shrink-0
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              cursor-pointer
              bg-white
              text-black
              shadow-sm
              transition-all duration-200
              hover:scale-[1.03]
              hover:bg-zinc-100
              active:scale-95
              disabled:bg-zinc-700
              disabled:text-zinc-400
              disabled:shadow-none
              disabled:cursor-not-allowed
            "
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </form>
    </div>
  );
}
