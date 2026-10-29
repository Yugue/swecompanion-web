"use client";

import { useEffect, useMemo, useState } from "react";
import { LLM_DOMAIN, llmParts, llmPartsById, llmTopicCount, llmTopicsById } from "@/lib/llmStudyData";
import { useChapterExpansion } from "@/lib/useChapterExpansion";
import { useProgress } from "@/lib/useProgress";
import { TopBar } from "@/components/TopBar";
import { GuideControls, type ProblemFilter } from "@/components/guide/GuideControls";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { MlHero } from "@/components/ml/MlHero";
import { MlSidebar } from "@/components/ml/MlSidebar";
import { MlPartDetails } from "@/components/ml/MlPartDetails";
import { LLM_PATH } from "@/lib/mlDomains";

const DOMAIN = LLM_DOMAIN;

export function LlmHub() {
  const { completed: savedCompleted, toggle, reset } = useProgress("llm", []);
  const completed = useMemo(
    () => new Set([...savedCompleted].filter(id => Object.hasOwn(llmTopicsById, id))),
    [savedCompleted],
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProblemFilter>("all");
  const [openChapters, setOpenChapters] = useChapterExpansion(
    "swe-companion:expanded-chapters:llm", llmParts[0]?.id
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [collapsedResults, setCollapsedResults] = useState<Set<string>>(() => new Set());
  const filtering = query.trim().length > 0 || filter !== "all";

  useEffect(() => {
    // window.location.hash is only readable client-side, after mount - the standard exception
    // to "avoid setState in effects".
    const hash = window.location.hash.replace("#", "");
    const part = llmParts.find((p) => p.id === hash || p.topics.some((t) => t.id === hash));
    if (part) {
      setOpenChapters((current) => new Set(current).add(part.id));
      requestAnimationFrame(() => {
        document.getElementById(part.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [setOpenChapters]);

  function jump(id: string) {
    setOpenChapters((current) => new Set(current).add(id));
    setQuery("");
    setFilter("all");
    setCollapsedResults(new Set());
    setDrawerOpen(false);
    window.history.replaceState(null, "", `#${id}`);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return llmParts
      .map((part) => {
        const partMatches = q.length > 0 && `${part.title} ${part.description}`.toLowerCase().includes(q);
        const topics = part.topics.filter((topic) => {
          const complete = completed.has(topic.id);
          const matchesFilter = filter === "all" || (filter === "remaining" ? !complete : complete);
          const matchesQuery =
            q.length === 0 ||
            partMatches ||
            `${topic.title} ${topic.summary} ${topic.keyPoints.join(" ")} ${topic.interviewPrompt}`.toLowerCase().includes(q);
          return matchesFilter && matchesQuery;
        });
        return { part, topics };
      })
      .filter((r) => r.topics.length > 0);
  }, [query, filter, completed]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <aside className="hidden w-[286px] shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <MlSidebar
              parts={llmParts}
              completed={completed}
              onJump={jump}
              onResetProgress={() => setConfirmingReset(true)}
              domain={DOMAIN}
              totalTopics={llmTopicCount}
              sectionLabel="Chapter"
            />
          </div>
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Close curriculum navigation"
              className="absolute inset-0 bg-black/50"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-[286px]">
              <MlSidebar
                parts={llmParts}
                completed={completed}
                onJump={jump}
                onResetProgress={() => setConfirmingReset(true)}
                domain={DOMAIN}
                totalTopics={llmTopicCount}
                sectionLabel="Chapter"
              />
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <TopBar activeTrack="ml" onMenuPressed={() => setDrawerOpen(true)} />

          <main className="mx-auto max-w-4xl px-4 py-6 sm:px-8">
            <MlHero
              domain={LLM_DOMAIN}
              sectionLabel="Chapter"
              lessonCount={llmTopicCount}
              chapterCount={llmParts.length}
              quizCount={llmParts.reduce((count, part) => count + part.quizQuestionCount, 0)}
            />

            <section aria-labelledby="llm-start-here" className="mb-5 rounded-xl border border-outline/70 bg-surface p-4">
              <h2 id="llm-start-here" className="mb-1 font-bold text-text">Start here</h2>
              <p className="text-sm leading-relaxed text-text-muted">
                Begin with Chapter 1. You need basic programming and school-level algebra. This guide teaches
                its own probability, neural networks, attention, training, and reinforcement learning foundations
                before using them.
              </p>
            </section>

            <div className="mb-5">
              <GuideControls
                query={query}
                onQueryChange={(value) => {
                  setQuery(value);
                  setCollapsedResults(new Set());
                }}
                filter={filter}
                onFilterChange={(value) => {
                  setFilter(value);
                  setCollapsedResults(new Set());
                }}
              />
            </div>

            <h2 className="sr-only">Curriculum</h2>

            {results.length === 0 ? (
              <div className="rounded-xl border border-outline bg-surface px-6 py-14 text-center">
                <p className="mb-3 font-semibold text-text">No topics match those filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                  className="text-sm font-semibold text-accent-blue"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {results.map(({ part, topics }) => (
                  <MlPartDetails
                    key={part.id}
                    part={{ ...part, topics }}
                    completed={completed}
                    open={filtering ? !collapsedResults.has(part.id) : openChapters.has(part.id)}
                    onToggle={() => {
                      if (filtering) {
                        setCollapsedResults((current) => {
                          const next = new Set(current);
                          if (next.has(part.id)) next.delete(part.id);
                          else next.add(part.id);
                          return next;
                        });
                      } else {
                        setOpenChapters((current) => {
                          const next = new Set(current);
                          if (next.has(part.id)) next.delete(part.id);
                          else next.add(part.id);
                          return next;
                        });
                        window.history.replaceState(null, "", window.location.pathname + window.location.search);
                      }
                    }}
                    onToggleTopic={toggle}
                    basePath={LLM_PATH}
                    partsById={llmPartsById}
                    sectionLabel="Chapter"
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {confirmingReset && (
        <ConfirmDialog
          title="Reset Large Language Models progress?"
          description="All completed lessons in this Large Language Models guide will be marked incomplete. This progress will be erased from this device (and your account, if signed in) and cannot be recovered."
          confirmLabel="Yes, reset progress"
          onConfirm={() => {
            reset();
            setConfirmingReset(false);
          }}
          onCancel={() => setConfirmingReset(false)}
        />
      )}
    </div>
  );
}
