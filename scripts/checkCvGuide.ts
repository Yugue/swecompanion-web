import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { cvParts, cvTopics, cvLessonNumbers, cvReferencesByTopic } from "../src/lib/cvStudyData";
import { getLessonBlocks } from "../src/lib/getLessonBlocks";
import { parseInline, parseTableRows } from "../src/lib/lessonParser";
import { CV_PATH } from "../src/lib/mlDomains";

// Validate the actual authored content through the same parser used by lesson pages.
// This catches missing pages, broken prerequisites, unsupported source formatting,
// malformed tables, and equations that the renderer would silently show as errors.
assert.deepEqual(cvParts.map((part) => part.topics.length), [6, 7, 6, 6, 9, 5, 6, 3]);
assert.equal(new Set(cvParts.map((part) => part.id)).size, 8);
assert.equal(cvTopics.length, 48);
assert.equal(new Set(cvTopics.map((topic) => topic.id)).size, 48);
const directory = path.join(process.cwd(), "src/content/cv-lessons");
assert.deepEqual(
  fs.readdirSync(directory).filter((file) => file.endsWith(".md")).sort(),
  cvTopics.map((topic) => `${topic.id}.md`).sort(),
);

let equations = 0;
let tables = 0;
let diagrams = 0;
let examples = 0;
let words = 0;
const seen = new Set<string>();
for (const topic of cvTopics) {
  const source = fs.readFileSync(path.join(directory, `${topic.id}.md`), "utf8");
  const blocks = getLessonBlocks(topic.id, "cv");
  const wordCount = source.split(/\s+/).filter(Boolean).length;
  words += wordCount;
  assert.ok(source.startsWith(`# ${cvLessonNumbers[topic.id]} ${topic.title}\n`), `${topic.id}: title/number mismatch`);
  assert.ok(blocks.filter((block) => block.type === "heading2").length >= 6, `${topic.id}: missing conceptual sections`);
  assert.match(source, /\*\*Question:\*\*/);
  assert.match(source, /\*\*Answer(?: structure)?:\*\*/);
  assert.equal((source.match(/^```/gm) ?? []).length % 2, 0, `${topic.id}: unclosed code fence`);
  assert.equal((source.match(/^\\\[$/gm) ?? []).length, (source.match(/^\\\]$/gm) ?? []).length, `${topic.id}: unclosed math`);
  for (const prerequisite of topic.prerequisites) {
    assert.ok(seen.has(prerequisite), `${topic.id}: missing or later prerequisite ${prerequisite}`);
  }
  seen.add(topic.id);

  for (const block of blocks) {
    if (block.type === "math") {
      katex.renderToString(block.text, { throwOnError: true, strict: false });
      equations++;
    } else if (block.type === "table") {
      const rows = parseTableRows(block.text);
      assert.ok(rows.length >= 2, `${topic.id}: empty table`);
      assert.ok(rows.every((row) => row.length === rows[0].length), `${topic.id}: uneven table columns`);
      tables++;
    } else if (block.type === "diagram") {
      diagrams++;
    } else if (block.type === "code") {
      examples++;
    }
    for (const token of parseInline(block.text)) {
      if (token.kind === "math") katex.renderToString(token.text, { throwOnError: true, strict: false });
    }
  }
}
for (const part of cvParts) {
  for (const reference of part.references) assert.equal(new URL(reference.url).protocol, "https:");
}
for (const [topicId, references] of Object.entries(cvReferencesByTopic)) {
  assert.ok(seen.has(topicId), `References point to unknown lesson ${topicId}`);
  for (const reference of references) assert.equal(new URL(reference.url).protocol, "https:");
}
assert.ok(equations >= 30);
assert.ok(tables >= 20);
assert.ok(diagrams >= 20);
assert.ok(examples >= 10);

if (process.argv.includes("--export")) {
  const validPaths = new Set([CV_PATH, ...cvTopics.map((topic) => `${CV_PATH}/${topic.id}`)]);
  const hub = fs.readFileSync(path.join(process.cwd(), "out", `${CV_PATH.slice(1)}.html`), "utf8");
  assert.ok(hub.includes("48") && hub.includes("full lessons"), "Exported hub is missing lesson count");
  const sitemap = fs.readFileSync(path.join(process.cwd(), "out/sitemap.xml"), "utf8");
  for (const topic of cvTopics) {
    const lessonPath = `${CV_PATH}/${topic.id}`;
    const html = fs.readFileSync(path.join(process.cwd(), "out", `${lessonPath.slice(1)}.html`), "utf8");
    assert.match(html, /<article aria-label="Full lesson"/);
    assert.ok(html.includes("Question:") && html.includes("Answer"), `${topic.id}: missing exported interview practice`);
    assert.ok(!html.includes("katex-error"), `${topic.id}: math rendering failed in exported page`);
    assert.ok(html.includes(`rel="canonical" href=`) && html.includes(lessonPath), `${topic.id}: missing canonical`);
    assert.ok(sitemap.includes(`${lessonPath}</loc>`), `${topic.id}: missing sitemap entry`);
    for (const match of html.matchAll(/href="(\/mldomain\/cv[^"\s]*)"/g)) {
      const target = match[1].split(/[?#]/)[0];
      assert.ok(validPaths.has(target), `${topic.id}: broken internal link ${target}`);
    }
  }
  console.log("Static export validated: CV hub, all 48 lesson pages, canonical URLs, internal links, and sitemap entries.");
}
console.log(`CV guide validated: ${cvTopics.length} lessons, ${words} words, ${equations} equations, ${tables} tables, ${diagrams} diagrams, ${examples} examples.`);
