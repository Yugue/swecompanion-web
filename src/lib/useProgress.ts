"use client";

import { useCallback, useEffect, useState } from "react";

function loadLocal(key: string, fallback: string[]): Set<string> {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return new Set(fallback);
    const saved: unknown = JSON.parse(raw);
    return Array.isArray(saved) && saved.every((id) => typeof id === "string")
      ? new Set(saved)
      : new Set(fallback);
  } catch {
    return new Set(fallback);
  }
}

/** Learning progress belongs to this browser, independently of login or plan. */
export function useProgress(kind: "leetcode" | "ml" | "aml" | "agentic" | "rrp" | "cv" | "nlp" | "genai" | "llm" | "speech" | "rl" | "distributed" | "mlsd", initial: string[]) {
  // Keep the existing key so switching to local-only storage preserves progress.
  const storageKey = `progress_${kind}_v2`;
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(initial));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrate after the static page mounts. Gate persistence so the initial
    // render cannot overwrite saved progress with an empty set in Strict Mode.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompleted(loadLocal(storageKey, initial));
    setHydrated(true);
    // Each guide supplies a fixed kind and initial list for this mounted hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify([...completed]));
    } catch {
      // If browser storage is unavailable, this tab still keeps progress in memory.
    }
  }, [completed, hydrated, storageKey]);

  const toggle = useCallback((id: string) => {
    setCompleted((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const reset = useCallback(() => { setCompleted(new Set()); }, []);
  return { completed, toggle, reset };
}
