import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { mlQuizTracks } from "./mlQuizCatalog";
import { ML_DOMAINS } from "../src/lib/mlDomains";

type Bank = { questions: string[]; answers: string[] };
type Mapping = { lessons: string[]; skill: "mechanism" | "calculation" | "diagnosis" | "tradeoff" };
const bank = JSON.parse(fs.readFileSync("scripts/quizzes.json", "utf8")) as Record<string, Bank>;
const coverage = JSON.parse(fs.readFileSync("scripts/domainQuizCoverage.json", "utf8")) as Record<string, Mapping[]>;
const args = process.argv.slice(2);
assert.ok(args.every((arg) => ["--export", "--remote"].includes(arg)), "Supported options: --export, --remote");
assert.deepEqual(mlQuizTracks.map((t) => t.path).sort(), ML_DOMAINS.map((d) => d.href).sort(), "Every ML domain must be audited");
const entries: { id: string; count: number; url: string }[] = [];
const authored = new Set<string>(), mappedCalculations = new Set<string>(), checkedCalculations = new Set<string>();
const allAuthoredQuestions = new Set<string>();
for (const track of mlQuizTracks) {
  assert.ok(fs.existsSync(path.join("src/app", track.path.slice(1), "[id]/quiz/page.tsx")), track.name + ": quiz route missing");
  const isNew = track.prefix === "speech" || track.prefix === "rl";
  const available = new Set<string>(), covered = new Set<string>();
  for (const part of track.parts) {
    part.topics.forEach((t) => available.add(t.id));
    const id = track.prefix + "-" + part.id, quiz = bank[id], url = track.path + "/" + part.id + "/quiz";
    assert.ok(part.quizQuestionCount > 0 && quiz, id + ": missing advertised quiz or payload");
    assert.equal(quiz.questions.length, part.quizQuestionCount, id + ": advertised question count mismatch");
    assert.equal(quiz.answers.length, quiz.questions.length, id + ": answer pairing");
    assert.ok([...quiz.questions, ...quiz.answers].every((value) => typeof value === "string" && value.trim()), id + ": empty payload");
    assert.equal(new Set(quiz.questions).size, quiz.questions.length, id + ": duplicate questions");
    entries.push({ id, count: part.quizQuestionCount, url });
    if (!isNew) continue;
    authored.add(id);
    assert.equal(quiz.questions.length, 10);
    const mapping = coverage[id];
    assert.equal(mapping.length, quiz.questions.length, id + ": coverage count");
    assert.deepEqual([...new Set(mapping.map((m) => m.skill))].sort(), ["calculation", "diagnosis", "mechanism", "tradeoff"], id + ": incomplete reasoning mix");
    for (const [i, question] of quiz.questions.entries()) {
      const answer = quiz.answers[i], label = id + ":" + i;
      assert.ok(question.split(/\s+/).length >= 12, label + ": insufficient prompt");
      assert.ok(answer.split(/\s+/).length >= 45 && answer.split(/\s+/).length <= 200, label + ": answer length");
      assert.ok(!allAuthoredQuestions.has(question), label + ": repeated question");
      allAuthoredQuestions.add(question);
      assert.ok(mapping[i].lessons.some((lesson) => part.topics.some((t) => t.id === lesson)), label + ": must assess current Part");
      for (const lesson of mapping[i].lessons) {
        assert.ok(available.has(lesson), label + ": unknown or future prerequisite " + lesson);
        covered.add(lesson);
      }
      if (mapping[i].skill === "calculation") mappedCalculations.add(label);
      for (const text of [question, answer]) {
        assert.doesNotMatch(text, /TODO|TBD|coming soon|actual Google interview|asked at Google|<script|\*\*|```/i);
      }
    }
  }
  if (isNew) assert.deepEqual([...covered].sort(), track.parts.flatMap((p) => p.topics.map((t) => t.id)).sort(), track.name + ": unassessed lesson");
  console.log(track.name + ": " + track.parts.length + " quizzes, " + track.parts.reduce((n, p) => n + p.quizQuestionCount, 0) + " questions");
}
assert.deepEqual([...authored].sort(), Object.keys(coverage).sort());
assert.equal(allAuthoredQuestions.size, 120);

function calculation(id: string, index: number, marker: RegExp, actual: number, expected: number, tolerance = 1e-9) {
  assert.match(bank[id].answers[index], marker, id + ": worked answer marker missing");
  assert.ok(Math.abs(actual - expected) <= tolerance, id + ": wrong worked result " + actual);
  checkedCalculations.add(id + ":" + index);
}
calculation("rl-foundations", 2, /−2/, (1 * 2 - 3) * 2, -2);
calculation("rl-foundations", 4, /10.1/, [2, 0, 10].reduce((n, r, t) => n + 0.9 ** t * r, 0), 10.1);
calculation("rl-foundations", 7, /3.7/, 0.75 * (2 + 0.9 * 4) + 0.25 * -2, 3.7);
calculation("rl-learning-values", 1, /4.48/, 4 + 0.2 * (1 + 0.9 * 6 - 4), 4.48);
calculation("rl-learning-values", 3, /6.85/, 1 + 0.9 * 2 + 0.9 ** 2 * 5, 6.85);
calculation("rl-learning-values", 6, /2.188/, 2 + 0.1 * (1 + 0.9 * (0.8 * 4 + 0.2 * 0) - 2), 2.188);
calculation("rl-learning-values", 6, /2.26/, 2 + 0.1 * (1 + 0.9 * 4 - 2), 2.26);
calculation("rl-deep-values", 2, /6.5/, 2 + 0.9 * Math.max(3, 5), 6.5);
calculation("rl-deep-values", 3, /6.4/, 1 + 0.9 * Math.max(6, 2), 6.4);
const selected = [4, 5].indexOf(Math.max(4, 5));
calculation("rl-deep-values", 3, /2.8/, 1 + 0.9 * [6, 2][selected], 2.8);
calculation("rl-policy-optimization", 2, /2.44/, 1 + 0.9 * 0.8 * 2, 2.44);
const clipped = (ratio: number, advantage: number) => Math.min(ratio * advantage, Math.max(0.8, Math.min(1.2, ratio)) * advantage);
calculation("rl-policy-optimization", 3, /2.4/, clipped(1.5, 2), 2.4);
calculation("rl-policy-optimization", 3, /−1.6/, clipped(0.5, -2), -1.6);
calculation("rl-policy-optimization", 6, /5.5/, 1 + 0.9 * Math.min(8, 5), 5.5);
calculation("rl-policy-optimization", 6, /5.68/, 1 + 0.9 * (Math.min(8, 5) - 0.2 * -1), 5.68);
calculation("rl-models-and-data", 5, /reward/, [0.5, 0.5].reduce((n, b, i) => n + b * [0.75, 0.25][i] / b * [4, 0][i], 0), 3);
calculation("rl-practical-systems", 1, /1.2/, 0.9 * -2 - -3, 1.2);
calculation("rl-practical-systems", 4, /more sample-efficient/, 2e6 / 1e6, 2);
calculation("speech-audio-signals", 1, /64,000/, 16000 * 2 * 16 / 8, 64000);
calculation("speech-audio-signals", 3, /40 Hz/, 16000 / 400, 40);
calculation("speech-audio-signals", 3, /31.25 Hz/, 16000 / 512, 31.25);
calculation("speech-audio-signals", 4, /98 frames/, 1 + Math.floor((16000 - 400) / 160), 98);
calculation("speech-learning-foundations", 0, /0.357/, Math.round(-Math.log(0.7) * 1000) / 1000, 0.357);
calculation("speech-learning-foundations", 0, /2.303/, Math.round(-Math.log(0.1) * 1000) / 1000, 2.303);
calculation("speech-learning-foundations", 2, /9 input samples/, 5 + (3 - 1) * 2, 9);
calculation("speech-learning-foundations", 6, /4T²/, (2 * 10) ** 2 / 10 ** 2, 4);
const ctc = new Map<string, number>();
for (const a of ["a", "_"]) for (const b of ["a", "_"]) {
  const labels = [a, b].filter((label, i, seq) => i === 0 || label !== seq[i - 1]).filter((label) => label !== "_").join("");
  ctc.set(labels, (ctc.get(labels) ?? 0) + (a === "a" ? 0.4 : 0.6) * (b === "a" ? 0.4 : 0.6));
}
calculation("speech-speech-recognition", 3, /0.64/, ctc.get("a")!, 0.64);
const target = "book".split(""), repeats = target.slice(1).filter((c, i) => c === target[i]).length;
calculation("speech-speech-recognition", 4, /5/, target.length + repeats, 5);
calculation("speech-audio-understanding", 2, /0.3%/, 30 / 10000 * 100, 0.3);
calculation("speech-audio-understanding", 2, /2%/, 20 / 1000 * 100, 2);
calculation("speech-audio-understanding", 3, /0.8/, (3 * 0 + 4 * 5) / (Math.hypot(3, 4) * Math.hypot(0, 5)), 0.8);
calculation("speech-audio-understanding", 5, /25%/, (3 + 2 + 5) / 40 * 100, 25);
calculation("speech-audio-generation", 2, /100 milliseconds/, [2, 3, 1, 4].reduce((n, v) => n + v, 0) * 10, 100);
calculation("speech-audio-generation", 4, /450 milliseconds/, 30 * 15, 450);
calculation("speech-audio-generation", 6, /6,000/, 8 * 75 * Math.log2(1024), 6000);
calculation("speech-practical-systems", 2, /40%/, (1 + 2 + 1) / 10 * 100, 40);
calculation("speech-practical-systems", 3, /20%/, 2 / (2 + 8) * 100, 20);
calculation("speech-practical-systems", 3, /31.25%/, (1 / 2 + 1 / 8) / 2 * 100, 31.25);
calculation("speech-practical-systems", 4, /0.75/, 1.5 / 2, 0.75);
assert.deepEqual([...checkedCalculations].sort(), [...mappedCalculations].sort(), "Every calculation question must have a numerical check");

async function main() {
  if (args.includes("--export")) {
    const read = (url: string) => fs.readFileSync(path.join("out", url.slice(1) + ".html"), "utf8").replace(/<!--[\s\S]*?-->/g, "");
    const xml = fs.readFileSync("out/sitemap.xml", "utf8");
    for (const track of mlQuizTracks) {
      const hub = read(track.path);
      for (const part of track.parts) {
        const url = track.path + "/" + part.id + "/quiz", html = read(url);
        assert.ok(hub.includes('href="' + url + '"'), url + ": missing hub link");
        assert.ok(html.includes('href="' + track.path + "#" + part.id + '"'), url + ": missing return link");
        assert.ok(xml.includes(url + "</loc>"), url + ": missing sitemap entry");
        assert.match(html, new RegExp('<link rel="canonical" href="[^"]*' + url + '"'));
        assert.ok(html.includes(track.prefix + "-" + part.id), url + ": wrong quiz-store identifier");
        assert.ok(html.includes("MOCK INTERVIEW") && html.includes("FREE"), url + ": free quiz label");
        assert.doesNotMatch(html, /Sign in to unlock|Upgrade to unlock|MOCK INTERVIEW · PREMIUM/);
        const payload = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].flatMap((match) => {
          const script = match[1];
          if (!script.startsWith("self.__next_f.push(")) return [];
          const chunk = JSON.parse(script.slice("self.__next_f.push(".length, -1));
          return typeof chunk[1] === "string" ? [chunk[1]] : [];
        }).join("");
        const quiz = bank[track.prefix + "-" + part.id];
        for (const text of [...quiz.questions, ...quiz.answers]) {
          assert.ok((payload.includes(text) || payload.includes(JSON.stringify(text).slice(1, -1))), url + ": missing public question or answer");
        }
        assert.ok(html.includes(part.quizQuestionCount + " questions"), url + ": count");
        if (["speech", "rl"].includes(track.prefix)) for (const topic of part.topics) {
          assert.ok(read(track.path + "/" + topic.id).includes('href="' + url + '"'), topic.id + ": missing lesson quiz link");
        }
      }
    }
    console.log("Export passed: every ML quiz is free with public questions and answers, valid links, canonical URLs, and sitemap entries.");
  }
  if (args.includes("--remote")) {
    const { initializeApp, cert, applicationDefault, deleteApp } = await import("firebase-admin/app");
    const { getFirestore } = await import("firebase-admin/firestore");
    const projectId = JSON.parse(fs.readFileSync(".firebaserc", "utf8")).projects.default;
    const key = "scripts/serviceAccountKey.json";
    const app = initializeApp({ projectId, credential: fs.existsSync(key) ? cert(JSON.parse(fs.readFileSync(key, "utf8"))) : applicationDefault() });
    try {
      const db = getFirestore(app);
      const snapshots = await db.getAll(...entries.map(({ id }) => db.collection("quizzes").doc(id)));
      for (const [i, snapshot] of snapshots.entries()) {
        assert.ok(snapshot.exists, entries[i].id + ": missing stored quiz");
        const data = snapshot.data()!;
        assert.deepEqual(data.questions, bank[entries[i].id].questions, entries[i].id + ": stored question drift");
        assert.deepEqual(data.answers, bank[entries[i].id].answers, entries[i].id + ": stored answer drift");
      }
      console.log("Remote read-back passed: all registered ML questions and answers exactly match the local banks.");
    } finally { await deleteApp(app); }
  }
  console.log("ML quiz audit: " + mlQuizTracks.length + " domains, " + entries.length + " quizzes, " + entries.reduce((n, e) => n + e.count, 0) + " questions.");
  console.log("New coverage: 120 questions across 64 lessons, all four reasoning skills per Part; all 31 calculation questions verified.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
