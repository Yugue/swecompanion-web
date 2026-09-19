import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { studyTopics, leetCodeUrl } from "@/lib/studyData";
import { CODING_PATH, chapterPath, studyTopicsByPath } from "@/lib/codingPaths";
import { CodingHub } from "@/components/guide/CodingHub";

// A chapter has no page of its own: this URL is the coding hub with the chapter expanded, so it is
// the shareable link to that chapter. Only the per-chapter metadata and structured data are
// specific to it.
export function generateStaticParams() {
  return studyTopics.map((topic) => ({ chapter: chapterPath(topic) }));
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
    title: `${topic.title} — Interview Questions & Patterns`,
    description: topic.note,
    alternates: { canonical: `${CODING_PATH}/${chapter}` },
    openGraph: { title: topic.title, description: topic.note },
  };
}

export default async function CodingChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const topic = studyTopicsByPath[chapter];
  if (!topic) notFound();

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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CodingHub initialChapter={chapter} />
    </>
  );
}
