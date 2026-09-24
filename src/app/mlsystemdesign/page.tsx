import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar";
import { ML_SYSTEM_DESIGN_PATH } from "@/lib/mlDomains";

export const metadata: Metadata = {
  title: "ML System Design",
  description: "ML system design interview prep.",
  alternates: { canonical: ML_SYSTEM_DESIGN_PATH },
};

export default function MlSystemDesignPage() {
  return (
    <div className="min-h-screen bg-bg">
      <TopBar activeTrack="mlsd" />
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-text">ML System Design</h1>
        <p className="mt-3 text-[15px] text-text-muted">This guide is coming soon.</p>
      </main>
    </div>
  );
}
