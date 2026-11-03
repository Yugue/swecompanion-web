import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { mlQuizTracks } from "./mlQuizCatalog";
import { ML_DOMAINS } from "../src/lib/mlDomains";

type Bank = { questions: string[]; answers: string[] };
type Mapping = { lessons: string[]; skill: "knowledge" };
const bank = JSON.parse(fs.readFileSync("src/content/ml-quizzes.json", "utf8")) as Record<string, Bank>;
const priorities = JSON.parse(fs.readFileSync("src/content/ml-quiz-priorities.json", "utf8")) as Record<string, number[]>;
assert.deepEqual(Object.keys(priorities).sort(), Object.keys(bank).sort(), "Every quiz needs an explicit editorial priority review");
const coverage = JSON.parse(fs.readFileSync("scripts/domainQuizCoverage.json", "utf8")) as Record<string, Mapping[]>;
const args = process.argv.slice(2);
assert.ok(args.every((arg) => ["--export"].includes(arg)), "Supported options: --export");
assert.deepEqual(mlQuizTracks.map((t) => t.path).sort(), ML_DOMAINS.map((d) => d.href).sort(), "Every ML domain must be audited");
const entries: { id: string; count: number; url: string }[] = [];
const authored = new Set<string>();
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
    for (const question of quiz.questions) {
      assert.ok(question.trim().endsWith("?"), id + ": question format");
      assert.match(question, /^(?:What|Why|How|When|Where|Which|Does|Do|Can|Is|Are)\b/, id + ": use direct knowledge prompts");
      assert.doesNotMatch(question, /\b(?:suppose|imagine|your|diagnose|debug|troubleshoot)\b/i, id + ": no scenario/debugging prompts");
      assert.doesNotMatch(question, /\[[\s\d.,−-]+\]|\b(?:calculate|work out|given\s+(?:a|an)\s+\d+)\b/i, id + ": no numerical exercise setup");
    }
    assert.equal(priorities[id].length, 3, id + ": three core practice prompts");
    assert.equal(new Set(priorities[id]).size, 3, id + ": duplicate priorities");
    assert.ok(priorities[id].every(n => Number.isInteger(n) && n >= 1 && n <= quiz.questions.length), id + ": invalid priority index");
    entries.push({ id, count: part.quizQuestionCount, url });
    if (!isNew) continue;
    authored.add(id);
    assert.equal(quiz.questions.length, 10);
    const mapping = coverage[id];
    assert.equal(mapping.length, quiz.questions.length, id + ": coverage count");
    assert.ok(mapping.every(m => m.skill === "knowledge"), id + ": knowledge-only coverage");
    for (const [i, question] of quiz.questions.entries()) {
      const answer = quiz.answers[i], label = id + ":" + i;
      assert.ok(question.split(/\s+/).length >= 4, label + ": insufficient prompt");
      assert.ok(answer.split(/\s+/).length >= 12 && answer.split(/\s+/).length <= 200, label + ": answer length");
      assert.ok(!allAuthoredQuestions.has(question), label + ": repeated question");
      allAuthoredQuestions.add(question);
      assert.ok(mapping[i].lessons.some((lesson) => part.topics.some((t) => t.id === lesson)), label + ": must assess current Part");
      for (const lesson of mapping[i].lessons) {
        assert.ok(available.has(lesson), label + ": unknown or future prerequisite " + lesson);
        covered.add(lesson);
      }
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
        assert.ok(html.includes("MOCK INTERVIEW"), url + ": quiz label");
        assert.doesNotMatch(html, /Sign in to unlock|Upgrade to unlock|MOCK INTERVIEW · PREMIUM|MOCK INTERVIEW · FREE/);
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
        const displayed = [...html.matchAll(/<button[^>]*aria-expanded="false"[^>]*>([\s\S]*?)<\/button>/g)]
          .map(match => match[1].replace(/^\s*<span\b[^>]*>\d+<\/span>/, "").replace(/<[^>]*>/g, ""));
        const escapeHtml = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
        assert.equal(displayed.length, quiz.questions.length, url + ": visible question count");
        priorities[track.prefix + "-" + part.id].forEach((n, i) => {
          assert.equal(displayed[i], escapeHtml(quiz.questions[n - 1]), url + ": core prompts must appear first");
        });
        if (["speech", "rl"].includes(track.prefix)) for (const topic of part.topics) {
          assert.ok(read(track.path + "/" + topic.id).includes('href="' + url + '"'), topic.id + ": missing lesson quiz link");
        }
      }
    }
    console.log("Export passed: every ML quiz contains static questions and answers, valid links, canonical URLs, and sitemap entries.");
  }
  console.log("ML quiz audit: " + mlQuizTracks.length + " domains, " + entries.length + " quizzes, " + entries.reduce((n, e) => n + e.count, 0) + " questions.");
  console.log("Knowledge coverage: direct conceptual prompts, complete chapter inventory, paired answers, and valid practice priorities. Speech/RL lesson mappings are retained.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
