import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";

/**
 * Funnel step 1: a short, curiosity-sparking prompt shown next to the free content. It only has
 * to earn the click - the quiz page (QuizSection) does the actual explaining. Expects an
 * ancestor to set the `--accent` CSS variable.
 */
export function QuizTeaser({
  href,
  title,
  questionCount,
  className = "",
}: {
  href: string;
  title: string;
  questionCount: number;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] ${className}`}
      style={{ background: "color-mix(in srgb, var(--accent) 4%, transparent)" }}
    >
      <span className="flex w-11 shrink-0 justify-center">
        <span
          className="flex size-9 items-center justify-center rounded-full"
          style={{ background: "color-mix(in srgb, var(--accent) 16%, transparent)" }}
        >
          <Mic size={17} style={{ color: "var(--accent)" }} />
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm font-bold text-text">{title}</span>
          <span
            className="rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide"
            style={{
              color: "var(--accent)",
              background: "color-mix(in srgb, var(--accent) 15%, transparent)",
            }}
          >
            PREMIUM
          </span>
        </span>
        <span className="block text-[13px] leading-snug text-text-muted">
          {questionCount} question{questionCount === 1 ? "" : "s"} designed to reflect real
          interview questions
        </span>
      </span>
      <span
        className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white transition-transform group-hover:translate-x-0.5"
        style={{ background: "var(--accent)" }}
      >
        <span className="hidden sm:inline">Try it</span> <ArrowRight size={16} />
      </span>
    </Link>
  );
}
