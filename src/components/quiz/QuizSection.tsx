"use client";

import { useEffect, useState } from "react";
import { Check, Lock, Sparkles, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { usePremium } from "@/lib/usePremium";
import { useQuiz } from "@/lib/useQuiz";
import { SignInDialog } from "@/components/auth/SignInDialog";

export function QuizSection({
  quizId,
  title,
  covers,
  questionCount,
  proof,
}: {
  quizId: string;
  title: string;
  /** One-line description of what the quiz covers, shown even to non-premium visitors. */
  covers: string;
  questionCount: number;
  /** Optional one-line credibility statement shown in the unlock card. */
  proof?: string;
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
          <p className="mb-5 text-sm leading-relaxed text-text-muted">
            Covers: {covers}
          </p>

          <div className="grid gap-4 md:grid-cols-[1.25fr_1fr]">
            <div className="rounded-lg border border-outline bg-surface p-5">
              <h4 className="mb-3 text-base font-bold leading-snug text-text">
                {questionCount} questions designed to reflect real interview questions
              </h4>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Phrased the way real L4–L6 interviewers probe this topic: open-ended prompts, follow-ups, and trade-offs - not definition trivia.",
                  "A model answer for every question, so you hear what a clear, concise answer sounds like and can grade yourself honestly.",
                  "Built like a mock interview: read the question, answer out loud, then reveal - the same pressure as the real thing.",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-sm leading-relaxed text-text-muted">
                    <span
                      className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full"
                      style={{ background: "color-mix(in srgb, var(--accent) 16%, transparent)" }}
                    >
                      <Check size={12} strokeWidth={3} style={{ color: "var(--accent)" }} />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              {proof && (
                <p className="mt-4 border-t border-outline/60 pt-3.5 text-[13px] font-semibold leading-relaxed text-text">
                  {proof}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2" aria-hidden="true">
              {Array.from({ length: Math.min(3, questionCount) }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-lg border border-outline bg-surface p-3"
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
                  <span className="flex flex-1 flex-col gap-1.5">
                    <span className="h-2.5 rounded bg-surface-high" style={{ width: `${88 - i * 14}%` }} />
                    <span className="h-2.5 rounded bg-surface-high" style={{ width: `${56 - i * 8}%` }} />
                  </span>
                  <Lock size={15} className="shrink-0 text-text-muted" />
                </div>
              ))}
              {questionCount > 3 && (
                <p className="px-1 text-xs font-semibold text-text-muted">
                  + {questionCount - 3} more, each with a model answer
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-lg border border-outline bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-text-muted">
              <span className="font-bold text-text">Free to sign up.</span> Your account also saves
              your progress across devices.
            </p>
            <button
              type="button"
              onClick={() => (user ? undefined : setDialogOpen(true))}
              disabled={user !== null && (premiumLoading || premium)}
              className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-5 py-3 text-sm font-bold text-white shadow-sm transition-[filter] hover:brightness-110 disabled:opacity-60"
              style={{ background: "var(--accent)" }}
            >
              <Lock size={16} />
              {!user ? "Sign in to unlock the mock interview" : premiumLoading ? "Checking access…" : "Upgrade to unlock"}
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
