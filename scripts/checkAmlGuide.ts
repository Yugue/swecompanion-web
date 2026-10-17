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

const topics = amlParts.flatMap(p => p.topics), used = new Set<string>();
assert.equal(topics.length, 46); assert.equal(new Set(topics.map(t => t.id)).size, 46);
const dir = path.join(process.cwd(), "src/content/aml-lessons");
assert.deepEqual(fs.readdirSync(dir).filter(f => f.endsWith(".md")).sort(), topics.map(t => `${t.id}.md`).sort());
let tables = 0, equations = 0, illustratedChapters = 0;
for (const topic of topics) {
  const source = fs.readFileSync(path.join(dir, `${topic.id}.md`), "utf8"), blocks = getLessonBlocks(topic.id, "aml");
  assert.ok(source.startsWith("## "), `${topic.id}: missing source title`);
  const sections = blocks.filter(b => b.type === "heading2").map(b => b.text.match(/^(\d+)\. /)?.[1]);
  assert.ok(sections.length >= 3 && sections.every((n, i) => Number(n) === i + 1), `${topic.id}: sections must be numbered in sequence`);
  assert.equal((source.match(/^```/gm) ?? []).length % 2, 0, `${topic.id}: unclosed fence`);
  assert.equal((source.match(/^\\\[$/gm) ?? []).length, (source.match(/^\\\]$/gm) ?? []).length, `${topic.id}: unclosed display math`);
  const inlineSource = source.replace(/\\\[[\s\S]*?\\\]/g, "");
  assert.equal((inlineSource.match(/\\\(/g) ?? []).length, (inlineSource.match(/\\\)/g) ?? []).length, `${topic.id}: unclosed inline math`);
  assert.ok(!/genui|Builds on|Chapter goal|What matters most/.test(source), `${topic.id}: unresolved placeholder or repeated scaffolding`);
  assert.ok(topic.summary && topic.keyPoints.length === 3 && topic.interviewPrompt, `${topic.id}: incomplete overview`);
  const figures = blocks.filter(b => b.type === "aml-visual");
  if (figures.length) illustratedChapters++;
  for (const block of blocks) {
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
    if (block.type !== "code" && block.type !== "diagram") for (const token of parseInline(block.text)) {
      if (token.kind === "math") { katex.renderToString(token.text, { throwOnError: true, strict: false }); equations++; }
    }
  }
  if (process.argv.includes("--export")) {
    const lessonPath = `/mldomain/appliedml/${topic.id}`;
    const html = fs.readFileSync(path.join(process.cwd(), "out", `${lessonPath.slice(1)}.html`), "utf8");
    assert.ok(!html.includes("katex-error") && html.includes("FULL LESSON"), `${topic.id}: missing or invalid exported lesson`);
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
console.log(`Applied ML validated: ${topics.length} chapters, ${used.size} figures across ${illustratedChapters} chapters, ${tables} tables and ${equations} math expressions. Numerical examples and parser compatibility passed${process.argv.includes("--export") ? "; exported pages, links, canonical URLs and sitemap passed" : ""}.`);
