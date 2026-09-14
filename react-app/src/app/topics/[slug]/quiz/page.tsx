import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { studyTopics, studyTopicsBySlug } from "@/lib/studyData";
import { TopBar } from "@/components/TopBar";
import { QuizSection } from "@/components/quiz/QuizSection";

export function generateStaticParams() {
  return studyTopics.filter((t) => t.quiz && t.quiz.length > 0).map((t) => ({ slug: t.slug }));
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
    description: `Realistic interview-style questions on ${topic.title.toLowerCase()} - answer out loud, then reveal the model answer. Premium.`,
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
  if (!topic || !topic.quiz || topic.quiz.length === 0) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topic.quiz.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: "Available to premium members - sign in and upgrade to view the model answer.",
      },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": topic.color } as React.CSSProperties}>
      <TopBar activeTrack="leetcode" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Link href={`/topics/${topic.slug}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
          <ArrowLeft size={16} /> {topic.title}
        </Link>

        <h1 className="mb-1 text-3xl font-bold leading-tight tracking-tight text-text">
          {topic.title} mock interview quiz
        </h1>
        <p className="mb-6 text-base leading-relaxed text-text-muted">
          The questions your interviewer actually asks about {topic.title.toLowerCase()} - answer
          like you&apos;re in the room.
        </p>

        <QuizSection quizId={`lc-${topic.slug}`} title={`${topic.shortTitle} quiz`} questions={topic.quiz} />
      </main>
    </div>
  );
}
