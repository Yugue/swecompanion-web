import { Sparkles } from "lucide-react";
import { getMlQuiz } from "@/lib/mlQuizData";
import { QuizQuestions } from "./QuizQuestions";

export function QuizSection({
  quizId,
  title,
  questionCount,
  proof,
}: {
  quizId: string;
  title: string;
  questionCount: number;
  proof?: string;
}) {
  if (questionCount === 0) return null;
  const quiz = getMlQuiz(quizId, questionCount);

  return (
    <section
      id={quizId}
      className="mt-2 rounded-xl border p-5"
      style={{ borderColor: "color-mix(in srgb, var(--accent) 35%, transparent)" }}
    >
      <div className="mb-1 flex flex-wrap items-center gap-2.5">
        <Sparkles size={20} style={{ color: "var(--accent)" }} />
        <h3 className="text-lg font-bold text-text">{title}</h3>
        <span
          className="rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide"
          style={{
            color: "var(--accent)",
            background: "color-mix(in srgb, var(--accent) 15%, transparent)",
          }}
        >
          MOCK INTERVIEW
        </span>
      </div>
      {proof && <p className="mb-4 text-sm font-semibold text-text">{proof}</p>}
      <QuizQuestions key={quizId} quiz={quiz} />
    </section>
  );
}
