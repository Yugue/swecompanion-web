import type { Metadata } from "next";
import { SystemDesignHub } from "@/components/mlsystemdesign/SystemDesignHub";
import { NLP_SYSTEM_DESIGN_PATH } from "@/lib/mlDomains";
import { nlpDesignProblems } from "@/lib/nlpSystemDesignData";

export const metadata: Metadata = {
  title: "NLP System Design — 8 Interview Problems",
  description: "Eight practical NLP system design problems, following the six-stage interview delivery framework.",
  alternates: { canonical: NLP_SYSTEM_DESIGN_PATH },
};

export default function NlpSystemDesignPage() {
  const problems = nlpDesignProblems.map(({ id, title, summary, pattern }) => ({ id, title, summary, pattern }));
  return <SystemDesignHub key="nlp" topicId="nlp" problems={problems} />;
}
