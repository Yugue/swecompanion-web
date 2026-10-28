import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { genaiParts, genaiTopics, genaiLessonNumbers } from "../src/lib/genaiStudyData";
import { genaiVisuals, isGenaiVisualId } from "../src/lib/genaiVisuals";
import { rotatePair, rotaryExample, addScalarNoise, cleanFromNoise, denoisingExample, imageConvolution, centered, diffusionNoise, diffusionRetentions, diffusionSignal, dpoPreference, flowPath, groupRewards, guided, kvBytes, noisyState, quantizationValues, quantize, rejectionDistribution, samplingExample, softmax, speculativeAcceptance } from "../src/lib/genaiVisualMath";
import { getLessonBlocks } from "../src/lib/getLessonBlocks";
import { parseInline, parseTableRows } from "../src/lib/lessonParser";
import sitemap from "../src/app/sitemap";
import { GENAI_PATH, ML_DOMAINS } from "../src/lib/mlDomains";

const close = (actual: number, expected: number, epsilon = 1e-9) => assert.ok(Math.abs(actual - expected) <= epsilon, `${actual} != ${expected}`);
const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);
const built = process.argv.includes("--built");

// Values used in lessons, captions, native diagrams, and private numerical questions.
softmax(samplingExample.logits).forEach((value, i) => close(value, [4 / 7, 2 / 7, 1 / 7][i]));
softmax(samplingExample.logits, 0.5).forEach((value, i) => close(value, [16 / 21, 4 / 21, 1 / 21][i]));
assert.deepEqual(softmax([0, 0]), [0.5, 0.5]); assert.deepEqual(softmax([7, 7]), [0.5, 0.5]);
close(sum(softmax([1000, 1001, 1002])), 1); assert.throws(() => softmax([1], 0));
close(dpoPreference(2, 0.5), 0.8); close(dpoPreference(3, 1), 0.75);
assert.deepEqual(centered(groupRewards), [-0.5, 0.5, 0.5, -0.5]); assert.deepEqual(centered([1, 1, 1]), [0, 0, 0]);
assert.deepEqual(guided([1, 0], [2, 1], 0), [1, 0]); assert.deepEqual(guided([1, 0], [2, 1], 1), [2, 1]); assert.deepEqual(guided([1, 0], [2, 1], 2), [3, 2]);
assert.deepEqual(guided([1, 2], [3, 1], 2), [5, 0]);
assert.equal(kvBytes(32, 1, 4096, 8, 128, 2), 512 * 2 ** 20); assert.equal(kvBytes(16, 2, 1024, 4, 64, 2), 32 * 2 ** 20);
assert.deepEqual(quantizationValues.map(value => quantize(value)), [-1, -0, 0.5, 1]);
assert.deepEqual(imageConvolution(), [[2, -2], [0, -2]]);
close(quantize(3), 1); close(quantize(-3), -1); assert.throws(() => quantize(1, 0));
for (const [m, n] of rotaryExample.positions) {
  const q = rotatePair(rotaryExample.query, m * 45), k = rotatePair(rotaryExample.key, n * 45);
  close(q[0] * k[0] + q[1] * k[1], Math.SQRT1_2);
}
const farKey = rotatePair(rotaryExample.key, 90); close(farKey[0], 0); close(farKey[1], 1);
// Preserve vector length and relative dot products for nonidentical content too.
const qContent: [number, number] = [2, -1], kContent: [number, number] = [-0.5, 3];
const q0 = rotatePair(qContent, 15), k0 = rotatePair(kContent, 75), q1 = rotatePair(qContent, 45), k1 = rotatePair(kContent, 105);
close(q0[0] * k0[0] + q0[1] * k0[1], q1[0] * k1[0] + q1[1] * k1[1]);
close(q1[0] ** 2 + q1[1] ** 2, 5);
const noisyToy = addScalarNoise(denoisingExample.clean, denoisingExample.noise, denoisingExample.retention);
close(noisyToy, 1.6); close(cleanFromNoise(noisyToy, 0.5, 0.36), 2);
close(cleanFromNoise(noisyToy, 0.4, 0.36), 32 / 15); close((0.5 - 0.4) ** 2, 0.01);
assert.throws(() => cleanFromNoise(1, 0.5, 0));
const centeredFeatures = [1, 3].map(x => x - 2); assert.deepEqual(centeredFeatures, [-1, 1]);
close(1 / Math.sqrt(5), 0.4472135955, 1e-9); close(3 / Math.sqrt(5), 1.3416407865, 1e-9);
close(6 * 1e9 * 20e9, 1.2e20); close(6 * 2e9 * 10e9, 1.2e20);
close(1 / 2 + 1 / 11, 0.5909090909, 1e-9); close(1 / 3 + 1 / 3, 2 / 3);
close((1 - 0.25) * -1 + 0.25 * 3, 0); close(3 - -1, 4);
close(0.8 * 0.75, 0.6); close(0.2 + 0.8 * 0.25, 0.4);
const clippedPpoRatio = Math.max(1 - 0.2, Math.min(1 + 0.2, 1.5));
close(Math.min(1.5 * 2, clippedPpoRatio * 2), 2.4);
close(Math.min(1.5 * -2, clippedPpoRatio * -2), -3);
assert.ok(4 / 7 + 2 / 7 >= 0.8 && 4 / 7 + 2 / 7 < 0.9);
close((4 / 7) / (6 / 7), 2 / 3);
close(1 - 0.8 ** 3, 0.488); close(72 / 80, 0.9); close(80 / 100, 0.8);
close(0.2 + (5 - 1) * 0.05, 0.4); assert.equal(8000 - 500 - 1000 - 1500, 5000);
assert.equal(diffusionSignal.length, 64); assert.equal(diffusionNoise.length, 64);
assert.deepEqual(noisyState(1), diffusionSignal); assert.deepEqual(noisyState(0), diffusionNoise);
for (const retention of diffusionRetentions) {
  noisyState(retention).forEach((value, i) => close(value, Math.sqrt(retention) * diffusionSignal[i] + Math.sqrt(1 - retention) * diffusionNoise[i]));
}
assert.deepEqual(flowPath(0, 1, 1), [[0, 1], [0.25, 0.75]]);
close(speculativeAcceptance(0.6, 0.8), 0.75); close(speculativeAcceptance(0.2, 0.5), 0.4);
assert.deepEqual(rejectionDistribution([0.2, 0.8], [0.5, 0.5]), [0, 1]);
close(Math.exp(Math.log(5)), 5); close(0.2 * 5, 1); close(0.8 * 10, 8);
assert.equal(4 * (100 + 100), 800); assert.equal((512 * 512 * 3) / (64 * 64 * 4), 48);

assert.equal(genaiParts.length, 8); assert.equal(genaiTopics.length, 60);
assert.deepEqual(genaiParts.map(part => part.topics.length), [8, 8, 7, 8, 10, 6, 7, 6]);
assert.equal(new Set(genaiTopics.map(topic => topic.id)).size, 60);
assert.equal(new Set(genaiParts.map(part => part.id)).size, 8);
assert.deepEqual(fs.readdirSync("src/content/genai-lessons").filter(file => file.endsWith(".md")).sort(), genaiTopics.map(topic => `${topic.id}.md`).sort());
assert.ok(ML_DOMAINS.some(domain => domain.name === "Generative AI" && domain.href === GENAI_PATH));
assert.ok(fs.readFileSync("src/components/genai/GenaiHub.tsx", "utf8").includes('useProgress("genai", [])'));
assert.doesNotMatch(fs.readFileSync("src/lib/genaiStudyData.ts", "utf8"), /^import .*StudyData/m);
const urls = sitemap().map(entry => new URL(entry.url).pathname);
const quizzes = JSON.parse(fs.readFileSync("scripts/quizzes.json", "utf8")) as Record<string, { questions: string[]; answers: string[] }>;
const privateText: string[] = [], figures = new Set<string>(), prose = new Map<string, string>(), wordCounts: number[] = [];
let sections = 0, tables = 0, formulas = 0, quizCount = 0;
for (const [chapterIndex, chapter] of genaiParts.entries()) {
  assert.equal(chapter.number, String(chapterIndex + 1));
  const quizId = `genai-${chapter.id}`, quiz = quizzes[quizId]; assert.ok(quiz);
  assert.equal(quiz.questions.length, chapter.quizQuestionCount); assert.equal(quiz.answers.length, chapter.quizQuestionCount);
  quizCount += quiz.questions.length;
  for (const text of [...quiz.questions, ...quiz.answers]) { assert.ok(text.length > 25); privateText.push(text); }
  assert.equal(urls.filter(url => url === `${GENAI_PATH}/${chapter.id}/quiz`).length, 1);
  if (built) {
    const html = fs.readFileSync(`out${GENAI_PATH}/${chapter.id}/quiz.html`, "utf8");
    assert.ok(html.includes(quizId) && html.includes("PREMIUM")); assert.ok(html.includes(`Chapter ${chapter.number} quiz`));
  }
  for (const [lessonIndex, topic] of chapter.topics.entries()) {
    assert.equal(genaiLessonNumbers[topic.id], `${chapterIndex + 1}.${lessonIndex + 1}`);
    assert.equal(topic.keyPoints.length, 3); assert.ok(topic.summary && topic.interviewPrompt);
    assert.ok(topic.summary.split(/\s+/).length <= 30, `Long overview: ${topic.id}`);
    const source = fs.readFileSync(`src/content/genai-lessons/${topic.id}.md`, "utf8");
    assert.ok(source.startsWith(`# ${topic.title}\n`));
    assert.doesNotMatch(source, /Builds on|TODO|TBD|Further reading|Interview reasoning|\$\$|\/mldomain\/(?:cv|nlp|rrp|appliedml|deeplearning|agentic)/i, topic.id);
    assert.equal((source.match(/^```/gm) ?? []).length % 2, 0, `Code fence: ${topic.id}`);
    assert.equal((source.match(/^\\\[$/gm) ?? []).length, (source.match(/^\\\]$/gm) ?? []).length, `Math fence: ${topic.id}`);
    const inlineOnly = source.replace(/\\\[[\s\S]*?\\\]/g, "");
    assert.equal((inlineOnly.match(/\\\(/g) ?? []).length, (inlineOnly.match(/\\\)/g) ?? []).length);
    const blocks = getLessonBlocks(topic.id, "genai"), headings = blocks.filter(block => block.type === "heading2");
    assert.ok(headings.length >= 6 && headings.length <= 12, `Section count: ${topic.id}`);
    headings.forEach((heading, i) => assert.ok(heading.text.startsWith(`${i + 1}. `), `Section order: ${topic.id}`));
    sections += headings.length; wordCounts.push(source.trim().split(/\s+/).length);
    for (const block of blocks) {
      if (block.type === "paragraph" || block.type === "quote") {
        const words = block.text.trim().split(/\s+/).length; assert.ok(words <= 85, `Long paragraph: ${topic.id} (${words})`);
        if (words >= 18) { const normalized = block.text.toLowerCase().replace(/\s+/g, " ").trim(); assert.ok(!prose.has(normalized), `Repeated passage: ${topic.id} and ${prose.get(normalized)}`); prose.set(normalized, topic.id); }
      }
      if (block.type === "code") assert.ok(block.text.split("\n").length <= 5, `Long code example: ${topic.id}`);
      if (block.type === "math") { katex.renderToString(block.text, { throwOnError: true, strict: "error" }); formulas++; }
      if (!["code", "diagram", "math"].includes(block.type)) for (const token of parseInline(block.text)) if (token.kind === "math") katex.renderToString(token.text, { throwOnError: true, strict: "error" });
      if (block.type === "table") { const rows = parseTableRows(block.text); assert.ok(rows.length > 1); rows.forEach(row => assert.equal(row.length, rows[0].length)); tables++; }
      if (block.type === "genai-visual") { assert.ok(isGenaiVisualId(block.text)); assert.ok(!figures.has(block.text)); figures.add(block.text); }
    }
    assert.equal(urls.filter(url => url === `${GENAI_PATH}/${topic.id}`).length, 1);
    if (built) {
      const html = fs.readFileSync(`out${GENAI_PATH}/${topic.id}.html`, "utf8");
      assert.ok(html.includes("INTERVIEW-READY OVERVIEW") && html.includes("Interview probe:") && html.includes("FULL LESSON"));
      assert.ok(html.indexOf("INTERVIEW-READY OVERVIEW") < html.indexOf("FULL LESSON"));
      assert.ok(html.includes('<article aria-label="Full lesson"') && !html.includes("katex-error"));
      assert.ok(!html.includes("Further reading") && !html.includes("Interview reasoning") && !html.includes("Builds on"));
      assert.ok(html.includes(`Chapter ${chapter.number} mock interview`));
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/); assert.ok(canonical); assert.equal(new URL(canonical[1]).pathname, `${GENAI_PATH}/${topic.id}`);
      const jsonLd = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/); assert.ok(jsonLd); assert.equal(JSON.parse(jsonLd[1]).name, topic.title);
      for (const match of html.matchAll(/href="(\/mldomain\/genai[^"?]*)"/g)) {
        const [target, anchor] = match[1].split("#"), file = `out${target}.html`; assert.ok(fs.existsSync(file), `Broken target ${file}`);
        if (anchor) assert.ok(fs.readFileSync(file, "utf8").includes(`id="${anchor}"`));
      }
      for (const figure of blocks.filter(block => block.type === "genai-visual")) assert.ok(html.includes(`data-genai-visual="${figure.text}"`) && html.includes('role="img"'));
    }
  }
}
assert.equal(quizCount, 64); assert.equal(new Set(privateText).size, privateText.length);
assert.deepEqual(new Set(Object.keys(quizzes).filter(id => id.startsWith("genai-"))), new Set(genaiParts.map(part => `genai-${part.id}`)));
assert.deepEqual(figures, new Set(Object.keys(genaiVisuals)));
Object.values(genaiVisuals).forEach(spec => assert.ok(spec.title && spec.caption && spec.alt));
// Check explicit definitions and their teaching order, excluding headings and overview previews.
const teaching = genaiTopics.flatMap(topic => getLessonBlocks(topic.id, "genai").filter(block => ["paragraph", "quote", "table"].includes(block.type)).map(block => ({ id: topic.id, text: block.text })));
const firstDefinitions: [string, RegExp, string][] = [
  ["generative-foundations", /generative AI/i, "**Generative AI**"],
  ["generative-foundations", /\bhallucinat(?:ion|e)\b/i, "**hallucination**"],
  ["generative-foundations", /\bfoundation model\b/i, "**foundation model**"],
  ["probability-essentials", /\blikelihood\b/i, "**Likelihood**"],
  ["backpropagation", /\bcomputation graph\b/i, "**computation graph**"],
  ["next-token-pretraining", /\bexposure bias\b/i, "**Exposure bias**"],
  ["next-token-pretraining", /\bmasked-language modeling\b/i, "**Masked-language modeling**"],
  ["rlhf", /\brubric\b/i, "**rubric**"],
  ["diffusion-foundations", /\bdenoiser\b/i, "**denoiser**"],
  ["autoencoders-and-vaes", /\bevidence lower bound\b/i, "**evidence lower bound (ELBO)**"],
  ["evaluation-design", /\bconfidence calibration\b/i, "**Confidence calibration**"],
  ["position-information", /\brotary position encoding\b/i, "**Rotary position encoding (RoPE)**"],
  ["vectors-and-tensors", /\bvector\b/i, "**vector**"],
  ["vectors-and-tensors", /\bbatch\b/i, "**batch**"],
  ["generative-foundations", /\bprompt\b/i, "**prompt**"],
  ["softmax-and-losses", /\bloss\b/i, "**loss**"],
  ["probability-essentials", /conditional probability/i, "**Conditional probability**"],
  ["softmax-and-losses", /\bsoftmax\b/i, "**Softmax**"],
  ["neural-networks", /\bneural network\b/i, "**neural network**"],
  ["backpropagation", /\bbackpropagation\b/i, "**Backpropagation**"],
  ["tokenization", /\btokenizer\b/i, "**tokenizer**"],
  ["embeddings-and-outputs", /\bembedding\b/i, "**embedding**"],
  ["self-attention", /\bself-attention\b/i, "**Self-attention**"],
  ["attention-masks", /\bcausal mask\b/i, "**causal mask**"],
  ["reinforcement-learning", /\breinforcement learning\b/i, "**Reinforcement learning (RL)**"],
  ["training-resources", /\bloss scaling\b/i, "**loss scaling**"],
  ["rlhf", /\bsycophancy\b/i, "**sycophancy**"],
  ["latent-diffusion", /\bpatch(?:es)?\b/i, "**patches**"],
  ["autoencoders-and-vaes", /\bautoencoder\b/i, "**autoencoder**"],
  ["image-text-alignment", /\bcontrastive learning\b/i, "**Contrastive learning**"],
  ["knowledge-and-rag", /\bretrieval-augmented generation\b/i, "**Retrieval-augmented generation (RAG)**"],
  ["prompt-injection", /\bprompt injection\b/i, "**Prompt injection**"],
];
for (const [expected, pattern, marker] of firstDefinitions) {
  const first = teaching.find(block => pattern.test(block.text)); assert.ok(first, marker);
  assert.equal(first.id, expected, `Teach before use: ${marker}`); assert.ok(first.text.includes(marker), `Explicit first-use definition: ${marker}`);
}
assert.equal(urls.filter(url => url === GENAI_PATH || url.startsWith(`${GENAI_PATH}/`)).length, 69);
if (built) {
  const hub = fs.readFileSync(`out${GENAI_PATH}.html`, "utf8"), text = hub.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ");
  assert.match(text, /60\s+lessons/); assert.match(text, /8\s+chapters/); assert.ok(hub.includes("Start here"));
  const exportedSitemap = fs.readFileSync("out/sitemap.xml", "utf8");
  urls.filter(url => url === GENAI_PATH || url.startsWith(`${GENAI_PATH}/`)).forEach(url => assert.ok(exportedSitemap.includes(`${url}</loc>`)));
  const privateVariants = privateText.flatMap(value => [value, JSON.stringify(value).slice(1, -1), value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")]);
  for (const file of fs.readdirSync("out", { recursive: true })) {
    if (typeof file !== "string" || !/\.(html|txt|js|json|xml)$/.test(file)) continue;
    const output = fs.readFileSync(path.join("out", file), "utf8"); assert.ok(!privateVariants.some(value => output.includes(value)), `Private quiz text bundled: ${file}`);
  }
}
console.log(`Generative AI validated: 8 chapters, 60 lessons, ${sections} sections, ${figures.size} figures, ${tables} tables, ${formulas} display formulas.`);
console.log(`Source words: ${sum(wordCounts).toLocaleString("en-US")} total; ${Math.min(...wordCounts)}–${Math.max(...wordCounts)} per lesson.`);
console.log("Definitions, duplicate passages, numerical examples, parser, sitemap and 64 private quiz pairs passed.");
if (built) console.log("All 69 Generative AI pages, metadata, links, figures, premium gates and static quiz privacy passed.");
