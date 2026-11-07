import fs from "node:fs";
import path from "node:path";
import { Fragment, type ReactNode } from "react";
import { LessonBlockView } from "@/components/lesson/LessonBlockView";
import { parseLesson } from "@/lib/lessonParser";

export function SystemDesignLesson({ lessonId, diagram, topicName }: { lessonId: string; diagram: ReactNode; topicName: string }) {
  const filePath = path.join(process.cwd(), "src/content/ml-system-design-lessons", `${lessonId}.md`);
  const blocks = parseLesson(fs.readFileSync(filePath, "utf8"));

  return (
    <article aria-label={`${topicName} system design lesson`} className="[&_.katex-display]:text-text">
      {blocks.map((block, index) => (
        block.type === "paragraph" && block.text === "<!-- system-design-diagram -->"
          ? <Fragment key={index}>{diagram}</Fragment>
          : <LessonBlockView key={index} block={block} />
      ))}
    </article>
  );
}
