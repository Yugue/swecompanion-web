import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { llmParts, llmPartsById } from "@/lib/llmStudyData";
import { LLM_PATH } from "@/lib/mlDomains";
import { TopBar } from "@/components/TopBar";
import { QuizSection } from "@/components/quiz/QuizSection";

export function generateStaticParams() {
  return llmParts.filter(part => part.quizQuestionCount > 0).map(part => ({ id: part.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const part = llmPartsById[id];
  if (!part || part.quizQuestionCount === 0) return {};
  return {
    title: `Large Language Models ${part.title} Mock Interview Quiz`,
    description: `${part.quizQuestionCount} Large Language Models reasoning questions with model answers covering ${part.title.toLowerCase()}. Uses the foundations taught within this topic. Premium.`,
    alternates: { canonical: `${LLM_PATH}/${id}/quiz` },
  };
}

export default async function LlmChapterQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const part = llmPartsById[id];
  if (!part || part.quizQuestionCount === 0) notFound();
  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": part.color } as React.CSSProperties}>
      <TopBar activeTrack="ml" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <Link href={`${LLM_PATH}#${part.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
          <ArrowLeft size={16} /> Chapter {part.number} — {part.title}
        </Link>
        <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight text-text">{part.title} mock interview quiz</h1>
        <p className="mb-6 text-base leading-relaxed text-text-muted">
          {part.quizQuestionCount} questions with model answers. Explain mechanisms, diagnose failures,
          and defend tradeoffs using lessons from this chapter and earlier chapters.
        </p>
        <QuizSection
          quizId={`llm-${part.id}`}
          title={`Chapter ${part.number} quiz`}
          covers={part.description}
          questionCount={part.quizQuestionCount}
        />
      </main>
    </div>
  );
}
