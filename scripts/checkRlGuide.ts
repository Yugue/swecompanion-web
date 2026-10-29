import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { rlParts, rlTopics, rlLessonNumbers } from "../src/lib/rlStudyData";
import { getLessonBlocks, lessonExists } from "../src/lib/getLessonBlocks";
import { parseInline, parseTableRows } from "../src/lib/lessonParser";
import { ML_DOMAINS, RL_PATH } from "../src/lib/mlDomains";
import { ICONS } from "../src/lib/icons";

assert.deepEqual(rlParts.map((p) => p.topics.length), [6, 6, 4, 5, 6, 6]);
assert.equal(new Set(rlParts.map((p) => p.id)).size, 6);
assert.equal(rlTopics.length, 33);
assert.equal(new Set(rlTopics.map((t) => t.id)).size, 33);
assert.equal(ML_DOMAINS.find((d) => d.name === "Reinforcement Learning")?.href, RL_PATH);
const directory = path.join(process.cwd(), "src/content/rl-lessons");
assert.deepEqual(fs.readdirSync(directory).filter((f) => f.endsWith(".md")).sort(),
  rlTopics.map((t) => t.id + ".md").sort());

let equations = 0, tables = 0, diagrams = 0, examples = 0, words = 0;
const seen = new Set<string>();
const paragraphs = new Map<string, string>();
for (const topic of rlTopics) {
  assert.ok(lessonExists(topic.id, "rl"));
  assert.ok(topic.summary && topic.keyPoints.length >= 2 && topic.interviewPrompt);
  const source = fs.readFileSync(path.join(directory, topic.id + ".md"), "utf8");
  assert.ok(source.startsWith("# " + rlLessonNumbers[topic.id] + " " + topic.title + "\n"));
  assert.doesNotMatch(source, /\b(?:TODO|TBD|coming soon)\b/i);
  assert.doesNotMatch(source, /^#.*\b7\.\d/m, "Removed revision Part must not reappear");
  assert.doesNotMatch(source, /Further reading|Interview reasoning|\*\*(?:Prompt|Reasoning):\*\*/i);
  const count = source.split(/\s+/).filter(Boolean).length;
  assert.ok(count >= 400 && count <= 1100, `${topic.id}: lesson length ${count}`);
  words += count;
  const sections = [...source.matchAll(/^## (\d+)\. /gm)].map((m) => Number(m[1]));
  assert.ok(sections.length >= 7 && sections.length <= 12, topic.id + ": section count");
  assert.deepEqual(sections, sections.map((_, i) => i + 1), topic.id + ": section numbering");
  assert.equal((source.match(/^```/gm) ?? []).length % 2, 0, topic.id + ": unclosed code fence");
  assert.equal((source.match(/^\\\[$/gm) ?? []).length, (source.match(/^\\\]$/gm) ?? []).length);
  for (const prerequisite of topic.prerequisites) {
    assert.ok(seen.has(prerequisite), `${topic.id}: prerequisite must precede lesson: ${prerequisite}`);
  }
  seen.add(topic.id);
  for (const block of getLessonBlocks(topic.id, "rl")) {
    if (block.type === "math") {
      katex.renderToString(block.text, { throwOnError: true, strict: false });
      equations++;
    } else if (block.type === "table") {
      const rows = parseTableRows(block.text);
      assert.ok(rows.length >= 2);
      assert.ok(rows.every((row) => row.length === rows[0].length), topic.id + ": uneven table");
      tables++;
    } else if (block.type === "diagram") diagrams++;
    else if (block.type === "code") {
      assert.ok(block.text.split("\n").length <= 5, topic.id + ": code exceeds five lines");
      examples++;
    }
    if (["paragraph", "bullet", "table", "heading2"].includes(block.type)) {
      for (const token of parseInline(block.text)) {
        if (token.kind === "math") katex.renderToString(token.text, { throwOnError: true, strict: false });
      }
    }
    if (block.type === "paragraph" && block.text.split(/\s+/).length >= 25) {
      assert.ok(!paragraphs.has(block.text), `${topic.id}: repeated prose from ${paragraphs.get(block.text)}`);
      paragraphs.set(block.text, topic.id);
    }
  }
}
for (const part of rlParts) {
  assert.ok(ICONS[part.icon], "Unregistered icon: " + part.icon);
  assert.equal(part.quizQuestionCount, 0, "Do not advertise unavailable quizzes");
}
assert.ok(equations >= 45 && tables >= 20 && diagrams >= 12 && examples >= 8);

// Independent numerical checks of the worked examples and learning mechanisms.
const close = (actual: number, expected: number, label: string, tolerance = 1e-9) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${label}: ${actual} != ${expected}`);
const discounted = (rewards: number[], gamma: number) => rewards.reduce((sum, r, t) => sum + gamma ** t * r, 0);
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const derivative = (f: (x: number) => number, x: number) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
close(discounted([2, 0, 10], 0.9), 10.1, "Discounted return");
close(0.75 * (2 + 0.9 * 4) + 0.25 * -2, 3.7, "Stochastic Bellman backup");
close(4 + 0.2 * (1 + 0.9 * 6 - 4), 4.48, "TD prediction");
close(1 + 0.9 * 2 + 0.9 ** 2 * 5, 6.85, "Two-step target");
close(2 + 0.1 * (1 + 0.9 * (0.8 * 4 + 0.2 * 0) - 2), 2.188, "Expected SARSA");
close(2 + 0.1 * (1 + 0.9 * 4 - 2), 2.26, "Q-learning");
close(1 + 0.9 * 5, 5.5, "Continuing target");
close(1 + 0.9 * 0, 1, "Terminal target");
let tail = 0, start = 0;
for (let i = 0; i < 1000; i++) { start = 1 + 0.9 * tail; tail = 2 + 0.9 * tail; }
close(tail, 20, "Known-model fixed point");
close(start, 19, "Predecessor fixed point");
const gradientByScores = (baseline: number) => 0.5 * (5 - baseline) * 0.5 + 0.5 * (1 - baseline) * -0.5;
close(gradientByScores(0), derivative((z) => 1 + 4 * sigmoid(z), 0), "Score gradient matches finite differences");
close(gradientByScores(7), gradientByScores(0), "Baseline leaves expected gradient unchanged");
// Enumerate two binary decisions with terminal reward only for two action-ones.
const p = sigmoid(0.3), gamma = 0.9;
const scoreGradient = p * p * gamma * 2 * (1 - p);
close(scoreGradient, derivative((z) => gamma * sigmoid(z) ** 2, 0.3), "Discounted policy gradient");
close(derivative((theta) => -((theta * 2 - 2) ** 2), 0.5), 4, "Deterministic actor chain rule");
close(1 + 0.9 * 0.8 * 2, 2.44, "GAE mixture");
const deltas = [1 + 0.9 * 6 - 4, 3 - 6];
close(deltas[0] + 0.9 * deltas[1], discounted([1, 3], 0.9) - 4, "Lambda-one telescoping");
const clipped = (ratio: number, advantage: number) => Math.min(ratio * advantage, Math.max(0.8, Math.min(1.2, ratio)) * advantage);
close(clipped(1.5, 2), 2.4, "PPO positive-advantage clipping");
close(clipped(0.5, -2), -1.6, "PPO negative-advantage clipping");
close(derivative((ratio) => clipped(ratio, 2), 1.5), 0, "Clipped sample removes improvement incentive");
close(1 + 0.9 * Math.min(8, 5), 5.5, "Twin-critic target");
close(1 + 0.9 * (5 - 0.2 * -1), 5.68, "Soft target");
close(0.8 * (1 / (2 * 0.8)) * 4 + 0.2 * (1 / (2 * 0.2)) * 9, 6.5, "Replay inverse-probability correction");
const r = [1, 2, 5], potential = [-3, -2, -1, 0];
const shaped = r.map((reward, t) => reward + 0.9 * potential[t + 1] - potential[t]);
close(discounted(shaped, 0.9), discounted(r, 0.9) - potential[0], "Potential shaping telescopes");
close(0.9 * -2 - -3, 1.2, "Worked shaping bonus");
const actionRewards = [4, 0], behavior = [0.5, 0.5], target = [0.75, 0.25], q = [2, 5];
const isEstimate = behavior.reduce((sum, b, a) => sum + b * target[a] / b * actionRewards[a], 0);
const modelValue = target.reduce((sum, probability, a) => sum + probability * q[a], 0);
const drEstimate = modelValue + behavior.reduce((sum, b, a) => sum + b * target[a] / b * (actionRewards[a] - q[a]), 0);
close(isEstimate, 3, "Importance evaluation");
close(drEstimate, 3, "Doubly robust residual correction");
assert.equal(2 * 64 * 4 + 4 + 4 + 2, 522, "Transition memory estimate");

if (process.argv.includes("--export")) {
  const hubPath = RL_PATH.slice(1);
  const hub = fs.readFileSync(path.join("out", hubPath + ".html"), "utf8");
  assert.ok(hub.includes("33") && hub.includes("Reinforcement Learning"));
  const sitemap = fs.readFileSync("out/sitemap.xml", "utf8");
  assert.ok(sitemap.includes(RL_PATH + "</loc>"));
  const validPaths = new Set([RL_PATH, ...rlTopics.map((t) => `${RL_PATH}/${t.id}`)]);
  for (const topic of rlTopics) {
    const lessonPath = `${RL_PATH}/${topic.id}`;
    const html = fs.readFileSync(path.join("out", lessonPath.slice(1) + ".html"), "utf8");
    assert.ok(html.includes('<article aria-label="Full lesson"'), topic.id + ": missing content");
    assert.doesNotMatch(html, /Further reading|Interview reasoning|Reasoning:/i, topic.id + ": removed sections still exported");
    assert.ok(!html.includes("katex-error"), topic.id + ": failed equation");
    assert.match(html, /<link rel="canonical" href="[^"]+"/);
    assert.ok(html.includes(`href="${RL_PATH}#`), topic.id + ": missing curriculum return");
    assert.ok(sitemap.includes(lessonPath + "</loc>"), topic.id + ": absent from sitemap");
    for (const match of html.matchAll(/href="(\/mldomain\/rl[^"\s]*)"/g)) {
      assert.ok(validPaths.has(match[1].split(/[?#]/)[0]), topic.id + ": invalid internal link");
    }
    const index = rlTopics.indexOf(topic);
    if (index > 0) assert.ok(html.includes(`href="${RL_PATH}/${rlTopics[index - 1].id}"`));
    if (index < rlTopics.length - 1) assert.ok(html.includes(`href="${RL_PATH}/${rlTopics[index + 1].id}"`));
  }
  console.log("Static export verified: RL hub, 33 lessons, equations, navigation, canonicals, sitemap; removed sections absent.");
}
console.log("RL guide: " + JSON.stringify({ lessons: rlTopics.length, words, equations, tables, diagrams, examples }));
console.log("Numerical checks passed: backups, policy gradients, baselines, GAE, PPO, TD3, SAC, shaping, replay and OPE.");
