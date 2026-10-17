import type { ReactNode } from "react";
import { cvVisuals, type CvVisualId } from "@/lib/cvVisuals";
import { LessonFigure } from "@/components/lesson/LessonFigure";

export function CvFigure({ id, children }: { id: CvVisualId; children: ReactNode }) {
  return <LessonFigure id={id} track="cv" visual={cvVisuals[id]}>{children}</LessonFigure>;
}
