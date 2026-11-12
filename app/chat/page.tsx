"use client";

import { useChat } from "@ai-sdk/react";
import { ArrowUpRight, Database } from "lucide-react";
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

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="scroll-thin flex flex-1 items-center justify-center overflow-y-auto px-5 py-10 sm:px-6">
            <div className="w-full max-w-3xl">
              <div className="mb-10 text-center">
                <div className="relative mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-accent-brand/10 ring-1 ring-accent-brand/15 ring-inset">
                  <div
                    aria-hidden
                    className="absolute inset-3 rounded-full bg-accent-brand/15 blur-xl dark:bg-accent-brand/25"
                  />
                  <Database
                    className="relative size-6 text-accent-brand"
                    strokeWidth={1.75}
                  />
                </div>
                <h2 className="mb-2 text-[22px] font-semibold tracking-[-0.02em] text-balance text-text-primary">
                  Start a conversation
                </h2>
                <p className="mx-auto max-w-md text-[15px] leading-relaxed text-pretty text-text-muted">
                  Ask questions about your database. Try &ldquo;Show me all
                  active customers&rdquo; or &ldquo;What&apos;s the total revenue
                  from completed orders?&rdquo;
                </p>
              </div>

              <div className="grid auto-rows-fr grid-cols-1 gap-2.5 sm:grid-cols-2">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => submit(question)}
                    className="group flex h-full cursor-pointer items-start justify-between gap-3 rounded-xl border border-border-subtle bg-panel p-4 text-left text-[13.5px] leading-snug text-text-primary transition-[background-color,border-color,transform] duration-200 ease-out outline-none hover:border-accent-brand/30 hover:bg-elevated focus-visible:ring-2 focus-visible:ring-accent-focus/60 active:scale-[0.99] motion-reduce:active:scale-100"
                  >
                    <span className="text-pretty">{question}</span>
                    <ArrowUpRight
                      aria-hidden
                      className="mt-0.5 size-3.5 shrink-0 text-text-muted opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div ref={scrollRef} className="scroll-thin flex-1 overflow-y-auto">
            <Conversation messages={messages} isStreaming={isLoading} />
          </div>
        )}
      </main>

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
