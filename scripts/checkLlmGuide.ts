import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { llmParts, llmTopics, llmLessonNumbers } from "../src/lib/llmStudyData";
import { isLlmVisualId, llmVisuals, packedAttentionAllowed, decoderPipelineExample } from "../src/lib/llmVisuals";
import { isGenaiVisualId } from "../src/lib/genaiVisuals";
import { getLessonBlocks } from "../src/lib/getLessonBlocks";
import { parseInline, parseTableRows } from "../src/lib/lessonParser";
import { softmax, kvBytes, speculativeAcceptance, rejectionDistribution } from "../src/lib/genaiVisualMath";
import { LLM_PATH, ML_DOMAINS } from "../src/lib/mlDomains";
import sitemap from "../src/app/sitemap";

const built = process.argv.includes("--built");
const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);
const lessonCount = llmTopics.length;
const chapterCount = llmParts.length;
const quizPairCount = llmParts.reduce((sum, part) => sum + part.quizQuestionCount, 0);
assert.ok(chapterCount > 0 && lessonCount > 0);
assert.equal(new Set(llmTopics.map(t => t.id)).size, lessonCount);
assert.deepEqual(fs.readdirSync("src/content/llm-lessons").sort(), llmTopics.map(t => `${t.id}.md`).sort());
assert.ok(ML_DOMAINS.some(d => d.href === LLM_PATH && d.name === "Large Language Models (LLM)"));
assert.ok(fs.readFileSync("src/components/llm/LlmHub.tsx", "utf8").includes('useProgress("llm", [])'));
assert.doesNotMatch(fs.readFileSync("src/lib/llmStudyData.ts", "utf8"), /^import .*StudyData/m);
const urls = sitemap().map(e => new URL(e.url).pathname).filter(p => p === LLM_PATH || p.startsWith(`${LLM_PATH}/`));
const routeCount = 1 + lessonCount + llmParts.filter(part => part.quizQuestionCount > 0).length;
assert.equal(urls.length, routeCount); assert.equal(new Set(urls).size, routeCount);
const quizzes = JSON.parse(fs.readFileSync("scripts/quizzes.json", "utf8")) as Record<string, { questions: string[]; answers: string[] }>;
assert.deepEqual(Object.keys(quizzes).filter(k => k.startsWith("llm-")).sort(), llmParts.map(p => `llm-${p.id}`).sort());
const privateText: string[] = [], passages = new Map<string, string>(), usedVisuals = new Set<string>(), counts: number[] = [];
const teaching: { id: string; text: string }[] = [];
let sections = 0, tables = 0, formulas = 0, figures = 0;
function htmlAt(url: string) { return fs.readFileSync(`out${url}.html`, "utf8"); }
for (const [pi, part] of llmParts.entries()) {
  assert.equal(part.number, String(pi + 1)); assert.ok(part.topics.length > 0);
  const quiz = quizzes[`llm-${part.id}`]; assert.ok(quiz);
  assert.equal(quiz.questions.length, part.quizQuestionCount); assert.equal(quiz.answers.length, part.quizQuestionCount);
  privateText.push(...quiz.questions, ...quiz.answers);
  if (built) { const h = htmlAt(`${LLM_PATH}/${part.id}/quiz`); assert.ok(h.includes(`llm-${part.id}`) && h.includes("PREMIUM")); }
  for (const [ti, topic] of part.topics.entries()) {
    assert.equal(llmLessonNumbers[topic.id], `${pi + 1}.${ti + 1}`); assert.equal(topic.keyPoints.length, 3);
    assert.ok(topic.summary && topic.interviewPrompt); assert.ok(topic.summary.split(/\s+/).length <= 35);
    const source = fs.readFileSync(`src/content/llm-lessons/${topic.id}.md`, "utf8");
    assert.ok(source.startsWith(`# ${topic.title}\n`));
    assert.doesNotMatch(source, /TODO|TBD|Builds on|Further reading|Interview reasoning|\/mldomain\/(?:genai|nlp|deeplearning|cv)/i);
    assert.equal((source.match(/^```/gm) ?? []).length % 2, 0);
    assert.equal((source.match(/^\\\[$/gm) ?? []).length, (source.match(/^\\\]$/gm) ?? []).length);
    counts.push(source.trim().split(/\s+/).length);
    const blocks = getLessonBlocks(topic.id, "llm"), headings = blocks.filter(b => b.type === "heading2");
    assert.ok(headings.length > 0, `Missing lesson structure: ${topic.id}`); sections += headings.length;
    headings.forEach((h, i) => assert.ok(h.text.startsWith(`${i + 1}. `)));
    for (const block of blocks) {
      if (["paragraph", "quote", "table"].includes(block.type)) teaching.push({ id: topic.id, text: block.text });
      if (["paragraph", "quote"].includes(block.type)) {
        const words = block.text.split(/\s+/).length; assert.ok(words <= 85, `Long paragraph: ${topic.id}`);
        if (words >= 18) { const p = block.text.toLowerCase().replace(/\s+/g, " ").trim(); assert.ok(!passages.has(p), `Duplicate: ${topic.id}, ${passages.get(p)}`); passages.set(p, topic.id); }
      }
      if (block.type === "code") assert.ok(block.text.split("\n").length <= 5);
      if (block.type === "math") { katex.renderToString(block.text, { throwOnError: true, strict: "error" }); formulas++; }
      if (!["code", "diagram", "math"].includes(block.type)) for (const token of parseInline(block.text)) if (token.kind === "math") katex.renderToString(token.text, { throwOnError: true, strict: "error" });
      if (block.type === "table") { const rows = parseTableRows(block.text); assert.ok(rows.length > 1); rows.forEach(row => assert.equal(row.length, rows[0].length)); tables++; }
      if (block.type === "llm-visual" || block.type === "genai-visual") {
        assert.ok(block.type === "llm-visual" ? isLlmVisualId(block.text) : isGenaiVisualId(block.text), block.text);
        assert.ok(!usedVisuals.has(block.text), `Repeated visual: ${block.text}`); usedVisuals.add(block.text); figures++;
      }
    }
    if (built) {
      const html = htmlAt(`${LLM_PATH}/${topic.id}`);
      assert.ok(html.includes("INTERVIEW-READY OVERVIEW") && html.includes("Interview probe:") && html.includes("FULL LESSON"));
      assert.ok(!html.includes("katex-error"));
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/); assert.ok(canonical); assert.equal(new URL(canonical[1]).pathname, `${LLM_PATH}/${topic.id}`);
      const ld = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/); assert.ok(ld); assert.equal(JSON.parse(ld[1]).name, topic.title);
      for (const block of blocks.filter(b => ["llm-visual", "genai-visual"].includes(b.type))) assert.ok(html.includes(`data-${block.type === "llm-visual" ? "llm" : "genai"}-visual="${block.text}"`) && html.includes('role="img"'));
      for (const link of html.matchAll(/href="(\/mldomain\/llm[^"?]*)"/g)) { const [target, anchor] = link[1].split("#"); const targetHtml = htmlAt(target); if (anchor) assert.ok(targetHtml.includes(`id="${anchor}"`)); }
    }
  }
}
assert.equal(privateText.length, 2 * quizPairCount); assert.equal(new Set(privateText).size, 2 * quizPairCount);
for (const id of Object.keys(llmVisuals)) assert.ok(usedVisuals.has(id));
// Teaching-order checks operate on lesson bodies, excluding title and overview previews.
const definitions: [string, RegExp, string][] = [
  ["uncertainty-and-divergence", /(?<!cross-)\bentropy\b/i, "**Entropy**"],
  ["uncertainty-and-divergence", /\bKL divergence\b/i, "**KL divergence**"],
  ["attention-masks", /\bloss mask\b/i, "**loss mask**"],
  ["structured-output", /\bschema\b/i, "**schema**"],
  ["distributed-training", /\bZeRO\b/, "**ZeRO**"],
  ["bias-and-safety", /\bover-refusal\b/i, "**Over-refusal**"],
  ["language-models", /\bcorpus\b/i, "**corpus**"],
  ["language-models", /\blatency\b/i, "**latency**"],
  ["vectors-and-tensors", /\bbatch\b/i, "**batch**"],
  ["tokenization", /\bmerge ranks\b/i, "**merge ranks**"],
  ["self-attention", /\bsoftmax saturation\b/i, "**softmax saturation**"],
  ["feed-forward-networks", /\bswiglu\b/i, "**SwiGLU**"],
  ["optimization", /\bmomentum\b/i, "**Momentum**"],
  ["training-memory-and-parallelism", /\bFP32\b/i, "**FP32**"],
  ["rlhf-and-policy-learning", /\bsigmoid\b/i, "**sigmoid**"],
  ["reinforcement-learning", /\bvalue baseline\b/i, "**value baseline**"],
  ["reasoning-and-verifiable-rewards", /\bgroup relative policy optimization\b/i, "**Group relative policy optimization (GRPO)**"],
  ["inference-time-reasoning", /\bPass@N\b/i, "**Pass@N**"],
  ["instructions-and-structured-output", /\bin-context learning\b/i, "**In-context learning**"],
  ["long-context", /\bposition interpolation\b/i, "**Position interpolation**"],
  ["tools-and-execution", /\btrust boundary\b/i, "**trust boundary**"],
  ["confidence-and-abstention", /\bconfidence calibration\b/i, "**Confidence calibration**"],
  ["inference-quantization", /\bzero point\b/i, "**zero point**"],
  ["attention-and-cache-systems", /\bprefix caching\b/i, "**prefix caching**"],
  ["batching-and-prefix-caching", /\banswer cache\b/i, "**answer cache**"],
  ["language-models", /\bhallucination\b/i, "**hallucination**"],
  ["language-models", /\bprompt\b/i, "**prompt**"],
  ["tokenization", /\btokenizer\b/i, "**tokenizer**"],
  ["vectors-and-embeddings", /\bembedding\b/i, "**embedding**"],
  ["vectors-and-embeddings", /\blogits?\b/i, "**logits**"],
  ["probabilities-and-loss", /\bsoftmax\b/i, "**Softmax**"],
  ["gradients-and-learning", /\bbackpropagation\b/i, "**Backpropagation**"],
  ["self-attention", /\bself-attention\b/i, "**Self-attention**"],
  ["attention-masks", /\bcausal mask\b/i, "**causal mask**"],
  ["next-token-training", /\bteacher forcing\b/i, "**Teacher forcing**"],
  ["reinforcement-learning", /\breinforcement learning\b/i, "**Reinforcement learning (RL)**"],
  ["tools-and-execution", /\bprompt injection\b/i, "**Prompt injection**"],
];
for (const [id, pattern, marker] of definitions) { const first = teaching.find(t => pattern.test(t.text)); assert.ok(first); assert.equal(first.id, id, marker); assert.ok(first.text.includes(marker), marker); }
// Numerical examples and matrix semantics in the actual teaching figures.
softmax([Math.log(2), 0, 0]).forEach((p, i) => close(p, [0.5, 0.25, 0.25][i]));
softmax([Math.log(4), Math.log(2), 0], 0.5).forEach((p, i) => close(p, [16 / 21, 4 / 21, 1 / 21][i]));
close(-Math.log(0.5), Math.log(2)); close(0.4 * 0.5, 0.2); close(1 - 0.05 * 4, 0.8);
assert.deepEqual(Array.from({ length: 4 }, (_, q) => Array.from({ length: 4 }, (_, k) => packedAttentionAllowed(q, k))), [[true, false, false, false], [true, true, false, false], [false, false, true, false], [false, false, true, true]]);
assert.equal(packedAttentionAllowed(-1, 0), false); assert.equal(packedAttentionAllowed(4, 0), false);
assert.equal(kvBytes(32, 1, 4096, 8, 128, 2), 512 * 2 ** 20);
close(speculativeAcceptance(0.6, 0.8), 0.75); assert.deepEqual(rejectionDistribution([0.6, 0.4], [0.8, 0.2]), [0, 1]);
close(1 - 0.8 ** 3, 0.488); close(72 / 80, 0.9); close(0.2 + 4 * 0.05, 0.4);
// Examples introduced by the curriculum separation.
softmax([Math.log(3), 0, -Infinity]).forEach((p, i) => close(p, [0.75, 0.25, 0][i]));
assert.equal(4 * 12 + 12 * 4, 96); assert.equal(8 / 4, 2);
assert.equal(kvBytes(32, 4, 4096, 8, 128, 2), 2 * 2 ** 30);
close(-Math.log(0.5), Math.log(2));
// Check newly worked examples against independent calculations.
const ce = (logits: number[], target: number) => -Math.log(softmax(logits)[target]);
const logits = [Math.log(2), 0, 0], h = 1e-5;
for (let i = 0; i < logits.length; i++) {
  const plus = [...logits], minus = [...logits]; plus[i] += h; minus[i] -= h;
  close((ce(plus, 0) - ce(minus, 0)) / (2 * h), [-0.5, 0.25, 0.25][i]);
}
close((100 * 1 + 10 * 3) / 110, 13 / 11); assert.notEqual((1 + 3) / 2, 13 / 11);
const momentum = [2, -2].reduce<number[]>((states, g) => [...states, 0.5 * (states.at(-1) ?? 0) + 0.5 * g], []);
assert.deepEqual(momentum, [1, -0.5]);
close(1 / (1 + Math.exp(-Math.log(3))), 0.75);
const rewards = [0, 1, 1, 0], mean = rewards.reduce((a, b) => a + b, 0) / rewards.length;
const std = Math.sqrt(rewards.reduce((a, r) => a + (r - mean) ** 2, 0) / rewards.length);
close(std, 0.5); assert.deepEqual(rewards.map(r => (r - mean) / std), [-1, 1, 1, -1]);
assert.equal(14 / 2, 7); close(60 / 80, 0.75); close((60 + 0.5 * 20) / 100, 0.7);
assert.equal(72 + 8, 80); assert.equal(72 + 12, 84); assert.equal(72 + 8 + 12 + 8, 100);
assert.equal(7e9 * 0.5, 3.5e9);
const { tokens, width, vocabulary } = decoderPipelineExample;
assert.equal(tokens, 3); assert.equal(width, 4); assert.equal(vocabulary, 6);
assert.match(llmVisuals["decoder-pipeline"].caption, /three four-coordinate/);
assert.ok(llmVisuals["decoder-pipeline"].caption.includes("six vocabulary scores per position"));
if (built) {
  const hub = htmlAt(LLM_PATH).replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ");
  assert.match(hub, new RegExp(`${lessonCount}\\s+lessons`)); assert.match(hub, new RegExp(`${chapterCount}\\s+chapters`));
  const xml = fs.readFileSync("out/sitemap.xml", "utf8"); urls.forEach(url => assert.ok(xml.includes(`${url}</loc>`)));
  const variants = privateText.flatMap(t => [t, JSON.stringify(t).slice(1, -1), t.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")]);
  for (const file of fs.readdirSync("out", { recursive: true })) {
    if (typeof file !== "string" || !/\.(html|txt|js|json|xml)$/.test(file)) continue;
    const text = fs.readFileSync(path.join("out", file), "utf8"); assert.ok(!variants.some(v => text.includes(v)), `Private chapter payload bundled: ${file}`);
  }
}
console.log(`LLM validated: ${chapterCount} chapters, ${lessonCount} lessons, ${sections} sections, ${figures} figures, ${tables} tables, ${formulas} display formulas, ${quizPairCount} private quiz pairs.`);
console.log(`Source words: ${counts.reduce((a, b) => a + b, 0).toLocaleString("en-US")}; ${Math.min(...counts)}–${Math.max(...counts)} per lesson.`);
if (built) console.log(`All ${routeCount} LLM routes, canonical URLs, structured data, links, figure rendering, premium gates, and public-export quiz privacy passed.`);
