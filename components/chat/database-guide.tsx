"use client";

import { useState } from "react";
import { Database, KeyRound, Lightbulb, Table2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  exampleQuestions,
  getTableDoc,
  tableCatalog,
  tableGroups,
} from "@/db/catalog";

export function DatabaseGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-4 bottom-[5.5rem] z-50 lg:right-6 lg:bottom-6">
      <section
        aria-hidden={!isOpen}
        aria-label="Database guide"
        className={[
          "absolute right-0 bottom-[4.5rem] h-[min(620px,calc(100dvh-11rem))] w-[min(420px,calc(100vw-2rem))] sm:h-[min(680px,calc(100dvh-11rem))] origin-bottom-right overflow-hidden rounded-2xl border border-border-subtle bg-panel shadow-soft lg:h-[min(680px,calc(100vh-7rem))]",
          "transition-[opacity,transform,visibility] ease-out",
          isOpen
            ? "visible translate-y-0 scale-100 opacity-100 duration-200"
            : "invisible translate-y-2 scale-[0.96] opacity-0 duration-150",
        ].join(" ")}
      >
        <button
          type="button"
          aria-label="Close database guide"
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-3.5 z-10 grid size-9 cursor-pointer place-items-center rounded-full text-text-muted transition-[background-color,color,transform] duration-150 ease-out outline-none hover:rotate-90 hover:bg-elevated hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent-focus/60"
        >
          <X className="size-4" strokeWidth={2} />
        </button>

        <ScrollArea className="h-full">
          <div className="sticky top-0 z-[1] border-b border-border-subtle bg-panel/90 px-5 pt-5 pb-3 backdrop-blur">
            <div className="flex items-center gap-2 pr-8">
              <span className="grid size-7 place-items-center rounded-lg bg-accent-brand/12 ring-1 ring-accent-brand/15 ring-inset">
                <Database
                  className="size-3.5 text-accent-brand"
                  strokeWidth={2}
                />
              </span>
              <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-text-primary">
                Database Guide
              </h2>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-pretty text-text-muted">
              Turso (SQLite) · {tableCatalog.length} tables · faker seed data.
              Ask the AI natural questions and it writes &amp; runs the SQL for
              you.
            </p>
          </div>

          <div className="space-y-5 px-5 py-4">
            {tableGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-2 text-[10.5px] font-semibold tracking-[0.08em] text-text-muted uppercase">
                  {group.title}
                </h3>
                <div className="space-y-1.5">
                  {group.tables.flatMap((name) => {
                    const table = getTableDoc(name);
                    if (!table) return [];

                    return [
                      <div
                        key={name}
                        className="rounded-lg border border-border-subtle bg-elevated/50 px-3 py-2 transition-[background-color,border-color] duration-150 ease-out hover:border-accent-brand/25 hover:bg-elevated/80"
                      >
                        <div className="flex items-center gap-1.5">
                          <Table2
                            className="size-3.5 shrink-0 text-text-muted"
                            strokeWidth={1.75}
                          />
                          <code className="font-mono text-[11.5px] text-text-primary">
                            {table.table_name}
                          </code>
                        </div>
                        <p className="mt-1 pl-5 font-mono text-[10.5px] leading-snug text-text-muted">
                          {table.columns}
                        </p>
                      </div>,
                    ];
                  })}
                </div>
              </div>
            ))}

            <div className="flex items-start gap-2 rounded-lg border border-border-subtle bg-elevated/40 px-3 py-2.5">
              <KeyRound
                className="mt-0.5 size-3.5 shrink-0 text-accent-brand"
                strokeWidth={1.75}
              />
              <p className="text-[11px] leading-relaxed text-text-secondary">
                Tables link through foreign keys. The AI handles the joins. Just
                describe what you want.
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <Lightbulb
                  className="size-3.5 text-accent-brand"
                  strokeWidth={1.75}
                />
                <h3 className="text-[10.5px] font-semibold tracking-[0.08em] text-text-muted uppercase">
                  Try asking
                </h3>
              </div>
              <div className="space-y-1.5">
                {exampleQuestions.map((question) => (
                  <div
                    key={question}
                    className="cursor-default rounded-lg border border-border-subtle bg-elevated/50 px-3 py-2 text-xs leading-snug text-text-secondary transition-[background-color,border-color] duration-150 ease-out hover:border-accent-brand/25 hover:bg-elevated/80"
                  >
                    {question}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </section>

      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close database guide" : "Open database guide"}
        onClick={() => setIsOpen((open) => !open)}
        className="relative grid size-12 cursor-pointer place-items-center rounded-full bg-[var(--lp-primary)] text-[#171717] shadow-[0_6px_20px_-6px_rgba(187,247,70,0.55)] transition-[transform,box-shadow] duration-150 ease-out outline-none hover:scale-[1.04] hover:shadow-[0_10px_26px_-8px_rgba(187,247,70,0.7)] focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96] motion-reduce:active:scale-100"
        title="Database guide"
      >
        <Database
          aria-hidden
          className={[
            "absolute size-5 transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
            isOpen
              ? "scale-[0.25] -rotate-45 opacity-0 blur-[4px]"
              : "scale-100 rotate-0 opacity-100 blur-none",
          ].join(" ")}
          strokeWidth={2.25}
        />
        <X
          aria-hidden
          className={[
            "absolute size-5 transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
            isOpen
              ? "scale-100 rotate-0 opacity-100 blur-none"
              : "scale-[0.25] rotate-45 opacity-0 blur-[4px]",
          ].join(" ")}
          strokeWidth={2.25}
        />
      </button>
    </div>
  );
}
