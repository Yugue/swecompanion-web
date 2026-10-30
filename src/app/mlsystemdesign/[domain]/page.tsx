import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SystemDesignHub } from "@/components/mlsystemdesign/SystemDesignHub";
import { mlSystemDesignTopics } from "@/lib/mlSystemDesignTopics";

const upcomingTopics = mlSystemDesignTopics.filter((topic) => topic.id !== "nlp");

export function generateStaticParams() { return upcomingTopics.map(({ id }) => ({ domain: id })); }

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params;
  const topic = upcomingTopics.find((item) => item.id === domain);
  if (!topic) return {};
  return { title: `${topic.name} System Design`, alternates: { canonical: topic.href } };
}

export default async function UpcomingDesignTopic({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const topic = upcomingTopics.find((item) => item.id === domain);
  if (!topic) notFound();
  return <SystemDesignHub key={topic.id} topicId={topic.id} problems={[]} />;
}
