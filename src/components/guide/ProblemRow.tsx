"use client";

import { ExternalLink } from "lucide-react";
import { leetCodeUrl, type StudyProblem } from "@/lib/studyData";

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "#34A853",
  Medium: "#FBBC04",
  Hard: "#EA4335",
};

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
    <div className="flex items-center gap-3.5 border-t border-outline/40 px-3.5 py-2.5 first:border-t-0">
      <input
        type="checkbox"
        checked={complete}
        onChange={() => onToggle(problem.id)}
        className="size-[18px] shrink-0 accent-[var(--accent)]"
        aria-label={`Mark ${problem.title} complete`}
      />
      <span
        className="w-12 shrink-0 text-right text-sm font-bold tabular-nums"
        style={{ color: complete ? "var(--color-text-muted)" : "var(--accent)" }}
      >
        {problem.id}
      </span>
      <span
        className={`flex-1 text-[15px] leading-snug ${
          complete ? "text-text-muted line-through decoration-text-muted" : "text-text"
        }`}
      >
        {problem.title}
      </span>
      {problem.difficulty && (
        <span
          className="shrink-0 rounded px-1.5 py-1 text-[11px] font-bold"
          style={{
            color: DIFFICULTY_COLOR[problem.difficulty],
            background: `color-mix(in srgb, ${DIFFICULTY_COLOR[problem.difficulty]} 13%, transparent)`,
          }}
        >
          {problem.difficulty}
        </span>
      )}
      <a
        href={leetCodeUrl(problem)}
        target="_blank"
        rel="noreferrer"
        title={`Open ${problem.title} on LeetCode`}
        className="flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--accent)] hover:bg-surface-high"
      >
        <ExternalLink size={18} />
      </a>
    </div>
  );
}
