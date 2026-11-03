"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function QuizQuestions({ quiz }: { quiz: { questions: string[]; answers: string[] } }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  return (
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
              aria-expanded={isRevealed}
              onClick={() => setRevealed((prev) => {
                const next = new Set(prev);
                if (next.has(i)) next.delete(i);
                else next.add(i);
                return next;
              })}
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
  );
}
