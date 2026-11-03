import type { MlPart } from "../src/lib/mlStudyData";
import { mlParts } from "../src/lib/mlStudyData";
import { amlParts } from "../src/lib/amlStudyData";
import { agenticParts } from "../src/lib/agenticStudyData";
import { cvParts } from "../src/lib/cvStudyData";
import { nlpParts } from "../src/lib/nlpStudyData";
import { rrpParts } from "../src/lib/rrpStudyData";
import { genaiParts } from "../src/lib/genaiStudyData";
import { llmParts } from "../src/lib/llmStudyData";
import { speechParts } from "../src/lib/speechStudyData";
import { rlParts } from "../src/lib/rlStudyData";
import { distributedParts } from "../src/lib/distributedStudyData";
import {
  DEEP_LEARNING_PATH, APPLIED_ML_PATH, AGENTIC_AI_PATH, CV_PATH, NLP_PATH,
  RRP_PATH, GENAI_PATH, LLM_PATH, SPEECH_PATH, RL_PATH, DISTRIBUTED_ML_PATH,
} from "../src/lib/mlDomains";

// Owner-side coverage catalog. Public ML payloads are selected by the server-only mlQuizData module.
export const mlQuizTracks: { name: string; path: string; prefix: string; parts: MlPart[] }[] = [
  { name: "Deep Learning", path: DEEP_LEARNING_PATH, prefix: "ml", parts: mlParts },
  { name: "Applied ML", path: APPLIED_ML_PATH, prefix: "aml", parts: amlParts },
  { name: "Agentic AI", path: AGENTIC_AI_PATH, prefix: "agentic", parts: agenticParts },
  { name: "Computer Vision", path: CV_PATH, prefix: "cv", parts: cvParts },
  { name: "NLP", path: NLP_PATH, prefix: "nlp", parts: nlpParts },
  { name: "Recommendations / Ranking", path: RRP_PATH, prefix: "rrp", parts: rrpParts },
  { name: "Generative AI", path: GENAI_PATH, prefix: "genai", parts: genaiParts },
  { name: "LLM", path: LLM_PATH, prefix: "llm", parts: llmParts },
  { name: "Speech / Audio", path: SPEECH_PATH, prefix: "speech", parts: speechParts },
  { name: "Reinforcement Learning", path: RL_PATH, prefix: "rl", parts: rlParts },
  { name: "Distributed ML", path: DISTRIBUTED_ML_PATH, prefix: "distributed", parts: distributedParts },
];
