"use client";

import { useEffect, useState } from "react";
import { Lock, Sparkles, Eye, EyeOff, Mic } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { usePremium } from "@/lib/usePremium";
import { useQuiz } from "@/lib/useQuiz";
import { SignInDialog } from "@/components/auth/SignInDialog";

export function QuizSection({
  quizId,
  title,
  covers,
  questionCount,
}: {
  quizId: string;
  title: string;
  /** One-line description of what the quiz covers, shown even to non-premium visitors. */
  covers: string;
  questionCount: number;
}) {
  const { user } = useAuth();
  const { premium, loading: premiumLoading } = usePremium();
  const { quiz, status, load } = useQuiz(quizId);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);

  // Premium members see the quiz immediately - no separate unlock click needed once they're
  // already paying for access.
  useEffect(() => {
    if (premium && status === "idle") void load();
  }, [premium, status, load]);

  if (questionCount === 0) return null;

  const unlocked = premium && status === "loaded" && quiz;

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

      {!unlocked && (
        <>
          <p className="mb-4 text-sm leading-relaxed text-text-muted">{covers}</p>
          <div className="flex flex-col items-start gap-4 rounded-lg border border-outline bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full"
                style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)" }}
              >
                <Mic size={20} style={{ color: "var(--accent)" }} />
              </div>
              <div>
                <p className="text-sm font-bold text-text">
                  {questionCount} question{questionCount === 1 ? "" : "s"}, written to match a real
                  L4–L6 interview
                </p>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-text-muted">
                  These aren&apos;t generic trivia - they&apos;re phrased and paced the way an
                  interviewer actually probes this topic, with model answers you can compare
                  yourself against. Questions and answers are both premium.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => (user ? undefined : setDialogOpen(true))}
              disabled={user !== null && (premiumLoading || premium)}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "var(--accent)" }}
            >
              <Lock size={16} />
              {!user ? "Sign in to unlock" : premiumLoading ? "Checking access…" : "Upgrade to unlock"}
            </button>
          </div>
          {user && !premiumLoading && !premium && (
            <p className="mt-3 text-sm text-text-muted">
              Signed in, but this account isn&apos;t premium yet. Ask about upgrading to get
              access.
            </p>
          )}
        </>
      )}

      {premium && status === "loading" && <p className="text-sm text-text-muted">Loading quiz…</p>}
      {premium && status === "denied" && (
        <p className="text-sm text-text-muted">
          This account isn&apos;t premium yet - ask about upgrading to get access.
        </p>
      )}

      {unlocked && (
        <div className="flex flex-col gap-2.5">
          <p className="mb-1 text-sm text-text-muted">
            Answer out loud first, then reveal the model answer.
          </p>
          {quiz.questions.map((question, i) => {
            const isRevealed = revealed.has(i);
            return (
              <div key={i} className="rounded-lg border border-outline bg-surface p-3.5">
                <button
                  type="button"
                  onClick={() => setRevealed((prev) => new Set(prev).add(i))}
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
                    {question}
                  </span>
                  {isRevealed ? (
                    <EyeOff size={17} className="mt-0.5 shrink-0 text-text-muted" />
                  ) : (
                    <Eye size={17} className="mt-0.5 shrink-0 text-text-muted" />
                  )}
                </button>
                {isRevealed && (
                  <p className="mt-3 rounded-md border border-accent-green/35 bg-accent-green/10 p-3 text-sm leading-relaxed text-text">
                    {quiz.answers[i]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {dialogOpen && <SignInDialog onClose={() => setDialogOpen(false)} />}
    </section>
  );
}
