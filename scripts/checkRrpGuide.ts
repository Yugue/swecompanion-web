import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { rrpParts, rrpTopicsById } from "../src/lib/rrpStudyData";
import { rrpVisualIds, rrpVisuals, isRrpVisualId, type RrpVisualSpec } from "../src/lib/rrpVisuals";
import { mfObjective, mfUpdate, softmax, towerTrainingExample, towerUpdate, contrastiveLoss, listwiseTrainingExample, clickThresholdExample, clickOperatingPoint, requestScoreExamples, pairAuc, constantRegressionErrors, annBucket, annExample, annItems, annQuery, correctDownsampling, cosine, dcg, distance, dot, explorationExamples, ipsEstimate, ipsRows, itemFactors, mergedSources, metricLists, positionWeight, rerankExamples, rerankUtility, servingBudget, sourceLists, userFactors, vectorItems, vectorQuery, wilson } from "../src/lib/rrpVisualMath";
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
const pairLoss = (gap: number) => Math.log1p(Math.exp(-gap));
for (const gap of [-1, 1]) {
  const epsilon = 1e-5, derivative = (pairLoss(gap + epsilon) - pairLoss(gap - epsilon)) / (2 * epsilon);
  close(derivative, -1 / (1 + Math.exp(gap)), 1e-8);
  assert.ok(derivative < 0 && pairLoss(gap + 0.1) < pairLoss(gap));
}
close(dot([1, 2], [3, -1]), 1); close(3 / 6, 0.5); close(3 / 10, 0.3);
assert.equal(100_000_000 * 64 * 4, 25_600_000_000);
assert.equal(10_000 * 800, 8_000_000);
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

// Verify new worked updates with independent finite differences and loss reductions.
const initialUser: [number, number] = [1, 0], initialItem: [number, number] = [0, 1];
for (const penalty of [0, 0.2]) {
  const step = mfUpdate(initialUser, initialItem, 1, 0.1, penalty), epsilon = 1e-5;
  for (const coordinate of [0, 1]) {
    const plusUser: [number, number] = [...initialUser], minusUser: [number, number] = [...initialUser];
    plusUser[coordinate] += epsilon; minusUser[coordinate] -= epsilon;
    close(step.userGradient[coordinate], (mfObjective(plusUser, initialItem, 1, penalty) - mfObjective(minusUser, initialItem, 1, penalty)) / (2 * epsilon), 1e-8);
    const plusItem: [number, number] = [...initialItem], minusItem: [number, number] = [...initialItem];
    plusItem[coordinate] += epsilon; minusItem[coordinate] -= epsilon;
    close(step.itemGradient[coordinate], (mfObjective(initialUser, plusItem, 1, penalty) - mfObjective(initialUser, minusItem, 1, penalty)) / (2 * epsilon), 1e-8);
  }
  assert.ok(mfObjective(step.user, step.item, 1, penalty) < mfObjective(initialUser, initialItem, 1, penalty));
}
const unpenalizedStep = mfUpdate(initialUser, initialItem, 1, 0.1);
assert.deepEqual(unpenalizedStep.user, [1, 0.1]); assert.deepEqual(unpenalizedStep.item, [0.1, 1]);
close(dot(unpenalizedStep.user, unpenalizedStep.item), 0.2); close(mfObjective(unpenalizedStep.user, unpenalizedStep.item, 1), 0.32);
const penalizedStep = mfUpdate(initialUser, initialItem, 1, 0.1, 0.2);
assert.deepEqual(penalizedStep.user, [0.98, 0.1]); assert.deepEqual(penalizedStep.item, [0.1, 0.98]);
const alsUser = (1 * 2 + 2 * 3) / (1 * 1 + 2 * 2);
close(alsUser, 1.6); close(5 * alsUser - 8, 0);
const alsLoss = (value: number) => 0.5 * ((value - 2) ** 2 + (2 * value - 3) ** 2);
assert.ok(alsLoss(alsUser) < alsLoss(1.5) && alsLoss(alsUser) < alsLoss(1.7));
close(pairLoss(0), Math.log(2)); close(pairLoss(0.1), 0.6443966600735709);
const toy = towerTrainingExample;
for (const temperature of [1, 0.7]) {
  const step = towerUpdate(toy.query, toy.items, toy.rate, 0, temperature), epsilon = 1e-5;
  for (const coordinate of [0, 1]) {
    const plus: [number, number] = [...toy.query], minus: [number, number] = [...toy.query];
    plus[coordinate] += epsilon; minus[coordinate] -= epsilon;
    close(step.queryGradient[coordinate], (contrastiveLoss(plus, toy.items, 0, temperature) - contrastiveLoss(minus, toy.items, 0, temperature)) / (2 * epsilon), 1e-8);
    for (let item = 0; item < toy.items.length; item++) {
      const plusItems = toy.items.map(p => [...p] as [number, number]), minusItems = toy.items.map(p => [...p] as [number, number]);
      plusItems[item][coordinate] += epsilon; minusItems[item][coordinate] -= epsilon;
      close(step.itemGradients[item][coordinate], (contrastiveLoss(toy.query, plusItems, 0, temperature) - contrastiveLoss(toy.query, minusItems, 0, temperature)) / (2 * epsilon), 1e-8);
    }
  }
  assert.ok(contrastiveLoss(step.query, step.items, 0, temperature) < contrastiveLoss(toy.query, toy.items, 0, temperature));
}
const towerStep = towerUpdate(toy.query, toy.items, toy.rate);
assert.deepEqual(towerStep.query, [1, 0.1]); assert.deepEqual(towerStep.items, [[0.05, 1], [-0.05, -1]]);
close(dot(towerStep.query, towerStep.items[0]), 0.15); close(dot(towerStep.query, towerStep.items[1]), -0.15);
close(contrastiveLoss(towerStep.query, towerStep.items), 0.554355244468527);
const list = listwiseTrainingExample, listShares = softmax(list.scores);
assert.deepEqual(listShares.map(value => Number(value.toFixed(3))), [0.398, 0.36, 0.242]);
const listLoss = (scores: number[]) => softmax(scores).reduce((sum, share, i) => sum - list.targets[i] * Math.log(share), 0);
close(listLoss(list.scores), 1.1708276555532595);
for (let i = 0; i < list.scores.length; i++) {
  const plus = [...list.scores], minus = [...list.scores], epsilon = 1e-5;
  plus[i] += epsilon; minus[i] -= epsilon;
  close((listLoss(plus) - listLoss(minus)) / (2 * epsilon), listShares[i] - list.targets[i], 1e-8);
}
const pairedOrderings = [[1, 0, 0, 1], [0, 1, 1, 0]];
const correctPairs = (labels: number[]) => labels.reduce((count, positive, i) => count + (positive ? labels.slice(i + 1).filter(v => !v).length : 0), 0);
assert.deepEqual(pairedOrderings.map(correctPairs), [2, 2]);
close(dcg(pairedOrderings[0]) / dcg([1, 1, 0, 0]), 0.8772153153380493);
close(dcg(pairedOrderings[1]) / dcg([1, 1, 0, 0]), 0.6934264036172708);
assert.equal(Object.values(clickThresholdExample).reduce((sum, count) => sum + count, 0), 10000);
const operatingPoint = clickOperatingPoint();
close(operatingPoint.tpr, 0.8); close(operatingPoint.fpr, 0.01); close(operatingPoint.precision, 80 / 179); close(operatingPoint.prevalence, 0.01);
close(pairAuc([1], [1]), 0.5);
const globalAucs = [0, 1].map(model => pairAuc(requestScoreExamples.map(row => row.positive[model]), requestScoreExamples.map(row => row.negative[model])));
close(globalAucs[0], 6 / 9); close(globalAucs[1], 8 / 9);
const meanTopOne = [0, 1].map(model => requestScoreExamples.filter(row => row.positive[model] > row.negative[model]).length / requestScoreExamples.length);
close(meanTopOne[0], 1); close(meanTopOne[1], 2 / 3);
assert.ok(globalAucs[1] > globalAucs[0] && meanTopOne[1] < meanTopOne[0]);
assert.deepEqual(constantRegressionErrors(0), { mse: 27, mae: 3, rmse: Math.sqrt(27) });
assert.deepEqual(constantRegressionErrors(3), { mse: 18, mae: 4, rmse: Math.sqrt(18) });
let boostedPrediction = 0.5;
boostedPrediction += 0.2 * (1 - boostedPrediction); close(boostedPrediction, 0.6);
boostedPrediction += 0.2 * (1 - boostedPrediction); close(boostedPrediction, 0.68);
for (const x of [0, 1]) for (const z of [0, 1]) assert.equal(Math.sign(1 - 2 * x - 2 * z + 4 * x * z), x === z ? 1 : -1);

const topics = rrpParts.flatMap(part => part.topics), used = new Set<string>();
const teachingParagraphs = new Map<string, string>();
assert.deepEqual(rrpParts.map(part => part.topics.length), [8, 6, 6, 8, 6, 6, 5]);
assert.equal(topics.length, 45); assert.equal(new Set(topics.map(topic => topic.id)).size, 45);
const dir = path.join(process.cwd(), "src/content/rrp-lessons");
assert.deepEqual(fs.readdirSync(dir).filter(file => file.endsWith(".md")).sort(), topics.map(topic => `${topic.id}.md`).sort());
let tables = 0, equations = 0, illustratedChapters = 0, words = 0, sectionsChecked = 0;
for (const topic of topics) {
  const source = fs.readFileSync(path.join(dir, `${topic.id}.md`), "utf8"), blocks = getLessonBlocks(topic.id, "rrp");
  words += source.trim().split(/\s+/).length;
  assert.ok(source.startsWith("## "), `${topic.id}: missing source title`);
  const sections = blocks.filter(block => block.type === "heading2").map(block => block.text.match(/^(\d+)\. /)?.[1]);
  assert.ok(sections.length >= 6 && sections.length <= 12 && sections.every((number, index) => Number(number) === index + 1), `${topic.id}: use 6–12 sequential short sections`);
  sectionsChecked += sections.length;
  const lastSection = blocks.findLastIndex(block => block.type === "heading2");
  assert.match(blocks[lastSection].text, /^\d+\. Interview reasoning$/, `${topic.id}: end with interview reasoning`);
  assert.deepEqual(blocks.slice(lastSection + 1).map(block => block.type), ["paragraph", "paragraph"], `${topic.id}: end with one question and one answer`);
  assert.ok(blocks[lastSection + 1].text.startsWith("**Question:**") && blocks[lastSection + 2].text.startsWith("**Answer:**"), `${topic.id}: missing reasoning prompt or answer`);
  assert.equal((source.match(/^```/gm) ?? []).length % 2, 0, `${topic.id}: unclosed fence`);
  assert.equal((source.match(/^\\\[$/gm) ?? []).length, (source.match(/^\\\]$/gm) ?? []).length, `${topic.id}: unclosed display math`);
  const inlineSource = source.replace(/\\\[[\s\S]*?\\\]/g, "");
  assert.equal((inlineSource.match(/\\\(/g) ?? []).length, (inlineSource.match(/\\\)/g) ?? []).length, `${topic.id}: unclosed inline math`);
  assert.ok(!/genui|Builds on|Chapter goal|What matters most/.test(source), `${topic.id}: placeholder or repeated scaffolding`);
  assert.ok(topic.summary && topic.keyPoints.length === 3 && topic.interviewPrompt, `${topic.id}: incomplete overview`);
  const figures = blocks.filter(block => block.type === "rrp-visual");
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
    const overviewIndex = html.indexOf("INTERVIEW-READY OVERVIEW");
    assert.ok(overviewIndex >= 0 && overviewIndex < html.indexOf("FULL LESSON") && html.includes("Interview probe:"), `${topic.id}: missing interview-ready overview before lesson`);
    assert.ok(html.includes('<article aria-label="Full lesson"'), `${topic.id}: missing lesson article`);
    assert.ok(html.includes('rel="canonical"') && html.includes(lessonPath), `${topic.id}: missing canonical`);
    for (const figure of figures) assert.ok(html.includes(`data-rrp-visual="${figure.text.trim()}"`) && html.includes('role="img"'), `${topic.id}: missing exported accessible figure`);
    for (const match of html.matchAll(/href="\/mldomain\/rrp\/([^"?#/]+)"/g)) assert.ok(rrpTopicsById[match[1]], `${topic.id}: broken chapter link`);
  }
}
assert.deepEqual([...used].sort(), [...rrpVisualIds].sort());
assert.equal(used.size, 22); assert.equal(illustratedChapters, 22);
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
console.log(`RRP validated: ${topics.length} chapters, ${sectionsChecked} short sections with closing reasoning prompts, ${used.size} figures across ${illustratedChapters} chapters, ${tables} tables, ${equations} math expressions and ${words.toLocaleString()} source words. Duplicate-paragraph, numerical and parser checks passed${process.argv.includes("--export") ? "; exported pages, links, canonical URLs and sitemap passed" : ""}.`);
