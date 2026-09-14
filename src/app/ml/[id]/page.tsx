import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { mlParts, mlTopicsById, mlPartIdForTopic, mlPartsById } from "@/lib/mlStudyData";
import { lessonExists } from "@/lib/getLessonBlocks";
import { TopBar } from "@/components/TopBar";
import { LessonView } from "@/components/lesson/LessonView";
import { InlineMarkdown } from "@/components/lesson/InlineMarkdown";
import { LessonCompleteToggle } from "@/components/ml/LessonCompleteToggle";

export function generateStaticParams() {
  return mlParts.flatMap((part) => part.topics.map((topic) => ({ id: topic.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const topic = mlTopicsById[id];
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.summary,
    alternates: { canonical: `/ml/${id}` },
    openGraph: { title: topic.title, description: topic.summary },
  };
}

export default async function MlLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topic = mlTopicsById[id];
  if (!topic || !lessonExists(id)) notFound();
  const partId = mlPartIdForTopic[id];
  const part = mlPartsById[partId];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: topic.title,
    description: topic.summary,
    learningResourceType: "Lesson",
    educationalLevel: "Advanced",
    isPartOf: {
      "@type": "Course",
      name: `Chapter ${part.number} — ${part.title}`,
      url: `/ml#${part.id}`,
    },
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": part.color } as React.CSSProperties}>
      <TopBar activeTrack="ml" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Link href={`/ml#${part.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
          <ArrowLeft size={16} /> Chapter {part.number} — {part.title}
        </Link>

        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-text">{topic.title}</h1>

        <div className="mb-6 flex items-center gap-3">
          <LessonCompleteToggle topicId={topic.id} accent={part.color} />
        </div>

        <div
          className="mb-6 rounded-md border p-4"
          style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)", background: "color-mix(in srgb, var(--accent) 7%, transparent)" }}
        >
          <p className="mb-2.5 text-xs font-extrabold tracking-wide text-[var(--accent)]">
            INTERVIEW-READY OVERVIEW
          </p>
          <p className="mb-3 text-base leading-relaxed text-text">{topic.summary}</p>
          <ul className="mb-3 flex flex-col gap-1.5">
            {topic.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-text-muted">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--accent)]" />
                <InlineMarkdown text={point} />
              </li>
            ))}
          </ul>
          {topic.code && (
            <pre className="mb-3 overflow-x-auto rounded-md bg-surface-high/70 px-3 py-2.5 font-mono text-[13px] text-text">
              {topic.code}
            </pre>
          )}
          <p className="text-sm font-semibold leading-relaxed text-text">
            Interview probe: {topic.interviewPrompt}
          </p>
        </div>

        <div className="mb-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-outline/55" />
          <span className="text-xs font-extrabold tracking-wide text-[var(--accent)]">FULL LESSON</span>
          <div className="h-px flex-1 bg-outline/55" />
        </div>

        <LessonView topicId={topic.id} />

        {part.quizQuestionCount > 0 && (
          <Link
            href={`/ml/${part.id}/quiz`}
            className="mt-8 flex items-center justify-center gap-2 rounded-lg border border-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]"
          >
            <ClipboardCheck size={17} /> Finished this chapter? Test yourself with the mock
            interview quiz →
          </Link>
        )}
      </main>
    </div>
  );
}
