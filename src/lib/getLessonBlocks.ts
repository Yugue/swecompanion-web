import fs from "node:fs";
import path from "node:path";
import { parseLesson, type LessonBlock } from "./lessonParser";

/** Each study track keeps its lessons in its own directory, so topic ids only have to be
 * unique within a track (both tracks legitimately have a `class-imbalance` lesson). */
export type LessonTrack = "ml" | "aml";

const LESSONS_DIR: Record<LessonTrack, string> = {
  ml: path.join(process.cwd(), "src/content/ml-lessons"),
  aml: path.join(process.cwd(), "src/content/aml-lessons"),
};

export function getLessonBlocks(topicId: string, track: LessonTrack = "ml"): LessonBlock[] {
  const filePath = path.join(LESSONS_DIR[track], `${topicId}.md`);
  const source = fs.readFileSync(filePath, "utf8");
  return parseLesson(source);
}

export function lessonExists(topicId: string, track: LessonTrack = "ml"): boolean {
  return fs.existsSync(path.join(LESSONS_DIR[track], `${topicId}.md`));
}
