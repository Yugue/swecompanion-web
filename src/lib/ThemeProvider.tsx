"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type Theme = "dark" | "light";
const THEME_KEY = "theme_v1";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

function initialTheme(): Theme {
  // Keep the guide preference even when the visitor starts on the light-only landing page.
  if (typeof window === "undefined") return "light";
  try {
    return window.localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [guideTheme, setGuideTheme] = useState<Theme>(initialTheme);
  const pathname = usePathname();
  const isGuide = /^\/(coding|mldomain|mlsystemdesign)(\/|$)/.test(pathname);
  const theme = isGuide ? guideTheme : "light";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_KEY, guideTheme);
    } catch {
      // The theme still works when browser storage is unavailable.
    }
  }, [guideTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggle: () => setGuideTheme((t) => (t === "dark" ? "light" : "dark")) }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
