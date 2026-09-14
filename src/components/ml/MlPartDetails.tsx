"use client";
/* eslint-disable react-hooks/static-components -- `getIcon` looks up a stable reference from a
   module-level map, never defines a new component; this pattern reads as unsafe to the linter's
   heuristic but isn't. */

import Link from "next/link";
import { ChevronDown, ChevronUp, ClipboardCheck } from "lucide-react";
import type { MlPart } from "@/lib/mlStudyData";
import { getIcon } from "@/lib/icons";
import { ProgressRing } from "@/components/ProgressRing";

export function MlPartDetails({
  part,
  completed,
  open,
  onToggle,
  onToggleTopic,
}: {
  part: MlPart;
  completed: Set<string>;
  open: boolean;
  onToggle: () => void;
  onToggleTopic: (id: string) => void;
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

      <div>
        {part.topics.map((topic, i) => (
          <div
            key={topic.id}
            className="flex items-center gap-3 border-t border-outline/40 px-4 py-2.5 first:border-t-0"
          >
            <input
              type="checkbox"
              checked={completed.has(topic.id)}
              onChange={() => onToggleTopic(topic.id)}
              className="size-[18px] shrink-0 accent-[var(--accent)]"
              aria-label={`Mark ${topic.title} reviewed`}
            />
            <span className="w-9 shrink-0 text-right text-xs font-bold text-text-muted">
              {part.number}.{i + 1}
            </span>
            <Link
              href={`/ml/${topic.id}`}
              className={`flex-1 text-[15px] leading-snug hover:underline ${
                completed.has(topic.id) ? "text-text-muted line-through" : "text-text"
              }`}
            >
              {topic.title}
            </Link>
          </div>
        ))}
      </div>

      {part.quizQuestionCount > 0 && (
        <div className="flex items-center justify-between gap-3 border-t border-outline/50 px-5 py-4">
          <p className="text-sm text-text-muted">
            {part.quizQuestionCount} mock-interview question{part.quizQuestionCount === 1 ? "" : "s"} for this
            chapter
          </p>
          <Link
            href={`/ml/${part.id}/quiz`}
            className="flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            <ClipboardCheck size={16} /> Test yourself →
          </Link>
        </div>
      )}
    </details>
  );
}
