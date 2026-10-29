import type { MetadataRoute } from "next";
import { studyTopics } from "@/lib/studyData";
import { CODING_PATH, chapterHref } from "@/lib/codingPaths";
import { mlParts } from "@/lib/mlStudyData";
import { amlParts } from "@/lib/amlStudyData";
import { agenticParts } from "@/lib/agenticStudyData";
import { rrpParts } from "@/lib/rrpStudyData";
import { nlpParts } from "@/lib/nlpStudyData";
import { llmParts } from "@/lib/llmStudyData";
import { genaiParts } from "@/lib/genaiStudyData";
import { distributedTopics } from "@/lib/distributedStudyData";
import { rlTopics } from "@/lib/rlStudyData";
import { speechTopics } from "@/lib/speechStudyData";
import { cvParts } from "@/lib/cvStudyData";
import { DEEP_LEARNING_PATH, APPLIED_ML_PATH, AGENTIC_AI_PATH, RRP_PATH, CV_PATH, DISTRIBUTED_ML_PATH, RL_PATH, SPEECH_PATH, NLP_PATH, GENAI_PATH, LLM_PATH } from "@/lib/mlDomains";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://swecompanion.web.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}${DISTRIBUTED_ML_PATH}`, priority: 1 },
    { url: `${siteUrl}${RL_PATH}`, priority: 1 },
    { url: `${siteUrl}${SPEECH_PATH}`, priority: 1 },
    { url: `${siteUrl}/`, priority: 1 },
    { url: `${siteUrl}${CODING_PATH}`, priority: 1 },
    { url: `${siteUrl}${DEEP_LEARNING_PATH}`, priority: 1 },
    { url: `${siteUrl}${APPLIED_ML_PATH}`, priority: 1 },
    { url: `${siteUrl}${AGENTIC_AI_PATH}`, priority: 1 },
    { url: `${siteUrl}${RRP_PATH}`, priority: 1 },
    { url: `${siteUrl}${CV_PATH}`, priority: 1 },
    { url: `${siteUrl}${NLP_PATH}`, priority: 1 },
    { url: `${siteUrl}${GENAI_PATH}`, priority: 1 },
    { url: `${siteUrl}${LLM_PATH}`, priority: 1 },
  ];

  for (const topic of studyTopics) {
    entries.push({ url: `${siteUrl}${chapterHref(topic)}`, priority: 0.7 });
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

  for (const part of agenticParts) {
    for (const topic of part.topics) {
      entries.push({ url: `${siteUrl}${AGENTIC_AI_PATH}/${topic.id}`, priority: 0.8 });
    }
    if (part.quizQuestionCount > 0) {
      entries.push({ url: `${siteUrl}${AGENTIC_AI_PATH}/${part.id}/quiz`, priority: 0.6 });
    }
  }

  for (const part of rrpParts) {
    for (const topic of part.topics) {
      entries.push({ url: `${siteUrl}${RRP_PATH}/${topic.id}`, priority: 0.8 });
    }
    if (part.quizQuestionCount > 0) {
      entries.push({ url: `${siteUrl}${RRP_PATH}/${part.id}/quiz`, priority: 0.6 });
    }
  }

  for (const part of cvParts) {
    for (const topic of part.topics) {
      entries.push({ url: `${siteUrl}${CV_PATH}/${topic.id}`, priority: 0.8 });
    }
    if (part.quizQuestionCount > 0) {
      entries.push({ url: `${siteUrl}${CV_PATH}/${part.id}/quiz`, priority: 0.6 });
    }
  }

  for (const part of nlpParts) {
    for (const topic of part.topics) {
      entries.push({ url: `${siteUrl}${NLP_PATH}/${topic.id}`, priority: 0.8 });
    }
    if (part.quizQuestionCount > 0) {
      entries.push({ url: `${siteUrl}${NLP_PATH}/${part.id}/quiz`, priority: 0.6 });
    }
  }

  for (const part of genaiParts) {
    for (const topic of part.topics) {
      entries.push({ url: `${siteUrl}${GENAI_PATH}/${topic.id}`, priority: 0.8 });
    }
    if (part.quizQuestionCount > 0) {
      entries.push({ url: `${siteUrl}${GENAI_PATH}/${part.id}/quiz`, priority: 0.6 });
    }
  }

  for (const part of llmParts) {
    for (const topic of part.topics) entries.push({ url: `${siteUrl}${LLM_PATH}/${topic.id}`, priority: 0.8 });
    if (part.quizQuestionCount > 0) entries.push({ url: `${siteUrl}${LLM_PATH}/${part.id}/quiz`, priority: 0.6 });
  }
  for (const topic of speechTopics) entries.push({ url: `${siteUrl}${SPEECH_PATH}/${topic.id}`, priority: 0.8 });
  for (const topic of rlTopics) entries.push({ url: `${siteUrl}${RL_PATH}/${topic.id}`, priority: 0.8 });
  for (const topic of distributedTopics) entries.push({ url: `${siteUrl}${DISTRIBUTED_ML_PATH}/${topic.id}`, priority: 0.8 });
  return entries;
}
