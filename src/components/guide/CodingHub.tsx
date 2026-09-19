"use client";

import { useEffect, useMemo, useState } from "react";
import {
  studyTopics,
  initialCompletedProblems,
  type StudyTopic,
  type StudyProblem,
} from "@/lib/studyData";
import { useProgress } from "@/lib/useProgress";
import { CODING_PATH, chapterPath } from "@/lib/codingPaths";
import { TopBar } from "@/components/TopBar";
import { GuideSidebar } from "@/components/guide/GuideSidebar";
import { GuideControls, type ProblemFilter } from "@/components/guide/GuideControls";
import { TopicDetails } from "@/components/guide/TopicDetails";
import { ConfirmDialog } from "@/components/ConfirmDialog";

/**
 * The coding guide. Every chapter starts expanded. A chapter has no page of its own:
 * /coding/<chapter> renders this same hub scrolled to that chapter, and picking a chapter here
 * updates the URL to match, so the address bar is always a shareable link to what is on screen.
 * (The URL only says which chapter is focused; expanding or collapsing others does not change it.)
 */
export function CodingHub({ initialChapter }: { initialChapter?: string }) {
  const { completed, toggle, reset } = useProgress("leetcode", [...initialCompletedProblems]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProblemFilter>("all");
  const [openChapters, setOpenChapters] = useState<Set<string>>(
    () => new Set(studyTopics.map(chapterPath))
  );
  const [focusChapter, setFocusChapter] = useState<string | null>(initialChapter ?? null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  function scrollToChapter(path: string) {
    requestAnimationFrame(() => {
      document.getElementById(path)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function setUrl(path: string | null) {
    window.history.replaceState(null, "", path ? `${CODING_PATH}/${path}` : CODING_PATH);
  }

  // Focus a chapter: make sure it is expanded, point the URL at it, and bring it into view.
  function focus(path: string) {
    setOpenChapters((cur) => new Set(cur).add(path));
    setFocusChapter(path);
    setUrl(path);
    scrollToChapter(path);
  }

  // Header click: expanding focuses the chapter; collapsing the focused one clears the focus.
  function toggleChapter(path: string) {
    if (openChapters.has(path)) {
      setOpenChapters((cur) => {
        const next = new Set(cur);
        next.delete(path);
        return next;
      });
      if (focusChapter === path) {
        setFocusChapter(null);
        setUrl(null);
      }
    } else {
      setOpenChapters((cur) => new Set(cur).add(path));
      setFocusChapter(path);
      setUrl(path);
    }
  }

  useEffect(() => {
    // window.location.hash is only readable client-side, after mount - the standard exception
    // to "avoid setState in effects". A #fragment is a link from before chapters had URL paths
    // (it used the old slug, or the path); resolve it to the chapter and canonicalize the URL.
    const hash = window.location.hash.replace("#", "");
    const fromHash = hash ? studyTopics.find((t) => chapterPath(t) === hash || t.slug === hash) : undefined;
    const target = fromHash ? chapterPath(fromHash) : initialChapter;
    if (!target) return;
    if (fromHash) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFocusChapter(target);
      setUrl(target);
    }
    scrollToChapter(target);
  }, [initialChapter]);

  function jump(path: string) {
    setDrawerOpen(false);
    focus(path);
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
                    open={openChapters.has(chapterPath(topic))}
                    onToggle={() => toggleChapter(chapterPath(topic))}
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
