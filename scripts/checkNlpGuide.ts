import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { nlpParts, nlpTopics, nlpTopicsById, nlpLessonNumbers, nlpReferencesByTopic } from "../src/lib/nlpStudyData";
import { getLessonBlocks } from "../src/lib/getLessonBlocks";
import { parseInline, parseTableRows } from "../src/lib/lessonParser";
import { isNlpVisualId, nlpVisuals } from "../src/lib/nlpVisuals";
import { attentionExample, attentionMixture, causalAccess, contrastiveLogits, convolutionExample, convolveText, crfExample, crfLogPartition, decodingExample, dot, embeddingExample, loraParameterCounts, lstmStep, pathScore, softmax, subwordSteps, teacherForcingExample, vectorExample, viterbi } from "../src/lib/nlpVisualMath";
import { mlpForwardBackward, mlpParameters, updateMlp } from "../src/lib/cvVisualMath";
import sitemap from "../src/app/sitemap";
import { NLP_PATH } from "../src/lib/mlDomains";

const close = (a: number, b: number, tolerance = 1e-9) => assert.ok(Math.abs(a - b) <= tolerance, `${a} != ${b}`);
const sum = (values: readonly number[]) => values.reduce((a, b) => a + b, 0);
const cosine = (a: readonly number[], b: readonly number[]) => dot(a, b) / Math.sqrt(dot(a, a) * dot(b, b));
const derivative = (f: (value: number) => number, x: number) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
const sigmoid = (value: number) => 1 / (1 + Math.exp(-value));

// Arithmetic is checked independently from prose and visual labels.
close(30 / 40, 0.75); close(30 / 100, 0.3); close(920 / 1000, 0.92); close(60 / 140, 3 / 7);
close(dot(vectorExample.query, vectorExample.a), 1); close(dot(vectorExample.query, vectorExample.b), 2);
close(cosine(vectorExample.query, vectorExample.a), Math.SQRT1_2); close(cosine(vectorExample.query, vectorExample.b), Math.SQRT1_2);
const bayes = 0.01 * 0.8 / (0.01 * 0.8 + 0.99 * 0.05); close(bayes, 0.1391304347826087);
close(0.5 * 1 + 0.5 * 3, 2); close(0.5 * (1 - 2) ** 2 + 0.5 * (3 - 2) ** 2, 1);
close(0.4 * 0.5 * 0.8, 0.16); close(Math.log(0.4) + Math.log(0.5) + Math.log(0.8), Math.log(0.16));
const p = [0.5, 0.5], q = [0.9, 0.1];
const entropy = -sum(p.map(value => value * Math.log(value))), crossEntropy = -sum(p.map((value, i) => value * Math.log(q[i])));
close(entropy, Math.log(2)); close(crossEntropy, 1.2039728043259361);
close(sum(p.map((value, i) => value * Math.log(value / q[i]))), crossEntropy - entropy);
close(-Math.log(0.01), 4.605170185988091);
assert.deepEqual(subwordSteps.map(pieces => pieces.join("")), Array(4).fill("lower"));
const pieces = [...subwordSteps[0]];
for (const [left, right] of [["l", "o"], ["lo", "w"], ["e", "r"]]) {
  const at = pieces.findIndex((piece, i) => piece === left && pieces[i + 1] === right);
  assert.ok(at >= 0); pieces.splice(at, 2, left + right);
}
assert.deepEqual(pieces, ["low", "er"]); assert.ok(0.2 * 0.1 > 0.015);
close(2 * (1 + Math.log(4 / 2)), 3.386294361119891);
close(0.04 / 0.0408, 0.9803921568627451); close(0.15 / 0.225, 2 / 3);
close(sigmoid(1.5), 0.8175744761936437); close(sigmoid(2.5), 0.9241418199787566);
const smoothed = [2, 1, 0].map(count => (count + 1) / 6); close(sum(smoothed), 1); close(smoothed[2], 1 / 6);
close(Math.exp(-(Math.log(0.5) + Math.log(0.25)) / 2), Math.sqrt(8));
const input = [1, 2], matrix = [[1, -1], [2, 0]], bias = [0, 1];
const preactivations = matrix.map((row, i) => dot(row, input) + bias[i]);
assert.deepEqual(preactivations, [-1, 3]); assert.deepEqual(preactivations.map(value => Math.max(0, value)), [0, 3]);
softmax([Math.log(3), 0]).forEach((value, i) => close(value, [0.75, 0.25][i]));
softmax([Math.log(3) + 100, 100]).forEach((value, i) => close(value, [0.75, 0.25][i]));
for (const logits of [[0, 0], [2, -1, 0.5]]) for (let target = 0; target < logits.length; target++) {
  const probabilities = softmax(logits);
  logits.forEach((_, coordinate) => {
    const observed = derivative(value => { const scores = [...logits]; scores[coordinate] = value; return -Math.log(softmax(scores)[target]); }, logits[coordinate]);
    close(observed, probabilities[coordinate] - Number(coordinate === target), 1e-8);
  });
}
const mlp = mlpForwardBackward(); close(mlp.loss, 0.5); close(mlp.gradients.w[1][1], 4);
for (let row = 0; row < mlpParameters.w.length; row++) for (let column = 0; column < mlpParameters.w[row].length; column++) {
  const observed = derivative(value => { const parameters = structuredClone(mlpParameters); parameters.w[row][column] = value; return mlpForwardBackward(parameters).loss; }, mlpParameters.w[row][column]);
  close(observed, mlp.gradients.w[row][column], 1e-8);
}
const updatedMlp = mlpForwardBackward(updateMlp(mlpParameters, mlp.gradients, 0.05)); close(updatedMlp.prediction, 0.73); close(updatedMlp.loss, 0.03645);
close(1 - 0.1 * -4, 1.4); close((1.4 - 3) ** 2, 2.56); close((1 - 2 * -4 - 3) ** 2, 36); close(0.8 * 1.25, 1);
embeddingExample.table.forEach((row, i) => row.forEach((_, j) => {
  const observed = derivative(value => { const table = structuredClone(embeddingExample.table); table[i][j] = value; return sum(embeddingExample.ids.map(id => table[id][0])); }, row[j]);
  close(observed, j === 0 ? embeddingExample.ids.filter(id => id === i).length : 0, 1e-8);
}));
close(derivative(value => -Math.log(sigmoid(value)), 0), -0.5, 1e-8);
close(derivative(value => -Math.log(sigmoid(-value)), 0), 0.5, 1e-8);
assert.deepEqual(convolveText(convolutionExample.input, convolutionExample.kernel), [-1, 3, -1]);
assert.deepEqual(convolveText([1, -1, 2], [2, 1]), [1, 0]);
const memory = lstmStep(); close(memory.retained, 3); close(memory.added, -0.2); close(memory.memory, 2.8); close(memory.hidden, 0.8 * Math.tanh(2.8));
assert.deepEqual(teacherForcingExample.inputs.slice(1), teacherForcingExample.labels.slice(0, -1));
const mixture = attentionMixture(attentionExample.scores, attentionExample.values);
mixture.weights.forEach((value, i) => close(value, [0.75, 0.25][i])); mixture.output.forEach((value, i) => close(value, [1.5, 1][i]));
attentionMixture([...attentionExample.scores].reverse(), attentionExample.values).output.forEach((value, i) => close(value, [0.5, 3][i]));
assert.deepEqual(attentionMixture([0, -Infinity], attentionExample.values).output, [2, 0]);
assert.throws(() => softmax([-Infinity, -Infinity]));
assert.deepEqual(causalAccess, [[true, false, false], [true, true, false], [true, true, true]]);
// Without positions, unrestricted attention is permutation-equivariant and mean pooling is invariant.
const states = [[1, 0], [0, 1], [1, 1]], permutation = [2, 0, 1];
const attend = (x: number[][]) => x.map(query => attentionMixture(x.map(key => dot(query, key) / Math.SQRT2), x).output);
const reordered = permutation.map(i => states[i]), originalOutputs = attend(states), reorderedOutputs = attend(reordered);
reorderedOutputs.forEach((row, i) => row.forEach((value, j) => close(value, originalOutputs[permutation[i]][j])));
for (let j = 0; j < 2; j++) close(sum(originalOutputs.map(row => row[j])), sum(reorderedOutputs.map(row => row[j])));
const position = [[0, 0], [1, 0], [0, 1]];
const meanPositioned = (x: number[][]) => {
  const outputs = attend(x.map((row, i) => row.map((value, j) => value + position[i][j])));
  return [0, 1].map(j => sum(outputs.map(row => row[j])) / x.length);
};
const positioned = meanPositioned(states), reorderedPositioned = meanPositioned(reordered);
assert.ok(positioned.some((value, i) => Math.abs(value - reorderedPositioned[i]) > 1e-4));
close((1 - 2) / Math.sqrt(1), -1); close((3 - 2) / Math.sqrt(1), 1);
assert.equal(128 ** 2, 16384); assert.equal(256 ** 2 / 128 ** 2, 4);
assert.deepEqual(loraParameterCounts(4, 4, 1), { full: 16, adapter: 8 });
assert.deepEqual(loraParameterCounts(1024, 1024, 8), { full: 1048576, adapter: 16384 });
assert.deepEqual(loraParameterCounts(6, 4, 1), { full: 24, adapter: 10 });
const completions = decodingExample.first.map((value, i) => value * decodingExample.end[i]); close(completions[0], 0.3); close(completions[1], 0.36); assert.ok(completions[1] > completions[0]);
close(softmax([Math.log(3) / 0.5, 0])[0], 0.9); close(0.5 / 0.8, 0.625); close(0.3 / 0.8, 0.375);
const sourceText = "Ada visits New York."; assert.equal(sourceText.indexOf("New York"), 11); assert.equal(sourceText.slice(11, 19), "New York");
close(3 / 4, 0.75); close(3 / 5, 0.6); close(2 * 3 / (4 + 5), 2 / 3);
close(pathScore([0, 2]), 5); close(pathScore([0, 1]), 6);
const allPaths = crfExample.labels.flatMap((_, a) => crfExample.labels.map((_, b) => [a, b]));
const validScores = allPaths.map(path => ({ path, score: pathScore(path) })).filter(item => Number.isFinite(item.score));
const best = validScores.reduce((a, b) => a.score >= b.score ? a : b);
assert.deepEqual(viterbi(), best); close(crfLogPartition(), Math.log(sum(validScores.map(item => Math.exp(item.score)))));
close(sum(validScores.map(item => Math.exp(item.score - crfLogPartition()))), 1);
contrastiveLogits.forEach((row, i) => { close(softmax(row)[i], Math.exp(2) / (Math.exp(2) + 2)); close(-Math.log(softmax(row)[i]), 0.2395447662218845); });
[1, 2, 3].forEach((frequency, i) => close(2 * frequency / (frequency + 1), [1, 4 / 3, 1.5][i]));
close((1 + 0.5 + 0) / 3, 0.5);
const counts = (text: string) => text.split(" ").reduce((map, word) => map.set(word, (map.get(word) ?? 0) + 1), new Map<string, number>());
const candidate = counts("the cat the cat"), reference = counts("the cat sat");
assert.equal(sum([...candidate].map(([word, count]) => Math.min(count, reference.get(word) ?? 0))), 2);
const summary = "parcel arrives in Paris Tuesday".split(" "), gold = "parcel arrives in Paris Friday".split(" "); close(summary.filter(word => gold.includes(word)).length / gold.length, 0.8);

const built = process.argv.includes("--built") || process.argv.includes("--export");
assert.deepEqual(nlpParts.map(part => part.topics.length), [6, 4, 6, 4, 6, 6, 7, 5, 5, 6]);
assert.equal(nlpParts.length, 10); assert.equal(nlpTopics.length, 55);
assert.equal(new Set(nlpTopics.map(topic => topic.id)).size, 55);
assert.deepEqual(fs.readdirSync("src/content/nlp-lessons").filter(file => file.endsWith(".md")).sort(), nlpTopics.map(topic => `${topic.id}.md`).sort());
assert.ok(fs.readFileSync("src/components/nlp/NlpHub.tsx", "utf8").includes('useProgress("nlp", [])'));
assert.ok(!/^import .*StudyData/m.test(fs.readFileSync("src/lib/nlpStudyData.ts", "utf8")), "No required content imported from other topics");
const urls = sitemap().map(entry => new URL(entry.url).pathname), usedFigures = new Set<string>(), prose = new Map<string, string>();
const quizData = JSON.parse(fs.readFileSync("scripts/quizzes.json", "utf8")) as Record<string, { questions: string[]; answers: string[] }>;
const quizIds = new Set<string>(), privateText: string[] = [], wordCounts: number[] = [], sectionReviews: string[] = [];
let sections = 0, formulas = 0, tables = 0, quizCount = 0;
for (const [chapterIndex, chapter] of nlpParts.entries()) {
  assert.equal(chapter.number, String(chapterIndex + 1));
  const quizId = `nlp-${chapter.id}`, quiz = quizData[quizId]; quizIds.add(quizId);
  assert.ok(quiz); assert.equal(quiz.questions.length, chapter.quizQuestionCount); assert.equal(quiz.answers.length, chapter.quizQuestionCount);
  assert.ok(quiz.questions.length > 0); quizCount += quiz.questions.length;
  quiz.questions.forEach((question, i) => { assert.ok(question.length > 25 && quiz.answers[i].length > 25); privateText.push(question, quiz.answers[i]); });
  assert.equal(urls.filter(url => url === `${NLP_PATH}/${chapter.id}/quiz`).length, 1);
  if (built) {
    const html = fs.readFileSync(`out${NLP_PATH}/${chapter.id}/quiz.html`, "utf8");
    assert.ok(html.includes(quizId) && html.includes("PREMIUM")); assert.ok(html.includes('rel="canonical"'));
    assert.ok(html.includes(`Chapter ${chapter.number} quiz`) && !/Part \d+ quiz/.test(html));
  }
  for (const [lessonIndex, topic] of chapter.topics.entries()) {
    assert.equal(nlpLessonNumbers[topic.id], `${chapterIndex + 1}.${lessonIndex + 1}`);
    assert.equal(topic.keyPoints.length, 3); assert.ok(topic.summary && topic.interviewPrompt);
    const references = nlpReferencesByTopic[topic.id] ?? chapter.references; assert.ok(references.length);
    references.forEach(reference => assert.equal(new URL(reference.url).protocol, "https:"));
    const source = fs.readFileSync(`src/content/nlp-lessons/${topic.id}.md`, "utf8");
    assert.ok(source.startsWith(`# ${topic.title}\n`), `Title mismatch: ${topic.id}`);
    assert.ok(!/Builds on|TODO|TBD|\$\$|\/mldomain\/(?:cv|rrp|appliedml|deeplearning)/.test(source), `Unresolved or external prerequisite: ${topic.id}`);
    assert.equal((source.match(/^```/gm) ?? []).length % 2, 0, `Open code fence: ${topic.id}`);
    assert.equal((source.match(/^\\\[$/gm) ?? []).length, (source.match(/^\\\]$/gm) ?? []).length, `Open equation: ${topic.id}`);
    const inlineOnly = source.replace(/\\\[[\s\S]*?\\\]/g, ""); assert.equal((inlineOnly.match(/\\\(/g) ?? []).length, (inlineOnly.match(/\\\)/g) ?? []).length);
    const blocks = getLessonBlocks(topic.id, "nlp"), headings = blocks.filter(block => block.type === "heading2");
    headings.forEach((heading, i) => assert.ok(heading.text.startsWith(`${i + 1}. `), `Section order: ${topic.id}`));
    if (headings.length < 6 || headings.length > 12) sectionReviews.push(`${topic.id}: ${headings.length} sections`);
    sections += headings.length; wordCounts.push(source.trim().split(/\s+/).length);
    assert.match(headings.at(-1)!.text, /Interview reasoning/); assert.match(blocks.at(-2)!.text, /^\*\*Question:\*\*/); assert.match(blocks.at(-1)!.text, /^\*\*Answer:\*\*/);
    assert.notEqual(blocks.at(-2)!.text.replace(/^\*\*Question:\*\* /, ""), topic.interviewPrompt, `Duplicate overview and closing probe: ${topic.id}`);
    for (const block of blocks) {
      if (block.type === "paragraph" || block.type === "quote") {
        const words = block.text.trim().split(/\s+/).length;
        assert.ok(words <= 85, `Review a long paragraph: ${topic.id} (${words} words)`);
        if (words >= 18) { const normalized = block.text.toLowerCase().replace(/\s+/g, " ").trim(); assert.ok(!prose.has(normalized), `Repeated passage in ${topic.id} and ${prose.get(normalized)}`); prose.set(normalized, topic.id); }
      }
      if (block.type === "code") assert.ok(block.text.split("\n").length <= 5, `Operation example too long: ${topic.id}`);
      if (block.type === "math") { katex.renderToString(block.text, { throwOnError: true, strict: "error" }); formulas++; }
      if (!["code", "diagram", "math"].includes(block.type)) for (const token of parseInline(block.text)) if (token.kind === "math") katex.renderToString(token.text, { throwOnError: true, strict: "error" });
      if (block.type === "table") { const rows = parseTableRows(block.text); assert.ok(rows.length > 1); rows.forEach(row => assert.equal(row.length, rows[0].length, `Uneven table: ${topic.id}`)); tables++; }
      if (block.type === "nlp-visual") { assert.ok(isNlpVisualId(block.text)); assert.ok(!usedFigures.has(block.text), `Repeated figure: ${block.text}`); usedFigures.add(block.text); }
    }
    assert.equal(urls.filter(url => url === `${NLP_PATH}/${topic.id}`).length, 1);
    if (built) {
      const html = fs.readFileSync(`out${NLP_PATH}/${topic.id}.html`, "utf8");
      assert.ok(html.includes("INTERVIEW-READY OVERVIEW") && html.includes("FULL LESSON") && html.includes("Interview probe:"));
      assert.ok(html.includes(`Chapter ${chapter.number} mock interview`) && !/Part \d+ mock interview/.test(html));
      assert.ok(html.indexOf("INTERVIEW-READY OVERVIEW") < html.indexOf("FULL LESSON"));
      assert.ok(html.includes('<article aria-label="Full lesson"') && !html.includes("katex-error"));
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/); assert.ok(canonical); assert.equal(new URL(canonical[1]).pathname, `${NLP_PATH}/${topic.id}`);
      const jsonLd = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/); assert.ok(jsonLd); assert.equal(JSON.parse(jsonLd[1]).name, topic.title);
      for (const match of html.matchAll(/href="(\/mldomain\/nlp[^"?]*)"/g)) {
        const [target, anchor] = match[1].split("#"), file = `out${target}.html`; assert.ok(fs.existsSync(file), `Broken target ${file}`);
        if (anchor) assert.ok(fs.readFileSync(file, "utf8").includes(`id="${anchor}"`));
      }
      for (const figure of blocks.filter(block => block.type === "nlp-visual")) assert.ok(html.includes(`data-nlp-visual="${figure.text}"`) && html.includes('role="img"'));
    }
  }
}
assert.equal(new Set(privateText.filter((_, i) => i % 2 === 0)).size, quizCount, "Duplicate quiz prompts");
assert.deepEqual(quizIds, new Set(Object.keys(quizData).filter(id => id.startsWith("nlp-"))));
assert.deepEqual(usedFigures, new Set(Object.keys(nlpVisuals)));
Object.values(nlpVisuals).forEach(spec => assert.ok(spec.title && spec.caption && spec.alt));
const definitions: [string, string][] = [
  ["language-tasks", "**Natural language processing (NLP)**"], ["probability-and-language", "**Conditional probability**"],
  ["information-theory", "**Cross-entropy**"], ["tokens-and-vocabularies", "**tokenizer**"], ["tokens-and-subwords", "**Byte-pair encoding (BPE)**"],
  ["naive-bayes", "**Naive Bayes**"], ["neural-text-features", "**neural network**"], ["neural-output-heads", "**Softmax**"],
  ["backpropagation", "**Backpropagation**"], ["embedding-lookup", "**embedding**"], ["sequence-models", "**recurrent neural network (RNN)**"],
  ["gated-sequence-models", "**Long short-term memory (LSTM)**"], ["sequence-objectives", "**Teacher forcing**"],
  ["attention", "**Attention**"], ["transformer-blocks", "**Layer normalization**"], ["fine-tuning", "**Low-rank adaptation (LoRA)**"],
  ["entities-and-spans", "**Named-entity recognition (NER)**"], ["structured-prediction", "**linear-chain conditional random field (CRF)**"],
  ["retrieval-augmented-qa", "**Retrieval-augmented generation (RAG)**"],
];
for (const [id, marker] of definitions) assert.ok(getLessonBlocks(id, "nlp").some(block => block.type === "paragraph" && block.text.includes(marker)), `Explicit prose definition missing: ${id} ${marker}`);
const retired = ["nlp-system-design", "nlp-revision", "calibration-and-error-analysis", "serving-and-drift", "multilingual-and-linguistic-failures", "task-metrics", "syntax-relations-and-meaning", "learning-text-models", "pretraining-and-adaptation"];
retired.forEach(id => assert.ok(!nlpTopicsById[id], `Obsolete lesson still registered: ${id}`));
assert.equal(urls.filter(url => url.startsWith(`${NLP_PATH}/`) && !url.endsWith("/quiz")).length, 55);
assert.equal(urls.filter(url => url.startsWith(`${NLP_PATH}/`) && url.endsWith("/quiz")).length, 10);
if (built) {
  const hub = fs.readFileSync(`out${NLP_PATH}.html`, "utf8"); const hubText = hub.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " "); assert.match(hubText, /55\s+lessons/); assert.match(hubText, /10\s+chapters/); assert.ok(hub.includes("Start here"));
  assert.ok(!hub.includes("Part 1") && !hub.includes("Chapter 11") && !hub.includes("Chapter 12"));
  retired.forEach(id => assert.ok(!fs.existsSync(`out${NLP_PATH}/${id}.html`), `Stale exported lesson: ${id}`));
  const exportedSitemap = fs.readFileSync("out/sitemap.xml", "utf8");
  urls.filter(url => url === NLP_PATH || url.startsWith(`${NLP_PATH}/`)).forEach(url => assert.ok(exportedSitemap.includes(`${url}</loc>`)));
  const privateVariants = privateText.flatMap(value => [value, JSON.stringify(value).slice(1, -1), value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")]);
  for (const file of fs.readdirSync("out", { recursive: true })) {
    if (typeof file !== "string" || !/\.(html|txt|js|json|xml)$/.test(file)) continue;
    const text = fs.readFileSync(path.join("out", file), "utf8"); assert.ok(!privateVariants.some(value => text.includes(value)), `Private quiz content bundled: ${file}`);
  }
}
console.log(`NLP validated: 10 chapters, 55 lessons, ${sections} sections, ${usedFigures.size} figures, ${tables} tables and ${formulas} display formulas.`);
console.log(`Lesson source words: ${sum(wordCounts).toLocaleString("en-US")} total; ${Math.min(...wordCounts)}–${Math.max(...wordCounts)} per lesson. No fixed lesson word ceiling.`);
console.log(`Definitions, duplicate-passage, numerical and parser checks passed. ${quizIds.size} local chapter quizzes contain ${quizCount} paired private questions/answers.`);
if (sectionReviews.length) console.log(`Editorial section-count reviews: ${sectionReviews.join("; ")}`);
if (built) console.log("All 66 NLP pages, links, canonical URLs, structured metadata, figures and sitemap passed; no private quiz text in static output.");
