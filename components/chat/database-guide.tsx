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
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <section
        aria-hidden={!isOpen}
        className={[
          "absolute bottom-20 right-0 h-[min(680px,calc(100vh-7rem))] w-[min(420px,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-2xl border border-border-subtle bg-panel shadow-soft",
          "transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          isOpen ? "visible scale-100 opacity-100" : "invisible scale-[0.14] opacity-0",
        ].join(" ")}
      >
        <button
          type="button"
          aria-label="Close database guide"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-10 grid size-9 cursor-pointer place-items-center rounded-full text-text-muted transition-all duration-200 ease-out hover:rotate-90 hover:bg-elevated hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-focus"
        >
          <X className="size-5" strokeWidth={2.25} />
        </button>

        <ScrollArea className="h-full">
          <div className="sticky top-0 z-[1] border-b border-border-subtle bg-panel/95 px-5 pb-3 pt-5 backdrop-blur">
            <div className="flex items-center gap-2 pr-8">
              <div className="grid size-7 place-items-center rounded-lg bg-[var(--accent-brand)]/15">
                <Database className="size-4 text-[var(--accent-brand)]" />
              </div>
              <h2 className="text-base font-semibold text-text-primary">
                Database Guide
              </h2>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
              Turso (SQLite) · {tableCatalog.length} tables · faker seed data.
              Ask the AI natural questions and it writes &amp; runs the SQL for
              you.
            </p>
          </div>

          <div className="space-y-5 px-5 py-4">
            {tableGroups.map((group) => (
              <div key={group.title} className="group/section">
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  {group.title}
                </h3>
                <div className="space-y-1.5">
                  {group.tables.flatMap((name) => {
                    const table = getTableDoc(name);
                    if (!table) return [];

                    return [
                      <div
                        key={name}
                        className="rounded-lg border border-border-subtle bg-elevated/60 px-3 py-2 transition-all duration-200 ease-out hover:translate-x-0.5 hover:border-[var(--accent-brand)]/40 hover:bg-elevated"
                      >
                        <div className="flex items-center gap-1.5">
                          <Table2 className="size-3.5 shrink-0 text-text-muted transition-colors duration-200 group-hover/section:text-[var(--accent-brand)]" />
                          <code className="font-mono text-xs text-text-primary">
                            {table.table_name}
                          </code>
                        </div>
                        <p className="mt-1 pl-5 font-mono text-[11px] leading-snug text-text-muted">
                          {table.columns}
                        </p>
                      </div>,
                    ];
                  })}
                </div>
              </div>
            ))}

            <div className="flex items-start gap-2 rounded-lg border border-border-subtle bg-elevated/40 px-3 py-2.5 transition-colors duration-200 hover:bg-elevated/70">
              <KeyRound className="mt-0.5 size-4 shrink-0 text-[var(--accent-brand)]" />
              <p className="text-[11px] leading-relaxed text-text-secondary">
                Tables link through foreign keys. The AI handles the joins. Just
                describe what you want.
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <Lightbulb className="size-4 text-[var(--accent-brand)]" />
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Try asking
                </h3>
              </div>
              <div className="space-y-1.5">
                {exampleQuestions.map((question) => (
                  <div
                    key={question}
                    className="cursor-default rounded-lg border border-border-subtle bg-elevated/60 px-3 py-2 text-xs text-text-secondary transition-all duration-200 ease-out hover:translate-x-0.5 hover:border-[var(--accent-brand)]/40 hover:bg-elevated"
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
        className={[
          "relative grid size-12 cursor-pointer place-items-center rounded-full bg-[var(--lp-primary)] text-[#171717]",
          "transition-transform duration-150 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[var(--lp-primary)]/25",
          "shadow-[0_8px_24px_rgba(187,247,70,0.35)] hover:shadow-[0_12px_30px_rgba(187,247,70,0.45)]",
        ].join(" ")}
        title="Database guide"
      >
        <span className="absolute inset-0 rounded-full bg-[var(--lp-primary)] opacity-0 transition-opacity duration-300 hover:opacity-20" />
        <Database
          className={[
            "absolute size-5 transition-[opacity,transform] duration-200 ease-out",
            isOpen ? "scale-50 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
          ].join(" ")}
          strokeWidth={2.25}
        />
        <X
          className={[
            "absolute size-6 transition-[opacity,transform] duration-200 ease-out",
            isOpen ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-90 opacity-0",
          ].join(" ")}
          strokeWidth={2.25}
        />
      </button>
    </div>
  );
}
