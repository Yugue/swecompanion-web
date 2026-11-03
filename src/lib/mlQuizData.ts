import "server-only";
import quizBank from "@/content/ml-quizzes.json";
import quizPriorities from "@/content/ml-quiz-priorities.json";

type Quiz = { questions: string[]; answers: string[] };
const quizzes: Record<string, Quiz> = quizBank;
const priorities: Record<string, number[]> = quizPriorities;

// Questions and model answers are authored as static content. Only the selected
// chapter is serialized into its page; no Firebase read is needed.
export function getMlQuiz(quizId: string, questionCount: number): Quiz {
  if (!/^(ml|aml|agentic|cv|nlp|rrp|genai|llm|speech|rl|distributed)-/.test(quizId)) {
    throw new Error(`Not an ML domain quiz: ${quizId}`);
  }
  const quiz = quizzes[quizId];
  if (!quiz || quiz.questions.length !== questionCount || quiz.answers.length !== questionCount) {
    throw new Error(`Missing or incomplete ML quiz: ${quizId}`);
  }
  // Source numbering stays stable for chapter/lesson coverage audits. Display
  // the three editorially selected core prompts first, then the remaining depth.
  const first = priorities[quizId];
  if (!first || first.length !== 3 || new Set(first).size !== 3 ||
      first.some(n => !Number.isInteger(n) || n < 1 || n > questionCount)) {
    throw new Error(`Invalid practice priorities: ${quizId}`);
  }
  const order = [...first.map(n => n - 1), ...quiz.questions.map((_, i) => i).filter(i => !first.includes(i + 1))];
  return {
    questions: order.map(i => quiz.questions[i]),
    answers: order.map(i => quiz.answers[i]),
  };
}
