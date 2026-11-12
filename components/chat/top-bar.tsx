"use client";

import { Database, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { version } from "@/package.json";

// Both icons stay mounted and cross-fade, so the swap has an exit as well as
// an entrance. scale 0.25 → 1, opacity 0 → 1, blur 4px → 0.
const iconTransition =
  "absolute size-4 transition-[opacity,transform,filter] duration-200 ease-[cubic-bezier(0.2,0,0,1)]";

export function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-subtle bg-panel/80 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-2.5">
        <span className="grid size-7 place-items-center rounded-lg bg-accent-brand/12 ring-1 ring-accent-brand/15 ring-inset">
          <Database className="size-3.5 text-accent-brand" strokeWidth={2} />
        </span>
        <span className="text-sm font-medium tracking-[-0.01em] text-text-primary">
          QueryMind
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden rounded-md border border-border-subtle px-1.5 py-0.5 font-mono text-[10.5px] tabular-nums text-text-muted sm:inline">
          v{version}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="size-8 cursor-pointer text-text-muted hover:text-text-primary"
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
          <span className="relative grid size-4 place-items-center">
            <Sun
              aria-hidden
              className={cn(
                iconTransition,
                isDark
                  ? "scale-100 opacity-100 blur-none"
                  : "scale-[0.25] opacity-0 blur-[4px]",
              )}
            />
            <Moon
              aria-hidden
              className={cn(
                iconTransition,
                isDark
                  ? "scale-[0.25] opacity-0 blur-[4px]"
                  : "scale-100 opacity-100 blur-none",
              )}
            />
          </span>
        </Button>
      </div>
    </header>
  );
}
