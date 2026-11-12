"use client";

import { SQL_TOOL_PART, type ChatUIMessage } from "@/lib/chat-contract";
import { MessageBubble } from "./message-bubble";
import { MessageMarkdown } from "./markdown";
import { SqlQueryCard } from "./sql-query-card";

type MessageParts = ChatUIMessage["parts"];

function lastToolIndex(parts: MessageParts): number {
  let last = -1;
  parts.forEach((part, index) => {
    if (part.type === SQL_TOOL_PART) last = index;
  });
  return last;
}

function stepStatus(parts: MessageParts, stepIndex: number): string {
  for (const part of parts.slice(stepIndex + 1)) {
    if (part.type === "step-start") break;
    if (part.type === SQL_TOOL_PART) return "Generating SQL query…";
    if (part.type === "text") return "Generating answer…";
  }
  return "Thinking…";
}

function MessageParts({
  message,
  showProgress,
}: {
  message: ChatUIMessage;
  showProgress: boolean;
}) {
  const lastTool = lastToolIndex(message.parts);

  return message.parts.map((part, index) => {
    switch (part.type) {
      case "text":
        return message.role === "assistant" ? (
          <MessageMarkdown key={index}>{part.text}</MessageMarkdown>
        ) : (
          <div key={index} className="whitespace-pre-wrap text-pretty">
            {part.text}
          </div>
        );

      case SQL_TOOL_PART:
        return index === lastTool ? <SqlQueryCard key={index} part={part} /> : null;

      case "step-start":
        return showProgress ? (
          <p
            key={index}
            className="my-2.5 flex items-center gap-1.5 pt-0.5 text-[11px] font-medium tracking-wide text-text-muted"
          >
            <span
              aria-hidden
              className="size-1 animate-pulse rounded-full bg-accent-brand"
            />
            {stepStatus(message.parts, index)}
          </p>
        ) : null;

      default:
        return null;
    }
  });
}

export function Conversation({
  messages,
  isStreaming,
}: {
  messages: ChatUIMessage[];
  isStreaming: boolean;
}) {
  const lastMessage = messages[messages.length - 1];
  const isWaiting =
    isStreaming &&
    (!lastMessage ||
      lastMessage.role === "user" ||
      (lastMessage.role === "assistant" && lastMessage.parts.length === 0));

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} role={message.role}>
          <MessageParts
            message={message}
            showProgress={isStreaming && message === lastMessage}
          />
        </MessageBubble>
      ))}

      {isWaiting && (
        <MessageBubble role="assistant">
          <div
            role="status"
            className="flex items-center gap-2 py-1 text-[11px] font-medium tracking-wide text-text-muted"
          >
            <span aria-hidden className="flex items-end gap-[3px]">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="thinking-dot size-1 rounded-full bg-accent-brand"
                  style={{ animationDelay: `${dot * 140}ms` }}
                />
              ))}
            </span>
            Thinking…
          </div>
        </MessageBubble>
      )}
    </div>
  );
}
