import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { distributedParts, distributedPartsById } from "@/lib/distributedStudyData";
import { DISTRIBUTED_ML_PATH } from "@/lib/mlDomains";
import { TopBar } from "@/components/TopBar";
import { QuizSection } from "@/components/quiz/QuizSection";

export const dynamicParams = false;

export function generateStaticParams() {
  return distributedParts.filter(part => part.quizQuestionCount > 0).map(part => ({ id: part.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const part = distributedPartsById[id];
  if (!part || part.quizQuestionCount === 0) return {};
  return {
    title: `Distributed Machine Learning ${part.title} Mock Interview Quiz`,
    description: `${part.quizQuestionCount} Distributed Machine Learning reasoning questions with model answers covering ${part.title.toLowerCase()}. Uses the foundations taught within this topic. Free.`,
    alternates: { canonical: `${DISTRIBUTED_ML_PATH}/${id}/quiz` },
  };
}

export default async function DistributedPartQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const part = distributedPartsById[id];
  if (!part || part.quizQuestionCount === 0) notFound();
  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": part.color } as React.CSSProperties}>
      <TopBar activeTrack="ml" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <Link href={`${DISTRIBUTED_ML_PATH}#${part.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
          <ArrowLeft size={16} /> Part {part.number} — {part.title}
        </Link>
        <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight text-text">{part.title} mock interview quiz</h1>
        <p className="mb-6 text-base leading-relaxed text-text-muted">
          {part.quizQuestionCount} questions with model answers. Explain mechanisms, diagnose failures,
          and defend tradeoffs using lessons from this Part and earlier Parts.
        </p>
        <QuizSection
          quizId={`distributed-${part.id}`}
          title={`Part ${part.number} quiz`}
          covers={part.description}
          questionCount={part.quizQuestionCount}
        />
      </main>
    </div>
  );
}
