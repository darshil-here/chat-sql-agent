"use client";

import Link from "next/link";
import { cn } from "@/components/ui/utils";

const VARIANTS = {
  primary:
    "btn-shiny bg-[var(--lp-primary)] text-[var(--lp-badge-text)] hover:bg-[var(--lp-primary-hover)]",
  outline:
    "border border-[var(--lp-border-dark)] text-[var(--lp-text-on-dark)] hover:border-[var(--lp-text-on-dark)]",
  muted: "text-[var(--lp-text-muted)] hover:text-[var(--lp-text-on-dark)]",
} as const;

const SIZES = {
  md: "inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base font-medium transition-all duration-300",
  sm: "inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300",
  plain: "text-sm transition-colors",
} as const;

interface LandingLinkProps {
  href: string;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export function LandingLink({
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  children,
}: LandingLinkProps) {
  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      onClick={onClick}
      className={cn(VARIANTS[variant], SIZES[size], className)}
    >
      {children}
    </Link>
  );
}
