"use client";

import { useEffect, useRef, useState } from "react";
import { LandingLink } from "@/components/landing/landing-link";
import { cn } from "@/components/ui/utils";
import {
  Sparkles,
  ArrowRight,
  Menu,
  X,
  MessageSquare,
  Database,
  Search,
  Plug,
  MessageCircle,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

const GITHUB_URL = "https://github.com/darshil-here/chat-sql-agent";

const sections = [
  { id: "features", label: "Overview" },
  { id: "how-it-works", label: "How It Works" },
];

const features = [
  {
    icon: MessageSquare,
    title: "Ask in plain English",
    desc: "The model reads the schema, writes SQLite, and explains the result. A retrieval step keeps it pointed at the tables your question actually needs.",
  },
  {
    icon: Database,
    title: "Live backend integration",
    desc: "Every answer comes from a real query against a Turso database. The demo data is seeded with faker, so you can ask the same questions without touching production data.",
  },
  {
    icon: Search,
    title: "See the query, trust the answer",
    desc: "Every AI response surfaces the exact query it ran underneath. This was a deliberate design choice to make the model's reasoning transparent and verifiable.",
  },
];

const steps = [
  {
    icon: Plug,
    title: "1. User Asks",
    desc: "The user types a question in plain English into the chat interface, for example, 'How many orders came in last week?'",
    glow: false,
  },
  {
    icon: MessageCircle,
    title: "2. AI Interprets",
    desc: "The retrieval step finds the relevant tables, then the model writes a SQLite query against that schema.",
    glow: true,
  },
  {
    icon: CheckCircle,
    title: "3. Answer Returned",
    desc: "The backend runs the query against the live database and the AI returns both a human-readable answer and the raw query for full transparency.",
    glow: false,
  },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function ScrollReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn("scroll-reveal", className)}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-14 text-center md:mb-16", className)}>
      <ScrollReveal>
        <h2
          className="text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance sm:text-[36px]"
          style={{ color: "var(--lp-text-on-dark)" }}
        >
          {title}
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={70}>
        <p
          className="mx-auto mt-4 max-w-[520px] text-[15px] leading-relaxed text-pretty"
          style={{ color: "var(--lp-text-secondary)" }}
        >
          {description}
        </p>
      </ScrollReveal>
    </div>
  );
}

export default function QueryMindLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--lp-bg)",
        color: "var(--lp-text-on-dark)",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {/* Section reveals are JS-driven; without it, show everything. */}
      <noscript>
        <style>{`.scroll-reveal{opacity:1;transform:none}`}</style>
      </noscript>
      {/* ──────────────────────── */}
      {/* 1. NAVIGATION BAR        */}
      {/* ──────────────────────── */}
      <nav
        className="fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150"
        style={{
          backgroundColor: "var(--lp-nav)",
          borderColor: "var(--lp-border-dark)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-12 lg:px-16">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex cursor-pointer items-center gap-2 rounded-lg text-lg font-semibold tracking-[-0.01em] transition-transform duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-[var(--lp-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--lp-bg)] active:scale-[0.98]"
            style={{ color: "var(--lp-text-on-dark)" }}
            aria-label="QueryMind home"
          >
            <Sparkles
              size={20}
              strokeWidth={2}
              className="transition-transform duration-200 ease-[var(--lp-ease-out)] group-hover:rotate-12"
              style={{ color: "var(--lp-primary)" }}
            />
            QueryMind
          </button>

          {/* Desktop center links */}
          <div className="hidden items-center gap-1 sm:flex">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors duration-150 ease-out outline-none hover:bg-white/[0.05] hover:text-[var(--lp-text-on-dark)] focus-visible:ring-2 focus-visible:ring-[var(--lp-primary)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--lp-bg)]"
                style={{ color: "var(--lp-text-secondary)" }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden items-center gap-3 sm:flex">
            <LandingLink href={GITHUB_URL} size="sm">
              View on GitHub
              <ArrowRight size={15} />
            </LandingLink>
          </div>

          {/* Mobile hamburger */}
          <button
            className="cursor-pointer rounded-lg p-2 transition-colors duration-150 outline-none hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[var(--lp-primary)] active:scale-95 sm:hidden"
            style={{ color: "var(--lp-text-on-dark)" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu — grid-rows keeps it animatable both ways. */}
        <div
          id="mobile-menu"
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          className={cn(
            "grid overflow-hidden border-t transition-[grid-template-rows,opacity] duration-200 ease-out sm:hidden",
            menuOpen
              ? "grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0",
          )}
          style={{
            backgroundColor: "var(--lp-nav-solid)",
            borderColor: menuOpen ? "var(--lp-border-dark)" : "transparent",
          }}
        >
          <div className="min-h-0">
            <div className="space-y-1 px-6 pt-3 pb-5">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-150 outline-none hover:bg-white/[0.05] hover:text-[var(--lp-text-on-dark)] focus-visible:ring-2 focus-visible:ring-[var(--lp-primary)]"
                  style={{ color: "var(--lp-text-secondary)" }}
                >
                  {s.label}
                </button>
              ))}
              <div className="flex flex-col gap-2 pt-3">
                <LandingLink
                  href={GITHUB_URL}
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => setMenuOpen(false)}
                >
                  View on GitHub
                  <ArrowRight size={15} />
                </LandingLink>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ──────────────────────── */}
      {/* 2. HERO SECTION          */}
      {/* ──────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-32 pb-20 text-center md:pt-40 md:pb-28">
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "900px",
            height: "900px",
            background:
              "radial-gradient(circle, rgba(187,247,70,0.09) 0%, rgba(187,247,70,0.03) 40%, transparent 68%)",
          }}
        />
        {/* Hairline that fades in from the nav */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Headline */}
          <ScrollReveal>
            <h1
              className="mx-auto mb-6 max-w-[860px] text-[40px] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-[56px] lg:text-[64px]"
              style={{ color: "var(--lp-text-on-dark)" }}
            >
              Talk to the data.
              <br />
              Get{" "}
              <span
                className="mr-[0.08em] italic"
                style={{ color: "var(--lp-primary)" }}
              >
                real
              </span>{" "}
              answers, instantly.
            </h1>
          </ScrollReveal>

          {/* Sub-headline */}
          <ScrollReveal delay={70}>
            <p
              className="mx-auto mb-10 max-w-[520px] text-[15px] leading-[1.7] text-pretty sm:text-base"
              style={{ color: "var(--lp-text-secondary)" }}
            >
              QueryMind connects to a seeded SQLite database and lets anyone ask
              data questions in plain English. No SQL needed.
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal delay={140}>
            <div className="mb-16 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <LandingLink href="/chat" className="w-full sm:w-auto">
                Try the Live Demo
                <ArrowRight size={17} />
              </LandingLink>
              <LandingLink
                href={GITHUB_URL}
                variant="outline"
                className="w-full justify-center sm:w-auto"
              >
                View on GitHub
              </LandingLink>
            </div>
          </ScrollReveal>

          {/* Mock Chat UI — same composition as the real chat page:
              user on the right, answer plus the query it ran below. */}
          <ScrollReveal delay={210}>
            <div className="relative mx-auto max-w-[560px] text-left">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-x-16 top-4 bottom-8 -z-10"
                style={{
                  background:
                    "radial-gradient(55% 60% at 50% 70%, rgba(187,247,70,0.10), transparent 72%)",
                }}
              />

              {/* Outer ring: 16px radius, 6px inset → 10px inner radius. */}
              <div
                className="rounded-2xl p-1.5"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.01))",
                  boxShadow: "var(--lp-shadow-card)",
                }}
              >
                <div
                  className="overflow-hidden rounded-[10px]"
                  style={{
                    backgroundColor: "var(--lp-card-surface)",
                    border: "1px solid var(--lp-border-dark)",
                  }}
                >
                  {/* Mock chat header */}
                  <div
                    className="flex items-center justify-between border-b px-4 py-2.5"
                    style={{
                      borderColor: "var(--lp-border-dark)",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.03), transparent)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles
                        size={14}
                        style={{ color: "var(--lp-primary)" }}
                      />
                      <span
                        className="text-[13px] font-medium"
                        style={{ color: "var(--lp-text-on-dark)" }}
                      >
                        QueryMind
                      </span>
                    </div>
                    <span
                      className="rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase"
                      style={{
                        borderColor: "var(--lp-border-dark)",
                        color: "var(--lp-text-muted)",
                      }}
                    >
                      SQLite
                    </span>
                  </div>

                  <div className="space-y-3.5 p-4">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div
                        className="max-w-[82%] px-3.5 py-2.5 text-[13px] leading-snug"
                        style={{
                          backgroundColor: "var(--lp-primary)",
                          color: "var(--lp-badge-text)",
                          borderRadius: "14px 14px 4px 14px",
                        }}
                      >
                        How many new customers signed up this month?
                      </div>
                    </div>

                    {/* AI response */}
                    <div className="flex justify-start">
                      <div
                        className="max-w-[88%] px-3.5 py-3"
                        style={{
                          backgroundColor: "var(--lp-bg)",
                          border: "1px solid var(--lp-border-dark)",
                          borderRadius: "14px 14px 14px 4px",
                        }}
                      >
                        <p
                          className="text-[13px] leading-[1.6]"
                          style={{ color: "var(--lp-text-on-dark)" }}
                        >
                          There were <strong>128 new customers</strong> this
                          month. That&apos;s up 18% from last month.
                          <span className="streaming-caret" aria-hidden />
                        </p>

                        {/* Collapsible SQL */}
                        <details className="group mt-2.5">
                          <summary
                            className="flex w-fit cursor-pointer list-none items-center gap-1 rounded text-[11px] transition-colors duration-150 outline-none hover:text-[var(--lp-text-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--lp-primary)] [&::-webkit-details-marker]:hidden"
                            style={{ color: "var(--lp-text-muted)" }}
                          >
                            <ChevronRight
                              size={12}
                              strokeWidth={2.25}
                              className="transition-transform duration-200 ease-out group-open:rotate-90"
                            />
                            Query used
                          </summary>
                          <pre
                            className="scroll-thin mt-2 overflow-x-auto rounded-lg p-3 text-left text-[11.5px] leading-relaxed"
                            style={{
                              backgroundColor: "rgba(0,0,0,0.32)",
                              color: "var(--lp-text-secondary)",
                              fontFamily:
                                "var(--font-geist-mono), ui-monospace, monospace",
                              border: "1px solid rgba(255,255,255,0.04)",
                            }}
                          >
                            {`SELECT COUNT(*) AS new_customers
FROM customers
WHERE signup_date >= date('now', 'start of month')`}
                          </pre>
                        </details>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ──────────────────────── */}
      {/* 3. FEATURES              */}
      {/* ──────────────────────── */}
      <section
        id="features"
        className="scroll-mt-16 px-6 py-20 md:py-24"
        style={{ backgroundColor: "var(--lp-bg)" }}
      >
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="What this project demonstrates"
            description="A look at the core technical skills behind this build."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 70} className="h-full">
                <div
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-[transform,border-color,box-shadow] duration-200 ease-[var(--lp-ease-out)] hover:-translate-y-0.5 md:p-7"
                  style={{
                    backgroundColor: "var(--lp-card-surface)",
                    backgroundImage:
                      "linear-gradient(180deg, rgba(255,255,255,0.035), transparent 55%)",
                    borderColor: "var(--lp-border-dark)",
                    boxShadow:
                      "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 12px 32px -16px rgba(0,0,0,0.8)",
                  }}
                >
                  <div
                    className="mb-5 grid size-10 place-items-center rounded-[10px] ring-1 ring-inset ring-[rgba(187,247,70,0.16)] transition-[box-shadow] duration-200 group-hover:ring-[rgba(187,247,70,0.28)]"
                    style={{ backgroundColor: "rgba(187,247,70,0.10)" }}
                  >
                    <f.icon
                      size={19}
                      strokeWidth={2}
                      style={{ color: "var(--lp-primary)" }}
                    />
                  </div>
                  <h3
                    className="mb-2 text-[17px] font-semibold tracking-[-0.01em]"
                    style={{ color: "var(--lp-text-on-dark)" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-[14px] leading-[1.65] text-pretty"
                    style={{ color: "var(--lp-text-secondary)" }}
                  >
                    {f.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── */}
      {/* 4. HOW IT WORKS           */}
      {/* ──────────────────────── */}
      <section
        id="how-it-works"
        className="scroll-mt-16 border-y px-6 py-20 md:py-24"
        style={{
          backgroundColor: "var(--lp-surface-mid)",
          borderColor: "var(--lp-border-dark)",
        }}
      >
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            title="How it works under the hood"
            description="The technical flow from question to answer."
          />

          {/* Steps with connecting line */}
          <div className="relative flex flex-col gap-10 md:flex-row md:items-start md:gap-0">
            {/* Desktop connector: runs behind the icon row. */}
            <div
              aria-hidden
              className="absolute top-8 right-[16.67%] left-[16.67%] hidden h-px md:block"
              style={{
                background:
                  "linear-gradient(to right, transparent, var(--lp-border-strong) 20%, var(--lp-border-strong) 80%, transparent)",
              }}
            />

            {steps.map((step, i) => (
              <ScrollReveal
                key={step.title}
                delay={i * 90}
                className="md:w-1/3 md:px-5"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div
                    className="relative z-10 mb-5 grid size-16 place-items-center rounded-2xl ring-1 ring-inset ring-[rgba(187,247,70,0.16)]"
                    style={{
                      backgroundColor: "var(--lp-surface-mid)",
                      backgroundImage:
                        "radial-gradient(120% 120% at 50% 0%, rgba(187,247,70,0.16), transparent 70%)",
                      ...(step.glow
                        ? { boxShadow: "0 0 32px rgba(187,247,70,0.16)" }
                        : {}),
                    }}
                  >
                    <step.icon
                      size={24}
                      strokeWidth={1.75}
                      style={{ color: "var(--lp-primary)" }}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className="w-full rounded-xl border p-5 transition-colors duration-200 hover:border-[var(--lp-border-strong)]"
                    style={{
                      backgroundColor: "var(--lp-card-surface)",
                      borderColor: "var(--lp-border-dark)",
                      boxShadow:
                        "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 14px 36px -20px rgba(0,0,0,0.9)",
                    }}
                  >
                    <h3
                      className="mb-2 text-[15px] font-semibold tracking-[-0.01em]"
                      style={{ color: "var(--lp-text-on-dark)" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-[13.5px] leading-[1.65] text-pretty"
                      style={{ color: "var(--lp-text-secondary)" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────── */}
      {/* 5. CTA BANNER             */}
      {/* ──────────────────────── */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[720px]">
          <ScrollReveal>
            <div
              className="relative overflow-hidden rounded-2xl border px-8 py-16 text-center md:px-12 md:py-20"
              style={{
                backgroundColor: "var(--lp-surface-mid)",
                backgroundImage:
                  "radial-gradient(80% 90% at 50% 0%, rgba(187,247,70,0.09), transparent 62%)",
                borderColor: "var(--lp-border-dark)",
                boxShadow:
                  "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 64px -32px rgba(0,0,0,0.9)",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)",
                }}
              />

              <div
                className="mx-auto mb-6 grid size-14 place-items-center rounded-2xl ring-1 ring-inset ring-[rgba(187,247,70,0.18)]"
                style={{ backgroundColor: "rgba(187,247,70,0.10)" }}
              >
                <Sparkles
                  size={26}
                  strokeWidth={2}
                  style={{ color: "var(--lp-primary)" }}
                />
              </div>

              <h2
                className="mb-10 text-[28px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance sm:text-[36px]"
                style={{ color: "var(--lp-text-on-dark)" }}
              >
                Try it out{" "}
                <span className="italic" style={{ color: "var(--lp-primary)" }}>
                  yourself
                </span>
              </h2>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <LandingLink href="/chat" className="w-full sm:w-auto">
                  Try the Live Demo
                  <ArrowRight size={17} />
                </LandingLink>
                <LandingLink
                  href={GITHUB_URL}
                  variant="outline"
                  className="w-full justify-center sm:w-auto"
                >
                  View Source on GitHub
                </LandingLink>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ──────────────────────── */}
      {/* 6. FOOTER                 */}
      {/* ──────────────────────── */}
      <footer
        className="border-t px-6 pt-12 pb-8"
        style={{
          backgroundColor: "var(--lp-bg)",
          borderColor: "var(--lp-border-dark)",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div
            className="flex flex-col items-center justify-between gap-4 text-sm sm:flex-row"
            style={{ color: "var(--lp-text-muted)" }}
          >
            <p className="tabular-nums">Built by Darshil Prajapati · 2026</p>
            <div className="flex items-center gap-4">
              <LandingLink href={GITHUB_URL} variant="muted" size="plain">
                GitHub
              </LandingLink>
              <span aria-hidden>·</span>
              <LandingLink href="/chat" variant="muted" size="plain">
                Open app
              </LandingLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
