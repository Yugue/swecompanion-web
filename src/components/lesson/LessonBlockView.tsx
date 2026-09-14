import type { LessonBlock } from "@/lib/lessonParser";
import { InlineMarkdown } from "./InlineMarkdown";
import { LessonTable } from "./LessonTable";
import { DisplayMath } from "./Math";
import { GitBranch, Code2 } from "lucide-react";

const NUMBERED_ITEM = /^\d+\.\s+/;

export function LessonBlockView({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "heading1":
      return (
        <h2 className="mb-2.5 mt-6 text-2xl font-bold leading-tight text-text">
          <InlineMarkdown text={block.text} />
        </h2>
      );
    case "heading2":
      return (
        <h3 className="mb-2.5 mt-5 text-xl font-bold leading-tight text-text">
          <InlineMarkdown text={block.text} />
        </h3>
      );
    case "heading3":
      return (
        <h4 className="mb-2.5 mt-5 text-[1.05rem] font-bold leading-tight text-text">
          <InlineMarkdown text={block.text} />
        </h4>
      );
    case "paragraph":
      return (
        <p className="mb-3 text-[15.5px] leading-[1.58] text-text-muted">
          <InlineMarkdown text={block.text} />
        </p>
      );
    case "bullet":
      return (
        <div className="mb-2 flex items-start gap-2.5 pl-1">
          <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
          <p className="text-[15px] leading-[1.52] text-text-muted">
            <InlineMarkdown text={block.text} />
          </p>
        </div>
      );
    case "numbered": {
      const match = block.text.match(NUMBERED_ITEM)!;
      return (
        <div className="mb-2 flex items-start gap-0 pl-1">
          <span className="w-7 shrink-0 text-[15px] font-bold text-[var(--accent)]">
            {match[0].trim()}
          </span>
          <p className="text-[15px] leading-[1.52] text-text-muted">
            <InlineMarkdown text={block.text.slice(match[0].length)} />
          </p>
        </div>
      );
    }
    case "quote":
      return (
        <blockquote className="my-2 rounded-md border-l-[3px] border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_9%,transparent)] p-4 text-[15.5px] italic leading-[1.5] text-text">
          <InlineMarkdown text={block.text} />
        </blockquote>
      );
    case "code":
    case "diagram": {
      const isDiagram = block.type === "diagram";
      return (
        <div
          className={`my-2 overflow-hidden rounded-md border ${
            isDiagram
              ? "border-[color-mix(in_srgb,var(--accent)_42%,transparent)] bg-[color-mix(in_srgb,var(--accent)_6.5%,transparent)]"
              : "border-outline/60 bg-surface-high/65"
          }`}
        >
          <div className="flex items-center gap-1.5 px-3.5 pt-2.5">
            {isDiagram ? (
              <GitBranch className="size-[15px] text-[var(--accent)]" />
            ) : (
              <Code2 className="size-[15px] text-text-muted" />
            )}
            <span
              className={`text-[10.5px] font-bold tracking-wider ${
                isDiagram ? "text-[var(--accent)]" : "text-text-muted"
              }`}
            >
              {isDiagram ? "DIAGRAM / FLOW" : "CODE / EXAMPLE"}
            </span>
          </div>
          <pre className="overflow-x-auto px-3.5 pb-3.5 pt-2.5 font-mono text-[13.5px] leading-[1.5] text-text">
            {block.text}
          </pre>
        </div>
      );
    }
    case "table":
      return <LessonTable markdown={block.text} />;
    case "math":
      return (
        <div className="my-2 overflow-x-auto rounded-md border border-outline/55 bg-surface-high/65 px-4 py-4.5 text-[var(--accent)]">
          <DisplayMath expr={block.text} />
        </div>
      );
    case "divider":
      return <hr className="my-8 border-outline/50" />;
  }
}
