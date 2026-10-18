import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { amlParts, amlTopicsById } from "../src/lib/amlStudyData";
import { amlVisualIds, amlVisuals, isAmlVisualId, type AmlVisualSpec } from "../src/lib/amlVisuals";
import { clockPoint, curvePoints, dbscanRoles, distance, initialCenters, kmeansPoints, kmeansStep, l1Solution, l2Solution, mixtureParts, neighborPoints, pcaPoints, projectDiagonal, rankingSummaries, regularizationTarget, sigmoid } from "../src/lib/amlVisualMath";
import { getLessonBlocks } from "../src/lib/getLessonBlocks";
import { parseInline, parseLesson, parseTableRows } from "../src/lib/lessonParser";
import { isCvVisualId } from "../src/lib/cvVisuals";
import { isDlVisualId } from "../src/lib/dlVisuals";

const close = (a: number, b: number, tolerance = 1e-9) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
// Check the mathematical claims that the diagrams teach, including direction changes.
assert.ok(distance([10000, 1], [0, 0]) > distance([2000, 20], [0, 0]));
assert.ok(distance([1, 0.1], [0, 0]) < distance([0.2, 2], [0, 0]));
close(distance(clockPoint(0), clockPoint(23)), 2 * Math.sin(Math.PI / 24));
close(distance(clockPoint(0), clockPoint(12)), 2);
const mean = pcaPoints.reduce((s, p) => [s[0] + p[0] / pcaPoints.length, s[1] + p[1] / pcaPoints.length], [0, 0]);
close(mean[0], 0); close(mean[1], 0);
const xx = pcaPoints.reduce((s, p) => s + p[0] ** 2, 0), yy = pcaPoints.reduce((s, p) => s + p[1] ** 2, 0), xy = pcaPoints.reduce((s, p) => s + p[0] * p[1], 0);
close(xx, yy); assert.ok(xy > 0); // (1, 1) is the leading eigenvector for this cloud.
for (const p of pcaPoints) {
  const z = projectDiagonal(p), projection = [z / Math.SQRT2, z / Math.SQRT2];
  close((p[0] - projection[0]) + (p[1] - projection[1]), 0); // Projection residual is perpendicular.
}
close(sigmoid(0), 0.5); close(sigmoid(2), 0.8807970779778823);
const residuals = [[50, 180], [70, 250], [90, 310], [120, 390]].map(([x, y]) => y - (3 * x + 40));
assert.deepEqual(residuals, [-10, 0, 0, -10]); close(residuals.reduce((s, r) => s + r * r, 0), 200);
const nearest = [...neighborPoints].sort((a, b) => distance(a.point, [0, 0]) - distance(b.point, [0, 0])).slice(0, 3);
assert.equal(nearest.filter(v => v.positive).length, 2);
close(l1Solution.reduce((s, v) => s + Math.abs(v), 0), 1); close(Math.hypot(...l2Solution), 1);
// Check constrained optima against a dense sweep of their boundaries.
for (let i = 0; i <= 10000; i++) {
  const t = i / 10000 * 2 * Math.PI;
  assert.ok(distance(l2Solution, regularizationTarget) <= distance([Math.cos(t), Math.sin(t)], regularizationTarget) + 1e-9);
  const u = i / 10000 * 2 - 1;
  for (const sign of [-1, 1]) assert.ok(distance(l1Solution, regularizationTarget) <= distance([u, sign * (1 - Math.abs(u))], regularizationTarget) + 1e-9);
}
const curves = curvePoints(), selected = curves.find(v => v.threshold === 0.7)!;
assert.equal(selected.tp, 2); assert.equal(selected.fp, 1); close(selected.recall, 2 / 3); close(selected.fpr, 1 / 3); close(selected.precision, 2 / 3);
close(rankingSummaries().auc, 2 / 3); close(rankingSummaries().ap, (1 + 2 / 3 + 3 / 5) / 3);
const step = kmeansStep(kmeansPoints, initialCenters);
assert.deepEqual(step.assignments, [0, 0, 0, 1, 1, 1]);
close(step.updated[0][0], 4 / 3); close(step.updated[0][1], 4 / 3); close(step.updated[1][0], 22 / 3); close(step.updated[1][1], 19 / 3);
const inertia = (centers: readonly (readonly [number, number])[]) => kmeansPoints.reduce((s, p, i) => s + distance(p, centers[step.assignments[i]]) ** 2, 0);
assert.ok(inertia(step.updated) < inertia(initialCenters));
assert.deepEqual(dbscanRoles(), ["core", "core", "core", "core", "core", "border", "noise", "noise"]);
close(mixtureParts(0)[0], mixtureParts(0)[1]);
let area = 0;
for (let i = 0; i < 10000; i++) area += mixtureParts(-10 + (i + 0.5) * 0.002).reduce((a, b) => a + b, 0) * 0.002;
close(area, 1, 1e-7); close(0.2 + 0.15 - 0.05 + 0.1, 0.4);

// Independently check the worked lesson arithmetic and fitting directions.
const etaErrors = [1, 1, 7];
close(etaErrors.reduce((sum, e) => sum + Math.abs(e), 0) / 3, 3);
close(Math.sqrt(etaErrors.reduce((sum, e) => sum + e * e, 0) / 3), Math.sqrt(17));
close((80 + 9800) / 10000, 0.988); close(9900 / 10000, 0.99);
close((4 * 0.5 + 6 * 0.1) / (4 + 6), 0.26);
const gini = (proportions: number[]) => 1 - proportions.reduce((sum, p) => sum + p * p, 0);
close(gini([0.5, 0.5]) - (gini([0.9, 0.1]) + gini([0.1, 0.9])) / 2, 0.32);
close(0.04 / (0.04 + 0.0008), 0.9803921568627451);
const logLoss = (score: number, label: number) => Math.log1p(Math.exp(score)) - label * score;
const squaredProbabilityLoss = (score: number, label: number) => (sigmoid(score) - label) ** 2;
for (const score of [-2, 0, 2]) for (const label of [0, 1]) {
  const epsilon = 1e-5;
  close((logLoss(score + epsilon, label) - logLoss(score - epsilon, label)) / (2 * epsilon), sigmoid(score) - label, 1e-8);
  const probability = sigmoid(score);
  close((squaredProbabilityLoss(score + epsilon, label) - squaredProbabilityLoss(score - epsilon, label)) / (2 * epsilon), 2 * (probability - label) * probability * (1 - probability), 1e-8);
}
close(-Math.log(0.9), 0.10536051565782628); close(-Math.log(0.1), 2.3025850929940455);
close(Math.log(2), 0.6931471805599453);
const scalarObjective = (w: number) => (w - 3) ** 2, nextWeight = 1 - 0.1 * (2 * (1 - 3));
close(nextWeight, 1.4); close(scalarObjective(nextWeight), 2.56);
assert.ok(scalarObjective(nextWeight) < scalarObjective(1));
const numericTargets = [1, 1, 10], constantLoss = (prediction: number, power: number) => numericTargets.reduce((sum, target) => sum + Math.abs(prediction - target) ** power, 0);
assert.ok(constantLoss(4, 2) < constantLoss(1, 2)); assert.ok(constantLoss(1, 1) < constantLoss(4, 1));
const quantileLoss = (residual: number, q: number) => residual >= 0 ? q * residual : (q - 1) * residual;
close(quantileLoss(10, 0.8), 8); close(quantileLoss(-10, 0.8), 2);
assert.deepEqual([50, -50, 0].map((_, i) => 250 + 0.1 * [40, -40, 0][i]), [254, 246, 250]);
close(2000 / 3000, 2 / 3); close(10000 / 1000000, 0.01); close(2000 / 12000, 1 / 6);
close(370 / 420, 0.8809523809523809); close((5 - 2) / 5, 0.6);
assert.equal(5 ** 4, 625); assert.equal(30 * 5, 150);
assert.equal(10_000_000 * 0.001, 10000); assert.equal(8 + 2 + 3 + 4, 17);

const topics = amlParts.flatMap(p => p.topics), used = new Set<string>();
const teachingParagraphs = new Map<string, string>();
assert.deepEqual(amlParts.map(part => part.topics.length), [10, 6, 8, 6, 5, 5, 6]);
assert.equal(topics.length, 46); assert.equal(new Set(topics.map(t => t.id)).size, 46);
const dir = path.join(process.cwd(), "src/content/aml-lessons");
assert.deepEqual(fs.readdirSync(dir).filter(f => f.endsWith(".md")).sort(), topics.map(t => `${t.id}.md`).sort());
let tables = 0, equations = 0, illustratedChapters = 0, words = 0, sectionsChecked = 0;
for (const topic of topics) {
  const source = fs.readFileSync(path.join(dir, `${topic.id}.md`), "utf8"), blocks = getLessonBlocks(topic.id, "aml");
  words += source.trim().split(/\s+/).length;
  assert.ok(source.startsWith("## "), `${topic.id}: missing source title`);
  const sections = blocks.filter(b => b.type === "heading2").map(b => b.text.match(/^(\d+)\. /)?.[1]);
  assert.ok(sections.length >= 6 && sections.length <= 12 && sections.every((n, i) => Number(n) === i + 1), `${topic.id}: use 6–12 sequential short sections`);
  sectionsChecked += sections.length;
  const lastSection = blocks.findLastIndex(block => block.type === "heading2");
  assert.match(blocks[lastSection].text, /^\d+\. Interview reasoning$/, `${topic.id}: end with interview reasoning`);
  assert.deepEqual(blocks.slice(lastSection + 1).map(block => block.type), ["paragraph", "paragraph"], `${topic.id}: end with one question and one answer`);
  assert.ok(blocks[lastSection + 1].text.startsWith("**Question:**") && blocks[lastSection + 2].text.startsWith("**Answer:**"), `${topic.id}: missing reasoning prompt or answer`);
  assert.equal((source.match(/^```/gm) ?? []).length % 2, 0, `${topic.id}: unclosed fence`);
  assert.equal((source.match(/^\\\[$/gm) ?? []).length, (source.match(/^\\\]$/gm) ?? []).length, `${topic.id}: unclosed display math`);
  const inlineSource = source.replace(/\\\[[\s\S]*?\\\]/g, "");
  assert.equal((inlineSource.match(/\\\(/g) ?? []).length, (inlineSource.match(/\\\)/g) ?? []).length, `${topic.id}: unclosed inline math`);
  assert.ok(!/genui|Builds on|Chapter goal|What matters most/.test(source), `${topic.id}: unresolved placeholder or repeated scaffolding`);
  assert.ok(topic.summary && topic.keyPoints.length === 3 && topic.interviewPrompt, `${topic.id}: incomplete overview`);
  const figures = blocks.filter(b => b.type === "aml-visual");
  if (figures.length) illustratedChapters++;
  for (const block of blocks) {
    if (block.type === "paragraph" || block.type === "quote") {
      const paragraphWords = block.text.trim().split(/\s+/).length;
      assert.ok(paragraphWords <= 65, `${topic.id}: split a ${paragraphWords}-word prose block`);
      if (paragraphWords >= 18) {
        const normalized = block.text.toLowerCase().replace(/\s+/g, " ").trim();
        assert.ok(!teachingParagraphs.has(normalized), `${topic.id}: repeated teaching paragraph from ${teachingParagraphs.get(normalized)}`);
        teachingParagraphs.set(normalized, topic.id);
      }
    }
    if (block.type === "code") assert.ok(block.text.split("\n").length <= 5, `${topic.id}: keep operation examples to five lines`);
    if (block.type === "math") { katex.renderToString(block.text, { throwOnError: true, strict: false }); equations++; }
    if (block.type === "table") {
      const rows = parseTableRows(block.text);
      assert.ok(rows.length > 1 && rows.every(r => r.length === rows[0].length), `${topic.id}: uneven table columns`);
      tables++;
    }
    if (block.type === "aml-visual") {
      const id = block.text.trim(); assert.ok(isAmlVisualId(id), `${topic.id}: unknown visual ${id}`);
      assert.ok(!used.has(id), `${topic.id}: repeated figure`); used.add(id);
    }
    if (!["code", "diagram", "math"].includes(block.type)) for (const token of parseInline(block.text)) {
      if (token.kind === "math") { katex.renderToString(token.text, { throwOnError: true, strict: false }); equations++; }
    }
  }
  if (process.argv.includes("--export")) {
    const lessonPath = `/mldomain/appliedml/${topic.id}`;
    const html = fs.readFileSync(path.join(process.cwd(), "out", `${lessonPath.slice(1)}.html`), "utf8");
    assert.ok(!html.includes("katex-error") && html.includes("FULL LESSON"), `${topic.id}: missing or invalid exported lesson`);
    const overviewIndex = html.indexOf("INTERVIEW-READY OVERVIEW");
    assert.ok(overviewIndex >= 0 && overviewIndex < html.indexOf("FULL LESSON") && html.includes("Interview probe:"), `${topic.id}: missing interview-ready overview before lesson`);
    assert.ok(html.includes('<article aria-label="Full lesson"'), `${topic.id}: missing lesson article`);
    assert.ok(html.includes('rel="canonical"') && html.includes(lessonPath), `${topic.id}: missing canonical`);
    for (const figure of figures) assert.ok(html.includes(`data-aml-visual="${figure.text.trim()}"`) && html.includes('role="img"'), `${topic.id}: missing exported accessible figure`);
    for (const match of html.matchAll(/href="\/mldomain\/appliedml\/([^"?#/]+)"/g)) assert.ok(amlTopicsById[match[1]], `${topic.id}: broken chapter link`);
  }
}
assert.deepEqual([...used].sort(), [...amlVisualIds].sort());
for (const spec of Object.values(amlVisuals) as AmlVisualSpec[]) {
  assert.ok(spec.title && spec.caption && spec.alt);
  assert.ok(!(spec.sharedCv && spec.sharedDl));
  if (spec.sharedCv) assert.ok(isCvVisualId(spec.sharedCv));
  if (spec.sharedDl) assert.ok(isDlVisualId(spec.sharedDl));
}
assert.equal(parseLesson("# Title\n\n```aml-visual\npca-projection\n```")[0].type, "aml-visual");
assert.equal(parseLesson("# Title\n\n```dl-visual\nrope\n```")[0].type, "dl-visual");
assert.equal(parseLesson("# Title\n\n```cv-visual\nconvolution\n```")[0].type, "visual");
if (process.argv.includes("--export")) {
  const sitemap = fs.readFileSync(path.join(process.cwd(), "out/sitemap.xml"), "utf8");
  for (const topic of topics) assert.ok(sitemap.includes(`/mldomain/appliedml/${topic.id}</loc>`));
}
console.log(`Applied ML validated: ${topics.length} chapters, ${sectionsChecked} short sections with closing reasoning prompts, ${used.size} figures across ${illustratedChapters} chapters, ${tables} tables, ${equations} math expressions and ${words.toLocaleString("en-US")} source words. Duplicate-paragraph, numerical and parser checks passed${process.argv.includes("--export") ? "; exported pages, links, canonical URLs and sitemap passed" : ""}.`);
