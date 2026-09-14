"use client";

import { useCallback, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

type Status = "idle" | "loading" | "loaded" | "denied" | "error";

export interface Quiz {
  questions: string[];
  answers: string[];
}

const cache = new Map<string, Quiz>();

/** Fetches a full quiz (questions AND answers) on demand. Both are premium content - reads are
 * only permitted by firestore.rules when the caller's profile has `premium: true` - see the
 * plan's "Premium quiz architecture". A non-premium fetch resolves to status "denied", not data. */
export function useQuiz(quizId: string) {
  const [quiz, setQuiz] = useState<Quiz | null>(cache.get(quizId) ?? null);
  const [status, setStatus] = useState<Status>(cache.has(quizId) ? "loaded" : "idle");

  const load = useCallback(async () => {
    const cached = cache.get(quizId);
    if (cached) {
      setQuiz(cached);
      setStatus("loaded");
      return;
    }
    setStatus("loading");
    try {
      const snap = await getDoc(doc(db, "quizzes", quizId));
      const data = snap.data() as Quiz | undefined;
      const result: Quiz = { questions: data?.questions ?? [], answers: data?.answers ?? [] };
      cache.set(quizId, result);
      setQuiz(result);
      setStatus("loaded");
    } catch (err) {
      const code = (err as { code?: string })?.code;
      setStatus(code === "permission-denied" ? "denied" : "error");
    }
  }, [quizId]);

  return { quiz, status, load };
}
