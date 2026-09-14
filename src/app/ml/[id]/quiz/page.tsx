import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { mlParts, mlPartsById } from "@/lib/mlStudyData";
import { TopBar } from "@/components/TopBar";
import { QuizSection } from "@/components/quiz/QuizSection";

export function generateStaticParams() {
  return mlParts.filter((part) => part.quiz.length > 0).map((part) => ({ id: part.id }));
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
    description: `Realistic interview-style questions covering ${part.title.toLowerCase()} - answer out loud, then reveal the model answer. Premium.`,
    alternates: { canonical: `/ml/${id}/quiz` },
  };
}

export default async function MlChapterQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const part = mlPartsById[id];
  if (!part || part.quiz.length === 0) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: part.quiz.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: "Available to premium members - sign in and upgrade to view the model answer.",
      },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": part.color } as React.CSSProperties}>
      <TopBar activeTrack="ml" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Link href={`/ml#${part.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
          <ArrowLeft size={16} /> Chapter {part.number} — {part.title}
        </Link>

        <h1 className="mb-1 text-3xl font-bold leading-tight tracking-tight text-text">
          {part.title} mock interview quiz
        </h1>
        <p className="mb-6 text-base leading-relaxed text-text-muted">
          The questions your interviewer actually asks about {part.title.toLowerCase()} - answer
          like you&apos;re in the room.
        </p>

        <QuizSection quizId={`ml-${part.id}`} title={`Chapter ${part.number} quiz`} questions={part.quiz} />
      </main>
    </div>
  );
}
