import { ML_SYSTEM_DESIGN_PATH, NLP_SYSTEM_DESIGN_PATH } from "@/lib/mlDomains";

export type SystemDesignProblemSummary = { id: string; title: string; summary: string; pattern: string };

export const mlSystemDesignTopics = [
  { id: "genai", name: "GenAI", href: `${ML_SYSTEM_DESIGN_PATH}/genai`, summary: "Generative AI system design cases are coming soon." },
  { id: "cv", name: "Computer Vision", href: `${ML_SYSTEM_DESIGN_PATH}/cv`, summary: "Computer vision system design cases are coming soon." },
  { id: "nlp", name: "NLP", href: NLP_SYSTEM_DESIGN_PATH, summary: "Classification, workflow matching, entity linking, duplicates, emerging issues, grounded answers, translation, and long-document systems." },
  { id: "rrp", name: "Recommendation, Ranking, Prediction", href: `${ML_SYSTEM_DESIGN_PATH}/rrp`, summary: "Recommendation, ranking, and prediction system design cases are coming soon." },
];

export const mlSystemDesignFramework = {
  title: "Hello Interview’s delivery framework",
  href: "https://www.hellointerview.com/learn/ml-system-design/in-a-hurry/delivery",
  stages: [
    { id: "problem-framing", title: "Problem Framing", time: "5–7 min", description: "Clarify constraints, business success, and the ML task." },
    { id: "high-level-design", title: "High-level Design", time: "2–3 min", description: "Sketch data inputs, training, predictions, and the product action." },
    { id: "data-and-features", title: "Data and Features", time: "10 min", description: "Choose sources, labels, representations, and splits that prevent leakage." },
    { id: "modeling", title: "Modeling", time: "10 min", description: "Compare a simple baseline with your chosen architecture, loss, and tradeoffs." },
    { id: "inference-and-evaluation", title: "Inference and Evaluation", time: "7 min", description: "Explain serving, offline quality, online impact, latency, and cost." },
    { id: "deep-dives", title: "Deep Dives", time: "Remaining time", description: "Explore edge cases, scaling, drift, monitoring, and retraining." },
  ],
} as const;

export const mlSystemDesignProblemFlow = [
  { id: "problem-framing", title: "Problem Framing" },
  { id: "data-and-features", title: "Data and Features" },
  { id: "high-level-design", title: "High-level Design" },
  { id: "model-and-training", title: "Model and Training" },
  { id: "evaluation", title: "Evaluation" },
  { id: "monitoring-and-scaling", title: "Monitoring and Scaling" },
  { id: "detailed-design", title: "Detailed Design" },
] as const;

export function systemDesignProgressId(topicId: string, caseId: string) {
  return `${topicId}:${caseId}`;
}
