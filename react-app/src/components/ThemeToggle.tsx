"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      title={theme === "dark" ? "Use light theme" : "Use dark theme"}
      className="flex size-9 items-center justify-center rounded-lg border border-outline/75 bg-surface text-text-muted hover:text-text"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
