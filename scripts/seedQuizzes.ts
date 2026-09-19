// Run once, locally, by the project owner (not part of the build/deploy pipeline):
//   npm run seed:quizzes
//
// Populates the `quizzes/{quizId}` collection with the full premium quiz content (both
// questions and answers) that intentionally do NOT live in the static site bundle - see the
// plan's "Premium quiz architecture" and firestore.rules for why these are only readable by
// premium users.
//
// Needs Firebase Admin credentials for the `swecompanion` project. Either:
//   - set GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON key file, or
//   - place that key at scripts/serviceAccountKey.json (gitignored).
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const keyPath = join(__dirname, "serviceAccountKey.json");

// applicationDefault() alone takes its project from whatever the local Google credentials are
// bound to, which is not necessarily this app - so pin it to the project in .firebaserc.
const projectId = JSON.parse(readFileSync(join(__dirname, "..", ".firebaserc"), "utf8")).projects
  .default as string;

const app = existsSync(keyPath)
  ? initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, "utf8"))) })
  : initializeApp({ credential: applicationDefault(), projectId });

const db = getFirestore(app);
const quizzes = JSON.parse(readFileSync(join(__dirname, "quizzes.json"), "utf8")) as Record<
  string,
  { questions: string[]; answers: string[] }
>;

async function main() {
  const entries = Object.entries(quizzes);
  console.log(`Seeding ${entries.length} quiz documents into Firestore project "${app.options.projectId ?? projectId}"`);
  for (const [quizId, quiz] of entries) {
    await db.collection("quizzes").doc(quizId).set(quiz);
    console.log(`Seeded ${quizId} (${quiz.questions.length} questions)`);
  }
  console.log(`Done - ${entries.length} quiz documents written.`);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
