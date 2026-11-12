"use client";

import Link from "next/link";
import { cn } from "@/components/ui/utils";

const VARIANTS = {
  primary:
    "btn-shiny bg-[var(--lp-primary)] text-[var(--lp-badge-text)] shadow-[0_1px_0_rgba(255,255,255,0.25)_inset] hover:bg-[var(--lp-primary-hover)] hover:shadow-[0_8px_24px_-8px_rgba(187,247,70,0.6)]",
  outline:
    "border border-[var(--lp-border-dark)] text-[var(--lp-text-on-dark)] hover:border-[var(--lp-border-strong)] hover:bg-white/[0.04]",
  muted: "text-[var(--lp-text-muted)] hover:text-[var(--lp-text-on-dark)]",
} as const;

// Icon side gets 2px less horizontal padding than the text side, so the
// trailing arrow looks optically centered rather than pushed right.
const SIZES = {
  md: "inline-flex items-center gap-2 rounded-xl ps-6 pe-[22px] py-3.5 text-base font-medium [&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:ease-out hover:[&>svg]:translate-x-0.5",
  sm: "inline-flex items-center gap-1.5 rounded-xl ps-5 pe-[18px] py-2.5 text-sm font-medium [&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:ease-out hover:[&>svg]:translate-x-0.5",
  plain: "text-sm",
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
      rel={external ? "noreferrer" : undefined}
      onClick={onClick}
      className={cn(
        "transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out",
        "active:scale-[0.97] motion-reduce:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lp-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--lp-bg)]",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
