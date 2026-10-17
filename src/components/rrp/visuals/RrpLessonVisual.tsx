import { rrpVisuals, isRrpVisualId, type RrpVisualSpec } from "@/lib/rrpVisuals";
import { LessonFigure } from "@/components/lesson/LessonFigure";
import { AmlLessonVisual } from "@/components/aml/visuals/AmlLessonVisual";
import { StaticRrpVisual } from "./StaticRrpVisual";
export function RrpLessonVisual({ id }: { id: string }) {
  if (!isRrpVisualId(id)) throw new Error("Unknown RRP visual: " + id);
  const visual: RrpVisualSpec = rrpVisuals[id];
  if (visual.sharedAml) return <div data-rrp-visual={id}><AmlLessonVisual id={visual.sharedAml} /></div>;
  return <LessonFigure id={id} track="rrp" visual={visual}><StaticRrpVisual id={id} /></LessonFigure>;
}
