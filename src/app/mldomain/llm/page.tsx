import type { Metadata } from "next";
import { LlmHub } from "@/components/llm/LlmHub";
import { LLM_PATH } from "@/lib/mlDomains";
import { llmTopicCount, llmParts } from "@/lib/llmStudyData";
export const metadata: Metadata = {
  title: "Large Language Models Interview Guide",
  description: `${llmTopicCount} lessons across ${llmParts.length} chapters: standalone foundations, Transformer architecture, pretraining, adaptation, grounding, evaluation, safety, and efficient serving. No prior ML topic required.`,
  alternates: { canonical: LLM_PATH },
};
export default function LlmPage() { return <LlmHub />; }
