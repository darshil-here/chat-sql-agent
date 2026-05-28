"use client"

import { Bot, Wifi } from "lucide-react"

interface StatusStripProps {
  isLoading?: boolean
  isInitializing?: boolean
}

export function StatusStrip({ isLoading = false, isInitializing = false }: StatusStripProps) {
  return (
    <div className="flex items-center justify-between h-8 px-4 bg-panel border-b border-border-subtle text-xs">
      <div className="flex items-center gap-2">
        <Bot className="size-3.5 text-text-muted" />
        <span className="text-text-muted">
          {isInitializing ? "Connecting..." : isLoading ? "Thinking..." : "Ready"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className={`size-1.5 rounded-full ${isLoading || isInitializing ? "bg-accent-warning animate-pulse" : "bg-accent-positive"}`} />
          <Wifi className="size-3 text-text-muted" />
        </div>
        <span className="text-text-muted">Gemini 2.5 Flash</span>
      </div>
    </div>
  )
}
