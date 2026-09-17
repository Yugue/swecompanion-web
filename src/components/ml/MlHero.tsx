import { CheckCircle2, MessageSquare, Target, Mic } from "lucide-react";
import { mlTopicCount, mlParts } from "@/lib/mlStudyData";

const DOMAINS = [
  "Agentic AI Development",
  "Applied Machine Learning → Basics of ML",
  "Recommendations / Ranking / Predictions (RRP)",
  "Computer Vision (CV) / Image Processing",
  "Natural Language Processing / Understanding (NLP / NLU)",
  "Speech / Audio",
  "Deep Learning / Neural Networks",
  "Reinforcement Learning",
  "Distributed Machine Learning",
  "Generative AI → Large Language Models (LLM)",
];

const quizCount = mlParts.reduce((n, p) => n + p.quizQuestionCount, 0);

export function MlHero() {
  return (
    <div className="mb-6 rounded-2xl border border-outline/70 bg-surface p-6 sm:p-8">
      <span className="mb-4 inline-block rounded-md border border-accent-blue/35 bg-accent-blue/15 px-2.5 py-1.5 text-xs font-bold tracking-wide text-accent-blue-soft">
        GOOGLE L4–L6 ML DOMAIN INTERVIEW STUDY GUIDE
      </span>
      <h1 className="mb-2.5 text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl">
        Prepare for the Google ML Domain Interview.
      </h1>
      <p className="mb-2 text-base leading-relaxed text-text-muted">
        <span className="font-bold text-text">Designed for: </span>
        Google L4–L6 candidates preparing for a 45–60 minute interview with 3–5 common knowledge
        questions in one ML domain selected in advance.
      </p>
      <p className="mb-4 text-base leading-relaxed text-text-muted">
        <span className="font-bold text-text">Covers: </span>
        Deep Learning / Neural Networks fundamentals, with carefully organized explanations,
        diagrams, formulas, tables, and mock-interview quizzes.
      </p>

      <div className="mb-5 flex items-start gap-2.5 rounded-md border border-accent-green/35 bg-accent-green/10 p-3">
        <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-accent-green" />
        <p className="text-sm font-semibold leading-relaxed text-text">
          The writers of this page successfully passed the ML domain interview by following only
          this guide.
        </p>
      </div>

      <div className="mb-5 rounded-md border border-outline/55 bg-surface-high/40 p-4.5">
        <h2 className="mb-2 text-lg font-bold text-text">How the ML domain interview works</h2>
        <p className="mb-3 text-sm leading-relaxed text-text-muted">
          The interviewer is technical, but this is not a test of how many definitions you can
          recite. Expect 3–5 knowledge questions over the 45–60 minute session. Each one is often
          vague, like a system-design prompt - ask clarifying questions and work back and forth
          with the interviewer to find the concept they actually want you to explain.
        </p>

        <div className="mb-3 rounded-md border border-outline/55 bg-bg/40 p-3.5">
          <p className="mb-2.5 text-sm font-bold text-text">
            Example: narrow the question before teaching
          </p>
          <DialogueLine speaker="Interviewer" text="What is a loss function?" interviewer />
          <DialogueLine
            speaker="Candidate"
            text="A loss function measures how far a model's predictions are from the desired outcome and gives training a number to minimize. Is there a particular task you want to focus on, such as regression or classification?"
          />
          <DialogueLine speaker="Interviewer" text="Let's focus on binary classification." interviewer />
          <DialogueLine
            speaker="Candidate"
            text="Binary cross-entropy is a common training loss. Separately, we can judge performance with metrics such as recall or precision. Are missed positives or false alarms more important for this problem?"
          />
          <DialogueLine speaker="Interviewer" text="Let's focus on recall." interviewer />
          <div className="mb-2 rounded-md border border-accent-green/40 bg-accent-green/15 px-3 py-2.5">
            <p className="text-sm font-bold leading-relaxed text-text">
              KEY CONCEPT FOUND: RECALL. Stop surveying other losses, metrics, or model
              architectures. Spend the rest of the answer explaining recall well.
            </p>
          </div>
          <DialogueLine
            speaker="Candidate"
            text="Recall asks: of all the real positive cases, how many did we catch? Missing a cancer case can be especially costly, so recall may matter more there; in spam filtering, wrongly hiding a legitimate email can make precision important. I can walk through an example from a project where we chose the metric and threshold around those trade-offs."
          />
          <p className="mt-2.5 text-sm leading-relaxed text-text-muted">
            The key concept in this example is recall. Explain what it measures, why missed
            positives matter, the trade-offs, and a concrete project example. Spending time on
            unrelated concepts does not help. If coding comes up, expect simple implementation or
            pseudocode rather than building a Transformer from scratch.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <EvaluationPoint icon={MessageSquare} title="Collaborate" text="Narrow a broad prompt together instead of guessing." />
          <EvaluationPoint icon={Target} title="Identify the key concept" text="Notice what the interviewer chooses to focus on." />
          <EvaluationPoint icon={Mic} title="Explain it clearly" text="Know the idea well enough that a non-technical person could follow your explanation." />
        </div>
      </div>

      <div className="rounded-md border border-outline/55 bg-surface-high/40 p-4.5">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-sm font-bold text-text">Candidate-selectable Google ML domains</span>
        </div>
        <p className="mb-3.5 text-sm leading-relaxed text-text-muted">
          Candidates pre-select one of the following areas before the interview. The highlighted
          domain is the guide currently presented on this page.
        </p>
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map((domain) => {
            const selected = domain === "Deep Learning / Neural Networks";
            return (
              <span
                key={domain}
                className={`rounded-md border px-2.5 py-1.5 text-[12.5px] font-semibold ${
                  selected
                    ? "border-accent-blue/65 bg-accent-blue/15 text-accent-blue"
                    : "border-outline/45 bg-bg/50 text-text-muted"
                }`}
              >
                {domain}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5 text-[13px] font-medium text-text">
        <span className="rounded-md bg-surface-high/60 px-3 py-2">{mlTopicCount} full lessons</span>
        <span className="rounded-md bg-surface-high/60 px-3 py-2">Interview prompts</span>
        <span className="rounded-md bg-surface-high/60 px-3 py-2">{quizCount} mock-interview questions (premium)</span>
      </div>
    </div>
  );
}

function EvaluationPoint({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof MessageSquare;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={17} className="mt-0.5 shrink-0 text-accent-blue" />
      <p className="text-sm leading-relaxed text-text-muted">
        <span className="font-bold text-text">{title}: </span>
        {text}
      </p>
    </div>
  );
}

function DialogueLine({
  speaker,
  text,
  interviewer = false,
}: {
  speaker: string;
  text: string;
  interviewer?: boolean;
}) {
  const color = interviewer ? "var(--color-accent-blue)" : "var(--color-accent-green)";
  return (
    <div
      className="mb-1.5 rounded-md px-3 py-2.5"
      style={{
        background: `color-mix(in srgb, ${color} 7%, transparent)`,
        borderLeft: `2px solid ${color}`,
      }}
    >
      <p className="text-sm leading-relaxed text-text-muted">
        <span className="font-bold" style={{ color }}>
          {speaker}:{" "}
        </span>
        {text}
      </p>
    </div>
  );
}
