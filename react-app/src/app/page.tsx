"use client";

import { useEffect, useMemo, useState } from "react";
import {
  studyTopics,
  initialCompletedProblems,
  type StudyTopic,
  type StudyProblem,
} from "@/lib/studyData";
import { useProgress } from "@/lib/useProgress";
import { TopBar } from "@/components/TopBar";
import { GuideSidebar } from "@/components/guide/GuideSidebar";
import { GuideControls, type ProblemFilter } from "@/components/guide/GuideControls";
import { TopicDetails } from "@/components/guide/TopicDetails";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function LeetCodeGuidePage() {
  const { completed, toggle, reset } = useProgress("leetcode", [...initialCompletedProblems]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProblemFilter>("all");
  const [openSlug, setOpenSlug] = useState<string | null>(studyTopics[0]?.slug ?? null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  useEffect(() => {
    // window.location.hash is only readable client-side, after mount - the standard exception
    // to "avoid setState in effects".
    const hash = window.location.hash.replace("#", "");
    if (hash && studyTopics.some((t) => t.slug === hash)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenSlug(hash);
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  function jump(slug: string) {
    setOpenSlug(slug);
    setDrawerOpen(false);
    window.history.replaceState(null, "", `#${slug}`);
    requestAnimationFrame(() => {
      document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return studyTopics
      .map((topic) => {
        const topicMatches = q.length > 0 && `${topic.title} ${topic.note}`.toLowerCase().includes(q);
        const problems = topic.problems.filter((p) => {
          const complete = completed.has(p.id);
          const matchesFilter =
            filter === "all" || (filter === "remaining" ? !complete : complete);
          const matchesQuery =
            q.length === 0 || topicMatches || `${p.id} ${p.title}`.toLowerCase().includes(q);
          return matchesFilter && matchesQuery;
        });
        return { topic, problems };
      })
      .filter((r) => r.problems.length > 0);
  }, [query, filter, completed]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <aside className="hidden w-[286px] shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <GuideSidebar
              topics={studyTopics}
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
              <GuideSidebar
                topics={studyTopics}
                completed={completed}
                onJump={jump}
                onResetProgress={() => setConfirmingReset(true)}
              />
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <TopBar activeTrack="leetcode" onMenuPressed={() => setDrawerOpen(true)} />

          <main id="guide-top" className="mx-auto max-w-4xl px-4 py-6 sm:px-8">
            <div className="mb-6 rounded-2xl border border-outline/70 bg-surface p-6 sm:p-8">
              <span className="mb-4 inline-block rounded-md border border-accent-blue/35 bg-accent-blue/15 px-2.5 py-1.5 text-xs font-bold tracking-wide text-accent-blue-soft">
                FREE INTERVIEW GUIDE
              </span>
              <h1 className="mb-2.5 text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl">
                Master the fundamentals. Walk into L4–L6 interviews with confidence.
              </h1>
              <p className="text-base leading-relaxed text-text-muted">
                A carefully organized guide to the data structures, algorithms, and representative
                LeetCode questions that appear most often in software engineering interviews - plus
                mock-interview practice quizzes for premium members.
              </p>
            </div>

            <div className="mb-5">
              <GuideControls
                query={query}
                onQueryChange={setQuery}
                filter={filter}
                onFilterChange={setFilter}
                placeholder="Search questions or patterns"
              />
            </div>

            {results.length === 0 ? (
              <div className="rounded-xl border border-outline bg-surface px-6 py-14 text-center">
                <p className="mb-3 font-semibold text-text">No questions match these filters</p>
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
                {results.map(({ topic, problems }: { topic: StudyTopic; problems: StudyProblem[] }) => (
                  <TopicDetails
                    key={topic.slug}
                    topic={topic}
                    problems={problems}
                    completed={completed}
                    open={openSlug === topic.slug}
                    onToggle={() => setOpenSlug((cur) => (cur === topic.slug ? null : topic.slug))}
                    onToggleProblem={toggle}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {confirmingReset && (
        <ConfirmDialog
          title="Reset LeetCode progress?"
          description="All completed LeetCode problems will be marked incomplete. This progress will be erased from this device (and your account, if signed in) and cannot be recovered."
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
