import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { nlpTopics, nlpTopicsById, nlpPartsById, nlpPartIdForTopic, nlpLessonNumbers } from "@/lib/nlpStudyData";
import { NLP_PATH } from "@/lib/mlDomains";
import { lessonExists } from "@/lib/getLessonBlocks";
import { TopBar } from "@/components/TopBar";
import { LessonView } from "@/components/lesson/LessonView";
import { InlineMarkdown } from "@/components/lesson/InlineMarkdown";
import { QuizTeaser } from "@/components/quiz/QuizTeaser";
import { LessonCompleteToggle } from "@/components/ml/LessonCompleteToggle";

export function generateStaticParams() {
  return nlpTopics.map((topic) => ({ id: topic.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const topic = nlpTopicsById[id];
  if (!topic) return {};
  return {
    title: `${nlpLessonNumbers[id]} ${topic.title}`,
    description: topic.summary,
    alternates: { canonical: `${NLP_PATH}/${id}` },
    openGraph: { title: topic.title, description: topic.summary },
  };
}

export default async function NlpLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = nlpTopicsById[id];
  if (!topic || !lessonExists(id, "nlp")) notFound();
  const part = nlpPartsById[nlpPartIdForTopic[id]];
  const index = nlpTopics.findIndex((item) => item.id === id);
  const previous = nlpTopics[index - 1];
  const next = nlpTopics[index + 1];
  const jsonLd = {
    "@context": "https://schema.org", "@type": "LearningResource",
    name: topic.title, description: topic.summary, learningResourceType: "Lesson",
    educationalLevel: "Foundational to Advanced",
    isPartOf: { "@type": "Course", name: "NLP / NLU Interview Guide", url: NLP_PATH },
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": part.color } as React.CSSProperties}>
      <TopBar activeTrack="ml" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <Link href={`${NLP_PATH}#${part.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
          <ArrowLeft size={16} /> Chapter {part.number} — {part.title}
        </Link>
        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-text">
          {nlpLessonNumbers[id]} {topic.title}
        </h1>
        <div className="mb-5"><LessonCompleteToggle topicId={id} accent={part.color} track="nlp" /></div>
        <section aria-labelledby="interview-overview-title" className="mb-6 rounded-md border p-4" style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)", background: "color-mix(in srgb, var(--accent) 7%, transparent)" }}>
          <h2 id="interview-overview-title" className="mb-2.5 text-xs font-extrabold tracking-wide text-[var(--accent)]">INTERVIEW-READY OVERVIEW</h2>
          <p className="mb-3 text-base leading-relaxed text-text">{topic.summary}</p>
          <ul className="mb-3 flex flex-col gap-1.5">
            {topic.keyPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-text-muted">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--accent)]" /><InlineMarkdown text={point} />
              </li>
            ))}
          </ul>
          <p className="text-sm font-semibold leading-relaxed text-text">Interview probe: {topic.interviewPrompt}</p>
        </section>
        <div className="mb-3 flex items-center gap-3"><div className="h-px flex-1 bg-outline/55" /><span className="text-xs font-extrabold tracking-wide text-[var(--accent)]">FULL LESSON</span><div className="h-px flex-1 bg-outline/55" /></div>
        <article aria-label="Full lesson" className="[&_.katex-display]:text-text">
          <h2 className="sr-only">Full lesson</h2>
          <LessonView topicId={id} track="nlp" />
        </article>
        {part.quizQuestionCount > 0 && (
          <QuizTeaser
            href={`${NLP_PATH}/${part.id}/quiz`}
            title={`Chapter ${part.number} mock interview`}
            questionCount={part.quizQuestionCount}
            className="mt-8 rounded-xl border border-outline"
          />
        )}
        <nav aria-label="Lesson navigation" className="mt-8 grid gap-3 border-t border-outline/55 pt-5 sm:grid-cols-2">
          {previous ? (
            <Link href={`${NLP_PATH}/${previous.id}`} className="rounded-lg border border-outline bg-surface p-4 hover:bg-surface-high">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-text-muted"><ArrowLeft size={14} /> PREVIOUS LESSON</span>
              <span className="text-sm font-semibold text-text">{nlpLessonNumbers[previous.id]} {previous.title}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`${NLP_PATH}/${next.id}`} className="rounded-lg border border-outline bg-surface p-4 hover:bg-surface-high">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[var(--accent)]">NEXT LESSON <ArrowRight size={14} /></span>
              <span className="text-sm font-semibold text-text">{nlpLessonNumbers[next.id]} {next.title}</span>
            </Link>
          ) : (
            <Link href={NLP_PATH} className="rounded-lg border border-outline bg-surface p-4 text-sm font-semibold text-[var(--accent)] hover:bg-surface-high">Back to the curriculum</Link>
          )}
        </nav>
      </main>
    </div>
  );
}
