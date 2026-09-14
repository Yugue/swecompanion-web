"use client";

import { useEffect, useMemo, useState } from "react";
import { mlParts } from "@/lib/mlStudyData";
import { useProgress } from "@/lib/useProgress";
import { TopBar } from "@/components/TopBar";
import { GuideControls, type ProblemFilter } from "@/components/guide/GuideControls";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { MlHero } from "@/components/ml/MlHero";
import { MlSidebar } from "@/components/ml/MlSidebar";
import { MlPartDetails } from "@/components/ml/MlPartDetails";

export default function MlHubPage() {
  const { completed, toggle, reset } = useProgress("ml", []);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProblemFilter>("all");
  const [openId, setOpenId] = useState<string | null>(mlParts[0]?.id ?? null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  useEffect(() => {
    // window.location.hash is only readable client-side, after mount - the standard exception
    // to "avoid setState in effects".
    const hash = window.location.hash.replace("#", "");
    const part = mlParts.find((p) => p.id === hash || p.topics.some((t) => t.id === hash));
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
    setDrawerOpen(false);
    window.history.replaceState(null, "", `#${id}`);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mlParts
      .map((part) => {
        const partMatches = q.length > 0 && `${part.title} ${part.description}`.toLowerCase().includes(q);
        const topics = part.topics.filter((topic) => {
          const complete = completed.has(topic.id);
          const matchesFilter = filter === "all" || (filter === "remaining" ? !complete : complete);
          const matchesQuery =
            q.length === 0 ||
            partMatches ||
            `${topic.title} ${topic.summary} ${topic.keyPoints.join(" ")}`.toLowerCase().includes(q);
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
              parts={mlParts}
              completed={completed}
              onJump={jump}
              onResetProgress={() => setConfirmingReset(true)}
            />
          </div>
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-[286px]">
              <MlSidebar
                parts={mlParts}
                completed={completed}
                onJump={jump}
                onResetProgress={() => setConfirmingReset(true)}
              />
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <TopBar activeTrack="ml" onMenuPressed={() => setDrawerOpen(true)} />

          <main className="mx-auto max-w-4xl px-4 py-6 sm:px-8">
            <MlHero />

            <div className="mb-5">
              <GuideControls
                query={query}
                onQueryChange={setQuery}
                filter={filter}
                onFilterChange={setFilter}
                placeholder="Search ML concepts or interview prompts"
              />
            </div>

            {results.length === 0 ? (
              <div className="rounded-xl border border-outline bg-surface px-6 py-14 text-center">
                <p className="mb-3 font-semibold text-text">No review topics match those filters.</p>
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
                    open={openId === part.id}
                    onToggle={() => setOpenId((cur) => (cur === part.id ? null : part.id))}
                    onToggleTopic={toggle}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {confirmingReset && (
        <ConfirmDialog
          title="Reset ML progress?"
          description="All completed lessons in this ML guide will be marked incomplete. This progress will be erased from this device (and your account, if signed in) and cannot be recovered."
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
