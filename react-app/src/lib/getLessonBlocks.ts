import fs from "node:fs";
import path from "node:path";
import { parseLesson, type LessonBlock } from "./lessonParser";

const LESSONS_DIR = path.join(process.cwd(), "src/content/ml-lessons");

export function getLessonBlocks(topicId: string): LessonBlock[] {
  const filePath = path.join(LESSONS_DIR, `${topicId}.md`);
  const source = fs.readFileSync(filePath, "utf8");
  return parseLesson(source);
}

export function lessonExists(topicId: string): boolean {
  return fs.existsSync(path.join(LESSONS_DIR, `${topicId}.md`));
}
