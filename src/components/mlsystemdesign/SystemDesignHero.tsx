"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { mlSystemDesignFramework, mlSystemDesignTopics } from "@/lib/mlSystemDesignTopics";
import { useChapterExpansion } from "@/lib/useChapterExpansion";

export function SystemDesignHero({ topicId }: { topicId: string }) {
  const topic = mlSystemDesignTopics.find((item) => item.id === topicId)!;
  const [open, setOpen, restored] = useChapterExpansion("swe-companion:mlsd-interview-format", "format");
  // Do not expose the server default before the saved preference is restored.
  const expanded = restored && open.has("format");
  return (
    <div className="mb-6 rounded-2xl border border-outline/70 bg-surface p-6 sm:p-8">
      <h1 className="mb-2.5 text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl">Prepare for the ML System Design Interview.</h1>
      <section className="mb-5 rounded-md border border-outline/55 bg-surface-high/40 p-4.5">
        <h2>
          <button type="button" aria-expanded={expanded} aria-controls="system-design-interview-format" onClick={() => setOpen((current) => current.has("format") ? new Set() : new Set(["format"]))} className="flex w-full items-center justify-between gap-3 rounded-sm text-left text-lg font-bold text-text">
            How the ML system design interview works<ChevronDown size={20} className={`shrink-0 text-text-muted transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        </h2>
        {expanded && <div id="system-design-interview-format" className="mt-3">
          <div className="mb-3">
            <h3 className="mb-2 text-sm font-bold text-text">Different emphasis from traditional system design</h3>
            <p className="mb-3 text-sm leading-relaxed text-text-muted">Traditional system design emphasizes services, APIs, storage, and how requests and data move between components. ML system design focuses on the learning lifecycle: the data pipeline, model training, and serving predictions.</p>
            <ul className="space-y-2 text-sm leading-relaxed text-text-muted">
              <li><span className="font-semibold text-text">Data pipeline: </span>Collect and label examples, build features, and prevent leakage.</li>
              <li><span className="font-semibold text-text">Training: </span>Choose a baseline, train a model, and validate its quality.</li>
              <li><span className="font-semibold text-text">Serving: </span>Deliver predictions within latency and cost limits; monitor quality and feed improvements back into training.</li>
            </ul>
          </div>
          <p className="text-sm leading-relaxed text-text-muted">We recommend using <a href={mlSystemDesignFramework.href} target="_blank" rel="noreferrer" className="font-semibold text-text underline underline-offset-4">{mlSystemDesignFramework.title}</a> to approach your design.</p>
        </div>}
      </section>
      <div className="rounded-md border border-outline/55 bg-surface-high/40 p-4.5">
        <div className="mb-1.5 flex items-center gap-2"><span className="text-sm font-bold text-text">ML system design topics</span></div>
        <div className="flex flex-wrap gap-2">
          {mlSystemDesignTopics.map((item) => {
            const selected = item.id === topicId;
            const style = `rounded-md border px-2.5 py-1.5 text-[12.5px] font-semibold ${selected ? "border-accent-blue/65 bg-accent-blue/15 text-accent-blue" : "border-outline/45 bg-bg/50 text-text-muted"}`;
            return selected ? <span key={item.id} aria-current="page" className={style}>{item.name}</span> : <Link key={item.id} href={item.href} className={`${style} transition-colors hover:border-accent-blue/45 hover:text-text`}>{item.name}</Link>;
          })}
        </div>
      </div>
      <div className="mb-3 mt-4 rounded-md border border-accent-blue/35 bg-accent-blue/10 p-4">
        <p className="text-sm font-semibold text-text-muted">This guide covers the ML system design topic:</p>
        <p className="mt-1 text-lg font-bold leading-snug text-accent-blue">{topic.name}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{topic.summary}</p>
      </div>
    </div>
  );
}
