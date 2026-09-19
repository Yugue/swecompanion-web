import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { studyTopics } from "@/lib/studyData";
import { CODING_PATH, chapterPath, chapterHref, studyTopicsByPath } from "@/lib/codingPaths";
import { TopBar } from "@/components/TopBar";
import { QuizSection } from "@/components/quiz/QuizSection";

export function generateStaticParams() {
  return studyTopics.filter((t) => (t.quizQuestionCount ?? 0) > 0).map((t) => ({ chapter: chapterPath(t) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter } = await params;
  const topic = studyTopicsByPath[chapter];
  if (!topic) return {};
  return {
    title: `${topic.title} Mock Interview Quiz`,
    description: `${topic.quizQuestionCount} realistic interview-style questions on ${topic.title.toLowerCase()}, written to match a real L4-L6 interview. Premium.`,
    alternates: { canonical: `${CODING_PATH}/${chapter}/quiz` },
  };
}

export default async function TopicQuizPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const topic = studyTopicsByPath[chapter];
  if (!topic || !topic.quizQuestionCount) notFound();

  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": topic.color } as React.CSSProperties}>
      <TopBar activeTrack="leetcode" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <Link href={chapterHref(topic)} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
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
