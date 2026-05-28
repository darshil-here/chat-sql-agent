"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
})

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  const saved = localStorage.getItem("theme")
  if (saved === "light" || saved === "dark") return saved
  return "dark"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  )

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
