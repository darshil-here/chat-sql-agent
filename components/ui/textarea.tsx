import * as React from "react"

import { cn } from "./utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "border-border-subtle placeholder:text-text-muted focus-visible:border-accent-focus focus-visible:ring-accent-focus/50 aria-invalid:ring-accent-danger/20 aria-invalid:border-accent-danger flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base text-text-primary shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export { Textarea }
