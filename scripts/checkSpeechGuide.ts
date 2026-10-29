import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { speechParts, speechTopics, speechLessonNumbers } from "../src/lib/speechStudyData";
import { getLessonBlocks, lessonExists } from "../src/lib/getLessonBlocks";
import { parseInline, parseTableRows } from "../src/lib/lessonParser";
import { SPEECH_PATH, ML_DOMAINS } from "../src/lib/mlDomains";
import { isSpeechVisualId } from "../src/lib/speechVisuals";

assert.deepEqual(speechParts.map((part) => part.topics.length), [6, 6, 4, 5, 4, 6]);
assert.equal(new Set(speechParts.map((part) => part.id)).size, 6);
assert.equal(speechTopics.length, 31);
assert.equal(new Set(speechTopics.map((topic) => topic.id)).size, 31);
assert.equal(ML_DOMAINS.find((domain) => domain.name === "Speech / Audio")?.href, SPEECH_PATH);
const directory = path.join(process.cwd(), "src/content/speech-lessons");
assert.deepEqual(fs.readdirSync(directory).filter((file) => file.endsWith(".md")).sort(),
  speechTopics.map((topic) => topic.id + ".md").sort());

let equations = 0, tables = 0, diagrams = 0, examples = 0, figures = 0, words = 0;
const seen = new Set<string>();
for (const topic of speechTopics) {
  assert.ok(lessonExists(topic.id, "speech"));
  const source = fs.readFileSync(path.join(directory, topic.id + ".md"), "utf8");
  const blocks = getLessonBlocks(topic.id, "speech");
  words += source.split(/\s+/).filter(Boolean).length;
  assert.ok(source.startsWith("# " + speechLessonNumbers[topic.id] + " " + topic.title + "\n"));
  const headings = blocks.filter((block) => block.type === "heading2");
  assert.ok(headings.length >= 6 && headings.length <= 11, topic.id + ": section granularity");
  assert.doesNotMatch(source, /Interview reasoning|\*\*(?:Question|Answer):\*\*/i);
  const fences = source.match(new RegExp("^" + String.fromCharCode(96).repeat(3), "gm")) ?? [];
  assert.equal(fences.length % 2, 0, topic.id + ": unclosed fence");
  assert.equal((source.match(/^\\\[$/gm) ?? []).length, (source.match(/^\\\]$/gm) ?? []).length);
  assert.doesNotMatch(source, /\b(?:TODO|TBD|coming soon)\b/i);
  for (const prerequisite of topic.prerequisites) {
    assert.ok(seen.has(prerequisite), topic.id + ": prerequisite must precede lesson: " + prerequisite);
  }
  seen.add(topic.id);
  for (const block of blocks) {
    if (block.type === "math") {
      katex.renderToString(block.text, { throwOnError: true, strict: false }); equations++;
    } else if (block.type === "table") {
      const rows = parseTableRows(block.text);
      assert.ok(rows.length >= 2);
      assert.ok(rows.every((row) => row.length === rows[0].length), topic.id + ": uneven table");
      tables++;
    } else if (block.type === "speech-visual") {
      assert.ok(isSpeechVisualId(block.text.trim()));
      const file = path.join(process.cwd(), "public/speech", block.text.trim() + ".svg");
      assert.ok(fs.existsSync(file));
      assert.match(fs.readFileSync(file, "utf8"), /<svg/);
      figures++;
    } else if (block.type === "diagram") diagrams++;
    else if (block.type === "code") {
      assert.ok(block.text.split("\n").length <= 8, topic.id + ": oversized code example");
      examples++;
    }
    if (["paragraph", "bullet", "heading2", "heading3", "quote", "table"].includes(block.type)) {
      for (const token of parseInline(block.text)) {
        if (token.kind === "math") katex.renderToString(token.text, { throwOnError: true, strict: false });
      }
    }
  }
}
for (const part of speechParts) {
  assert.ok(part.references.length > 0);
  for (const reference of part.references) assert.equal(new URL(reference.url).protocol, "https:");
}
assert.ok(figures === 6 && equations >= 25 && tables >= 12 && diagrams >= 15 && examples >= 5);

if (process.argv.includes("--export")) {
  const validPaths = new Set([SPEECH_PATH, ...speechTopics.map((topic) => SPEECH_PATH + "/" + topic.id)]);
  const hub = fs.readFileSync(path.join("out", SPEECH_PATH.slice(1) + ".html"), "utf8");
  assert.ok(hub.includes("31") && hub.includes("Speech / Audio"));
  const sitemap = fs.readFileSync("out/sitemap.xml", "utf8");
  for (const topic of speechTopics) {
    const lessonPath = SPEECH_PATH + "/" + topic.id;
    const html = fs.readFileSync(path.join("out", lessonPath.slice(1) + ".html"), "utf8");
    assert.match(html, /<article aria-label="Full lesson"/);
    assert.ok(!html.includes("Interview reasoning"), topic.id + ": removed section still exported");
    assert.ok(!html.includes("katex-error"), topic.id + ": failed math");
    assert.ok(html.includes('rel="canonical"') && html.includes(lessonPath));
    assert.ok(sitemap.includes(lessonPath + "</loc>"));
    for (const block of getLessonBlocks(topic.id, "speech").filter((block) => block.type === "speech-visual")) {
      assert.ok(html.includes('data-speech-visual="' + block.text.trim() + '"'));
    }
    for (const match of html.matchAll(/href="(\/mldomain\/speech[^"\s]*)"/g)) {
      assert.ok(validPaths.has(match[1].split(/[?#]/)[0]), topic.id + ": invalid internal link");
    }
  }
  console.log("Static export verified: hub, all 31 lessons, equations, figures, navigation, canonicals, sitemap.");
}
console.log("Speech / Audio guide: " + JSON.stringify({ lessons: speechTopics.length, words, equations, tables, diagrams, figures, examples }));
