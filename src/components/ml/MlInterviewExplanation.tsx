"use client";

import { useId, useLayoutEffect, useState } from "react";
import { ChevronDown, MessageSquare, Target, Mic } from "lucide-react";

const STORAGE_KEY = "swe-companion:ml-interview-explanation-expanded";

/** Start expanded unless the reader has saved a different choice. */
export function MlInterviewExplanation() {
  // Server HTML stays closed until the browser can read the saved preference.
  const [expanded, setExpanded] = useState<boolean | null>(null);
  const contentId = useId();

  useLayoutEffect(() => {
    let savedExpanded = true;
    try {
      savedExpanded = localStorage.getItem(STORAGE_KEY) !== "false";
    } catch {
      // Keep the default when browser storage is unavailable.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpanded(savedExpanded);
  }, []);

  function toggleExpanded() {
    const next = !expanded;
    setExpanded(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // The section remains usable without persistent storage.
    }
  }

  return (
    <section className="mb-5 rounded-md border border-outline/55 bg-surface-high/40 p-4.5">
      <h2>
        <button
          type="button"
          aria-expanded={expanded === true}
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
          Expect 3–5 knowledge questions over the 45–60 minute session. Each one is often
          vague, like a system-design prompt - ask clarifying questions and work back and forth
          with the interviewer to find the concept they actually want you to explain.
        </p>

        <div className="mb-3">
          <p className="mb-2.5 text-sm font-bold text-text">
            Example
          </p>
          <DialogueLine speaker="Interviewer" text="What is a loss function?" interviewer />
          <DialogueLine
            speaker="Candidate"
            text="A loss function measures how far a model’s predictions are from the correct answers. During training, the model adjusts its parameters to reduce this loss. Common examples include mean squared error, mean absolute error, and cross-entropy. Is there a specific loss function you’d like me to discuss?"
          />
          <DialogueLine speaker="Interviewer" text="Yes, focus on recall." interviewer />
          <div className="mb-2 rounded-md border border-accent-green/40 bg-accent-green/15 px-3 py-2.5">
            <p className="text-sm font-bold leading-relaxed text-text">
              Bingo, you found the key concept: Recall
            </p>
          </div>
          <DialogueLine
            speaker="Candidate"
            text="Sure. Recall is an evaluation metric rather than a training loss. It asks: out of all the cases that were actually positive, how many did we catch? If 100 cases are positive and the model finds 90, recall is 90%; the other 10 are false negatives. Recall matters when missed positives are costly, such as fraud that goes undetected. It does not measure false alarms: flagging everything gives 100% recall. We also check precision to understand how many flagged cases are correct."
          />
        </div>

        <h3 className="mb-2 text-sm font-bold text-text">What interviewers look for</h3>
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
