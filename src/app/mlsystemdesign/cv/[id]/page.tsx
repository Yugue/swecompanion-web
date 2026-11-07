import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { SystemDesignCaseCompletion } from "@/components/mlsystemdesign/SystemDesignShell";
import { SystemDesignLesson } from "@/components/mlsystemdesign/SystemDesignLesson";
import { SystemDesignArchitecture } from "@/components/mlsystemdesign/SystemDesignArchitecture";
import { cvDesignProblems, getCvDesignProblem } from "@/lib/cvSystemDesignData";
import { cvArchitectures } from "@/lib/cvArchitectureData";
import { CV_SYSTEM_DESIGN_PATH } from "@/lib/mlDomains";

export function generateStaticParams() {
  return cvDesignProblems.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const problem = getCvDesignProblem(id);
  if (!problem) return {};
  return {
    title: `${problem.title} — Computer Vision System Design`,
    description: problem.summary,
    alternates: { canonical: `${CV_SYSTEM_DESIGN_PATH}/${problem.id}` },
  };
}

export default async function CvDesignProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const problem = getCvDesignProblem(id);
  if (!problem) notFound();
  const index = cvDesignProblems.findIndex(item => item.id === problem.id);
  const previous = cvDesignProblems[index - 1];
  const next = cvDesignProblems[index + 1];
  const accent = "#4285F4";

  return (
    <div className="flex min-h-screen flex-col" style={{ "--accent": accent } as CSSProperties}>
      <TopBar activeTrack="mlsd" />
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-8">
        <Link href={`${CV_SYSTEM_DESIGN_PATH}#${problem.id}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
          <ArrowLeft size={16} aria-hidden="true" /> All Computer Vision problems
        </Link>
        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-text">Problem {index + 1}: {problem.title}</h1>
        <div className="mb-5"><SystemDesignCaseCompletion topicId="cv" caseId={problem.id} accent={accent} /></div>
        <SystemDesignLesson
          lessonId={problem.lessonId}
          topicName="Computer Vision"
          diagram={<SystemDesignArchitecture id={`cv-${problem.id}`} title={problem.title} graph={cvArchitectures[problem.id]} />}
        />
        <nav aria-label="Case navigation" className="mt-8 grid gap-3 border-t border-outline/55 pt-5 sm:grid-cols-2">
          <Link href={previous ? `${CV_SYSTEM_DESIGN_PATH}/${previous.id}` : CV_SYSTEM_DESIGN_PATH} className="rounded-xl border border-outline/70 bg-surface p-4 hover:bg-surface-high">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-text-muted"><ArrowLeft size={14} aria-hidden="true" /> {previous ? "PREVIOUS CASE" : "ALL CV CASES"}</span>
            <span className="text-sm font-semibold text-text">{previous?.title ?? "Back to the problems"}</span>
          </Link>
          <Link href={next ? `${CV_SYSTEM_DESIGN_PATH}/${next.id}` : CV_SYSTEM_DESIGN_PATH} className="rounded-xl border border-outline/70 bg-surface p-4 hover:bg-surface-high">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-text-muted">{next ? "NEXT CASE" : "ALL CV CASES"} <ArrowRight size={14} aria-hidden="true" /></span>
            <span className="text-sm font-semibold text-text">{next?.title ?? "Back to the problems"}</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
