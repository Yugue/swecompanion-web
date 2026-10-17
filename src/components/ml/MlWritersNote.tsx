import { CheckCircle2 } from "lucide-react";

export function MlWritersNote() {
  return (
    <div className="mb-5 flex items-start gap-2.5 rounded-md border border-accent-green/35 bg-accent-green/10 p-3">
      <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-accent-green" />
      <p className="text-sm font-semibold leading-relaxed text-text">
        The writers of this page successfully passed the ML domain interview by following only
        this guide.
      </p>
    </div>
  );
}
