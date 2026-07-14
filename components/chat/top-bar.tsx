"use client"

import { Database, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function TopBar() {
  const { theme, toggleTheme, mounted } = useTheme()

  return (
    <div className="flex items-center justify-between h-10 px-4 bg-panel border-b border-border-subtle">
      <div className="flex items-center gap-2">
        <Database className="size-4 text-text-muted" />
        <span className="text-sm font-medium text-text-primary">SQL Agent</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-text-muted">v0.1.0</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="size-8 cursor-pointer"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {mounted && theme === "dark" ? (
            <Sun className="size-4 text-text-muted" />
          ) : (
            <Moon className="size-4 text-text-muted" />
          )}
        </Button>
      </div>
    </div>
  )
}
