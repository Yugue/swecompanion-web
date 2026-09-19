"use client";
/* eslint-disable react-hooks/static-components -- `getIcon` looks up a stable reference from a
   module-level map, never defines a new component; this pattern reads as unsafe to the linter's
   heuristic but isn't. */

import { ChevronDown, ChevronUp } from "lucide-react";
import type { StudyTopic, StudyProblem } from "@/lib/studyData";
import { getIcon } from "@/lib/icons";
import { ProgressRing } from "@/components/ProgressRing";
import { QuizTeaser } from "@/components/quiz/QuizTeaser";
import { chapterPath, chapterQuizHref } from "@/lib/codingPaths";
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
      id={chapterPath(topic)}
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

      <div className="pb-1">
        {problems.map((problem, i) => {
          const heading = problem.subcategory;
          const showHeading = heading && heading !== problems[i - 1]?.subcategory;
          // Progress is over the whole subcategory, not just the rows the current search shows.
          const group = showHeading ? topic.problems.filter((p) => p.subcategory === heading) : [];
          const groupDone = group.filter((p) => completed.has(p.id)).length;
          return (
            <div key={problem.id} className={i > 0 && !showHeading ? "border-t border-outline/40" : undefined}>
              {showHeading && (
                <div
                  className={`flex items-center gap-3.5 border-outline/50 bg-surface-high/40 px-5 py-2.5 ${
                    i > 0 ? "border-y" : "border-b"
                  }`}
                >
                  <span className="flex w-11 shrink-0 justify-center">
                    <span className="h-4 w-1 rounded-full" style={{ background: "var(--accent)" }} />
                  </span>
                  <h4 className="min-w-0 flex-1 truncate text-sm font-bold tracking-tight text-text">
                    {heading}
                  </h4>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums text-accent-ink"
                    style={{ background: "color-mix(in srgb, var(--accent) 14%, transparent)" }}
                    title={`${groupDone} of ${group.length} completed`}
                  >
                    {groupDone}/{group.length}
                  </span>
                </div>
              )}
              <ProblemRow problem={problem} complete={completed.has(problem.id)} onToggle={onToggleProblem} />
            </div>
          );
        })}
      </div>

      {(topic.quizQuestionCount ?? 0) > 0 && (
        <QuizTeaser
          href={chapterQuizHref(topic)}
          title={`${topic.shortTitle} mock interview`}
          questionCount={topic.quizQuestionCount ?? 0}
          className="border-t border-outline/50"
        />
      )}
    </details>
  );
}
