"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";
const THEME_KEY = "theme_v1";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

function initialTheme(): Theme {
  // The blocking inline script in layout.tsx already set this attribute (from localStorage)
  // before hydration runs, so reading it back here matches what's already painted - no flash,
  // and no separate "hydrate from storage" effect/setState needed.
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
