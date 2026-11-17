"use client";

import Link from "next/link";
import { PanelLeftClose } from "lucide-react";
import { ProductMark } from "./ProductMark";

export function ProgressPanelHeader({ onHide }: { onHide: () => void }) {
  return (
    <div className="flex items-center gap-2 px-4 py-4">
      <Link href="/" className="flex min-w-0 flex-1 items-center gap-2">
        <ProductMark size={30} />
        <span className="whitespace-nowrap text-[17px] font-bold text-text">SWE Companion</span>
      </Link>
      <button
        type="button"
        onClick={onHide}
        className="flex size-9 shrink-0 items-center justify-center rounded-md text-text-muted hover:bg-surface-high"
        aria-label="Collapse progress panel"
        aria-expanded={true}
        title="Collapse progress panel"
      >
        <PanelLeftClose size={22} />
      </button>
    </div>
  );
}
