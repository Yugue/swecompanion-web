import type { Metadata } from "next";
import { SystemDesignHub } from "@/components/mlsystemdesign/SystemDesignHub";
import { GENAI_SYSTEM_DESIGN_PATH } from "@/lib/mlDomains";
import { genaiDesignProblems } from "@/lib/genaiSystemDesignData";

export const metadata: Metadata = {
  title: "GenAI System Design — 7 Interview Problems",
  description: "Seven GenAI system design lessons covering RAG, agents, LLM serving, fine-tuning, text-to-SQL, long-document synthesis, and evaluation.",
  alternates: { canonical: GENAI_SYSTEM_DESIGN_PATH },
};

export default function GenaiSystemDesignPage() {
  const problems = genaiDesignProblems.map(({ id, title, summary, pattern }) => ({ id, title, summary, pattern }));
  return <SystemDesignHub key="genai" topicId="genai" problems={problems} />;
}
