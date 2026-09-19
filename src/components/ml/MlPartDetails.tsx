"use client";
/* eslint-disable react-hooks/static-components -- `getIcon` looks up a stable reference from a
   module-level map, never defines a new component; this pattern reads as unsafe to the linter's
   heuristic but isn't. */

import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { mlPartsById, type MlPart } from "@/lib/mlStudyData";
import { getIcon } from "@/lib/icons";
import { ProgressRing } from "@/components/ProgressRing";
import { QuizTeaser } from "@/components/quiz/QuizTeaser";
import { DEEP_LEARNING_PATH } from "@/lib/mlDomains";

export function MlPartDetails({
  part,
  completed,
  open,
  onToggle,
  onToggleTopic,
  basePath = DEEP_LEARNING_PATH,
  partsById = mlPartsById,
}: {
  part: MlPart;
  completed: Set<string>;
  open: boolean;
  onToggle: () => void;
  onToggleTopic: (id: string) => void;
  basePath?: string;
  partsById?: Record<string, MlPart>;
}) {
  const Icon = getIcon(part.icon);
  const done = part.topics.filter((t) => completed.has(t.id)).length;

  return (
    <details
      id={part.id}
      open={open}
      onToggle={(e) => {
        if (e.currentTarget.open !== open) onToggle();
      }}
      className="scroll-mt-24 overflow-hidden rounded-xl border border-outline/70 bg-surface"
      style={{ "--accent": part.color } as React.CSSProperties}
    >
      <summary className="flex items-start gap-3.5 px-5 py-5">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border"
          style={{
            background: "color-mix(in srgb, var(--accent) 14%, transparent)",
            borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)",
          }}
        >
          <Icon size={22} style={{ color: "var(--accent)" }} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold tracking-tight text-text">
            Chapter {part.number} — {part.title}
          </h3>
          <p className="text-sm leading-relaxed text-text-muted">{part.description}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2.5">
          <ProgressRing done={done} total={part.topics.length} color={part.color} size={44} strokeWidth={3} />
          {open ? <ChevronUp size={20} className="text-text-muted" /> : <ChevronDown size={20} className="text-text-muted" />}
        </div>
      </summary>

      <div className="border-t-[3px]" style={{ borderColor: "var(--accent)" }} />

      <div className="py-1">
        {part.topics.map((topic, i) => {
          const isDone = completed.has(topic.id);
          // Number by position in the full chapter, so search/filter doesn't renumber lessons.
          const position = (partsById[part.id]?.topics.findIndex((t) => t.id === topic.id) ?? i) + 1;
          return (
            <div
              key={topic.id}
              className={`flex items-center gap-3.5 px-5 transition-colors hover:bg-surface-high/50 ${
                i > 0 ? "border-t border-outline/40" : ""
              }`}
            >
              <span className="flex w-11 shrink-0 justify-center">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => onToggleTopic(topic.id)}
                  className="size-[18px] cursor-pointer accent-[var(--accent)]"
                  aria-label={`Mark ${topic.title} completed`}
                />
              </span>
              <Link
                href={`${basePath}/${topic.id}`}
                className="flex min-w-0 flex-1 items-center gap-3.5 py-2.5"
              >
                <span
                  className="w-11 shrink-0 text-sm font-bold tabular-nums"
                  style={{ color: isDone ? "var(--color-text-muted)" : "var(--accent)" }}
                >
                  {part.number}.{position}
                </span>
                <span
                  className={`min-w-0 flex-1 text-[15px] leading-snug ${
                    isDone ? "text-text-muted line-through decoration-text-muted" : "text-text"
                  }`}
                >
                  {topic.title}
                </span>
                <span className="flex w-9 shrink-0 justify-center text-text-muted sm:w-11">
                  <ChevronRight size={17} />
                </span>
              </Link>
            </div>
          );
        })}
      </div>

      {part.quizQuestionCount > 0 && (
        <QuizTeaser
          href={`${basePath}/${part.id}/quiz`}
          title={`Chapter ${part.number} mock interview`}
          questionCount={part.quizQuestionCount}
          className="border-t border-outline/50"
        />
      )}
    </details>
  );
}
