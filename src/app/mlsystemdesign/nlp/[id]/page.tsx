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
import { mlSystemDesignProblemFlow } from "@/lib/mlSystemDesignTopics";

function StageHeading({ index }: { index: number }) {
  const stage = mlSystemDesignProblemFlow[index];
  return (
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h2 id={`${stage.id}-title`} className="text-xl font-bold text-text">{index + 1}. {stage.title}</h2>
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
        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-text">Problem {index + 1}: {problem.title}</h1>
        <div className="mb-5"><SystemDesignCaseCompletion caseId={problem.id} accent={accent} /></div>
        <p className="mb-6 text-base leading-relaxed text-text-muted">{problem.summary}</p>
        <article aria-label="NLP system design lesson" className="space-y-8">
          <header>
            <p className="text-xs leading-relaxed text-text-muted">
              Interview Q&A → requirements and objectives → data → model choice and training → evaluation → monitoring → detailed architecture. Framework reference: <a href={nlpDesignFramework.href} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4">{nlpDesignFramework.title}</a>.
            </p>
            <nav aria-label="Interview stages" className="mt-4 flex flex-wrap gap-2">
              {mlSystemDesignProblemFlow.map((stage, stageIndex) => (
                <a key={stage.id} href={`#${stage.id}`} className="rounded-md border border-outline/60 bg-surface px-2.5 py-1.5 text-xs font-semibold text-text-muted hover:border-accent-blue/60 hover:text-text">
                  {stageIndex + 1}. {stage.title}
                </a>
              ))}
            </nav>
          </header>

          <section id="problem-framing" aria-labelledby="problem-framing-title" className="scroll-mt-6">
            <StageHeading index={0} />
            <h3 className="mb-3 text-sm font-bold text-text">Problem statement: interview Q&A</h3>
            <div role="group" aria-label="Problem statement conversation" className="overflow-hidden rounded-xl border border-outline/70 bg-surface">
              {problem.conversation.map((turn, turnIndex) => (
                <div key={turnIndex} className={`grid gap-1.5 p-4 sm:grid-cols-[100px_1fr] sm:gap-4 sm:p-5 ${turnIndex > 0 ? "border-t border-outline/45" : ""} ${turn.speaker === "Candidate" ? "bg-surface-high/30" : ""}`}>
                  <p className="text-sm font-bold text-text">{turn.speaker}</p>
                  <p className="text-sm leading-relaxed text-text-muted">{turn.text}</p>
                </div>
              ))}
            </div>
            <h3 className="mb-2 mt-5 text-sm font-bold text-text">Functional requirements</h3>
            <p className="mb-2 text-sm leading-relaxed text-text-muted">From the interviewer’s answers, the system must:</p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-text-muted">{problem.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul>
            <h3 className="mb-2 mt-5 text-sm font-bold text-text">Derived objectives</h3>
            <DesignDetails items={[
              { label: "Business objective", text: problem.objectives.business },
              { label: "ML objective", text: problem.objectives.ml },
            ]} />
            <div className="mt-4">
              <DesignDetails items={[
                { label: "Example input", text: problem.example.input },
                { label: "Expected result", text: problem.example.output },
              ]} />
            </div>
          </section>

          <section id="data-and-features" aria-labelledby="data-and-features-title" className="scroll-mt-6">
            <StageHeading index={1} />
            <DesignDetails items={[
              { label: "Where examples come from", text: problem.data.sources },
              { label: "Labels and fair testing", text: problem.data.labels },
              { label: "What the model reads", text: problem.data.features },
            ]} />
            <dl className="mt-4 grid gap-3 rounded-xl border border-outline/70 bg-surface p-5 text-sm leading-relaxed sm:grid-cols-2 sm:gap-6">
              <div><dt className="font-bold text-text">One training example</dt><dd className="mt-1 text-text-muted">{problem.trainingExample.input}</dd></div>
              <div><dt className="font-bold text-text">The answer we teach</dt><dd className="mt-1 text-text-muted">{problem.trainingExample.target}</dd></div>
            </dl>
          </section>

          <section id="high-level-design" aria-labelledby="high-level-design-title" className="scroll-mt-6">
            <StageHeading index={2} />
            <DesignDetails items={[
              { label: "What model to use", text: problem.highLevel.model },
              { label: "Why it fits", text: problem.highLevel.rationale },
            ]} />
            <aside className="mt-4 rounded-xl border border-outline/70 bg-surface p-5" aria-label="Mental model">
              <p className="text-sm font-bold text-text">Picture it</p>
              <p className="mt-2 text-base leading-relaxed text-text">{problem.mentalModel}</p>
            </aside>
          </section>

          <section id="model-and-training" aria-labelledby="model-and-training-title" className="scroll-mt-6">
            <StageHeading index={3} />
            <DesignDetails items={[
              { label: "Compare simple baselines", text: problem.modeling.baseline },
              { label: "How the model works", text: problem.modeling.choice },
              { label: "How it learns", text: problem.modeling.training },
              { label: "Live decision rule", text: problem.inference.serving },
            ]} />
          </section>

          <section id="evaluation" aria-labelledby="evaluation-title" className="scroll-mt-6">
            <StageHeading index={4} />
            <DesignDetails items={[
              ...problem.measure.map((metric) => ({ label: metric.label === "Live" ? "After release" : "Before release", text: metric.text })),
              { label: "Safe rollout", text: problem.inference.experiment },
            ]} />
          </section>

          <section id="monitoring-and-scaling" aria-labelledby="monitoring-and-scaling-title" className="scroll-mt-6">
            <StageHeading index={5} />
            <p className="mb-4 text-sm leading-relaxed text-text-muted">{problem.monitoring}</p>
            <details className="mt-4 rounded-xl border border-outline/60 bg-surface px-5 py-4 text-sm">
              <summary className="font-semibold text-text">Capacity and cost assumptions <span aria-hidden="true">+</span></summary>
              <p className="mt-3 leading-relaxed text-text-muted">{problem.capacity}</p>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">Illustrative arithmetic; validate serving capacity on the actual model, hardware, and traffic.</p>
            </details>
            <p className="mt-4 text-sm leading-relaxed text-text-muted"><span className="font-semibold text-text">The tradeoff: </span>{problem.tradeoff}</p>
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

          <section id="detailed-design" aria-labelledby="detailed-design-title" className="scroll-mt-6">
            <StageHeading index={6} />
            <ol className="mb-5 space-y-4">
              {problem.designSteps.map((step, stepIndex) => <li key={step.title}><h3 className="text-sm font-bold text-text">{stepIndex + 1}. {step.title}</h3><p className="mt-1 text-sm leading-relaxed text-text-muted">{step.text}</p></li>)}
            </ol>
            <SystemDesignDiagram problem={problem} />
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
