"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  mounted: false,
})

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

// Stable server snapshot: always dark until the client takes over.
let clientTheme: Theme = "dark"

function getClientTheme(): Theme {
  const saved = localStorage.getItem("theme")
  if (saved === "light" || saved === "dark") return saved
  return "dark"
}

function getSnapshot(): Theme {
  clientTheme = getClientTheme()
  return clientTheme
}

function getServerSnapshot(): Theme {
  return "dark"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark"
    localStorage.setItem("theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
    window.dispatchEvent(new StorageEvent("storage"))
  }, [theme])

  const value = useMemo(
    () => ({ theme, toggleTheme, mounted: true }),
    [theme, toggleTheme],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)