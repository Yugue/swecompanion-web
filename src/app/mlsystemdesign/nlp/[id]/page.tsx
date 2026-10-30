import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SystemDesignCaseCompletion } from "@/components/mlsystemdesign/SystemDesignShell";
import { TopBar } from "@/components/TopBar";
import { SystemDesignDiagram } from "@/components/mlsystemdesign/SystemDesignDiagram";
import { NLP_SYSTEM_DESIGN_PATH } from "@/lib/mlDomains";
import { nlpDesignFramework, nlpDesignProblems, getNlpDesignProblem } from "@/lib/nlpSystemDesignData";

function StageHeading({ index }: { index: number }) {
  const stage = nlpDesignFramework.stages[index];
  return (
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h2 id={`${stage.id}-title`} className="text-xl font-bold text-text">{index + 1}. {stage.title}</h2>
      <span className="text-xs font-medium text-text-muted">{stage.time}</span>
    </div>
  );
}

function DesignDetails({ items }: { items: { label: string; text: string }[] }) {
  return (
    <dl className="divide-y divide-outline/45 overflow-hidden rounded-xl border border-outline/70 bg-surface">
      {items.map(({ label, text }) => (
        <div key={label} className="grid gap-2 p-4 sm:grid-cols-[160px_1fr] sm:gap-5 sm:p-5">
          <dt className="text-sm font-bold text-text">{label}</dt>
          <dd className="text-sm leading-relaxed text-text-muted">{text}</dd>
        </div>
      ))}
    </dl>
  );
}

export function generateStaticParams() {
  return nlpDesignProblems.flatMap((problem) => [problem.id, ...(problem.legacyIds ?? [])].map((id) => ({ id })));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const problem = getNlpDesignProblem(id);
  if (!problem) return {};
  return {
    title: `${problem.title} — NLP System Design`,
    description: problem.summary,
    alternates: { canonical: `${NLP_SYSTEM_DESIGN_PATH}/${problem.id}` },
  };
}

export default async function NlpDesignProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = getNlpDesignProblem(id);
  if (!problem) notFound();
  const index = nlpDesignProblems.findIndex((item) => item.id === problem.id);
  const previous = nlpDesignProblems[index - 1];
  const next = nlpDesignProblems[index + 1];
  const accent = "#4285F4";

  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": accent } as CSSProperties}>
      <TopBar activeTrack="mlsd" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <Link href={`${NLP_SYSTEM_DESIGN_PATH}#${problem.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
          <ArrowLeft size={16} aria-hidden="true" /> All NLP problems
        </Link>
        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-text">{index + 1}. {problem.title}</h1>
        <div className="mb-5"><SystemDesignCaseCompletion caseId={problem.id} accent={accent} /></div>
        <section aria-labelledby="interview-overview-title" className="mb-6 rounded-md border p-4" style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)", background: "color-mix(in srgb, var(--accent) 7%, transparent)" }}>
          <h2 id="interview-overview-title" className="mb-2.5 text-xs font-extrabold tracking-wide text-[var(--accent)]">INTERVIEW-READY OVERVIEW</h2>
          <p className="mb-3 text-base leading-relaxed text-text">{problem.summary}</p>
          <ul className="mb-3 flex flex-col gap-1.5">
            {[problem.pattern, problem.objectives.ml].map((point) => <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-text-muted"><span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--accent)]" />{point}</li>)}
          </ul>
          <p className="text-sm font-semibold leading-relaxed text-text">Interview probe: {problem.conversation[0].text}</p>
        </section>
        <div className="mb-3 flex items-center gap-3"><div className="h-px flex-1 bg-outline/55" /><span className="text-xs font-extrabold tracking-wide text-[var(--accent)]">FULL CASE WALKTHROUGH</span><div className="h-px flex-1 bg-outline/55" /></div>
        <article aria-label="Full case walkthrough" className="space-y-8">
          <header>
            <p className="text-xs leading-relaxed text-text-muted">
              Interview flow: <a href={nlpDesignFramework.href} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4">{nlpDesignFramework.title}</a>. Timings are discussion guides.
            </p>
            <nav aria-label="Interview stages" className="mt-4 flex flex-wrap gap-2">
              {nlpDesignFramework.stages.map((stage, stageIndex) => (
                <a key={stage.id} href={`#${stage.id}`} className="rounded-md border border-outline/60 bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-muted hover:border-accent-blue/60 hover:text-text">
                  {stageIndex + 1}. {stage.title}
                </a>
              ))}
            </nav>
          </header>

          <section id="problem-framing" aria-labelledby="problem-framing-title" className="scroll-mt-6">
            <StageHeading index={0} />
            <p className="mb-4 text-xs text-text-muted">Illustrative interview constraints; use these to reason about the design.</p>
            <div className="overflow-hidden rounded-xl border border-outline/70 bg-surface">
              {problem.conversation.map((turn, turnIndex) => (
                <div key={turnIndex} className={`grid gap-1.5 p-4 sm:grid-cols-[100px_1fr] sm:gap-4 sm:p-5 ${turnIndex > 0 ? "border-t border-outline/45" : ""} ${turn.speaker === "Candidate" ? "bg-surface-high/30" : ""}`}>
                  <p className="text-sm font-bold text-text">{turn.speaker}</p>
                  <p className="text-sm leading-relaxed text-text-muted">{turn.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <DesignDetails items={[
                { label: "Business objective", text: problem.objectives.business },
                { label: "ML objective", text: problem.objectives.ml },
              ]} />
            </div>
          </section>

          <section id="high-level-design" aria-labelledby="high-level-design-title" className="scroll-mt-6">
            <StageHeading index={1} />
            <aside className="mb-4 rounded-xl border border-outline/70 bg-surface p-5 sm:p-6" aria-label="Mental model and example">
              <p className="text-sm font-bold text-text">Picture it</p>
              <p className="mt-2 text-base leading-relaxed text-text">{problem.mentalModel}</p>
              <dl className="mt-4 grid gap-3 border-t border-outline/55 pt-4 text-sm leading-relaxed sm:grid-cols-2 sm:gap-6">
                <div><dt className="font-bold text-text">Input</dt><dd className="mt-1 text-text-muted">{problem.example.input}</dd></div>
                <div><dt className="font-bold text-text">Output</dt><dd className="mt-1 text-text-muted">{problem.example.output}</dd></div>
              </dl>
            </aside>
            <SystemDesignDiagram problem={problem} />
          </section>

          <section id="data-and-features" aria-labelledby="data-and-features-title" className="scroll-mt-6">
            <StageHeading index={2} />
            <DesignDetails items={[
              { label: "Data sources", text: problem.data.sources },
              { label: "Labels and split", text: problem.data.labels },
              { label: "Features → representation", text: problem.data.features },
            ]} />
          </section>

          <section id="modeling" aria-labelledby="modeling-title" className="scroll-mt-6">
            <StageHeading index={3} />
            <DesignDetails items={[
              { label: "Baseline", text: problem.modeling.baseline },
              { label: "Chosen architecture", text: problem.modeling.choice },
              { label: "Training", text: problem.modeling.training },
            ]} />
          </section>

          <section id="inference-and-evaluation" aria-labelledby="inference-and-evaluation-title" className="scroll-mt-6">
            <StageHeading index={4} />
            <DesignDetails items={[
              { label: "Serving", text: problem.inference.serving },
              ...problem.measure.map((metric) => ({ label: metric.label === "Live" ? "Online metrics" : "Offline metrics", text: metric.text })),
              { label: "Rollout and experiment", text: problem.inference.experiment },
            ]} />
            <details className="mt-4 rounded-xl border border-outline/60 bg-surface px-5 py-4 text-sm">
              <summary className="font-semibold text-text">Capacity check <span aria-hidden="true">+</span></summary>
              <p className="mt-3 leading-relaxed text-text-muted">{problem.capacity}</p>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">Illustrative arithmetic; validate serving capacity on the actual model, hardware, and traffic.</p>
            </details>
          </section>

          <section id="deep-dives" aria-labelledby="deep-dives-title" className="scroll-mt-6">
            <StageHeading index={5} />
            <DesignDetails items={[
              { label: "Key tradeoff", text: problem.tradeoff },
              { label: "Monitor and maintain", text: problem.monitoring },
            ]} />
            <div className="mt-4 rounded-xl border border-outline/70 bg-surface p-5 sm:p-6">
              <h3 className="text-sm font-bold leading-relaxed text-text">Interviewer: {problem.followUp.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted"><span className="font-bold text-text">Candidate: </span>{problem.followUp.answer}</p>
            </div>
            <div className="mt-4 rounded-xl border border-outline/70 bg-surface p-5">
              <h3 className="text-sm font-bold text-text">Common mistakes</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
                {problem.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}
              </ul>
            </div>
          </section>

          <details className="rounded-lg border border-outline/55 px-5 py-4 text-sm">
            <summary className="font-semibold text-text">Design reference <span aria-hidden="true">+</span></summary>
            <p className="mt-3 text-text-muted">{problem.reference.note}</p>
            <a href={problem.reference.href} target="_blank" rel="noreferrer" className="mt-2 inline-block font-semibold text-accent-blue underline underline-offset-4">{problem.reference.title}</a>
          </details>
        </article>

        <nav aria-label="Case navigation" className="mt-8 grid gap-3 border-t border-outline/55 pt-5 sm:grid-cols-2">
          <Link href={previous ? `${NLP_SYSTEM_DESIGN_PATH}/${previous.id}` : NLP_SYSTEM_DESIGN_PATH} className="rounded-xl border border-outline/70 bg-surface p-4 hover:bg-surface-high">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-text-muted"><ArrowLeft size={14} aria-hidden="true" /> {previous ? "PREVIOUS CASE" : "ALL NLP CASES"}</span>
            <span className="text-sm font-semibold text-text">{previous?.title ?? "Back to the problems"}</span>
          </Link>
          <Link href={next ? `${NLP_SYSTEM_DESIGN_PATH}/${next.id}` : NLP_SYSTEM_DESIGN_PATH} className="rounded-xl border border-outline/70 bg-surface p-4 hover:bg-surface-high">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-text-muted">{next ? "NEXT CASE" : "ALL NLP CASES"} <ArrowRight size={14} aria-hidden="true" /></span>
            <span className="text-sm font-semibold text-text">{next?.title ?? "Back to the problems"}</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
