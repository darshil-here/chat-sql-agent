"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

const sections = [
  { id: "features", label: "Overview" },
  { id: "how-it-works", label: "How It Works" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "github", label: "GitHub" },
];

const features = [
  {
    icon: MessageSquare,
    title: "Ask in plain English",
    desc: "The model is fine-tuned to understand natural language inputs and map them to the correct database query, handling ambiguous phrasing, varied sentence structures, and context.",
  },
  {
    icon: Database,
    title: "Live backend integration",
    desc: "The app connects to a real database backend and fetches live data on every query. No hardcoded responses, no mock data, every answer reflects the actual state of the database.",
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
    desc: "The fine-tuned model parses the question, determines intent, and constructs the appropriate database query to fetch the right data.",
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

function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className="scroll-reveal">
      {children}
    </div>
  );
}

export default function QueryMindLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
      {/* ──────────────────────── */}
      {/* 1. NAVIGATION BAR        */}
      {/* ──────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: "var(--lp-bg)",
          borderBottom: "1px solid var(--lp-border-dark)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-12 lg:px-16 py-4">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
            style={{ color: "var(--lp-text-on-dark)" }}
          >
            <Sparkles size={20} style={{ color: "var(--lp-primary)" }} />
            QueryMind
          </button>

          {/* Desktop center links */}
          <div className="hidden sm:flex items-center gap-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-sm px-3 py-2 rounded-lg transition-colors"
                style={{ color: "var(--lp-text-secondary)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--lp-text-on-dark)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--lp-text-secondary)")
                }
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="https://github.com"
              target="_blank"
              className="btn-shiny inline-flex items-center gap-1.5 text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-300 relative"
              style={{
                backgroundColor: "var(--lp-primary)",
                color: "var(--lp-badge-text)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--lp-primary-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--lp-primary)")
              }
            >
              View on GitHub
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg"
            style={{ color: "var(--lp-text-on-dark)" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="sm:hidden px-6 pb-4 space-y-2"
            style={{
              backgroundColor: "var(--lp-bg)",
              borderBottom: "1px solid var(--lp-border-dark)",
            }}
          >
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="block w-full text-left text-sm px-3 py-2.5 rounded-lg transition-colors"
                style={{ color: "var(--lp-text-secondary)" }}
              >
                {s.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="https://github.com"
                target="_blank"
                className="btn-shiny inline-flex items-center justify-center gap-1.5 text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-300 relative"
                style={{
                  backgroundColor: "var(--lp-primary)",
                  color: "var(--lp-badge-text)",
                }}
                onClick={() => setMenuOpen(false)}
              >
                View on GitHub
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ──────────────────────── */}
      {/* 2. HERO SECTION          */}
      {/* ──────────────────────── */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6 text-center relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(circle, rgba(187,247,70,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Headline */}
          <ScrollReveal>
            <h1
              className="text-4xl sm:text-5xl lg:text-[48px] font-semibold leading-[1.1] tracking-tight max-w-4xl mx-auto mb-6"
              style={{ color: "var(--lp-text-on-dark)" }}
            >
              Talk to the data.
              <br />
              Get{" "}
              <span className="italic" style={{ color: "var(--lp-primary)" }}>
                real
              </span>{" "}
              answers, instantly.
            </h1>
          </ScrollReveal>

          {/* Sub-headline */}
          <ScrollReveal>
            <p
              className="text-base max-w-[520px] mx-auto mb-10 leading-relaxed"
              style={{ color: "var(--lp-text-secondary)" }}
            >
              AskDB connects to backend and lets anyone ask data related
              questions in plain English — no SQL needed.
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/chat"
                className="btn-shiny inline-flex items-center gap-2 text-base font-medium px-6 py-3.5 rounded-xl transition-all duration-300 relative"
                style={{
                  backgroundColor: "var(--lp-primary)",
                  color: "var(--lp-badge-text)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--lp-primary-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--lp-primary)")
                }
              >
                Try the Live Demo
                <ArrowRight size={18} />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                className="inline-flex items-center gap-2 text-base font-medium px-6 py-3.5 rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid var(--lp-border-dark)",
                  color: "var(--lp-text-on-dark)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--lp-text-on-dark)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--lp-border-dark)";
                }}
              >
                View on GitHub
              </Link>
            </div>
          </ScrollReveal>

          {/* Mock Chat UI */}
          <ScrollReveal>
            <div
              className="max-w-xl mx-auto text-left rounded-xl overflow-hidden"
              style={{
                backgroundColor: "var(--lp-card-surface)",
                boxShadow: "var(--lp-shadow-card)",
                border: "1px solid var(--lp-border-dark)",
              }}
            >
              {/* Mock chat header */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{ borderColor: "var(--lp-border-dark)" }}
              >
                <Sparkles size={16} style={{ color: "var(--lp-primary)" }} />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--lp-text-on-dark)" }}
                >
                  QueryMind
                </span>
              </div>

              <div className="p-4 space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div
                    className="max-w-[80%] text-sm rounded-xl px-4 py-2.5"
                    style={{
                      backgroundColor: "var(--lp-primary)",
                      color: "var(--lp-badge-text)",
                      borderRadius: "12px 12px 4px 12px",
                    }}
                  >
                    How many new users signed up this month?
                  </div>
                </div>

                {/* AI response */}
                <div className="flex justify-start">
                  <div
                    className="max-w-[85%] text-sm rounded-xl px-4 py-3 space-y-2"
                    style={{
                      backgroundColor: "var(--lp-bg)",
                      border: "1px solid var(--lp-border-dark)",
                      borderRadius: "12px 12px 12px 4px",
                    }}
                  >
                    <p style={{ color: "var(--lp-text-on-dark)" }}>
                      There were <strong>1,284 new signups</strong> in May 2025.
                      That&apos;s up 18% from last month.
                      <span
                        className="inline-block w-[2px] h-[1em] ml-0.5 align-middle animate-pulse"
                        style={{
                          backgroundColor: "var(--lp-primary)",
                        }}
                      />
                    </p>

                    {/* Collapsible SQL */}
                    <details className="group">
                      <summary
                        className="text-xs cursor-pointer list-none flex items-center gap-1"
                        style={{ color: "var(--lp-text-muted)" }}
                      >
                        <span className="transition-transform duration-200 group-open:rotate-90">
                          ▸
                        </span>
                        Query used
                      </summary>
                      <pre
                        className="mt-2 text-xs p-3 rounded-lg overflow-x-auto"
                        style={{
                          backgroundColor: "rgba(0,0,0,0.3)",
                          color: "var(--lp-text-secondary)",
                          fontFamily: "ui-monospace, monospace",
                        }}
                      >
                        {`SELECT COUNT(*)
FROM users
WHERE created_at >= '2025-05-01'`}
                      </pre>
                    </details>
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
        className="py-20 md:py-28 px-6"
        style={{ backgroundColor: "var(--lp-bg)" }}
      >
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2
              className="text-3xl sm:text-4xl font-semibold text-center mb-4 leading-[1.2]"
              style={{ color: "var(--lp-text-on-dark)" }}
            >
              What this project demonstrates
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <p
              className="text-base text-center max-w-xl mx-auto mb-16"
              style={{ color: "var(--lp-text-secondary)" }}
            >
              A look at the core technical skills behind this build.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <ScrollReveal key={i}>
                <div
                  className="rounded-xl p-6 md:p-8 transition-all duration-300"
                  style={{
                    backgroundColor: "var(--lp-card-surface)",
                    border: "1px solid var(--lp-border-dark)",
                    boxShadow: "var(--lp-shadow-card)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: "rgba(187, 247, 70, 0.12)",
                    }}
                  >
                    <f.icon size={20} style={{ color: "var(--lp-primary)" }} />
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--lp-text-on-dark)" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
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
        className="py-20 md:py-28 px-6"
        style={{ backgroundColor: "var(--lp-surface-mid)" }}
      >
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2
              className="text-3xl sm:text-4xl font-semibold text-center mb-4 leading-[1.2]"
              style={{ color: "var(--lp-text-on-dark)" }}
            >
              How it works under the hood
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <p
              className="text-base text-center max-w-xl mx-auto mb-16"
              style={{ color: "var(--lp-text-secondary)" }}
            >
              The technical flow from question to answer.
            </p>
          </ScrollReveal>

          {/* Steps with connecting line */}
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0">
            {/* Connecting line (desktop) */}
            {/*
            <div
              className="hidden md:block absolute top-8 left-[15%] right-[15%] h-px"
              style={{ backgroundColor: "var(--lp-border-dark)" }}
            />
             */}

            {/* Connecting dots */}
            {/*
            <div
              className="hidden md:block absolute top-8 left-[15%] right-[15%] flex justify-between pointer-events-none"
              style={{ transform: "translateY(-4px)" }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--lp-primary)" }}
              />
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--lp-primary)" }}
              />
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--lp-primary)" }}
              />
            </div>
            */}

            {steps.map((step, i) => (
              <ScrollReveal key={i}>
                <div className="flex flex-col items-center text-center md:w-1/3 md:px-6 relative">
                  {/* Icon */}
                  <div
                    className="relative w-16 h-16 rounded-xl flex items-center justify-center mb-5"
                    style={{
                      backgroundColor: "rgba(187, 247, 70, 0.12)",
                      ...(step.glow
                        ? {
                            boxShadow: "0 0 20px rgba(187,247,70,0.2)",
                          }
                        : {}),
                    }}
                  >
                    <step.icon
                      size={26}
                      style={{ color: "var(--lp-primary)" }}
                    />
                  </div>

                  {/* Card */}
                  <div
                    className="rounded-xl p-5 w-90"
                    style={{
                      backgroundColor: "var(--lp-card-surface)",
                      border: "1px solid var(--lp-border-dark)",
                    }}
                  >
                    <h3
                      className="text-base font-semibold mb-2"
                      style={{ color: "var(--lp-text-on-dark)" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
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
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-[700px] mx-auto">
          <ScrollReveal>
            <div
              className="rounded-xl text-center px-8 py-16 md:px-12 md:py-20"
              style={{
                backgroundColor: "var(--lp-surface-mid)",
                border: "1px solid var(--lp-border-dark)",
                boxShadow: "var(--lp-shadow-card)",
              }}
            >
              <Sparkles
                size={32}
                className="mx-auto mb-6"
                style={{ color: "var(--lp-primary)" }}
              />
              <h2
                className="text-3xl sm:text-4xl font-semibold leading-[1.2] mb-10"
                style={{ color: "var(--lp-text-on-dark)" }}
              >
                Try it out{" "}
                <span className="italic" style={{ color: "var(--lp-primary)" }}>
                  yourself
                </span>
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/chat"
                  className="btn-shiny inline-flex items-center gap-2 text-base font-medium px-6 py-3.5 rounded-xl transition-all duration-300 relative"
                  style={{
                    backgroundColor: "var(--lp-primary)",
                    color: "var(--lp-badge-text)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--lp-primary-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--lp-primary)")
                  }
                >
                  Try the Live Demo
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="https://github.com"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-base font-medium px-6 py-3.5 rounded-xl transition-all duration-300"
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid var(--lp-border-dark)",
                    color: "var(--lp-text-on-dark)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--lp-text-on-dark)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--lp-border-dark)";
                  }}
                >
                  View Source on GitHub
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ──────────────────────── */}
      {/* 6. FOOTER                 */}
      {/* ──────────────────────── */}
      <footer
        className="pt-12 pb-8 px-6"
        style={{
          backgroundColor: "var(--lp-bg)",
          borderTop: "1px solid var(--lp-border-dark)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
            style={{
              color: "var(--lp-text-muted)",
            }}
          >
            <p>Built by [Your Name] &middot; 2025</p>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com"
                target="_blank"
                className="transition-colors"
                style={{ color: "var(--lp-text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--lp-text-on-dark)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--lp-text-muted)")
                }
              >
                GitHub
              </Link>
              <span>&middot;</span>
              <Link
                href="/chat"
                className="transition-colors"
                style={{ color: "var(--lp-text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--lp-text-on-dark)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--lp-text-muted)")
                }
              >
                Live Demo
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
