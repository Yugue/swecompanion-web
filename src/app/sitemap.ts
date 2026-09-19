import type { MetadataRoute } from "next";
import { studyTopics } from "@/lib/studyData";
import { CODING_PATH, chapterHref, chapterQuizHref } from "@/lib/codingPaths";
import { mlParts } from "@/lib/mlStudyData";
import { amlParts } from "@/lib/amlStudyData";
import { DEEP_LEARNING_PATH, APPLIED_ML_PATH } from "@/lib/mlDomains";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://swecompanion.web.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}${CODING_PATH}`, priority: 1 },
    { url: `${siteUrl}${DEEP_LEARNING_PATH}`, priority: 1 },
    { url: `${siteUrl}${APPLIED_ML_PATH}`, priority: 1 },
  ];

  for (const topic of studyTopics) {
    entries.push({ url: `${siteUrl}${chapterHref(topic)}`, priority: 0.7 });
    if ((topic.quizQuestionCount ?? 0) > 0) {
      entries.push({ url: `${siteUrl}${chapterQuizHref(topic)}`, priority: 0.6 });
    }
  }

  for (const part of mlParts) {
    for (const topic of part.topics) {
      entries.push({ url: `${siteUrl}${DEEP_LEARNING_PATH}/${topic.id}`, priority: 0.8 });
    }
    if (part.quizQuestionCount > 0) {
      entries.push({ url: `${siteUrl}${DEEP_LEARNING_PATH}/${part.id}/quiz`, priority: 0.6 });
    }
  }

  for (const part of amlParts) {
    for (const topic of part.topics) {
      entries.push({ url: `${siteUrl}${APPLIED_ML_PATH}/${topic.id}`, priority: 0.8 });
    }
    if (part.quizQuestionCount > 0) {
      entries.push({ url: `${siteUrl}${APPLIED_ML_PATH}/${part.id}/quiz`, priority: 0.6 });
    }
  }

  return entries;
}
