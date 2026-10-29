import Image from "next/image";
import { isSpeechVisualId, speechVisuals } from "@/lib/speechVisuals";

export function SpeechLessonVisual({ id }: { id: string }) {
  if (!isSpeechVisualId(id)) return null;
  const visual = speechVisuals[id];
  return (
    <figure data-speech-visual={id} className="my-5 overflow-hidden rounded-xl border border-outline/65 bg-surface">
      <div className="border-b border-outline/45 px-4 py-3">
        <p className="text-[15px] font-bold leading-snug text-text">{visual.title}</p>
      </div>
      <Image src={`/speech/${id}.svg`} alt={visual.caption} width={960} height={600}
        className="h-auto w-full bg-[#f8fafc]" />
      <figcaption className="border-t border-outline/45 bg-surface-high/35 px-4 py-3 text-[13px] leading-relaxed text-text-muted">
        {visual.caption}
      </figcaption>
    </figure>
  );
}
