"use client";

import { useState } from "react";
import { Lock, Sparkles, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { usePremium } from "@/lib/usePremium";
import { useQuizAnswers } from "@/lib/useQuizAnswers";
import { SignInDialog } from "@/components/auth/SignInDialog";

export function QuizSection({
  quizId,
  title,
  questions,
}: {
  quizId: string;
  title: string;
  questions: { question: string }[];
}) {
  const { user } = useAuth();
  const { premium, loading: premiumLoading } = usePremium();
  const { answers, status, load } = useQuizAnswers(quizId);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);

  if (questions.length === 0) return null;

  function reveal(index: number) {
    if (!user) {
      setDialogOpen(true);
      return;
    }
    // Still mark it "revealed" when not premium - that's what surfaces the upgrade prompt
    // below, instead of silently doing nothing.
    if (premium && status === "idle") void load();
    setRevealed((prev) => new Set(prev).add(index));
  }

  return (
    <section
      className="mt-2 rounded-xl border p-5"
      style={{ borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)" }}
    >
      <div className="mb-1 flex flex-wrap items-center gap-2.5">
        <Sparkles size={20} style={{ color: "var(--accent)" }} />
        <h3 className="text-lg font-bold text-text">{title}</h3>
        <span
          className="rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide"
          style={{
            color: "var(--accent)",
            background: "color-mix(in srgb, var(--accent) 15%, transparent)",
          }}
        >
          MOCK INTERVIEW · PREMIUM
        </span>
      </div>
      <p className="mb-4 text-sm text-text-muted">
        These are asked in real interviews. Answer out loud first, then reveal the model answer.
      </p>

      <div className="flex flex-col gap-2.5">
        {questions.map((q, i) => {
          const isRevealed = revealed.has(i);
          const answer = answers?.[i];
          return (
            <div
              key={i}
              className="rounded-lg border border-outline bg-surface p-3.5"
            >
              <button
                type="button"
                onClick={() => reveal(i)}
                className="flex w-full items-start gap-2.5 text-left"
              >
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded text-xs font-extrabold"
                  style={{
                    color: "var(--accent)",
                    background: "color-mix(in srgb, var(--accent) 14%, transparent)",
                  }}
                >
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-semibold leading-snug text-text">
                  {q.question}
                </span>
                {!user ? (
                  <Lock size={17} className="mt-0.5 shrink-0 text-text-muted" />
                ) : isRevealed ? (
                  <EyeOff size={17} className="mt-0.5 shrink-0 text-text-muted" />
                ) : (
                  <Eye size={17} className="mt-0.5 shrink-0 text-text-muted" />
                )}
              </button>

              {isRevealed && user && !premium && !premiumLoading && (
                <p className="mt-3 rounded-md bg-accent-yellow/10 p-3 text-sm text-text-muted">
                  Premium unlocks the model answer for every mock-interview question. Ask about
                  upgrading your account to get access.
                </p>
              )}
              {isRevealed && premium && status === "loading" && (
                <p className="mt-3 text-sm text-text-muted">Loading answer…</p>
              )}
              {isRevealed && premium && status === "loaded" && answer && (
                <p className="mt-3 rounded-md border border-accent-green/35 bg-accent-green/10 p-3 text-sm leading-relaxed text-text">
                  {answer}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {dialogOpen && <SignInDialog onClose={() => setDialogOpen(false)} />}
    </section>
  );
}
