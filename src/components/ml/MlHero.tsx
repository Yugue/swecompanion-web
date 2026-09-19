import Link from "next/link";
import { CheckCircle2, MessageSquare, Target, Mic } from "lucide-react";
import { mlTopicCount, mlParts } from "@/lib/mlStudyData";
import { ML_DOMAINS } from "@/lib/mlDomains";

const mlQuizCount = mlParts.reduce((n, p) => n + p.quizQuestionCount, 0);

/**
 * Shared hero for every ML-domain guide. The "how the interview works" explanation is identical
 * across domains (the candidate picks one domain, the format is the same), so only the domain
 * name, the one-line "Covers" blurb and the two counts are per-track.
 */
export function MlHero({
  domain = "Deep Learning / Neural Networks",
  covers = "Deep Learning / Neural Networks fundamentals",
  lessonCount = mlTopicCount,
  quizCount = mlQuizCount,
}: {
  domain?: string;
  covers?: string;
  lessonCount?: number;
  quizCount?: number;
}) {
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
        {covers}, with carefully organized explanations, diagrams, formulas, tables, and
        mock-interview quizzes.
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
            text="Sure! Recall is basically: out of all the cases that were actually positive, how many did we catch? So if 100 patients really have cancer and our model flags 90 of them, recall is 90%, and the 10 we missed are the false negatives. It only cares about missed positives, not false alarms, so on its own it's easy to game: flagging everyone gives 100% recall. I'd lean on recall when missing a real case is the expensive mistake, like cancer screening, where we'd happily take a few false alarms to catch as many real cases as we can. Spam filtering is the opposite. A spam email slipping through is just annoying, but a legitimate email, like a job offer, landing in spam really hurts, so precision matters more there. And if we want one number that balances both, we can use F1."
          />
          <p className="mt-2.5 text-sm leading-relaxed text-text-muted">
            The key concept in this example is recall. Explain what it measures, why missed
            positives matter, and the trade-offs. Spending time on unrelated concepts does not
            help. If coding comes up, expect simple implementation or
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
          domain is the guide currently presented on this page; select another to switch guides.
        </p>
        <div className="flex flex-wrap gap-2">
          {ML_DOMAINS.map(({ name, href }) => {
            const selected = name === domain;
            const style = `rounded-md border px-2.5 py-1.5 text-[12.5px] font-semibold ${
              selected
                ? "border-accent-blue/65 bg-accent-blue/15 text-accent-blue"
                : "border-outline/45 bg-bg/50 text-text-muted"
            }`;
            if (!href || selected) {
              return (
                <span key={name} aria-current={selected ? "page" : undefined} className={style}>
                  {name}
                </span>
              );
            }
            return (
              <Link
                key={name}
                href={href}
                className={`${style} transition-colors hover:border-accent-blue/45 hover:text-text`}
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5 text-[13px] font-medium text-text">
        <span className="rounded-md bg-surface-high/60 px-3 py-2">{lessonCount} full lessons</span>
        <span className="rounded-md bg-surface-high/60 px-3 py-2">Interview prompts</span>
        {quizCount > 0 && (
          <span className="rounded-md bg-surface-high/60 px-3 py-2">
            {quizCount} mock-interview questions (premium)
          </span>
        )}
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
