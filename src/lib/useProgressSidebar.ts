"use client";

import { useCallback, useLayoutEffect, useState } from "react";

/** One device preference per track; new visitors start with the panel collapsed. */
export function useProgressSidebar(track: "leetcode" | "ml") {
  const storageKey = `swe-companion:progress-sidebar-collapsed:${track}`;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useLayoutEffect(() => {
    try {
      // Restore browser-only preferences after hydration and before the next paint.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarCollapsed(localStorage.getItem(storageKey) !== "false");
    } catch {
      // The default stays usable when storage is unavailable.
    }
  }, [storageKey]);

  const toggleSidebar = useCallback(() => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    try { localStorage.setItem(storageKey, String(next)); } catch {
      // Toggling still works for this visit when storage is blocked or full.
    }
  }, [sidebarCollapsed, storageKey]);

  return { sidebarCollapsed, toggleSidebar };
}
