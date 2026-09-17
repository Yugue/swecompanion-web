"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthProvider";

function loadLocal(key: string, fallback: string[]): Set<string> {
  if (typeof window === "undefined") return new Set(fallback);
  try {
    const raw = window.localStorage.getItem(key);
    return raw == null ? new Set(fallback) : new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set(fallback);
  }
}

/**
 * Completed-item tracking, mirroring `shared_preferences` in the Flutter app: always persisted
 * to localStorage, and additionally synced to Firestore once signed in so progress follows the
 * user across devices - the retention hook described in the plan.
 *
 * The local<->remote merge (a union, so nothing already marked complete on either side is lost)
 * only ever runs ONCE per account per device, on the first sign-in - tracked by a small
 * `<key>_merged_<uid>` localStorage flag. After that, Firestore is the source of truth and every
 * toggle writes straight through to it; without the once-only flag, re-unioning on every page
 * load would silently re-check anything you'd ever completed before, undoing an uncheck the
 * instant a stale write raced a reload.
 */
export function useProgress(kind: "leetcode" | "ml", initial: string[]) {
  const storageKey = `progress_${kind}_v1`;
  const { user } = useAuth();
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(initial));
  // `hydrated` has to be React state, not a ref: it's set in the same effect as `setCompleted`,
  // and only state updates from the same effect are guaranteed to land in the same render. With a
  // ref, `hydrated.current` flips to true synchronously while the paired `setCompleted` is still
  // pending, so the persist effect below could fire once with hydrated=true but the *old* (empty)
  // `completed` closure and write that empty set back over real localStorage data - React Strict
  // Mode's double-invoked effects turned that into a permanent data loss, not just a flicker.
  const [hydrated, setHydrated] = useState(false);
  const completedRef = useRef(completed);
  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);
  const mergedForUid = useRef<string | null>(null);

  useEffect(() => {
    // Server-rendered HTML (and this component's first client render, to avoid a hydration
    // mismatch on every checkbox) uses `initial`; localStorage is only readable after mount, so
    // correcting from it here - once - is the standard pattern for this exact SSR/CSR gap.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompleted(loadLocal(storageKey, initial));
    setHydrated(true);
    // Only run once on mount - `initial` is a stable default set from static data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify([...completed]));
  }, [completed, hydrated, storageKey]);

  useEffect(() => {
    if (!user || mergedForUid.current === user.uid) return;
    mergedForUid.current = user.uid;
    const ref = doc(db, "users", user.uid, "progress", kind);
    const mergeFlagKey = `${storageKey}_merged_${user.uid}`;

    if (window.localStorage.getItem(mergeFlagKey)) {
      // Already merged on this device before - Firestore is authoritative from here on.
      // If offline/unreachable, silently keep whatever localStorage already has.
      getDoc(ref)
        .then((snap) => {
          if (snap.exists()) setCompleted(new Set(snap.data().completed ?? []));
        })
        .catch(() => {});
      return;
    }

    getDoc(ref)
      .then((snap) => {
        const remote: string[] = snap.exists() ? (snap.data().completed ?? []) : [];
        const merged = new Set([...completedRef.current, ...remote]);
        void setDoc(ref, { completed: [...merged] }, { merge: true });
        window.localStorage.setItem(mergeFlagKey, "1");
        setCompleted(merged);
      })
      .catch(() => {
        // Offline/unreachable - leave local state as-is and retry the merge on a later mount
        // (the flag was never written, so this branch runs again next time).
      });
  }, [user, kind, storageKey]);

  const writeRemote = useCallback(
    (next: Set<string>) => {
      if (!user) return;
      void setDoc(doc(db, "users", user.uid, "progress", kind), { completed: [...next] }, { merge: true }).catch(
        () => {}
      );
    },
    [user, kind]
  );

  const toggle = useCallback(
    (id: string) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        writeRemote(next);
        return next;
      });
    },
    [writeRemote]
  );

  const reset = useCallback(() => {
    setCompleted(new Set());
    writeRemote(new Set());
  }, [writeRemote]);

  return { completed, toggle, reset };
}
