"use client";

import { ExternalLink } from "lucide-react";
import { leetCodeUrl, type StudyProblem } from "@/lib/studyData";

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "#34A853",
  Medium: "#FBBC04",
  Hard: "#EA4335",
};

/**
 * Two separate targets: the checkbox is the only control that marks a problem done, and the rest
 * of the row (number, title, difficulty, icon) opens the problem on LeetCode in a new tab.
 *
 * Columns line up with the topic card header above: the checkbox is centered in a 44px box under
 * the header's icon tile, the problem number starts where the header title starts, and the link
 * icon is centered in a 44px box under the progress ring.
 */
export function ProblemRow({
  problem,
  complete,
  onToggle,
}: {
  problem: StudyProblem;
  complete: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex items-stretch gap-3.5 px-5 transition-colors hover:bg-surface-high/50">
      <label className="flex w-11 shrink-0 cursor-pointer items-center justify-center">
        <input
          type="checkbox"
          checked={complete}
          onChange={() => onToggle(problem.id)}
          className="size-[18px] cursor-pointer accent-[var(--accent)]"
          aria-label={`Mark ${problem.title} ${complete ? "not complete" : "complete"}`}
        />
      </label>
      <a
        href={leetCodeUrl(problem)}
        target="_blank"
        rel="noreferrer"
        title={`Open ${problem.title} on LeetCode`}
        className="group flex min-w-0 flex-1 items-center gap-3.5 py-2.5"
      >
        <span
          className={`w-11 shrink-0 text-sm font-bold tabular-nums ${
            complete ? "text-text-muted" : "text-accent-ink"
          }`}
        >
          {problem.id}
        </span>
        <span
          className={`min-w-0 flex-1 text-[15px] leading-snug group-hover:underline ${
            complete ? "text-text-muted line-through decoration-text-muted" : "text-text"
          }`}
        >
          {problem.title}
        </span>
        {problem.difficulty && (
          <span
            className="shrink-0 rounded px-1.5 py-1 text-center text-[11px] font-bold sm:w-16"
            style={{
              color: DIFFICULTY_COLOR[problem.difficulty],
              background: `color-mix(in srgb, ${DIFFICULTY_COLOR[problem.difficulty]} 13%, transparent)`,
            }}
          >
            {problem.difficulty}
          </span>
        )}
        <span className="flex h-8 w-9 shrink-0 items-center justify-center text-accent-ink sm:w-11">
          <ExternalLink size={17} />
        </span>
      </a>
    </div>
  );
}
