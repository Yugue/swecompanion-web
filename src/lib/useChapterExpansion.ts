"use client";

import { useEffect, useLayoutEffect, useState } from "react";

/** Restore after hydration; never overwrite saved choices with the server defaults. */
export function useChapterExpansion(storageKey: string, firstChapterId?: string) {
  const [openChapters, setOpenChapters] = useState<Set<string>>(
    () => new Set(firstChapterId ? [firstChapterId] : [])
  );
  const [restored, setRestored] = useState(false);

  useLayoutEffect(() => {
    let chapters = new Set(firstChapterId ? [firstChapterId] : []);
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw !== null) {
        const saved: unknown = JSON.parse(raw);
        if (Array.isArray(saved) && saved.every((id) => typeof id === "string")) {
          chapters = new Set(saved);
        }
      }
    } catch {
      // Malformed or unavailable storage falls back to the first chapter.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenChapters(chapters);
    setRestored(true);
  }, [storageKey, firstChapterId]);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify([...openChapters]));
    } catch {
      // Expansion remains usable when storage is blocked or full.
    }
  }, [storageKey, openChapters, restored]);

  return [openChapters, setOpenChapters] as const;
}
