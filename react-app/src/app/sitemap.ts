import type { MetadataRoute } from "next";
import { studyTopics } from "@/lib/studyData";
import { mlParts } from "@/lib/mlStudyData";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://swecompanion.web.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, priority: 1 },
    { url: `${siteUrl}/ml`, priority: 1 },
  ];

  for (const topic of studyTopics) {
    entries.push({ url: `${siteUrl}/topics/${topic.slug}`, priority: 0.7 });
    if (topic.quiz && topic.quiz.length > 0) {
      entries.push({ url: `${siteUrl}/topics/${topic.slug}/quiz`, priority: 0.6 });
    }
  }

  for (const part of mlParts) {
    for (const topic of part.topics) {
      entries.push({ url: `${siteUrl}/ml/${topic.id}`, priority: 0.8 });
    }
    if (part.quiz.length > 0) {
      entries.push({ url: `${siteUrl}/ml/${part.id}/quiz`, priority: 0.6 });
    }
  }

  return entries;
}
