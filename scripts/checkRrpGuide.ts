import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { rrpParts, rrpTopicsById } from "../src/lib/rrpStudyData";
import { rrpVisualIds, rrpVisuals, isRrpVisualId, type RrpVisualSpec } from "../src/lib/rrpVisuals";
import { annBucket, annExample, annItems, annQuery, correctDownsampling, cosine, dcg, distance, dot, explorationExamples, ipsEstimate, ipsRows, itemFactors, mergedSources, metricLists, positionWeight, rerankExamples, rerankUtility, servingBudget, sourceLists, userFactors, vectorItems, vectorQuery, wilson } from "../src/lib/rrpVisualMath";
import { isAmlVisualId } from "../src/lib/amlVisuals";
import { getLessonBlocks } from "../src/lib/getLessonBlocks";
import { parseInline, parseLesson, parseTableRows } from "../src/lib/lessonParser";

const close = (a: number, b: number, tolerance = 1e-9) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
// Verify the examples' conclusions as well as their arithmetic.
close(positionWeight(1), 1);
for (let rank = 2; rank < 10; rank++) assert.ok(positionWeight(rank) < positionWeight(rank - 1));
assert.deepEqual(metricLists.map(list => list.reduce((a, b) => a + b, 0) / list.length), [0.5, 0.5]);
close(dcg(metricLists[0]), 1.6309297535714575);
close(dcg(metricLists[1]) / dcg(metricLists[0]), 0.5706417189553201);
assert.deepEqual(userFactors.map(user => itemFactors.map(item => dot(user, item))), [[4, -1, 4], [5, 1, 2], [-1, -2, 2]]);
assert.ok(dot(vectorQuery, vectorItems[1]) > dot(vectorQuery, vectorItems[0]));
assert.ok(cosine(vectorQuery, vectorItems[0]) > cosine(vectorQuery, vectorItems[1]));
close(cosine(vectorQuery, vectorItems[1]), Math.SQRT1_2);
const ann = annExample();
assert.equal(ann.bucket, 0);
assert.deepEqual(ann.approximate, [2.6, 2.5]); assert.deepEqual(ann.exact, [3.1, 2.8]);
assert.ok(annBucket(ann.exact) !== ann.bucket && !ann.candidates.includes(ann.exact));
assert.ok(annItems.every(point => distance(annQuery, point) >= distance(annQuery, ann.exact)));
close(distance(annQuery, ann.approximate), 0.5); close(distance(annQuery, ann.exact), Math.sqrt(0.05));
assert.equal(Object.values(sourceLists).flat().length, 7);
assert.deepEqual(mergedSources(), { A: ["Vector"], B: ["Vector", "History"], C: ["Vector", "Fresh"], D: ["History"], E: ["Fresh"] });
const utilities = rerankExamples.map(item => rerankUtility(item.relevance, item.similarity));
close(utilities[0], 0.615); close(utilities[1], 0.74); assert.ok(utilities[1] > utilities[0]);
close(ipsRows.reduce((sum, row) => sum + row.logging, 0), 1);
close(ipsRows.reduce((sum, row) => sum + row.target, 0), 1);
assert.ok(ipsRows.every(row => row.logging > 0)); close(ipsEstimate(), 0.625);
close(ipsRows.reduce((sum, row) => sum + row.rewards, 0) / 10, 0.4);
assert.equal(servingBudget.reduce((sum, stage) => sum + stage.ms, 0), 50);
const intervals = explorationExamples.map(example => wilson(example.clicks, example.impressions));
assert.deepEqual(intervals.map(interval => interval.map(value => (100 * value).toFixed(2))), [["4.81", "5.19"], ["1.03", "8.45"]]);
assert.ok(intervals[1][1] > intervals[0][1] && intervals[1][0] < intervals[0][0]);
close(correctDownsampling(0.01 / (0.01 + 0.99 * 0.1), 0.1), 0.01);
close(Math.log1p(Math.exp(-1)), 0.31326168751822286); close(Math.log1p(Math.exp(1)), 1.3132616875182228);
close((1 + 20 * 0.05) / 21, 2 / 21); close(0.2 * 60, 12);
close(0.8 * 0.1, 0.08); close(0.4 * 0.1, 0.04);
close(20 / Math.sqrt(100 * 400), 0.1); close(10 / Math.sqrt(100 * 20), 1 / Math.sqrt(20));
assert.equal(10_000_000 * 128 * 4, 5_120_000_000);
close(500 * 10_000 * 100e-6, 500); close(250 * 10_000 * 0.6 * 100e-6, 150);
// The factorization-machine shortcut must equal the explicit pair interactions.
const features = [1, -2, 0.5, 3], factors = [[1, 2], [-1, 0.3], [2, -0.5], [0.7, 1.5]];
let explicit = 0;
for (let i = 0; i < features.length; i++) for (let j = i + 1; j < features.length; j++) explicit += dot(factors[i] as [number, number], factors[j] as [number, number]) * features[i] * features[j];
const shortcut = [0, 1].reduce((sum, f) => sum + 0.5 * (features.reduce((s, x, i) => s + factors[i][f] * x, 0) ** 2 - features.reduce((s, x, i) => s + (factors[i][f] * x) ** 2, 0)), 0);
close(explicit, shortcut);

const topics = rrpParts.flatMap(part => part.topics), used = new Set<string>();
assert.deepEqual(rrpParts.map(part => part.topics.length), [8, 6, 6, 8, 6, 6, 5]);
assert.equal(topics.length, 45); assert.equal(new Set(topics.map(topic => topic.id)).size, 45);
const dir = path.join(process.cwd(), "src/content/rrp-lessons");
assert.deepEqual(fs.readdirSync(dir).filter(file => file.endsWith(".md")).sort(), topics.map(topic => `${topic.id}.md`).sort());
let tables = 0, equations = 0, illustratedChapters = 0, words = 0;
for (const topic of topics) {
  const source = fs.readFileSync(path.join(dir, `${topic.id}.md`), "utf8"), blocks = getLessonBlocks(topic.id, "rrp");
  words += source.trim().split(/\s+/).length;
  assert.ok(source.startsWith("## "), `${topic.id}: missing source title`);
  const sections = blocks.filter(block => block.type === "heading2").map(block => block.text.match(/^(\d+)\. /)?.[1]);
  assert.ok(sections.length >= 3 && sections.length <= 4 && sections.every((number, index) => Number(number) === index + 1), `${topic.id}: sections must be numbered in sequence`);
  assert.equal((source.match(/^```/gm) ?? []).length % 2, 0, `${topic.id}: unclosed fence`);
  assert.equal((source.match(/^\\\[$/gm) ?? []).length, (source.match(/^\\\]$/gm) ?? []).length, `${topic.id}: unclosed display math`);
  const inlineSource = source.replace(/\\\[[\s\S]*?\\\]/g, "");
  assert.equal((inlineSource.match(/\\\(/g) ?? []).length, (inlineSource.match(/\\\)/g) ?? []).length, `${topic.id}: unclosed inline math`);
  assert.ok(!/genui|Builds on|Chapter goal|What matters most/.test(source), `${topic.id}: placeholder or repeated scaffolding`);
  assert.ok(topic.summary && topic.keyPoints.length === 3 && topic.interviewPrompt, `${topic.id}: incomplete overview`);
  const figures = blocks.filter(block => block.type === "rrp-visual");
  if (figures.length) illustratedChapters++;
  for (const block of blocks) {
    if (block.type === "math") { katex.renderToString(block.text, { throwOnError: true, strict: false }); equations++; }
    if (block.type === "table") {
      const rows = parseTableRows(block.text);
      assert.ok(rows.length > 1 && rows.every(row => row.length === rows[0].length), `${topic.id}: uneven table columns`);
      tables++;
    }
    if (block.type === "rrp-visual") {
      const id = block.text.trim(); assert.ok(isRrpVisualId(id), `${topic.id}: unknown visual ${id}`);
      assert.ok(!used.has(id), `${topic.id}: repeated figure`); used.add(id);
    }
    if (!["code", "diagram", "math"].includes(block.type)) for (const token of parseInline(block.text)) {
      if (token.kind === "math") { katex.renderToString(token.text, { throwOnError: true, strict: false }); equations++; }
    }
  }
  if (process.argv.includes("--export")) {
    const lessonPath = `/mldomain/rrp/${topic.id}`;
    const html = fs.readFileSync(path.join(process.cwd(), "out", `${lessonPath.slice(1)}.html`), "utf8");
    assert.ok(!html.includes("katex-error") && html.includes("FULL LESSON"), `${topic.id}: missing or invalid exported lesson`);
    assert.ok(html.includes('rel="canonical"') && html.includes(lessonPath), `${topic.id}: missing canonical`);
    for (const figure of figures) assert.ok(html.includes(`data-rrp-visual="${figure.text.trim()}"`) && html.includes('role="img"'), `${topic.id}: missing exported accessible figure`);
    for (const match of html.matchAll(/href="\/mldomain\/rrp\/([^"?#/]+)"/g)) assert.ok(rrpTopicsById[match[1]], `${topic.id}: broken chapter link`);
  }
}
assert.deepEqual([...used].sort(), [...rrpVisualIds].sort());
assert.equal(used.size, 21); assert.equal(illustratedChapters, 21);
for (const spec of Object.values(rrpVisuals) as RrpVisualSpec[]) {
  assert.ok(spec.title && spec.caption && spec.alt);
  if (spec.sharedAml) assert.ok(isAmlVisualId(spec.sharedAml));
}
for (const [language, id, type] of [["rrp-visual", "two-tower", "rrp-visual"], ["aml-visual", "pca-projection", "aml-visual"], ["dl-visual", "rope", "dl-visual"], ["cv-visual", "convolution", "visual"], ["typescript", "const x = 1;", "code"]]) {
  assert.equal(parseLesson(`# Title\n\n\`\`\`${language}\n${id}\n\`\`\``)[0].type, type);
}
if (process.argv.includes("--export")) {
  const sitemap = fs.readFileSync(path.join(process.cwd(), "out/sitemap.xml"), "utf8");
  for (const topic of topics) assert.ok(sitemap.includes(`/mldomain/rrp/${topic.id}</loc>`));
}
console.log(`RRP validated: ${topics.length} chapters, ${used.size} figures across ${illustratedChapters} chapters, ${tables} tables, ${equations} math expressions and ${words.toLocaleString()} source words. Numerical examples and parser compatibility passed${process.argv.includes("--export") ? "; exported pages, links, canonical URLs and sitemap passed" : ""}.`);
