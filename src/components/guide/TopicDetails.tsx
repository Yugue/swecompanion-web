"use client";
/* eslint-disable react-hooks/static-components -- `getIcon` looks up a stable reference from a
   module-level map, never defines a new component; this pattern reads as unsafe to the linter's
   heuristic but isn't. */

import Link from "next/link";
import { ChevronDown, ChevronUp, Link as LinkIcon } from "lucide-react";
import type { StudyTopic, StudyProblem } from "@/lib/studyData";
import { getIcon } from "@/lib/icons";
import { ProgressRing } from "@/components/ProgressRing";
import { ProblemRow } from "./ProblemRow";

export function TopicDetails({
  topic,
  problems,
  completed,
  open,
  onToggle,
  onToggleProblem,
}: {
  topic: StudyTopic;
  problems: StudyProblem[];
  completed: Set<string>;
  open: boolean;
  onToggle: () => void;
  onToggleProblem: (id: string) => void;
}) {
  const Icon = getIcon(topic.icon);
  const doneCount = topic.problems.filter((p) => completed.has(p.id)).length;

  return (
    <details
      id={topic.slug}
      open={open}
      onToggle={(e) => {
        if (e.currentTarget.open !== open) onToggle();
      }}
      className="scroll-mt-24 overflow-hidden rounded-xl border border-outline/70 bg-surface"
      style={{ "--accent": topic.color } as React.CSSProperties}
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
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-bold tracking-tight text-text">{topic.title}</h3>
            <Link
              href={`/topics/${topic.slug}`}
              onClick={(e) => e.stopPropagation()}
              title={`Overview page for ${topic.title}`}
              className="shrink-0 text-[var(--accent)]"
            >
              <LinkIcon size={16} />
            </Link>
          </div>
          <p className={`text-sm leading-relaxed text-text-muted ${open ? "" : "line-clamp-2"}`}>
            {topic.note}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2.5">
          <ProgressRing done={doneCount} total={topic.problems.length} color={topic.color} size={44} strokeWidth={3} />
          {open ? <ChevronUp size={20} className="text-text-muted" /> : <ChevronDown size={20} className="text-text-muted" />}
        </div>
      </summary>

      <div className="border-t-[3px]" style={{ borderColor: "var(--accent)" }} />

      <div>
        {problems.map((problem, i) => {
          const showHeading = problem.subcategory && problem.subcategory !== problems[i - 1]?.subcategory;
          return (
            <div key={problem.id}>
              {showHeading && (
                <div className="flex items-center gap-2 px-5 pb-1.5 pt-4.5">
                  <span className="size-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                  <span className="text-sm font-extrabold uppercase tracking-wide text-[var(--accent)]">
                    {problem.subcategory}
                  </span>
                </div>
              )}
              <ProblemRow problem={problem} complete={completed.has(problem.id)} onToggle={onToggleProblem} />
            </div>
          );
        })}
      </div>

      {(topic.quizQuestionCount ?? 0) > 0 && (
        <div className="border-t border-outline/50 px-5 py-4">
          <Link
            href={`/topics/${topic.slug}/quiz`}
            className="text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            Practice the {topic.shortTitle} mock interview quiz →
          </Link>
        </div>
      )}
    </details>
  );
}
