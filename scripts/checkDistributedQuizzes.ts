import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { distributedParts, distributedTopics } from "../src/lib/distributedStudyData";
import { DISTRIBUTED_ML_PATH } from "../src/lib/mlDomains";

interface QuizBank { questions: string[]; answers: string[] }
export function checkDistributedQuizzes(built: boolean) {
  const banks = JSON.parse(fs.readFileSync("src/content/ml-quizzes.json", "utf8")) as Record<string, QuizBank>;
  const coverage = JSON.parse(fs.readFileSync("scripts/distributedQuizCoverage.json", "utf8")) as Record<string, string[][]>;
  const ids = distributedParts.map((part) => "distributed-" + part.id);
  assert.deepEqual(Object.keys(banks).filter((id) => id.startsWith("distributed-")).sort(), [...ids].sort());
  assert.deepEqual(Object.keys(coverage).sort(), [...ids].sort());
  assert.deepEqual(distributedParts.map((part) => part.quizQuestionCount), [10, 12, 12, 8, 8, 10]);
  const questions = new Set<string>(), covered = new Set<string>(), available = new Set<string>();
  const quizText: string[] = [];
  for (const part of distributedParts) {
    part.topics.forEach((topic) => available.add(topic.id));
    const id = "distributed-" + part.id, bank = banks[id], mapped = coverage[id];
    assert.equal(bank.questions.length, part.quizQuestionCount, id + ": advertised count mismatch");
    assert.equal(bank.answers.length, bank.questions.length, id + ": missing answer");
    assert.equal(mapped.length, bank.questions.length, id + ": coverage map mismatch");
    for (const [index, question] of bank.questions.entries()) {
      const answer = bank.answers[index], label = id + " question " + (index + 1);
      assert.ok(question.trim().split(/\s+/).length >= 4, label + ": insufficient prompt");
      assert.ok(answer.trim().split(/\s+/).length >= 12 && answer.trim().split(/\s+/).length <= 220, label + ": answer length");
      assert.ok(!questions.has(question), label + ": duplicate question");
      questions.add(question);
      for (const text of [question, answer]) {
        assert.doesNotMatch(text, /\bTODO\b|\bTBD\b|coming soon|<script|\*\*|```/i, label + ": invalid plain-text payload");
        quizText.push(text);
      }
      assert.ok(mapped[index].length > 0, label + ": missing lesson mapping");
      assert.ok(mapped[index].some((topic) => part.topics.some((t) => t.id === topic)), label + ": must assess this Part");
      for (const topic of mapped[index]) {
        assert.ok(available.has(topic), label + ": unknown or later prerequisite " + topic);
        covered.add(topic);
      }
    }
  }
  assert.equal(questions.size, 60);
  assert.equal(new Set(quizText).size, 120, "Questions and answers must be distinct");
  assert.deepEqual([...covered].sort(), distributedTopics.map((topic) => topic.id).sort());

  if (built) {
    const readPage = (url: string) => fs.readFileSync(path.join("out", url.slice(1) + ".html"), "utf8");
    const hub = readPage(DISTRIBUTED_ML_PATH), xml = fs.readFileSync("out/sitemap.xml", "utf8");
    for (const part of distributedParts) {
      const url = DISTRIBUTED_ML_PATH + "/" + part.id + "/quiz", html = readPage(url).replace(/<!--[\s\S]*?-->/g, "");
      assert.ok(hub.includes('href="' + url + '"'), part.id + ": missing hub quiz link");
      assert.ok(html.includes('href="' + DISTRIBUTED_ML_PATH + "#" + part.id + '"'), part.id + ": missing return link");
      assert.match(html, new RegExp('<link rel="canonical" href="[^"]*' + url + '"'));
      assert.ok(xml.includes(url + "</loc>"), part.id + ": missing quiz sitemap entry");
      assert.ok(html.includes("distributed-" + part.id), part.id + ": wrong quiz ID");
      assert.ok(html.includes(part.quizQuestionCount + " technical knowledge questions"), part.id + ": missing count");
      assert.ok(html.includes("MOCK INTERVIEW"), part.id + ": missing quiz label");
      assert.doesNotMatch(html, /Sign in to unlock|Upgrade to unlock/);
      for (const topic of part.topics) {
        assert.ok(readPage(DISTRIBUTED_ML_PATH + "/" + topic.id).includes('href="' + url + '"'), topic.id + ": missing Part quiz link");
      }
    }
    console.log("Quiz export: six static quiz routes, hub/lesson links, canonical URLs, sitemap, and no membership gate. Run check:ml-quizzes -- --export to verify all public payloads.");
  }
  console.log("Distributed quizzes: 60 conceptual question/answer pairs; all 28 lesson mappings retained.");
}
