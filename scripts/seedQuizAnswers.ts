// Run once, locally, by the project owner (not part of the build/deploy pipeline):
//   npm run seed:quiz-answers
//
// Populates the `quizAnswers/{quizId}` collection with the premium answer arrays that
// intentionally do NOT live in the static site bundle - see the plan's "Premium quiz
// architecture" and firestore.rules for why these are only readable by premium users.
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

const app = existsSync(keyPath)
  ? initializeApp({ credential: cert(JSON.parse(readFileSync(keyPath, "utf8"))) })
  : initializeApp({ credential: applicationDefault() });

const db = getFirestore(app);
const answers = JSON.parse(readFileSync(join(__dirname, "quizAnswers.json"), "utf8")) as Record<
  string,
  string[]
>;

async function main() {
  const entries = Object.entries(answers);
  for (const [quizId, list] of entries) {
    await db.collection("quizAnswers").doc(quizId).set({ answers: list });
    console.log(`Seeded ${quizId} (${list.length} answers)`);
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
