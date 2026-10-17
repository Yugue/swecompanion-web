import { amlVisuals, isAmlVisualId, type AmlVisualSpec } from "@/lib/amlVisuals";
import { LessonFigure } from "@/components/lesson/LessonFigure";
import { CvLessonVisual } from "@/components/cv/visuals/CvLessonVisual";
import { DlLessonVisual } from "@/components/ml/visuals/DlLessonVisual";
import { StaticAmlVisual } from "./StaticAmlVisual";

export function AmlLessonVisual({ id }: { id: string }) {
  if (!isAmlVisualId(id)) throw new Error("Unknown Applied ML visual: " + id);
  const visual: AmlVisualSpec = amlVisuals[id];
  if (visual.sharedCv) return <div data-aml-visual={id}><CvLessonVisual id={visual.sharedCv} /></div>;
  if (visual.sharedDl) return <div data-aml-visual={id}><DlLessonVisual id={visual.sharedDl} /></div>;
  return <LessonFigure id={id} track="aml" visual={visual}><StaticAmlVisual id={id} /></LessonFigure>;
}
