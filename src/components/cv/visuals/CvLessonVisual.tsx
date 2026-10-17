import { isCvVisualId } from "@/lib/cvVisuals";
import { CvFigure } from "./CvFigure";
import { ConvolutionDemo } from "./ConvolutionDemo";
import { MlpBackpropDemo } from "./MlpBackpropDemo";
import { StaticCvVisual } from "./StaticCvVisual";

export function CvLessonVisual({ id }: { id: string }) {
  if (!isCvVisualId(id)) throw new Error("Unknown CV visual: " + id);
  if (id === "convolution") return <ConvolutionDemo />;
  if (id === "mlp-forward") return <MlpBackpropDemo mode="forward" />;
  if (id === "mlp-backprop") return <MlpBackpropDemo />;
  return <CvFigure id={id}><StaticCvVisual id={id} /></CvFigure>;
}
