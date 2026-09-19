import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { mlParts, mlPartsById } from "@/lib/mlStudyData";
import { TopBar } from "@/components/TopBar";
import { DEEP_LEARNING_PATH } from "@/lib/mlDomains";
import { QuizSection } from "@/components/quiz/QuizSection";

export function generateStaticParams() {
  return mlParts.filter((part) => part.quizQuestionCount > 0).map((part) => ({ id: part.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const part = mlPartsById[id];
  if (!part) return {};
  return {
    title: `${part.title} Mock Interview Quiz`,
    description: `${part.quizQuestionCount} realistic interview-style questions covering ${part.title.toLowerCase()}, written to match a real L4-L6 interview. Premium.`,
    alternates: { canonical: `${DEEP_LEARNING_PATH}/${id}/quiz` },
  };
}

export default async function MlChapterQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const part = mlPartsById[id];
  if (!part || part.quizQuestionCount === 0) notFound();

  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": part.color } as React.CSSProperties}>
      <TopBar activeTrack="ml" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <Link href={`${DEEP_LEARNING_PATH}#${part.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
          <ArrowLeft size={16} /> Chapter {part.number} — {part.title}
        </Link>

        <h1 className="mb-1 text-3xl font-bold leading-tight tracking-tight text-text">
          {part.title} mock interview quiz
        </h1>
        <p className="mb-6 text-base leading-relaxed text-text-muted">
          {part.quizQuestionCount} questions designed to reflect real interview questions on{" "}
          {part.title.toLowerCase()} - answer like you&apos;re in the room.
        </p>

        <QuizSection
          quizId={`ml-${part.id}`}
          title={`Chapter ${part.number} quiz`}
          covers={part.description}
          questionCount={part.quizQuestionCount}
          proof="Written by people who passed the ML domain interview using this guide."
        />
      </main>
    </div>
  );
}
