/* eslint-disable react-hooks/static-components -- `getIcon` looks up a stable reference from a
   module-level map, never defines a new component; this pattern reads as unsafe to the linter's
   heuristic but isn't. */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { studyTopics, studyTopicsBySlug, leetCodeUrl } from "@/lib/studyData";
import { getIcon } from "@/lib/icons";
import { TopBar } from "@/components/TopBar";
import { QuizTeaser } from "@/components/quiz/QuizTeaser";

export function generateStaticParams() {
  return studyTopics.map((topic) => ({ slug: topic.slug }));
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
    title: `${topic.title} — Interview Questions & Patterns`,
    description: topic.note,
    alternates: { canonical: `/topics/${slug}` },
    openGraph: { title: topic.title, description: topic.note },
  };
}

export default async function TopicLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = studyTopicsBySlug[slug];
  if (!topic) notFound();
  const Icon = getIcon(topic.icon);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${topic.title} interview questions`,
    itemListElement: topic.problems.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${p.id}. ${p.title}`,
      url: leetCodeUrl(p),
    })),
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": topic.color } as React.CSSProperties}>
      <TopBar activeTrack="leetcode" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
          <ArrowLeft size={16} /> All topics
        </Link>

        <div className="mb-5 flex items-center gap-3.5">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-lg border"
            style={{
              background: "color-mix(in srgb, var(--accent) 14%, transparent)",
              borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)",
            }}
          >
            <Icon size={24} style={{ color: "var(--accent)" }} />
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-text">{topic.title}</h1>
        </div>

        <p className="mb-6 text-base leading-relaxed text-text-muted">{topic.note}</p>

        <Link
          href={`/#${topic.slug}`}
          className="mb-6 inline-flex items-center justify-center rounded-lg bg-accent-blue px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          Open in the full interactive guide →
        </Link>

        <div className="overflow-hidden rounded-xl border border-outline">
          {topic.problems.map((p) => (
            <div key={p.id} className="flex items-center gap-3 border-t border-outline/40 px-4 py-3 first:border-t-0">
              <span className="w-12 shrink-0 text-right text-sm font-bold tabular-nums text-[var(--accent)]">
                {p.id}
              </span>
              <span className="flex-1 text-[15px] text-text">{p.title}</span>
              {p.difficulty && <span className="text-xs font-semibold text-text-muted">{p.difficulty}</span>}
              <a href={leetCodeUrl(p)} target="_blank" rel="noreferrer" className="text-[var(--accent)]">
                <ExternalLink size={17} />
              </a>
            </div>
          ))}
        </div>

        {(topic.quizQuestionCount ?? 0) > 0 && (
          <QuizTeaser
            href={`/topics/${topic.slug}/quiz`}
            title={`${topic.shortTitle} mock interview`}
            questionCount={topic.quizQuestionCount ?? 0}
            className="mt-6 rounded-xl border border-outline"
          />
        )}
      </main>
    </div>
  );
}
