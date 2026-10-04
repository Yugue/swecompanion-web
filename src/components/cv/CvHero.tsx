import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { CV_DOMAIN, cvParts, cvTopicCount } from "@/lib/cvStudyData";
import { CV_PATH, ML_DOMAINS } from "@/lib/mlDomains";

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
        A standalone guide for mid-to-senior software and ML engineers preparing at roughly
        Google L4–L5 depth. Start with images and classical vision, then build toward learned
        representations, modern models, and practical system design.
      </p>
      <p className="mb-5 text-sm leading-relaxed text-text-muted">
        No separate Deep Learning course required. Learn through first-principles explanations,
        diagrams, formulas, comparison tables, small PyTorch/OpenCV examples, and interview
        reasoning prompts.
      </p>
      <div className="mb-5 flex flex-wrap gap-2.5 text-[13px] font-medium text-text">
        <span className="rounded-md bg-surface-high/60 px-3 py-2">{cvParts.length} Parts</span>
        <span className="rounded-md bg-surface-high/60 px-3 py-2">{cvTopicCount} full lessons</span>
        <span className="rounded-md bg-surface-high/60 px-3 py-2">Progress saved as you study</span>
      </div>
      <div className="mb-5 rounded-lg border border-outline/55 bg-surface-high/40 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-text">
          <BookOpen size={17} className="text-accent-blue" /> How to study
        </div>
        <p className="mb-3 text-sm leading-relaxed text-text-muted">
          Follow the numbered path if you are new to vision. Each lesson links to its
          prerequisites and ends with an interview question and a worked answer. Use the final
          revision lesson to revisit formulas, task mappings, and common mistakes.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href={`${CV_PATH}/${cvParts[0].topics[0].id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-blue">
            Start with lesson 1.1 <ArrowRight size={15} />
          </Link>
          <Link href={`${CV_PATH}/interview-revision`} className="text-sm font-semibold text-accent-blue">
            Interview revision
          </Link>
        </div>
      </div>
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
