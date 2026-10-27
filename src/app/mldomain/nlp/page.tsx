import type { Metadata } from "next";
import { NlpHub } from "@/components/nlp/NlpHub";
import { NLP_PATH } from "@/lib/mlDomains";
import { nlpTopicCount, nlpParts } from "@/lib/nlpStudyData";
export const metadata: Metadata = {
  title: "NLP / NLU Interview Guide",
  description: `${nlpTopicCount} lessons across ${nlpParts.length} chapters: standalone foundations, text representations, classical models, neural learning, Transformers, understanding, retrieval, and generation. Standalone foundations; no prior ML or DL course required.`,
  alternates: { canonical: NLP_PATH },
};
export default function NlpPage() { return <NlpHub />; }
