"use client";
/* eslint-disable react-hooks/static-components -- `getIcon` looks up a stable reference from a
   module-level map, never defines a new component; this pattern reads as unsafe to the linter's
   heuristic but isn't. */

import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import type { StudyTopic, StudyProblem } from "@/lib/studyData";
import { getIcon } from "@/lib/icons";
import { ProgressRing } from "@/components/ProgressRing";
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
      <summary className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 px-4 py-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-blue sm:px-5">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border"
          style={{
            background: "color-mix(in srgb, var(--accent) 10%, transparent)",
            borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)",
          }}
        >
          <Icon size={20} style={{ color: "var(--accent)" }} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug tracking-tight text-text sm:text-lg">{topic.title}</h3>
        </div>
        <div className="shrink-0">
          <ProgressRing done={doneCount} total={topic.problems.length} color={topic.color} size={40} strokeWidth={3} />
        </div>
        {description && <p className="col-span-3 text-sm leading-relaxed text-text-muted">{description}</p>}
        {showProTip && <div className="col-span-3 flex items-start gap-2.5">
          <span
            title="Pro tip: recognize this pattern"
            className="inline-flex h-6 w-5 shrink-0 items-center justify-center"
            style={{ color: "color-mix(in srgb, var(--color-yellow) 45%, var(--color-text))" }}
          >
            <Lightbulb size={17} strokeWidth={2} fill="currentColor" fillOpacity={0.12} aria-hidden="true" />
          </span>
          <p className="min-w-0 flex-1 py-0.5 text-sm leading-relaxed text-text-muted">
            <span className="font-semibold text-text">Pro tip:</span>{" "}
            {topic.note}
          </p>
        </div>}
        <div className="col-span-3 flex min-h-8 items-center justify-between gap-3 border-t border-outline/40 pt-3 text-sm font-semibold text-text-muted group-hover:text-accent-ink">
          <span>{open ? "Hide problems" : `View ${problems.length} ${problems.length === 1 ? "problem" : "problems"}`}</span>
          {open ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
        </div>
      </summary>

      <div className="flex flex-col gap-6 border-t border-outline/50 px-4 pt-5 pb-5 sm:px-5">
        {topic.slug === "binary-search" && <BinarySearchGuide />}
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
