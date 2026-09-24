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
 * Rows sit inside a subcategory's bordered list, so they only need to line up with each other.
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
    <div className="flex items-stretch gap-3 pl-3 pr-1.5 transition-colors hover:bg-surface-high/50 sm:pl-4">
      <label className="flex shrink-0 cursor-pointer items-center">
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
        className="group flex min-w-0 flex-1 items-center gap-3 py-3"
      >
        <span
          className={`w-10 shrink-0 text-[13px] font-semibold tabular-nums ${
            complete ? "text-text-muted" : "text-accent-ink"
          }`}
        >
          {problem.id}
        </span>
        <span
          className={`min-w-0 flex-1 text-[15px] leading-snug group-hover:underline ${
            complete ? "text-text-muted" : "font-medium text-text"
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
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-text-muted group-hover:text-accent-ink">
          <ExternalLink size={16} />
        </span>
      </a>
    </div>
  );
}
