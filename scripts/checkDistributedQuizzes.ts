import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { distributedParts, distributedTopics } from "../src/lib/distributedStudyData";
import { DISTRIBUTED_ML_PATH } from "../src/lib/mlDomains";

interface QuizBank { questions: string[]; answers: string[] }
export function checkDistributedQuizzes(built: boolean) {
  const banks = JSON.parse(fs.readFileSync("scripts/quizzes.json", "utf8")) as Record<string, QuizBank>;
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
      assert.ok(question.trim().split(/\s+/).length >= 12, label + ": insufficient prompt");
      assert.ok(answer.trim().split(/\s+/).length >= 45 && answer.trim().split(/\s+/).length <= 220, label + ": answer length");
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

  let examples = 0;
  function numeric(part: string, index: number, questionMarker: string, answerMarker: string, actual: number, expected: number, tolerance = 1e-8) {
    const quiz = banks["distributed-" + part];
    assert.ok(quiz.questions[index].includes(questionMarker), part + ": fixture question moved");
    assert.ok(quiz.answers[index].includes(answerMarker), part + ": worked result missing");
    assert.ok(Math.abs(actual - expected) <= tolerance, part + ": wrong worked value " + actual);
    examples++;
  }
  numeric("execution-foundations", 1, "x = 2", "−2", (1 * 2 - 3) * 2, -2);
  numeric("execution-foundations", 3, "v₀ = 0", "0.8", 0.9 * 2 - 1, 0.8);
  numeric("execution-foundations", 4, "2 trillion", "20 milliseconds", Math.max(2e12 / 100e12, 20e9 / 1e12) * 1000, 20);
  numeric("execution-foundations", 8, "100 messages", "1,040 microseconds", (100 * 10e-6 + 1e6 / 25e9) * 1e6, 1040);
  numeric("data-and-optimization", 1, "120-megabyte", "180 megabytes", 2 * (4 - 1) / 4 * 120, 180);
  numeric("data-and-optimization", 2, "2 and 6 valid", "is 5", (2 * 2 + 6 * 6) / 8, 5);
  numeric("data-and-optimization", 5, "loss sum 20", "2.75", (20 + 90) / (10 + 30), 2.75);
  numeric("data-and-optimization", 6, "Sixteen GPUs", "64 examples", 2 * 4 * 8, 64);
  numeric("data-and-optimization", 7, "7", "0.2", 2 / (3 + 7), 0.2);
  numeric("data-and-optimization", 11, "θ = −1", "−1.2", -1 - 0.1 * 2, -1.2);
  numeric("data-and-optimization", 11, "θ = −1", "−0.9", -1 - 0.1 * -1, -0.9);
  numeric("memory-and-partitioning", 0, "one-billion", "16 decimal gigabytes", (2 + 2 + 4 + 4 + 4) * 1e9 / 1e9, 16);
  numeric("memory-and-partitioning", 2, "eight workers", "5.5", 2 + 2 + 12 / 8, 5.5);
  numeric("memory-and-partitioning", 2, "eight workers", "3.75", 2 + (2 + 12) / 8, 3.75);
  numeric("memory-and-partitioning", 4, "[1, 2]", "scalar 11", 1 * 3 + 2 * 4, 11);
  numeric("memory-and-partitioning", 5, "log(2)", "= 3", (Math.exp(0) + Math.exp(Math.log(2)) * 4) / (Math.exp(0) + Math.exp(Math.log(2))), 3);
  numeric("memory-and-partitioning", 6, "eight microbatches", "72.7%", Math.round(1000 * 8 / 11) / 10, 72.7);
  numeric("memory-and-partitioning", 6, "sixteen microbatches", "84.2%", Math.round(1000 * 16 / 19) / 10, 84.2);
  numeric("memory-and-partitioning", 8, "4 decimal gigabytes", "0.32 seconds", 2 * 4 / 25, 0.32);
  numeric("memory-and-partitioning", 10, "[6, 2, 2, 2]", "= 4", Math.ceil(1.25 * 12 / 4), 4);
  numeric("scaling-training", 0, "four tensor workers", "16 devices", 2 * 4 * 2, 16);
  numeric("scaling-training", 2, "0.2 seconds", "62.5%", 1 / 0.2 / 8 * 100, 62.5);
  numeric("scaling-training", 2, "5% serial", "5.93", Math.round(100 / (0.05 + 0.95 / 8)) / 100, 5.93);
  numeric("scaling-training", 3, "six hours on 32", "80 versus 192", 6 * 32 - 10 * 8, 112);
  numeric("scaling-training", 4, "8 milliseconds", "24 milliseconds", 20 + 12 - 8, 24);
  numeric("scaling-training", 6, "[10, 10, 10, 30]", "50%", (10 + 10 + 10 + 30) / (4 * 30) * 100, 50);
  numeric("correctness-and-recovery", 1, "[3] and [4]", "= 5", Math.hypot(3, 4), 5);
  numeric("correctness-and-recovery", 6, "3,600", "268 seconds", Math.round(Math.sqrt(2 * 10 * 3600)), 268);
  numeric("distributed-inference", 0, "80 requests/second", "= 8", 80 * 0.1, 8);
  numeric("distributed-inference", 2, "4,096", "536,870,912 bytes", 2 * 32 * 8 * 128 * 2 * 4096, 536870912);
  numeric("distributed-inference", 2, "eight requests", "4 gibibytes", 2 * 32 * 8 * 128 * 2 * 4096 * 8 / 2 ** 30, 4);
  numeric("distributed-inference", 6, "17 tokens", "15 unused", Math.ceil(17 / 16) * 16 - 17, 15);
  numeric("distributed-inference", 8, "512-mebibyte", "21.5 milliseconds", Math.round(512 * 2 ** 20 / 25e9 * 10000) / 10, 21.5);

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
      assert.ok(html.includes(part.quizQuestionCount + " questions"), part.id + ": missing count");
      assert.ok(html.includes("MOCK INTERVIEW") && html.includes("FREE"), part.id + ": missing free access label");
      assert.doesNotMatch(html, /Sign in to unlock|Upgrade to unlock/);
      for (const topic of part.topics) {
        assert.ok(readPage(DISTRIBUTED_ML_PATH + "/" + topic.id).includes('href="' + url + '"'), topic.id + ": missing Part quiz link");
      }
    }
    console.log("Quiz export: six free routes, hub/lesson links, canonical URLs, sitemap, and no membership gate. Run check:ml-quizzes -- --export to verify all public payloads.");
  }
  console.log("Distributed quizzes: 60 question/answer pairs; all 28 lessons covered; " + examples + " independently checked worked results.");
}
