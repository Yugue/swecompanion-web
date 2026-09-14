// One-off migration: quiz QUESTIONS move from public site data into Firestore alongside the
// answers - quizzes are now fully premium (question text included), not just answer-gated.
// Reads the already-generated src/lib/{studyData,mlStudyData}.ts (the Dart sources are gone),
// extracts question text + existing answers from scripts/quizAnswers.json, writes the combined
// scripts/quizzes.json, and rewrites the two TS files to expose only `quizQuestionCount`.
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";

const existingAnswers = JSON.parse(readFileSync(new URL("./quizAnswers.json", import.meta.url), "utf8"));

function extractQuestions(line) {
  const questions = [];
  const re = /\{\s*question:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
  let m;
  while ((m = re.exec(line))) {
    questions.push(JSON.parse(`"${m[1]}"`));
  }
  return questions;
}

function rewriteQuizLines(text) {
  return text
    .split("\n")
    .map((line) => {
      const match = line.match(/^(\s*)quiz:\s*\[(.*)\],\s*$/);
      if (!match) return line;
      const [, indent, inner] = match;
      return `${indent}quizQuestionCount: ${extractQuestions(inner).length},`;
    })
    .join("\n");
}

const quizzes = {};

const mlUrl = new URL("../src/lib/mlStudyData.ts", import.meta.url);
const mlText = readFileSync(mlUrl, "utf8");
const mlPartRe = /\{\s*id:\s*"([^"]+)"[\s\S]*?\n\s*quiz:\s*\[(.*)\],\s*\n\s*\},/g;
let mm;
while ((mm = mlPartRe.exec(mlText))) {
  const [, partId, quizInner] = mm;
  const questions = extractQuestions(quizInner);
  if (questions.length > 0) {
    quizzes[`ml-${partId}`] = { questions, answers: existingAnswers[`ml-${partId}`] };
  }
}
writeFileSync(mlUrl, rewriteQuizLines(mlText), "utf8");

const studyUrl = new URL("../src/lib/studyData.ts", import.meta.url);
const studyText = readFileSync(studyUrl, "utf8");
const topicRe = /\{\s*slug:\s*"([^"]+)"[\s\S]*?\n\s*quiz:\s*\[(.*)\],\s*\n\s*\},/g;
let tm;
while ((tm = topicRe.exec(studyText))) {
  const [, slug, quizInner] = tm;
  const questions = extractQuestions(quizInner);
  if (questions.length > 0) {
    quizzes[`lc-${slug}`] = { questions, answers: existingAnswers[`lc-${slug}`] };
  }
}
writeFileSync(studyUrl, rewriteQuizLines(studyText), "utf8");

writeFileSync(new URL("./quizzes.json", import.meta.url), JSON.stringify(quizzes, null, 2), "utf8");
unlinkSync(new URL("./quizAnswers.json", import.meta.url));

console.log(`Wrote quizzes.json with ${Object.keys(quizzes).length} quizzes.`);
console.log("Rewrote src/lib/mlStudyData.ts and src/lib/studyData.ts to use quizQuestionCount.");
