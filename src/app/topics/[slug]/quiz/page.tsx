import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { studyTopics, studyTopicsBySlug } from "@/lib/studyData";
import { TopBar } from "@/components/TopBar";
import { QuizSection } from "@/components/quiz/QuizSection";

export function generateStaticParams() {
  return studyTopics.filter((t) => (t.quizQuestionCount ?? 0) > 0).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = studyTopicsBySlug[slug];
  if (!topic) return {};
  return {
    title: `${topic.title} Mock Interview Quiz`,
    description: `${topic.quizQuestionCount} realistic interview-style questions on ${topic.title.toLowerCase()}, written to match a real L4-L6 interview. Premium.`,
    alternates: { canonical: `/topics/${slug}/quiz` },
  };
}

export default async function TopicQuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = studyTopicsBySlug[slug];
  if (!topic || !topic.quizQuestionCount) notFound();

  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": topic.color } as React.CSSProperties}>
      <TopBar activeTrack="leetcode" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <Link href={`/topics/${topic.slug}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
          <ArrowLeft size={16} /> {topic.title}
        </Link>

        <h1 className="mb-1 text-3xl font-bold leading-tight tracking-tight text-text">
          {topic.title} mock interview quiz
        </h1>
        <p className="mb-6 text-base leading-relaxed text-text-muted">
          {topic.quizQuestionCount} questions designed to reflect real interview questions on{" "}
          {topic.title.toLowerCase()} - answer like you&apos;re in the room.
        </p>

        <QuizSection
          quizId={`lc-${topic.slug}`}
          title={`${topic.shortTitle} quiz`}
          covers={topic.note}
          questionCount={topic.quizQuestionCount}
        />
      </main>
    </div>
  );
}
