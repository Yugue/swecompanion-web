"use client";

import { useCallback, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

type Status = "idle" | "loading" | "loaded" | "denied" | "error";

const cache = new Map<string, string[]>();

/** Fetches the premium answer array for a quiz on demand. Reads are only permitted by
 * firestore.rules when the caller's profile has `premium: true` - see the plan's
 * "Premium quiz architecture". A non-premium fetch resolves to status "denied", not an answer. */
export function useQuizAnswers(quizId: string) {
  const [answers, setAnswers] = useState<string[] | null>(cache.get(quizId) ?? null);
  const [status, setStatus] = useState<Status>(cache.has(quizId) ? "loaded" : "idle");

  const load = useCallback(async () => {
    const cached = cache.get(quizId);
    if (cached) {
      setAnswers(cached);
      setStatus("loaded");
      return;
    }
    setStatus("loading");
    try {
      const snap = await getDoc(doc(db, "quizAnswers", quizId));
      const data = (snap.data()?.answers as string[] | undefined) ?? [];
      cache.set(quizId, data);
      setAnswers(data);
      setStatus("loaded");
    } catch (err) {
      const code = (err as { code?: string })?.code;
      setStatus(code === "permission-denied" ? "denied" : "error");
    }
  }, [quizId]);

  return { answers, status, load };
}
