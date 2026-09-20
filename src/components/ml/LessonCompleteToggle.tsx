"use client";

import { CheckCircle2 } from "lucide-react";
import { useProgress } from "@/lib/useProgress";

export function LessonCompleteToggle({
  topicId,
  accent,
  track = "ml",
}: {
  topicId: string;
  accent: string;
  track?: "ml" | "aml" | "agentic";
}) {
  const { completed, toggle } = useProgress(track, []);
  const done = completed.has(topicId);

  return (
    <button
      type="button"
      onClick={() => toggle(topicId)}
      className="flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold"
      style={{
        borderColor: done ? accent : "var(--color-outline)",
        color: done ? accent : "var(--color-text-muted)",
        background: done ? `color-mix(in srgb, ${accent} 12%, transparent)` : "transparent",
      }}
    >
      <CheckCircle2 size={17} />
      {done ? "Marked completed" : "Mark as completed"}
    </button>
  );
}
