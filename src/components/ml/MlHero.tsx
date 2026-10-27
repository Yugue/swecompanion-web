import Link from "next/link";
import { MlWritersNote } from "@/components/ml/MlWritersNote";
import { mlTopicCount, mlParts } from "@/lib/mlStudyData";
import { ML_DOMAINS } from "@/lib/mlDomains";
import { MlGuideStats } from "@/components/ml/MlGuideStats";
import { MlInterviewExplanation } from "@/components/ml/MlInterviewExplanation";

const mlQuizCount = mlParts.reduce((n, p) => n + p.quizQuestionCount, 0);

/**
 * Shared hero for every ML-domain guide. The "how the interview works" explanation is identical
 * across domains (the candidate picks one domain, the format is the same), so only the domain
 * name, its summary and the counts are per-track.
 */
export function MlHero({
  domain = "Deep Learning / Neural Networks",
  lessonCount = mlTopicCount,
  chapterCount = mlParts.length,
  quizCount = mlQuizCount,
  sectionLabel = "Chapter",
  showWritersNote = true,
}: {
  domain?: string;
  lessonCount?: number;
  chapterCount?: number;
  quizCount?: number;
  sectionLabel?: "Chapter" | "Part";
  showWritersNote?: boolean;
}) {
  const summary = ML_DOMAINS.find((d) => d.name === domain)?.summary;
  return (
    <div className="mb-6 rounded-2xl border border-outline/70 bg-surface p-6 sm:p-8">
      <h1 className="mb-2.5 text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl">
        Prepare for the Google ML Domain Interview.
      </h1>
      <p className="mb-2 text-base leading-relaxed text-text-muted">
        <span className="font-bold text-text">Designed for: </span>
        Google L4–L6 candidates preparing for a 45–60 minute interview with 3–5 common knowledge
        questions in one ML domain selected in advance.
      </p>
      <div className="mb-3 mt-4 rounded-md border border-accent-blue/35 bg-accent-blue/10 p-4">
        <p className="text-sm font-semibold text-text-muted">
          This guide covers the ML domain interview topic:
        </p>
        <p className="mt-1 text-lg font-bold leading-snug text-accent-blue">{domain}</p>
        {summary && <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{summary}</p>}
      </div>
      {showWritersNote && <MlWritersNote />}
      <MlGuideStats lessonCount={lessonCount} chapterCount={chapterCount} quizCount={quizCount} sectionLabel={sectionLabel} />

      <MlInterviewExplanation />

      <div className="rounded-md border border-outline/55 bg-surface-high/40 p-4.5">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-sm font-bold text-text">Candidate-selectable Google ML domains</span>
        </div>
        <p className="mb-3.5 text-sm leading-relaxed text-text-muted">
          Candidates pre-select one of the following areas before the interview. Select another
          domain to switch guides.
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

    </div>
  );
}
