// Curriculum inventory for whole-corpus editorial checks.
import type { LessonTrack } from "./getLessonBlocks";
import { mlParts } from "./mlStudyData";
import { amlParts } from "./amlStudyData";
import { agenticParts } from "./agenticStudyData";
import { rrpParts } from "./rrpStudyData";
import { cvParts } from "./cvStudyData";
import { nlpParts } from "./nlpStudyData";
import { genaiParts } from "./genaiStudyData";
import { llmParts } from "./llmStudyData";
import { speechParts } from "./speechStudyData";
import { rlParts } from "./rlStudyData";
import { distributedParts } from "./distributedStudyData";
export const lessonCurricula = { ml: mlParts, aml: amlParts, agentic: agenticParts, rrp: rrpParts, cv: cvParts, nlp: nlpParts, genai: genaiParts, llm: llmParts, speech: speechParts, rl: rlParts, distributed: distributedParts } satisfies Record<LessonTrack, readonly CurriculumPart[]>;
export interface CurriculumTopic { id: string; title: string; prerequisites?: string[] }
export interface CurriculumPart { id: string; title: string; description: string; topics: CurriculumTopic[] }
