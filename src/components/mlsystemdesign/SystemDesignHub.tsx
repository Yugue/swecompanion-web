"use client";

import Link from "next/link";
import { ChevronRight, RotateCcw } from "lucide-react";
import { mlSystemDesignTopics, type SystemDesignProblemSummary } from "@/lib/mlSystemDesignTopics";
import { TopBar } from "@/components/TopBar";
import { ProgressRing } from "@/components/ProgressRing";
import { SystemDesignHero } from "./SystemDesignHero";
import { useSystemDesignTopicProgress } from "./SystemDesignShell";

export function SystemDesignHub({ topicId, problems }: { topicId: string; problems: SystemDesignProblemSummary[] }) {
  const topic = mlSystemDesignTopics.find((item) => item.id === topicId)!;
  const { completed, toggle, requestReset } = useSystemDesignTopicProgress(topicId);
  const done = problems.filter((problem) => completed.has(problem.id)).length;
  const percent = problems.length ? Math.round(done / problems.length * 100) : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar activeTrack="mlsd" />
      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-8">
        <SystemDesignHero topicId={topicId} caseCount={problems.length} />
        {problems.length === 0 ? (
          <section className="rounded-xl border border-outline/70 bg-surface p-6">
            <h2 className="mb-2 text-lg font-bold text-text">Coming soon</h2>
            <p className="text-sm leading-relaxed text-text-muted">System design cases for {topic.name} are on the way. Select NLP above to explore the available guide.</p>
          </section>
        ) : (
          <>
            <section aria-label={`${topic.name} progress`} className="mb-6 rounded-xl border border-outline/70 bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ProgressRing done={done} total={problems.length} color="#4285F4" size={44} />
                  <div><h2 className="text-sm font-bold text-text">{topic.name} progress</h2><p className="mt-1 text-xs text-text-muted">{done} of {problems.length} problems completed · {percent}%</p></div>
                </div>
                <button type="button" onClick={requestReset} className="flex items-center gap-2 rounded-lg border border-outline px-3 py-2 text-sm font-semibold text-text hover:bg-surface-high"><RotateCcw size={16} aria-hidden="true" /> Reset progress</button>
              </div>
              <div role="progressbar" aria-label={`${topic.name} completion`} aria-valuemin={0} aria-valuemax={problems.length} aria-valuenow={done} aria-valuetext={`${done} of ${problems.length} problems completed`} className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-high"><div className="h-full rounded-full bg-accent-blue transition-[width]" style={{ width: `${percent}%` }} /></div>
            </section>
            <section aria-labelledby="system-design-problems-title">
              <h2 id="system-design-problems-title" className="mb-4 text-lg font-bold text-text">Problems</h2>
              <ol className="flex flex-col gap-3">
                {problems.map((problem, index) => {
                  const isDone = completed.has(problem.id);
                  return (
                    <li id={problem.id} key={problem.id} className="flex scroll-mt-6 items-start gap-3 rounded-xl border border-outline/70 bg-surface px-4 transition-colors hover:border-accent-blue/60 sm:gap-4 sm:px-5">
                      <input type="checkbox" checked={isDone} onChange={() => toggle(problem.id)} aria-label={`Mark ${problem.title} completed`} className="mt-6 size-[18px] shrink-0 cursor-pointer accent-accent-blue" />
                      <Link href={`${topic.href}/${problem.id}`} className="flex min-w-0 flex-1 items-start gap-3 py-5 focus-visible:outline-2 focus-visible:outline-accent-blue">
                        <div className="min-w-0 flex-1">
                          <h3 className={`text-base font-bold leading-snug ${isDone ? "text-text-muted line-through" : "text-text"}`}><span className="mr-2 tabular-nums text-accent-blue">{index + 1}.</span>{problem.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-text-muted">{problem.summary}</p>
                          <p className="mt-2 text-xs font-semibold text-text-muted">{problem.pattern}</p>
                        </div>
                        <ChevronRight size={18} className="mt-0.5 shrink-0 text-text-muted" aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
