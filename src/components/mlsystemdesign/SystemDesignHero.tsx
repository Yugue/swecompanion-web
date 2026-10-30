"use client";

import Link from "next/link";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { mlSystemDesignFramework, mlSystemDesignTopics } from "@/lib/mlSystemDesignTopics";
import { useChapterExpansion } from "@/lib/useChapterExpansion";

export function SystemDesignHero({ topicId, caseCount }: { topicId: string; caseCount: number }) {
  const topic = mlSystemDesignTopics.find((item) => item.id === topicId)!;
  const [open, setOpen] = useChapterExpansion("swe-companion:mlsd-interview-format", "format");
  const expanded = open.has("format");
  return (
    <div className="mb-6 rounded-2xl border border-outline/70 bg-surface p-6 sm:p-8">
      <h1 className="mb-2.5 text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl">Prepare for the ML System Design Interview.</h1>
      <p className="mb-2 text-base leading-relaxed text-text-muted"><span className="font-bold text-text">Designed for: </span>Candidates practicing how to turn an ambiguous ML problem into a practical system, explain model choices, and defend the tradeoffs.</p>
      <div className="mb-3 mt-4 rounded-md border border-accent-blue/35 bg-accent-blue/10 p-4">
        <p className="text-sm font-semibold text-text-muted">This guide covers the ML system design topic:</p>
        <p className="mt-1 text-lg font-bold leading-snug text-accent-blue">{topic.name}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{topic.summary}</p>
      </div>
      <div className="mb-5 flex items-start gap-2.5 rounded-md border border-accent-green/35 bg-accent-green/10 p-3">
        <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-accent-green" aria-hidden="true" />
        <p className="text-sm font-semibold leading-relaxed text-text">Practice with interviewer–candidate Q&A, system diagrams, concrete model choices, and the tradeoffs that matter.</p>
      </div>
      <div className="mb-4 flex flex-wrap gap-2.5 text-[13px] font-medium text-text"><span className="rounded-md bg-surface-high/60 px-3 py-2">{caseCount} problems</span></div>
      <section className="mb-5 rounded-md border border-outline/55 bg-surface-high/40 p-4.5">
        <h2>
          <button type="button" aria-expanded={expanded} aria-controls="system-design-interview-format" onClick={() => setOpen((current) => current.has("format") ? new Set() : new Set(["format"]))} className="flex w-full items-center justify-between gap-3 rounded-sm text-left text-lg font-bold text-text">
            How the ML system design interview works<ChevronDown size={20} className={`shrink-0 text-text-muted transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        </h2>
        {expanded && <div id="system-design-interview-format" className="mt-3">
          <div className="mb-3 rounded-md border border-outline/55 bg-bg/40 p-3.5">
            <h3 className="mb-2 text-sm font-bold text-text">Different emphasis from traditional system design</h3>
            <p className="mb-3 text-sm leading-relaxed text-text-muted">Traditional system design emphasizes services, APIs, storage, and how requests and data move between components. ML system design still needs that architecture, but focuses more on the learning lifecycle: the data pipeline, model training, and serving predictions.</p>
            <ul className="space-y-2 text-sm leading-relaxed text-text-muted">
              <li><span className="font-semibold text-text">Data pipeline: </span>Collect and label examples, build features, and prevent leakage.</li>
              <li><span className="font-semibold text-text">Training: </span>Choose a baseline, train a model, and validate its quality.</li>
              <li><span className="font-semibold text-text">Serving: </span>Deliver predictions within latency and cost limits; monitor quality and feed improvements back into training.</li>
            </ul>
          </div>
          <p className="mb-3 text-sm leading-relaxed text-text-muted">Structure the conversation with <a href={mlSystemDesignFramework.href} target="_blank" rel="noreferrer" className="font-semibold text-text underline underline-offset-4">{mlSystemDesignFramework.title}</a>:</p>
          <ol className="grid gap-x-5 gap-y-3 text-sm text-text-muted sm:grid-cols-2">
            {mlSystemDesignFramework.stages.map((stage, index) => <li key={stage.id}><span className="font-semibold text-text">{index + 1}. {stage.title}</span><span className="ml-1.5 text-xs">({stage.time})</span><p className="mt-1 leading-relaxed">{stage.description}</p></li>)}
          </ol>
          <p className="mt-3 text-xs leading-relaxed text-text-muted">Timings are guides. Keep architecture discussions connected to data quality, model behavior, training, and serving; go deeper into infrastructure when the role or interviewer calls for it.</p>
        </div>}
      </section>
      <div className="rounded-md border border-outline/55 bg-surface-high/40 p-4.5">
        <div className="mb-1.5 flex items-center gap-2"><span className="text-sm font-bold text-text">ML system design topics</span></div>
        <p className="mb-3.5 text-sm leading-relaxed text-text-muted">Select another topic to switch guides.</p>
        <div className="flex flex-wrap gap-2">
          {mlSystemDesignTopics.map((item) => {
            const selected = item.id === topicId;
            const style = `rounded-md border px-2.5 py-1.5 text-[12.5px] font-semibold ${selected ? "border-accent-blue/65 bg-accent-blue/15 text-accent-blue" : "border-outline/45 bg-bg/50 text-text-muted"}`;
            return selected ? <span key={item.id} aria-current="page" className={style}>{item.name}</span> : <Link key={item.id} href={item.href} className={`${style} transition-colors hover:border-accent-blue/45 hover:text-text`}>{item.name}</Link>;
          })}
        </div>
      </div>
    </div>
  );
}
