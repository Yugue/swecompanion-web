import type { ReactNode } from "react";

export function LessonFigure({ id, track, visual, children }: {
  id: string; track: "cv" | "dl" | "aml" | "rrp" | "nlp"; visual: { title: string; caption: string }; children: ReactNode;
}) {
  return (
    <figure {...(track === "cv" ? { "data-cv-visual": id } : track === "dl" ? { "data-dl-visual": id } : track === "aml" ? { "data-aml-visual": id } : track === "nlp" ? { "data-nlp-visual": id } : { "data-rrp-visual": id })}
      className="my-5 overflow-hidden rounded-xl border border-outline/65 bg-surface">
      <div className="border-b border-outline/45 px-4 py-3">
        <p className="text-[15px] font-bold leading-snug text-text">{visual.title}</p>
      </div>
      {children}
      <figcaption className="border-t border-outline/45 bg-surface-high/35 px-4 py-3 text-[13px] leading-relaxed text-text-muted">
        {visual.caption}
      </figcaption>
    </figure>
  );
}
