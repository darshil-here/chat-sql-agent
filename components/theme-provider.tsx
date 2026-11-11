"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
})

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

function getSnapshot(): Theme {
  const saved = localStorage.getItem("theme")
  return saved === "light" || saved === "dark" ? saved : "dark"
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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark"
    localStorage.setItem("theme", next)
    window.dispatchEvent(new StorageEvent("storage"))
  }, [theme])

  const value = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
