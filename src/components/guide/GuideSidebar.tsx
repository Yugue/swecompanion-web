"use client";

import { LayoutDashboard, RotateCcw } from "lucide-react";
import type { StudyTopic } from "@/lib/studyData";
import { uniqueProblems } from "@/lib/studyData";
import { chapterPath } from "@/lib/codingPaths";
import { ProgressRing } from "@/components/ProgressRing";
import { ProductMark } from "@/components/ProductMark";

export function GuideSidebar({
  topics,
  completed,
  onJump,
  onResetProgress,
}: {
  topics: StudyTopic[];
  completed: Set<string>;
  onJump: (slug: string) => void;
  onResetProgress: () => void;
}) {
  const completedCount = uniqueProblems.filter((p) => completed.has(p.id)).length;

  return (
    <div className="flex h-full flex-col border-r border-outline/55 bg-surface/95">
      <div className="flex items-center gap-3 px-5 py-5">
        <ProductMark size={30} />
        <span className="text-[17px] font-bold text-text">SWE Companion</span>
      </div>

      <button
        type="button"
        onClick={() => document.getElementById("guide-top")?.scrollIntoView({ behavior: "smooth" })}
        className="mx-3.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-surface-high"
      >
        <LayoutDashboard size={19} className="text-text-muted" />
        <span className="flex-1 text-sm font-semibold text-text">All topics</span>
        <ProgressRing done={completedCount} total={uniqueProblems.length} color="#4285F4" size={38} />
      </button>

      <div className="px-5 pb-2 pt-5 text-xs font-bold tracking-wide text-text-muted">TOPICS</div>

      <nav className="flex-1 overflow-y-auto px-3.5">
        {topics.map((topic) => {
          const done = topic.problems.filter((p) => completed.has(p.id)).length;
          return (
            <button
              key={topic.slug}
              type="button"
              onClick={() => onJump(chapterPath(topic))}
              className="mb-1 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-surface-high"
            >
              <span className="size-1.5 shrink-0 rounded-full" style={{ background: topic.color }} />
              <span className="flex-1 truncate text-[13px] text-text-muted">{topic.shortTitle}</span>
              <ProgressRing done={done} total={topic.problems.length} color={topic.color} size={32} />
            </button>
          );
        })}
      </nav>

      <div className="px-4.5 py-4.5">
        <p className="mb-2.5 text-xs text-text-muted">Progress saved on this device</p>
        <button
          type="button"
          onClick={onResetProgress}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-outline px-3 py-2 text-sm font-semibold text-text hover:bg-surface-high"
        >
          <RotateCcw size={16} /> Reset progress
        </button>
      </div>
    </div>
  );
}
