"use client";

import { RotateCcw } from "lucide-react";
import type { MlPart } from "@/lib/mlStudyData";
import { mlTopicCount } from "@/lib/mlStudyData";
import { getIcon } from "@/lib/icons";
import { ProgressRing } from "@/components/ProgressRing";
import { ProductMark } from "@/components/ProductMark";

export function MlSidebar({
  parts,
  completed,
  onJump,
  onResetProgress,
}: {
  parts: MlPart[];
  completed: Set<string>;
  onJump: (id: string) => void;
  onResetProgress: () => void;
}) {
  const doneCount = parts.reduce((n, p) => n + p.topics.filter((t) => completed.has(t.id)).length, 0);

  return (
    <div className="flex h-full flex-col border-r border-outline/55 bg-surface/95">
      <div className="flex items-center gap-3 px-5 py-5">
        <ProductMark size={30} />
        <span className="text-[17px] font-bold text-text">SWE Companion</span>
      </div>

      <div className="mx-3.5 mb-3 flex items-center gap-3 rounded-lg px-3 py-2.5">
        <span className="flex-1 text-sm font-semibold text-text">Deep Learning / Neural Networks</span>
        <ProgressRing done={doneCount} total={mlTopicCount} color="#4285F4" size={38} />
      </div>

      <div className="px-5 pb-2 text-xs font-bold tracking-wide text-text-muted">CURRICULUM</div>

      <nav className="flex-1 overflow-y-auto px-3.5">
        {parts.map((part) => {
          const Icon = getIcon(part.icon);
          const done = part.topics.filter((t) => completed.has(t.id)).length;
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => onJump(part.id)}
              className="mb-1 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left hover:bg-surface-high"
            >
              <Icon size={18} className="shrink-0 text-text-muted" />
              <span className="flex-1 truncate text-[13px] text-text-muted">
                Ch. {part.number} · {part.title}
              </span>
              <ProgressRing done={done} total={part.topics.length} color={part.color} size={32} />
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
