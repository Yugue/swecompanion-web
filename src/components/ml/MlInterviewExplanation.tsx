"use client";

import { useId, useLayoutEffect, useState } from "react";
import { ChevronDown, MessageSquare, Target, Mic } from "lucide-react";

const STORAGE_KEY = "swe-companion:ml-interview-explanation-expanded";

/** Shared across ML guides; remember the reader's choice on this browser. */
export function MlInterviewExplanation() {
  const [expanded, setExpanded] = useState(true);
  const contentId = useId();

  useLayoutEffect(() => {
    try {
      // Restore before the browser paints a newly mounted guide to avoid an expanded flash.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpanded(localStorage.getItem(STORAGE_KEY) !== "false");
    } catch {
      // Keep the section usable when browser storage is unavailable.
    }
  }, []);

  function toggleExpanded() {
    const next = !expanded;
    setExpanded(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // The current visit still keeps the selected state.
    }
  }

  return (
    <section className="mb-5 rounded-md border border-outline/55 bg-surface-high/40 p-4.5">
      <h2>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={toggleExpanded}
          className="flex w-full items-center justify-between gap-3 rounded-sm text-left text-lg font-bold text-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
        >
          How the ML domain interview works
          <ChevronDown size={20} aria-hidden="true" className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </h2>
      <div id={contentId} hidden={!expanded} className="mt-2">
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
    </section>
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
