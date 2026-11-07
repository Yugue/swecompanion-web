import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { SystemDesignCaseCompletion } from "@/components/mlsystemdesign/SystemDesignShell";
import { SystemDesignLesson } from "@/components/mlsystemdesign/SystemDesignLesson";
import { SystemDesignArchitecture } from "@/components/mlsystemdesign/SystemDesignArchitecture";
import { rrpDesignProblems, getRrpDesignProblem } from "@/lib/rrpSystemDesignData";
import { rrpArchitectures } from "@/lib/rrpArchitectureData";
import { RRP_SYSTEM_DESIGN_PATH } from "@/lib/mlDomains";

export function generateStaticParams() {
  return rrpDesignProblems.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const problem = getRrpDesignProblem(id);
  if (!problem) return {};
  return {
    title: `${problem.title} — Recommendation, Ranking & Prediction System Design`,
    description: problem.summary,
    alternates: { canonical: `${RRP_SYSTEM_DESIGN_PATH}/${problem.id}` },
  };
}

export default async function RrpDesignProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = getRrpDesignProblem(id);
  if (!problem) notFound();
  const index = rrpDesignProblems.findIndex(item => item.id === problem.id);
  const previous = rrpDesignProblems[index - 1];
  const next = rrpDesignProblems[index + 1];
  const accent = "#4285F4";

  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": accent } as CSSProperties}>
      <TopBar activeTrack="mlsd" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <Link href={`${RRP_SYSTEM_DESIGN_PATH}#${problem.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
          <ArrowLeft size={16} aria-hidden="true" /> All Recommendation, Ranking & Prediction problems
        </Link>
        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-text">Problem {index + 1}: {problem.title}</h1>
        <div className="mb-5"><SystemDesignCaseCompletion topicId="rrp" caseId={problem.id} accent={accent} /></div>
        <SystemDesignLesson
          lessonId={problem.lessonId}
          topicName="Recommendation, Ranking & Prediction"
          diagram={<SystemDesignArchitecture id={`rrp-${problem.id}`} title={problem.title} graph={rrpArchitectures[problem.id]} />}
        />
        <nav aria-label="Case navigation" className="mt-8 grid gap-3 border-t border-outline/55 pt-5 sm:grid-cols-2">
          <Link href={previous ? `${RRP_SYSTEM_DESIGN_PATH}/${previous.id}` : RRP_SYSTEM_DESIGN_PATH} className="rounded-xl border border-outline/70 bg-surface p-4 hover:bg-surface-high">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-text-muted"><ArrowLeft size={14} aria-hidden="true" /> {previous ? "PREVIOUS CASE" : "ALL RRP CASES"}</span>
            <span className="text-sm font-semibold text-text">{previous?.title ?? "Back to the problems"}</span>
          </Link>
          <Link href={next ? `${RRP_SYSTEM_DESIGN_PATH}/${next.id}` : RRP_SYSTEM_DESIGN_PATH} className="rounded-xl border border-outline/70 bg-surface p-4 hover:bg-surface-high">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-text-muted">{next ? "NEXT CASE" : "ALL RRP CASES"} <ArrowRight size={14} aria-hidden="true" /></span>
            <span className="text-sm font-semibold text-text">{next?.title ?? "Back to the problems"}</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
