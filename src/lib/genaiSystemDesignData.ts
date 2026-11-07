import type { SystemDesignProblemSummary } from "./mlSystemDesignTopics";

export type GenaiDesignProblem = SystemDesignProblemSummary & { lessonId: string };

export const genaiDesignProblems: GenaiDesignProblem[] = [
  {
    "id": "enterprise-rag",
    "lessonId": "genai-enterprise-rag",
    "title": "Enterprise retrieval-augmented generation (RAG) assistant",
    "pattern": "Retrieve evidence → generate → verify",
    "summary": "Answer employee questions with current, permitted evidence and supporting citations."
  },
  {
    "id": "tool-using-agent",
    "lessonId": "genai-tool-using-agent",
    "title": "Tool-using LLM agent for multi-step tasks",
    "pattern": "Propose → authorize → execute → verify",
    "summary": "Complete multi-step tasks through validated tools, durable state, and explicit approvals."
  },
  {
    "id": "llm-inference",
    "lessonId": "genai-llm-inference",
    "title": "Large-scale LLM inference service",
    "pattern": "Admit → schedule → prefill → decode",
    "summary": "Serve streaming LLM responses within token latency, memory, and cost budgets."
  },
  {
    "id": "domain-adaptation",
    "lessonId": "genai-domain-adaptation",
    "title": "Domain-specific AI assistant via fine-tuning",
    "pattern": "Curate → adapt → evaluate → serve",
    "summary": "Adapt a smaller assistant for domain behavior while retrieving current policy facts."
  },
  {
    "id": "text-to-sql",
    "lessonId": "genai-text-to-sql",
    "title": "Text-to-SQL assistant over thousands of tables",
    "pattern": "Retrieve schema → generate → validate → execute",
    "summary": "Turn business questions into safe, authorized queries and faithful result summaries."
  },
  {
    "id": "long-document-synthesis",
    "lessonId": "genai-long-document-synthesis",
    "title": "Long-document summarization beyond the context window",
    "pattern": "Chunk → parallel tracks → reconcile → verify",
    "summary": "Synthesize long documents while preserving facts, conflicts, and source evidence."
  },
  {
    "id": "evaluation-platform",
    "lessonId": "genai-evaluation-platform",
    "title": "LLM evaluation and feedback platform",
    "pattern": "Run → grade → compare → gate releases",
    "summary": "Compare LLM systems using versioned experiments, calibrated judges, and expert review."
  }
];

export function getGenaiDesignProblem(id: string) {
  return genaiDesignProblems.find(problem => problem.id === id);
}
