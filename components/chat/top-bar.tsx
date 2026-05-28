import { Database } from "lucide-react"

export function TopBar() {
  return (
    <div className="flex items-center justify-between h-10 px-4 bg-panel border-b border-border-subtle">
      <div className="flex items-center gap-2">
        <Database className="size-4 text-text-muted" />
        <span className="text-sm font-medium text-text-primary">SQL Agent</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-text-muted">v0.1.0</span>
      </div>
    </div>
  )
}
