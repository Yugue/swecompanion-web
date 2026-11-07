import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SystemDesignCaseCompletion } from "@/components/mlsystemdesign/SystemDesignShell";
import { TopBar } from "@/components/TopBar";
import { SystemDesignDiagram } from "@/components/mlsystemdesign/SystemDesignDiagram";
import { SystemDesignLesson } from "@/components/mlsystemdesign/SystemDesignLesson";
import { NLP_SYSTEM_DESIGN_PATH } from "@/lib/mlDomains";
import { nlpDesignProblems, getNlpDesignProblem } from "@/lib/nlpSystemDesignData";
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

function LessonProse({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="max-w-prose space-y-4">
      {items.map(({ title, text }) => (
        <div key={title}>
          <h3 className="text-sm font-bold text-text">{title}</h3>
          <p className="mt-1 text-base leading-relaxed text-text-muted">{text}</p>
        </div>
      ))}
    </div>
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
        {problem.lessonId ? <SystemDesignLesson lessonId={problem.lessonId} topicName="NLP" diagram={<SystemDesignDiagram problem={problem} />} /> : (
        <article aria-label="NLP system design lesson" className="space-y-8">
          <section id="problem-framing" aria-labelledby="problem-framing-title" className="scroll-mt-6">
            <StageHeading index={0} />
            <p className="mb-4 text-base leading-relaxed text-text">{problem.statement}</p>
            <h3 className="mb-3 text-sm font-bold text-text">Interview Q&A</h3>
            <div role="group" aria-label="Problem statement conversation" className="overflow-hidden rounded-xl border border-outline/70 bg-surface">
              {problem.conversation.map((turn, turnIndex) => (
                <div key={turnIndex} className={`grid gap-1.5 p-4 sm:grid-cols-[100px_1fr] sm:gap-4 sm:p-5 ${turnIndex > 0 ? "border-t border-outline/45" : ""} ${turn.speaker === "Candidate" ? "bg-surface-high/30" : ""}`}>
                  <p className="text-sm font-bold text-text">{turn.speaker}</p>
                  <p className="text-sm leading-relaxed text-text-muted">{turn.text}</p>
                </div>
              ))}
            </div>
            <p className="mb-4 mt-5 max-w-prose text-base leading-relaxed text-text">{problem.decision}</p>
            <h3 className="mb-2 text-sm font-bold text-text">Functional requirements</h3>
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
            <LessonProse items={[
              { title: "Where the data comes from", text: problem.data.sources },
              { title: "How to get reliable labels", text: problem.data.labels },
              { title: "What the model needs to see", text: problem.data.features },
              { title: "How to keep the test fair", text: problem.data.validation },
            ]} />
            <dl className="mt-4 grid gap-3 rounded-xl border border-outline/70 bg-surface p-5 text-sm leading-relaxed sm:grid-cols-2 sm:gap-6">
              <div><dt className="font-bold text-text">One labeled example</dt><dd className="mt-1 text-text-muted">{problem.trainingExample.input}</dd></div>
              <div><dt className="font-bold text-text">What to record</dt><dd className="mt-1 text-text-muted">{problem.trainingExample.target}</dd></div>
            </dl>
          </section>

          <section id="high-level-design" aria-labelledby="high-level-design-title" className="scroll-mt-6">
            <StageHeading index={2} />
            <div className="max-w-prose space-y-3 text-base leading-relaxed text-text-muted">
              <p>{problem.highLevel.model}</p>
              <p>{problem.highLevel.rationale}</p>
            </div>
            <aside className="mt-4 rounded-xl border border-outline/70 bg-surface p-5" aria-label="Mental model">
              <p className="text-sm font-bold text-text">Picture it</p>
              <p className="mt-2 text-base leading-relaxed text-text">{problem.mentalModel}</p>
            </aside>
          </section>

          <section id="model-and-training" aria-labelledby="model-and-training-title" className="scroll-mt-6">
            <StageHeading index={3} />
            <LessonProse items={[
              { title: "What to try first", text: problem.modeling.baseline },
              { title: "How the model makes a prediction", text: problem.modeling.choice },
              { title: "When and how to train", text: problem.modeling.training },
              { title: "How to act on a prediction", text: problem.inference.serving },
            ]} />
          </section>

          <section id="evaluation" aria-labelledby="evaluation-title" className="scroll-mt-6">
            <StageHeading index={4} />
            <LessonProse items={[
              ...problem.measure.map((metric) => ({ title: metric.label === "Live" ? "What to measure in production" : "What to measure before launch", text: metric.text })),
              { title: "How to roll it out", text: problem.inference.experiment },
            ]} />
          </section>

          <section id="monitoring-and-scaling" aria-labelledby="monitoring-and-scaling-title" className="scroll-mt-6">
            <StageHeading index={5} />
            <p className="max-w-prose text-base leading-relaxed text-text-muted">{problem.monitoring}</p>
            <div className="mt-4 rounded-xl border border-outline/60 bg-surface px-5 py-4 text-sm">
              <h3 className="font-semibold text-text">Capacity planning</h3>
              <p className="mt-2 text-base leading-relaxed text-text-muted">{problem.capacity}</p>
            </div>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-text-muted">{problem.tradeoff}</p>
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
              {problem.designSteps.map((step, stepIndex) => <li key={step.title} className="max-w-prose"><h3 className="text-sm font-bold text-text">{stepIndex + 1}. {step.title}</h3><p className="mt-1 text-base leading-relaxed text-text-muted">{step.text}</p></li>)}
            </ol>
            <SystemDesignDiagram problem={problem} />
          </section>

        </article>
        )}

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
