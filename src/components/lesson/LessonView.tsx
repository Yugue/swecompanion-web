import { getLessonBlocks, type LessonTrack } from "@/lib/getLessonBlocks";
import { LessonBlockView } from "./LessonBlockView";

/** Server component: reads + parses the lesson markdown at build time, so its full text
 * ships in the static HTML (the actual SEO fix vs. the Flutter app's canvas rendering). */
export function LessonView({ topicId, track = "ml" }: { topicId: string; track?: LessonTrack }) {
  const blocks = getLessonBlocks(topicId, track);
  return (
    <div>
      {blocks.map((block, i) => (
        <LessonBlockView key={i} block={block} />
      ))}
    </div>
  );
}
