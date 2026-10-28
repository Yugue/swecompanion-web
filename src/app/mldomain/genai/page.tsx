import type { Metadata } from "next";
import { GenaiHub } from "@/components/genai/GenaiHub";
import { GENAI_PATH } from "@/lib/mlDomains";
import { genaiTopicCount, genaiParts } from "@/lib/genaiStudyData";
export const metadata: Metadata = {
  title: "Generative AI Interview Guide",
  description: `${genaiTopicCount} lessons across ${genaiParts.length} chapters: standalone foundations, Transformers, training, reasoning, image and multimodal generation, retrieval, evaluation, safety, and efficient inference. No prior ML topic required.`,
  alternates: { canonical: GENAI_PATH },
};
export default function GenaiPage() { return <GenaiHub />; }
