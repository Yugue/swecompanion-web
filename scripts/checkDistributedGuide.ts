import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import katex from "katex";
import {
  distributedParts, distributedTopics, distributedLessonNumbers,
} from "../src/lib/distributedStudyData";
import { getLessonBlocks } from "../src/lib/getLessonBlocks";
import { parseInline, parseTableRows } from "../src/lib/lessonParser";
import { DISTRIBUTED_ML_PATH, ML_DOMAINS } from "../src/lib/mlDomains";
import { ICONS } from "../src/lib/icons";

assert.deepEqual(distributedParts.map((p) => p.topics.length), [5, 5, 6, 4, 3, 5]);
assert.equal(new Set(distributedParts.map((p) => p.id)).size, 6);
assert.equal(distributedTopics.length, 28);
assert.equal(new Set(distributedTopics.map((t) => t.id)).size, 28);
assert.equal(ML_DOMAINS.find((d) => d.name === "Distributed Machine Learning")?.href, DISTRIBUTED_ML_PATH);
const curriculum = fs.readFileSync("docs/distributed-ml-curriculum.md", "utf8");
const approved = [...curriculum.matchAll(/^### (\d+\.\d+) (.+)$/gm)];
assert.deepEqual(approved.map((m) => [m[1], m[2]]),
  distributedTopics.map((t) => [distributedLessonNumbers[t.id], t.title]));

const directory = path.join(process.cwd(), "src/content/distributed-lessons");
assert.deepEqual(fs.readdirSync(directory).filter((f) => f.endsWith(".md")).sort(),
  distributedTopics.map((t) => t.id + ".md").sort());
let equations = 0, tables = 0, diagrams = 0, words = 0, sectionsTotal = 0;
const code: string[] = [];
const seen = new Set<string>();
const paragraphs = new Map<string, string>();
const sources = new Map<string, string>();
for (const part of distributedParts) {
  assert.ok(ICONS[part.icon], "Unknown icon: " + part.icon);
  assert.equal(part.quizQuestionCount, 0);
}
for (const topic of distributedTopics) {
  assert.ok(topic.summary && topic.keyPoints.length >= 2);
  assert.equal(topic.interviewPrompt, "", "This guide has no interview sections");
  for (const prerequisite of topic.prerequisites) {
    assert.ok(seen.has(prerequisite), topic.id + ": prerequisite must precede its use: " + prerequisite);
  }
  seen.add(topic.id);
  const source = fs.readFileSync(path.join(directory, topic.id + ".md"), "utf8");
  sources.set(topic.id, source);
  assert.ok(source.startsWith("# " + distributedLessonNumbers[topic.id] + " " + topic.title + "\n"));
  assert.doesNotMatch(source, /\b(?:TODO|TBD|coming soon)\b/i);
  assert.doesNotMatch(source, /^#+ .*(?:Interview|Recap|Summary|Revision Sheet|Further Reading|References)/im);
  const sectionNumbers = [...source.matchAll(/^## (\d+)\. /gm)].map((m) => Number(m[1]));
  assert.ok(sectionNumbers.length >= 7 && sectionNumbers.length <= 12, topic.id);
  assert.deepEqual(sectionNumbers, sectionNumbers.map((_, i) => i + 1));
  sectionsTotal += sectionNumbers.length;
  const count = source.split(/\s+/).filter(Boolean).length;
  assert.ok(count >= 450 && count <= 1100, topic.id + ": inappropriate lesson length " + count);
  words += count;
  assert.equal((source.match(/^```/gm) ?? []).length % 2, 0, topic.id + ": unclosed fence");
  assert.equal((source.match(/^\\\[$/gm) ?? []).length, (source.match(/^\\\]$/gm) ?? []).length);
  const formats = new Set<string>();
  for (const block of getLessonBlocks(topic.id, "distributed")) {
    if (block.type === "math") {
      katex.renderToString(block.text, { throwOnError: true, strict: false });
      equations++; formats.add("math");
    }
    if (block.type === "table") {
      const rows = parseTableRows(block.text);
      assert.ok(rows.length > 1 && rows.every((row) => row.length === rows[0].length), topic.id + ": invalid table");
      tables++; formats.add("table");
    }
    if (block.type === "diagram") {
      diagrams++; formats.add("diagram");
      assert.ok(Math.max(...block.text.split("\n").map((line) => line.length)) <= 100, topic.id + ": excessively wide diagram");
    }
    if (block.type === "code") {
      assert.ok(block.text.split("\n").length <= 5, topic.id + ": example exceeds five lines");
      code.push(block.text); formats.add("code");
    }
    if (["paragraph", "bullet", "table", "heading2"].includes(block.type)) {
      for (const token of parseInline(block.text)) {
        if (token.kind === "math") katex.renderToString(token.text, { throwOnError: true, strict: false });
      }
    }
    if (block.type === "paragraph") {
      const length = block.text.split(/\s+/).length;
      assert.ok(length <= 130, topic.id + ": dense paragraph");
      if (length >= 25) {
        assert.ok(!paragraphs.has(block.text), topic.id + ": duplicated paragraph from " + paragraphs.get(block.text));
        paragraphs.set(block.text, topic.id);
      }
    }
  }
  assert.ok(formats.size >= 2, topic.id + ": needs varied explanatory formats");
}
assert.ok(equations >= 30 && tables >= 20 && diagrams >= 15 && code.length >= 8);
execFileSync("python3", ["-c", "import ast,json,sys\nfor snippet in json.load(sys.stdin): ast.parse(snippet)"], {
  input: JSON.stringify(code),
});

// Independent mathematical checks; these do not require a GPU or pretend to run torch.distributed.
const close = (a: number, b: number, label: string, tolerance = 1e-8) =>
  assert.ok(Math.abs(a - b) < tolerance, label + ": " + a + " != " + b);
const derivative = (f: (x: number) => number, x: number) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
close(derivative((w) => 0.5 * (2 * w - 3) ** 2, 1), -2, "Scalar chain rule");
close(1 - 0.1 * -2, 1.2, "SGD update");
const targets = [-2, -2, -6, -6, -6, -6, -6, -6];
const objective = (w: number) => targets.reduce((sum, y) => sum + 0.5 * (w - y) ** 2, 0) / targets.length;
close(derivative(objective, 0), 5, "Unequal-count global mean");
close((2 * 2 + 6 * 6) / 8, derivative(objective, 0), "Weighted gradient aggregation");
assert.notEqual((2 + 6) / 2, 5, "Mean of local means must fail this asymmetric test");
const localLossSums = [targets.slice(0, 2), targets.slice(2)];
const averagedWrapperObjective = (w: number) => localLossSums.reduce((sum, group) =>
  sum + group.reduce((s, y) => s + 0.5 * (w - y) ** 2, 0) * 2 / targets.length, 0) / 2;
close(derivative(averagedWrapperObjective, 0), derivative(objective, 0), "p/N scaling under rank averaging");
close(10e-6 + 1e6 / 25e9, 50e-6, "Latency plus bandwidth");
close(100 * 10e-6 + 1e6 / 25e9, 0.00104, "Many small-message startups");

// Simulate both phases of a ring and compare with a direct sum for multiple group sizes.
for (const p of [2, 4, 8]) {
  const n = p * 3, chunk = n / p;
  let ranks = Array.from({ length: p }, (_, r) => Array.from({ length: n }, (_, j) => r * n + j + 1));
  const direct = Array.from({ length: n }, (_, j) => ranks.reduce((s, r) => s + r[j], 0));
  const sent = Array(p).fill(0);
  for (let step = 0; step < p - 1; step++) {
    const previous = ranks.map((r) => [...r]);
    ranks = previous.map((r, rank) => {
      const source = (rank - 1 + p) % p;
      const index = (rank - step - 1 + p) % p;
      const next = [...r];
      for (let j = index * chunk; j < (index + 1) * chunk; j++) next[j] += previous[source][j];
      sent[rank] += chunk * 4;
      return next;
    });
  }
  for (let step = 0; step < p - 1; step++) {
    const previous = ranks.map((r) => [...r]);
    ranks = previous.map((r, rank) => {
      const source = (rank - 1 + p) % p, index = (rank - step + p) % p, next = [...r];
      for (let j = index * chunk; j < (index + 1) * chunk; j++) next[j] = previous[source][j];
      sent[rank] += chunk * 4;
      return next;
    });
  }
  ranks.forEach((r) => assert.deepEqual(r, direct, "Ring result"));
  sent.forEach((v) => close(v, 2 * (p - 1) / p * n * 4, "Per-rank ring sent bytes"));
}
close(2 * 3 / 4 * 120, 180, "Worked ring megabytes");

type Matrix = number[][];
const transpose = (a: Matrix): Matrix => a[0].map((_, j) => a.map((row) => row[j]));
const matmul = (a: Matrix, b: Matrix): Matrix => a.map((row) =>
  b[0].map((_, j) => row.reduce((sum, value, k) => sum + value * b[k][j], 0)));
const add = (a: Matrix, b: Matrix): Matrix => a.map((row, i) => row.map((v, j) => v + b[i][j]));
const x = [[1, 2, 3, 4], [-1, 0, 2, 1]];
const w = [[1, 0, 2, 1], [2, 3, 0, 1], [1, -1, 2, 0], [0, 2, 1, 3]];
const g = [[1, 2, -1, 3], [2, 0, 1, -2]];
const full = matmul(x, w);
const column0 = matmul(x, w.map((r) => r.slice(0, 2)));
const column1 = matmul(x, w.map((r) => r.slice(2)));
assert.deepEqual(column0.map((r, i) => [...r, ...column1[i]]), full, "Column-partitioned outputs");
assert.deepEqual(add(matmul(x.map((r) => r.slice(0, 2)), w.slice(0, 2)),
  matmul(x.map((r) => r.slice(2)), w.slice(2))), full, "Row-partitioned partial sums");
const dx = matmul(g, transpose(w));
assert.deepEqual(add(matmul(g.map((r) => r.slice(0, 2)), transpose(w.map((r) => r.slice(0, 2)))),
  matmul(g.map((r) => r.slice(2)), transpose(w.map((r) => r.slice(2))))), dx, "Backward input-gradient reduction");
for (let i = 0; i < x.length; i++) {
  for (let j = 0; j < x[0].length; j++) {
    const loss = (value: number) => {
      const changed = x.map((row) => [...row]); changed[i][j] = value;
      return matmul(changed, w).reduce((sum, row, r) => sum + row.reduce((s, v, c) => s + v * g[r][c], 0), 0);
    };
    close(derivative(loss, x[i][j]), dx[i][j], "Matrix backward finite difference");
  }
}
// Stable attention combination agrees with a direct softmax across remote blocks.
const scores = [1000, 1001, 999, 1002], values = [1, 4, -2, 3];
const maximum = Math.max(...scores);
const directAttention = scores.reduce((sum, score, i) => sum + Math.exp(score - maximum) * values[i], 0)
  / scores.reduce((sum, score) => sum + Math.exp(score - maximum), 0);
const blocks = [[0, 1], [2, 3]].map((indices) => {
  const m = Math.max(...indices.map((i) => scores[i]));
  return { m, l: indices.reduce((sum, i) => sum + Math.exp(scores[i] - m), 0),
    u: indices.reduce((sum, i) => sum + Math.exp(scores[i] - m) * values[i], 0) };
});
const combined = blocks.reduce((sum, block) => sum + Math.exp(block.m - maximum) * block.u, 0)
  / blocks.reduce((sum, block) => sum + Math.exp(block.m - maximum) * block.l, 0);
close(combined, directAttention, "Stable distributed attention blocks");
close((1 + 2 * 4) / 3, 3, "Attention blocks cannot average local normalized outputs");
assert.equal(2 + 2 + 4 + 4 + 4, 16, "Explicit mixed-precision ledger");
close(16 / 8, 2, "Ideal sharded bytes per parameter");
close(2 * 4 / 25, 0.32, "Offload round trip in seconds");
close(8 / (8 + 4 - 1), 8 / 11, "Balanced pipeline utilization");
assert.equal(Math.ceil(1.25 * 12 / 4), 4, "Expert capacity");
assert.equal([6, 2, 2, 2].reduce((s, load) => s + Math.max(0, load - 4), 0), 2, "Overflow despite idle expert capacity");
assert.equal(2 * 4 * 8, 64, "Hybrid global batch");
close(1 / (0.05 + 0.95 / 8), 5.925925925925926, "Amdahl bound");
close(20 + 12 - 8, 24, "Exposed communication");
close((10 + 10 + 10 + 30) / (4 * 30), 0.5, "Straggler utilization");
close(Math.hypot(3, 4), 5, "Unique global gradient norm");
close(Math.hypot(3 / 5, 4 / 5), 1, "Global norm clipping");
assert.ok(Math.hypot(1, 1) > 1, "Independent shard clipping violates global threshold");
const checkpointCost = (interval: number) => 10 / interval + interval / (2 * 3600);
const optimum = Math.sqrt(2 * 10 * 3600);
close(optimum, 268.32815729997475, "Checkpoint interval");
assert.ok(checkpointCost(optimum) < checkpointCost(optimum / 2));
assert.ok(checkpointCost(optimum) < checkpointCost(optimum * 2));
close(80 * 0.1, 8, "Little's law");
const cache = 2 * 32 * 8 * 128 * 2 * 4096;
assert.equal(cache, 536870912);
assert.equal(cache / 2 ** 20, 512, "Cache mebibytes");
assert.equal(cache * 8 / 2 ** 30, 4, "Eight-request gibibytes");
close(cache / 25e9 * 1000, 21.47483648, "Disaggregated cache handoff milliseconds");
assert.equal(Math.ceil(17 / 16) * 16 - 17, 15, "Paged final-block waste");
assert.ok(sources.get("prefill-decode-and-kv-cache")?.includes("536,870,912"), "Keep cache exercise and text aligned");
assert.ok(sources.get("collective-communication")?.includes("180 megabytes"), "Keep ring exercise and text aligned");

if (process.argv.includes("--export")) {
  const readPage = (url: string) => fs.readFileSync(path.join("out", url.slice(1) + ".html"), "utf8");
  const hub = readPage(DISTRIBUTED_ML_PATH);
  const sitemap = fs.readFileSync("out/sitemap.xml", "utf8");
  const valid = new Set([DISTRIBUTED_ML_PATH, ...distributedTopics.map((t) => DISTRIBUTED_ML_PATH + "/" + t.id)]);
  assert.ok(hub.includes("28") && hub.includes("Study Guide"));
  assert.ok(sitemap.includes(DISTRIBUTED_ML_PATH + "</loc>"));
  assert.doesNotMatch(hub, /How the Google ML domain interview works|Interview probe:/i);
  for (const [i, topic] of distributedTopics.entries()) {
    const url = DISTRIBUTED_ML_PATH + "/" + topic.id;
    const html = readPage(url);
    assert.ok(hub.includes('href="' + url + '"'), topic.id + ": not linked from hub");
    assert.ok(html.includes('<article aria-label="Full lesson"'), topic.id + ": missing lesson");
    assert.ok(!html.includes("katex-error"), topic.id + ": failed math rendering");
    assert.ok(html.includes('href="' + DISTRIBUTED_ML_PATH + "#"), topic.id + ": missing return link");
    assert.match(html, new RegExp('<link rel="canonical" href="[^"]*' + url + '"'));
    assert.ok(sitemap.includes(url + "</loc>"), topic.id + ": missing sitemap entry");
    assert.doesNotMatch(html, /INTERVIEW-READY OVERVIEW|Interview probe:|Further Reading|Revision Sheet/);
    for (const match of html.matchAll(/href="(\/mldomain\/distributed[^"\s]*)"/g)) {
      assert.ok(valid.has(match[1].split(/[?#]/)[0]), topic.id + ": invalid internal link " + match[1]);
    }
    for (const prerequisite of topic.prerequisites) {
      assert.ok(html.includes('href="' + DISTRIBUTED_ML_PATH + "/" + prerequisite + '"'));
    }
    if (i > 0) assert.ok(html.includes('href="' + DISTRIBUTED_ML_PATH + "/" + distributedTopics[i - 1].id + '"'));
    if (i < distributedTopics.length - 1) assert.ok(html.includes('href="' + DISTRIBUTED_ML_PATH + "/" + distributedTopics[i + 1].id + '"'));
  }
  assert.ok(readPage("/mldomain/deeplearning").includes('href="' + DISTRIBUTED_ML_PATH + '"'), "Guide switch link missing");
  console.log("Static export verified: hub, 28 lessons, prerequisites, navigation, canonical URLs, sitemap, domain switch.");
}
console.log("Distributed ML guide: " + JSON.stringify({ lessons: distributedTopics.length, words, sections: sectionsTotal, equations, tables, diagrams, examples: code.length }));
console.log("Passed: Python syntax, finite-difference gradients, weighted aggregation, ring simulation, tensor layouts, memory, scaling, clipping, recovery-cost and serving calculations.");
