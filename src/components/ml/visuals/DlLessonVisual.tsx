import { dlVisuals, isDlVisualId, type DlVisualSpec } from "@/lib/dlVisuals";
import { LessonFigure } from "@/components/lesson/LessonFigure";
import { CvLessonVisual } from "@/components/cv/visuals/CvLessonVisual";
import { StaticDlVisual } from "./StaticDlVisual";

export function DlLessonVisual({ id }: { id: string }) {
  if (!isDlVisualId(id)) throw new Error("Unknown Deep Learning visual: " + id);
  const visual: DlVisualSpec = dlVisuals[id];
  if (visual.shared) return <div data-dl-visual={id}><CvLessonVisual id={visual.shared} /></div>;
  return <LessonFigure id={id} track="dl" visual={visual}><StaticDlVisual id={id} /></LessonFigure>;
}
