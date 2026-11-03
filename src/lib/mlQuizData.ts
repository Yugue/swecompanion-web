import "server-only";
import quizBank from "../../scripts/quizzes.json";

type Quiz = { questions: string[]; answers: string[] };
const quizzes: Record<string, Quiz> = quizBank;

// ML quizzes are public. Only the selected quiz is passed to the client; the
// remaining banks (including non-ML quizzes) stay behind the server boundary.
export function getMlQuiz(quizId: string, questionCount: number): Quiz {
  if (!/^(ml|aml|agentic|cv|nlp|rrp|genai|llm|speech|rl|distributed)-/.test(quizId)) {
    throw new Error(`Not an ML domain quiz: ${quizId}`);
  }
  const quiz = quizzes[quizId];
  if (!quiz || quiz.questions.length !== questionCount || quiz.answers.length !== questionCount) {
    throw new Error(`Missing or incomplete ML quiz: ${quizId}`);
  }
  return quiz;
}
