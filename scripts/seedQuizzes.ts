// Local owner command; never runs during the site build or deployment.
//   npm run seed:quizzes
//   npm run seed:quizzes -- --prefix=nlp- --dry-run
//   npm run seed:quizzes -- --prefix=nlp-
// Questions AND answers belong in premium-gated Firestore, not the static site.
// Credentials: GOOGLE_APPLICATION_CREDENTIALS or scripts/serviceAccountKey.json.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));

async function main() {
  const args = process.argv.slice(2);
  for (const arg of args) {
    if (arg !== "--dry-run" && !/^--prefix=[a-z0-9-]+$/.test(arg)) {
      throw new Error(`Unsupported argument: ${arg}. Use --dry-run or --prefix=nlp-.`);
    }
  }
  const prefixes = args.filter(arg => arg.startsWith("--prefix="));
  if (prefixes.length > 1) throw new Error("Supply at most one quiz prefix.");
  const prefix = prefixes[0]?.slice("--prefix=".length);
  const quizzes = JSON.parse(readFileSync(join(scriptDirectory, "quizzes.json"), "utf8")) as Record<
    string, { questions: string[]; answers: string[] }
  >;
  const entries = Object.entries(quizzes).filter(([quizId]) => prefix === undefined || quizId.startsWith(prefix));
  if (entries.length === 0) throw new Error(`No quizzes match prefix ${prefix}.`);
  for (const [quizId, quiz] of entries) {
    if (!Array.isArray(quiz.questions) || !Array.isArray(quiz.answers) ||
      quiz.questions.length === 0 || quiz.questions.length !== quiz.answers.length ||
      [...quiz.questions, ...quiz.answers].some(value => typeof value !== "string" || value.trim().length === 0)) {
      throw new Error(`Invalid questions/answers for ${quizId}.`);
    }
  }
  const questionCount = entries.reduce((sum, [, quiz]) => sum + quiz.questions.length, 0);
  if (args.includes("--dry-run")) {
    for (const [quizId, quiz] of entries) console.log(`Validated ${quizId} (${quiz.questions.length} questions)`);
    console.log(`Dry run: ${entries.length} quiz documents, ${questionCount} questions; no credentials loaded or data written.`);
    return;
  }

  // Pin the destination even when local default credentials belong to another project.
  const projectId = JSON.parse(readFileSync(join(scriptDirectory, "..", ".firebaserc"), "utf8")).projects.default as string;
  const keyPath = join(scriptDirectory, "serviceAccountKey.json");
  const app = initializeApp({
    projectId,
    credential: existsSync(keyPath) ? cert(JSON.parse(readFileSync(keyPath, "utf8"))) : applicationDefault(),
  });
  const db = getFirestore(app);
  console.log(`Seeding ${entries.length} quiz documents into Firestore project "${projectId}"`);
  for (const [quizId, quiz] of entries) {
    await db.collection("quizzes").doc(quizId).set(quiz);
    console.log(`Seeded ${quizId} (${quiz.questions.length} questions)`);
  }
  console.log(`Done - ${entries.length} quiz documents written.`);
}

main().then(
  () => process.exit(0),
  err => { console.error(err); process.exit(1); }
);
