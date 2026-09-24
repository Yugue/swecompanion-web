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

      <div className="flex flex-col gap-6 border-t border-outline/50 px-4 pt-5 pb-5 sm:px-5">
        {groupBySubcategory(problems).map(({ heading, rows }) => {
          // Progress is over the whole subcategory, not just the rows the current search shows.
          const group = heading ? topic.problems.filter((p) => p.subcategory === heading) : [];
          const groupDone = group.filter((p) => completed.has(p.id)).length;
          return (
            <section key={heading ?? rows[0].id}>
              {heading && (
                <div className="mb-2.5 flex items-center gap-3 px-1">
                  <h4 className="min-w-0 flex-1 truncate text-base font-bold tracking-tight text-text">
                    {heading}
                  </h4>
                  <div
                    className="flex shrink-0 items-center gap-2"
                    title={`${groupDone} of ${group.length} completed`}
                  >
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-outline/60 sm:w-20">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(groupDone / group.length) * 100}%`, background: "var(--accent)" }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-bold tabular-nums text-accent-ink">
                      {groupDone}/{group.length}
                    </span>
                  </div>
                </div>
              )}
              <div className="divide-y divide-outline/40 overflow-hidden rounded-lg border border-outline/60">
                {rows.map((problem) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    complete={completed.has(problem.id)}
                    onToggle={onToggleProblem}
                  />
                ))}
              </div>
            </section>
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

/** Consecutive problems that share a subcategory, in order. Problems without one form their own
 * headingless group. */
function groupBySubcategory(problems: StudyProblem[]) {
  const groups: { heading?: string; rows: StudyProblem[] }[] = [];
  for (const problem of problems) {
    const last = groups[groups.length - 1];
    if (last && last.heading === problem.subcategory) last.rows.push(problem);
    else groups.push({ heading: problem.subcategory, rows: [problem] });
  }
  return groups;
}
