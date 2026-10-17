import Link from "next/link";
import { CV_DOMAIN, cvParts, cvTopicCount } from "@/lib/cvStudyData";
import { ML_DOMAINS } from "@/lib/mlDomains";
import { MlWritersNote } from "@/components/ml/MlWritersNote";
import { MlGuideStats } from "@/components/ml/MlGuideStats";
import { MlInterviewExplanation } from "@/components/ml/MlInterviewExplanation";

export function CvHero() {
  return (
    <section className="mb-6 rounded-2xl border border-outline/70 bg-surface p-6 sm:p-8">
      <span className="mb-4 inline-block rounded-md border border-accent-blue/35 bg-accent-blue/15 px-2.5 py-1.5 text-xs font-bold tracking-wide text-accent-blue-soft">
        COMPUTER VISION · ML INTERVIEW STUDY GUIDE
      </span>
      <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl">
        Computer Vision / Image Processing
      </h1>
      <p className="mb-3 text-base leading-relaxed text-text-muted">
        <span className="font-bold text-text">Designed for: </span>
        Mid-to-senior software and ML engineers preparing at roughly
        Google L4–L5 depth. Start with images and classical vision, then build toward learned
        representations, modern models, and practical system design.
      </p>
      <MlWritersNote />
      <MlGuideStats
        lessonCount={cvTopicCount}
        chapterCount={cvParts.length}
        quizCount={cvParts.reduce((count, part) => count + part.quizQuestionCount, 0)}
      />
      <p className="mb-5 text-sm leading-relaxed text-text-muted">
        No separate Deep Learning course required. Learn through first-principles explanations,
        diagrams, formulas, comparison tables, small PyTorch/OpenCV examples, and interview
        reasoning prompts.
      </p>
      <MlInterviewExplanation />
      <p className="mb-3 text-sm font-bold text-text">Explore ML domains</p>
      <div className="flex flex-wrap gap-2">
        {ML_DOMAINS.map(({ name, href }) => {
          const selected = name === CV_DOMAIN;
          const className = `rounded-md border px-2.5 py-1.5 text-[12.5px] font-semibold ${selected ? "border-accent-blue/65 bg-accent-blue/15 text-accent-blue" : "border-outline/45 bg-bg/50 text-text-muted"}`;
          return href && !selected ? (
            <Link key={name} href={href} className={`${className} transition-colors hover:border-accent-blue/45 hover:text-text`}>{name}</Link>
          ) : (
            <span key={name} aria-current={selected ? "page" : undefined} className={className}>{name}</span>
          );
        })}
      </div>
    </section>
  );
}
