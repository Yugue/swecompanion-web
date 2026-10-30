"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useProgress } from "@/lib/useProgress";
import { systemDesignProgressId } from "@/lib/mlSystemDesignTopics";

type ProgressValue = ReturnType<typeof useProgress> & { requestReset: () => void };
const ProgressContext = createContext<ProgressValue | null>(null);

function useSystemDesignProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("System design progress requires SystemDesignProgressProvider");
  return value;
}

export function SystemDesignProgressProvider({ children }: { children: ReactNode }) {
  const progress = useProgress("mlsd", []);
  const [confirmingReset, setConfirmingReset] = useState(false);
  return (
    <ProgressContext.Provider value={{ ...progress, requestReset: () => setConfirmingReset(true) }}>
      {children}
      {confirmingReset && <ConfirmDialog title="Reset system design progress?" description="All completed cases in ML System Design will be marked incomplete on this device and your account if signed in." confirmLabel="Yes, reset progress" onCancel={() => setConfirmingReset(false)} onConfirm={() => { progress.reset(); setConfirmingReset(false); }} />}
    </ProgressContext.Provider>
  );
}

export function useSystemDesignTopicProgress(topicId: string) {
  const { completed: saved, toggle: toggleSaved, requestReset } = useSystemDesignProgress();
  const prefix = `${topicId}:`;
  const completed = useMemo(() => new Set([...saved].filter((id) => id.startsWith(prefix)).map((id) => id.slice(prefix.length))), [saved, prefix]);
  const toggle = useCallback((id: string) => toggleSaved(systemDesignProgressId(topicId, id)), [toggleSaved, topicId]);
  return { completed, toggle, requestReset };
}

export function SystemDesignCaseCompletion({ caseId, accent = "#4285F4" }: { caseId: string; accent?: string }) {
  const { completed, toggle } = useSystemDesignTopicProgress("nlp");
  const done = completed.has(caseId);
  return (
    <button type="button" aria-pressed={done} onClick={() => toggle(caseId)} className="flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold" style={{ borderColor: done ? accent : "var(--color-outline)", color: done ? accent : "var(--color-text-muted)", background: done ? `color-mix(in srgb, ${accent} 12%, transparent)` : "transparent" }}>
      <CheckCircle2 size={17} aria-hidden="true" /> {done ? "Marked completed" : "Mark as completed"}
    </button>
  );
}
