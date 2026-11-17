"use client";
/* eslint-disable react-hooks/static-components -- `getIcon` looks up a stable reference from a
   module-level map, never defines a new component; this pattern reads as unsafe to the linter's
   heuristic but isn't. */

import { Check, ChevronDown, Lightbulb } from "lucide-react";
import type { StudyTopic, StudyProblem } from "@/lib/studyData";
import { getIcon } from "@/lib/icons";
import { chapterPath } from "@/lib/codingPaths";
import { codingTopicDescriptions } from "@/lib/codingTopicDescriptions";
import { ProblemRow } from "./ProblemRow";
import { BinarySearchGuide } from "./BinarySearchGuide";

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
  const allDone = doneCount === topic.problems.length;
  const description = codingTopicDescriptions[topic.slug];
  const showProTip = topic.slug !== "data-structures-to-know" && topic.group !== "Challenge Rounds";

  return (
    <details
      id={chapterPath(topic)}
      open={open}
      onToggle={(e) => {
        if (e.currentTarget.open !== open) onToggle();
      }}
      className="scroll-mt-24 overflow-hidden rounded-xl border border-outline/70 bg-surface transition-colors hover:border-outline"
      style={{ "--accent": topic.color } as React.CSSProperties}
    >
      <summary className="group flex items-center gap-3 px-4 py-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-blue sm:gap-4 sm:px-5">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "color-mix(in srgb, var(--accent) 8%, transparent)" }}
        >
          <Icon size={18} className="text-accent-ink" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-snug text-text sm:text-base">{topic.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            {topic.problems.length} {topic.problems.length === 1 ? "problem" : "problems"}
            {problems.length !== topic.problems.length && ` · ${problems.length} matching`}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2" aria-label={`${doneCount} of ${topic.problems.length} complete`}>
          <span className="flex items-center gap-1.5 text-xs font-medium tabular-nums text-text-muted">
            {allDone && <Check size={13} className="text-accent-ink" aria-hidden="true" />}
            <span>{doneCount}/{topic.problems.length}<span className="hidden sm:inline"> complete</span></span>
          </span>
          <span className="hidden h-1 w-24 overflow-hidden rounded-full bg-outline/40 sm:block" aria-hidden="true">
            <span className="block h-full rounded-full" style={{ width: `${(doneCount / topic.problems.length) * 100}%`, background: "var(--accent)" }} />
          </span>
        </div>
        <ChevronDown size={17} className={`shrink-0 text-text-muted transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </summary>

      <div className="flex flex-col gap-5 border-t border-outline/50 px-4 py-4 sm:px-5 sm:py-5">
        {description && <p className="text-sm leading-relaxed text-text-muted">{description}</p>}
        {showProTip && (
          <div className="flex items-start gap-2.5 rounded-lg bg-surface-high/50 px-3 py-3">
            <Lightbulb size={16} className="mt-0.5 shrink-0 text-text-muted" aria-hidden="true" />
            <p className="text-[13px] leading-relaxed text-text-muted">
              <span className="font-medium text-text">Pattern cue: </span>{topic.note}
            </p>
          </div>
        )}
        {topic.slug === "binary-search" && <BinarySearchGuide />}
        {groupBySubcategory(problems).map(({ heading, rows }) => {
          // Progress is over the whole subcategory, not just the rows the current search shows.
          const group = heading ? topic.problems.filter((p) => p.subcategory === heading) : [];
          const groupDone = group.filter((p) => completed.has(p.id)).length;
          return (
            <section key={heading ?? rows[0].id}>
              {heading && (
                <div className="mb-2.5 flex items-center gap-3 px-1">
                  <h4 className="min-w-0 flex-1 truncate text-sm font-semibold text-text">
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
