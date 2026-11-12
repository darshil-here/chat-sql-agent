"use client";

import { useChat } from "@ai-sdk/react";
import { Database } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Composer } from "@/components/chat/composer";
import { Conversation } from "@/components/chat/conversation";
import { DatabaseGuide } from "@/components/chat/database-guide";
import { TopBar } from "@/components/chat/top-bar";
import { exampleQuestions } from "@/db/catalog";
import type { ChatRequest, ChatUIMessage } from "@/lib/chat-contract";

const SUGGESTED_QUESTIONS = exampleQuestions.slice(0, 4);

export default function Chat() {
  const [dryRun, setDryRun] = useState(false);
  const { messages, sendMessage, status, error } = useChat<ChatUIMessage>({
    onError: (cause) => console.error(cause),
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const nearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 160;

    if (nearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  function submit(text: string) {
    const options: { body: Pick<ChatRequest, "dryRun"> } = { body: { dryRun } };
    sendMessage({ text }, options);
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar />

      <main className="flex flex-1 flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-12">
            <div className="max-w-lg text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-panel">
                <Database className="size-7 text-accent-brand" />
              </div>
              <h2 className="mb-2 text-xl font-medium text-text-primary">
                Start a conversation
              </h2>
              <p className="text-base text-text-muted">
                Ask questions about your database. Try &ldquo;Show me all active
                customers&rdquo; or &ldquo;What&apos;s the total revenue from
                completed orders?&rdquo;
              </p>
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <Conversation messages={messages} isStreaming={isLoading} />
          </div>
        )}
      </main>

      {messages.length === 0 && (
        <div className="px-4 pb-2">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3">
            {SUGGESTED_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => submit(question)}
                className="cursor-pointer rounded-lg border border-border-subtle bg-panel p-4 text-left text-sm text-text-primary transition-colors hover:bg-elevated"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <Composer
        onSubmit={submit}
        isLoading={isLoading}
        error={
          error
            ? "Something went wrong while answering. Please retry in a few moments."
            : null
        }
        dryRun={dryRun}
        onToggleDryRun={() => setDryRun((current) => !current)}
      />

      <DatabaseGuide />
    </div>
  );
}
