import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { distributedTopics, distributedTopicsById, distributedPartsById, distributedPartIdForTopic, distributedLessonNumbers } from "@/lib/distributedStudyData";
import { DISTRIBUTED_ML_PATH } from "@/lib/mlDomains";
import { lessonExists } from "@/lib/getLessonBlocks";
import { TopBar } from "@/components/TopBar";
import { LessonView } from "@/components/lesson/LessonView";
import { InlineMarkdown } from "@/components/lesson/InlineMarkdown";
import { LessonCompleteToggle } from "@/components/ml/LessonCompleteToggle";

export const dynamicParams = false;

export function generateStaticParams() {
  return distributedTopics.map((topic) => ({ id: topic.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const topic = distributedTopicsById[id];
  if (!topic) return {};
  return {
    title: `${distributedLessonNumbers[id]} ${topic.title}`,
    description: topic.summary,
    alternates: { canonical: `${DISTRIBUTED_ML_PATH}/${id}` },
    openGraph: { title: topic.title, description: topic.summary },
  };
}

export default async function DistributedLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = distributedTopicsById[id];
  if (!topic || !lessonExists(id, "distributed")) notFound();
  const part = distributedPartsById[distributedPartIdForTopic[id]];
  const index = distributedTopics.findIndex((item) => item.id === id);
  const previous = distributedTopics[index - 1];
  const next = distributedTopics[index + 1];
  const jsonLd = {
    "@context": "https://schema.org", "@type": "LearningResource",
    name: topic.title, description: topic.summary, learningResourceType: "Lesson",
    educationalLevel: "Intermediate to Advanced",
    isPartOf: { "@type": "Course", name: "Distributed Machine Learning Study Guide", url: DISTRIBUTED_ML_PATH },
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": part.color } as React.CSSProperties}>
      <TopBar activeTrack="ml" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <Link href={`${DISTRIBUTED_ML_PATH}#${part.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
          <ArrowLeft size={16} /> Part {part.number} — {part.title}
        </Link>
        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-text">
          {distributedLessonNumbers[id]} {topic.title}
        </h1>
        <div className="mb-5"><LessonCompleteToggle topicId={id} accent={part.color} track="distributed" /></div>
        <section className="mb-6 rounded-md border p-4" style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)", background: "color-mix(in srgb, var(--accent) 7%, transparent)" }}>
          <h2 className="mb-2.5 text-xs font-extrabold tracking-wide text-[var(--accent)]">LESSON OVERVIEW</h2>
          <p className="mb-3 text-base leading-relaxed text-text">{topic.summary}</p>
          <ul className="mb-3 flex flex-col gap-1.5">
            {topic.keyPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-text-muted">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--accent)]" /><InlineMarkdown text={point} />
              </li>
            ))}
          </ul>
        </section>
        {topic.prerequisites.length > 0 && (
          <nav aria-label="Lesson prerequisites" className="mb-6 rounded-md border border-outline/60 p-4">
            <p className="mb-2 text-xs font-bold tracking-wide text-text-muted">BUILDS ON</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {topic.prerequisites.map((prerequisite) => (
                <li key={prerequisite}>
                  <Link href={`${DISTRIBUTED_ML_PATH}/${prerequisite}`} className="font-semibold text-[var(--accent)] hover:underline">
                    {distributedLessonNumbers[prerequisite]} {distributedTopicsById[prerequisite].title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <article aria-label="Full lesson">
          <h2 className="sr-only">Full lesson</h2>
          <LessonView topicId={id} track="distributed" />
        </article>
        <nav aria-label="Lesson navigation" className="mt-8 grid gap-3 border-t border-outline/55 pt-5 sm:grid-cols-2">
          {previous ? (
            <Link href={`${DISTRIBUTED_ML_PATH}/${previous.id}`} className="rounded-lg border border-outline bg-surface p-4 hover:bg-surface-high">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-text-muted"><ArrowLeft size={14} /> PREVIOUS LESSON</span>
              <span className="text-sm font-semibold text-text">{distributedLessonNumbers[previous.id]} {previous.title}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`${DISTRIBUTED_ML_PATH}/${next.id}`} className="rounded-lg border border-outline bg-surface p-4 hover:bg-surface-high">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[var(--accent)]">NEXT LESSON <ArrowRight size={14} /></span>
              <span className="text-sm font-semibold text-text">{distributedLessonNumbers[next.id]} {next.title}</span>
            </Link>
          ) : (
            <Link href={DISTRIBUTED_ML_PATH} className="rounded-lg border border-outline bg-surface p-4 text-sm font-semibold text-[var(--accent)] hover:bg-surface-high">Back to the curriculum</Link>
          )}
        </nav>
      </main>
    </div>
  );
}
