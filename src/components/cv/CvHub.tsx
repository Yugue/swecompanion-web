"use client";

import { useEffect, useMemo, useState } from "react";
import { CV_DOMAIN, cvParts, cvPartsById, cvTopicCount } from "@/lib/cvStudyData";
import { useProgress } from "@/lib/useProgress";
import { TopBar } from "@/components/TopBar";
import { GuideControls, type ProblemFilter } from "@/components/guide/GuideControls";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { CvHero } from "@/components/cv/CvHero";
import { MlSidebar } from "@/components/ml/MlSidebar";
import { MlPartDetails } from "@/components/ml/MlPartDetails";
import { CV_PATH } from "@/lib/mlDomains";

const DOMAIN = CV_DOMAIN;

export function CvHub() {
  const { completed, toggle, reset } = useProgress("cv", []);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProblemFilter>("all");
  const [openId, setOpenId] = useState<string | null>(cvParts[0]?.id ?? null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [collapsedResults, setCollapsedResults] = useState<Set<string>>(() => new Set());
  const filtering = query.trim().length > 0 || filter !== "all";

  useEffect(() => {
    // window.location.hash is only readable client-side, after mount - the standard exception
    // to "avoid setState in effects".
    const hash = window.location.hash.replace("#", "");
    const part = cvParts.find((p) => p.id === hash || p.topics.some((t) => t.id === hash));
    if (part) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenId(part.id);
      requestAnimationFrame(() => {
        document.getElementById(part.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  function jump(id: string) {
    setOpenId(id);
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
    return cvParts
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
              parts={cvParts}
              completed={completed}
              onJump={jump}
              onResetProgress={() => setConfirmingReset(true)}
              domain={DOMAIN}
              totalTopics={cvTopicCount}
              sectionLabel="Part"
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
                parts={cvParts}
                completed={completed}
                onJump={jump}
                onResetProgress={() => setConfirmingReset(true)}
                domain={DOMAIN}
                totalTopics={cvTopicCount}
                sectionLabel="Part"
              />
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <TopBar activeTrack="ml" onMenuPressed={() => setDrawerOpen(true)} />

          <main className="mx-auto max-w-4xl px-4 py-6 sm:px-8">
            <CvHero />

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
                placeholder="Search CV concepts or interview prompts"
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
                    open={filtering ? !collapsedResults.has(part.id) : openId === part.id}
                    onToggle={() => {
                      if (filtering) {
                        setCollapsedResults((current) => {
                          const next = new Set(current);
                          if (next.has(part.id)) next.delete(part.id);
                          else next.add(part.id);
                          return next;
                        });
                      } else {
                        setOpenId((current) => current === part.id ? null : part.id);
                      }
                    }}
                    onToggleTopic={toggle}
                    basePath={CV_PATH}
                    partsById={cvPartsById}
                    sectionLabel="Part"
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {confirmingReset && (
        <ConfirmDialog
          title="Reset CV progress?"
          description="All completed lessons in this CV guide will be marked incomplete. This progress will be erased from this device (and your account, if signed in) and cannot be recovered."
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
