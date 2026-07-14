"use client";

import { Database, X, Table2, KeyRound, Lightbulb } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const TABLE_GROUPS = [
  {
    title: "Organizations & People",
    tables: [
      { name: "companies", cols: "name, industry, country" },
      { name: "employees", cols: "name, email, department, role" },
      { name: "departments", cols: "name, head, budget" },
      { name: "regions", cols: "name, country, manager" },
    ],
  },
  {
    title: "Customers",
    tables: [
      { name: "customers", cols: "name, email, country, status, total_spent" },
      { name: "shipping_addresses", cols: "label, city, state, zip" },
      { name: "loyalty_points", cols: "points, reason, earned_at" },
    ],
  },
  {
    title: "Products & Inventory",
    tables: [
      { name: "products", cols: "name, category, price, stock" },
      { name: "warehouses", cols: "name, city, country, capacity" },
      { name: "inventory", cols: "product, warehouse, quantity" },
      { name: "vendors", cols: "name, contact, country" },
      { name: "purchase_orders", cols: "vendor, amount, status" },
    ],
  },
  {
    title: "Orders & Sales",
    tables: [
      { name: "orders", cols: "customer, status, total_amount" },
      { name: "order_items", cols: "product, quantity, unit_price" },
      { name: "coupons", cols: "code, discount_percent, used_count" },
      { name: "refunds", cols: "order, amount, reason, status" },
    ],
  },
  {
    title: "Billing & Finance",
    tables: [
      { name: "invoices", cols: "customer, amount, tax, status" },
      { name: "payments", cols: "invoice, method, amount, status" },
      { name: "tax_rates", cols: "region, category, rate_percent" },
    ],
  },
  {
    title: "Marketing, Support & Shipping",
    tables: [
      { name: "campaigns", cols: "platform, budget, clicks, conversions" },
      { name: "support_tickets", cols: "subject, status, priority" },
      { name: "reviews", cols: "product, rating, comment" },
      { name: "shipments", cols: "order, carrier, tracking, status" },
    ],
  },
];

const SAMPLE_QUESTIONS = [
  "What is the total revenue from completed orders?",
  "Top 5 best-selling products by quantity sold",
  "Which country has the most customers?",
  "How many active subscriptions are there, and what's the monthly recurring revenue?",
  "List overdue invoices and their customers",
  "Which products are below their reorder point?",
  "Average product rating by category",
  "Total refund amount and refund rate",
];

export function DatabaseGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopping, setIsPopping] = useState(false);

  function toggle() {
    setIsOpen((open) => !open);
    setIsPopping(true);
    window.setTimeout(() => setIsPopping(false), 160);
  }

  function close() {
    setIsOpen(false);
    setIsPopping(true);
    window.setTimeout(() => setIsPopping(false), 160);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <section
        aria-hidden={!isOpen}
        className={[
          "absolute bottom-20 right-0 h-[min(680px,calc(100vh-7rem))] w-[min(420px,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-2xl bg-panel border border-border-subtle shadow-soft",
          "transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          isOpen
            ? "visible scale-100 opacity-100"
            : "invisible scale-[0.14] opacity-0",
        ].join(" ")}
      >
        <button
          type="button"
          aria-label="Close database guide"
          onClick={close}
          className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full text-text-muted transition-all duration-200 ease-out hover:bg-elevated hover:text-text-primary hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-accent-focus cursor-pointer"
        >
          <X className="size-5" strokeWidth={2.25} />
        </button>

        <ScrollArea className="h-full">
          {/* Header */}
          <div className="sticky top-0 z-[1] bg-panel/95 backdrop-blur px-5 pt-5 pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-2 pr-8">
              <div className="grid size-7 place-items-center rounded-lg bg-[var(--accent-brand)]/15">
                <Database className="size-4 text-[var(--accent-brand)]" />
              </div>
              <h2 className="text-base font-semibold text-text-primary">
                Database Guide
              </h2>
            </div>
            <p className="mt-1.5 text-xs text-text-muted leading-relaxed">
              Turso (SQLite) · 24 tables · ~8,335 faker rows. Ask the AI natural
              questions and it writes &amp; runs the SQL for you.
            </p>
          </div>

          {/* Tables */}
          <div className="px-5 py-4 space-y-5">
            {TABLE_GROUPS.map((group) => (
              <div key={group.title} className="group/section">
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  {group.title}
                </h3>
                <div className="space-y-1.5">
                  {group.tables.map((t) => (
                    <div
                      key={t.name}
                      className="rounded-lg border border-border-subtle bg-elevated/60 px-3 py-2 transition-all duration-200 ease-out hover:border-[var(--accent-brand)]/40 hover:bg-elevated hover:translate-x-0.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <Table2 className="size-3.5 text-text-muted shrink-0 transition-colors duration-200 group-hover/section:text-[var(--accent-brand)]" />
                        <code className="text-xs font-mono text-text-primary">
                          {t.name}
                        </code>
                      </div>
                      <p className="mt-1 pl-5 text-[11px] text-text-muted font-mono leading-snug">
                        {t.cols}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Relationships note */}
            <div className="flex items-start gap-2 rounded-lg border border-border-subtle bg-elevated/40 px-3 py-2.5 transition-colors duration-200 hover:bg-elevated/70">
              <KeyRound className="size-4 text-[var(--accent-brand)] mt-0.5 shrink-0" />
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Tables link via <code className="font-mono">company_id</code>,{" "}
                <code className="font-mono">customer_id</code>,{" "}
                <code className="font-mono">order_id</code>,{" "}
                <code className="font-mono">product_id</code> and{" "}
                <code className="font-mono">region_id</code>. The AI handles the
                joins — just describe what you want.
              </p>
            </div>

            {/* Sample questions */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Lightbulb className="size-4 text-[var(--accent-brand)]" />
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Try asking
                </h3>
              </div>
              <div className="space-y-1.5">
                {SAMPLE_QUESTIONS.map((q) => (
                  <div
                    key={q}
                    className="rounded-lg border border-border-subtle bg-elevated/60 px-3 py-2 text-xs text-text-secondary transition-all duration-200 ease-out hover:border-[var(--accent-brand)]/40 hover:bg-elevated hover:translate-x-0.5 cursor-default"
                  >
                    {q}
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
        onClick={toggle}
        className={[
          "relative grid size-12 place-items-center rounded-full bg-[var(--lp-primary)] text-[#171717]",
          "transition-transform duration-150 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[var(--lp-primary)]/25",
          "shadow-[0_8px_24px_rgba(187,247,70,0.35)] hover:shadow-[0_12px_30px_rgba(187,247,70,0.45)]",
          isPopping ? "scale-110" : "scale-100",
        ].join(" ")}
        style={{ cursor: "pointer" }}
        title="Database guide"
      >
        <span className="absolute inset-0 rounded-full bg-[var(--lp-primary)] opacity-0 transition-opacity duration-300 hover:opacity-20" />
        <Database
          className={[
            "absolute size-5 transition-[opacity,transform] duration-200 ease-out",
            isOpen
              ? "scale-50 -rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100",
          ].join(" ")}
          strokeWidth={2.25}
        />
        <X
          className={[
            "absolute size-6 transition-[opacity,transform] duration-200 ease-out",
            isOpen
              ? "scale-100 rotate-0 opacity-100"
              : "scale-50 rotate-90 opacity-0",
          ].join(" ")}
          strokeWidth={2.25}
        />
      </button>
    </div>
  );
}