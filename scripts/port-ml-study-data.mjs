// One-off conversion script: lib/ml_study_data.dart -> src/lib/mlStudyData.ts (+ scripts/quizAnswers.json)
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync(new URL("../../lib/ml_study_data.dart", import.meta.url), "utf8");

function matchParen(text, openIdx) {
  let depth = 0;
  let inString = false;
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (c === "'") inString = false;
      continue;
    }
    if (c === "'") inString = true;
    else if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error("unbalanced from " + openIdx);
}

function splitArgs(inner) {
  const args = [];
  let depth = 0;
  let inString = false;
  let cur = "";
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (inString) {
      cur += c;
      if (c === "'") inString = false;
      continue;
    }
    if (c === "'") {
      inString = true;
      cur += c;
    } else if (c === "(" || c === "[" || c === "{") {
      depth++;
      cur += c;
    } else if (c === ")" || c === "]" || c === "}") {
      depth--;
      cur += c;
    } else if (c === "," && depth === 0) {
      if (cur.trim()) args.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  if (cur.trim()) args.push(cur.trim());
  return args;
}

function unquote(s) {
  s = s.trim();
  if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1);
  return s;
}

function jsStr(s) {
  return JSON.stringify(s);
}

function parseStringList(text) {
  // text like "[ 'a', 'b', 'c' ]"
  const inner = text.slice(text.indexOf("[") + 1, text.lastIndexOf("]"));
  return splitArgs(inner).map(unquote);
}

const COLOR_VARS = {
  _blue: "#4285F4",
  _red: "#EA4335",
  _yellow: "#FBBC04",
  _green: "#34A853",
  _purple: "#A78BFA",
  _cyan: "#22D3EE",
  _orange: "#F97316",
};

const ICON_MAP = {
  "Icons.foundation_outlined": "Blocks",
  "Icons.hub_outlined": "Share2",
  "Icons.trending_down_rounded": "TrendingDown",
  "Icons.engineering_outlined": "Wrench",
  "Icons.auto_awesome_outlined": "Sparkles",
  "Icons.account_tree_outlined": "GitBranch",
  "Icons.bubble_chart_outlined": "CircleDot",
};

function parseTopicCall(callText) {
  // _topic('id', 'title', 'summary', [keyPoints...], 'interviewPrompt', code: '...')
  const openIdx = callText.indexOf("(");
  const closeIdx = matchParen(callText, openIdx);
  const inner = callText.slice(openIdx + 1, closeIdx);
  const args = splitArgs(inner);
  const topic = {};
  let pos = 0;
  for (const arg of args) {
    const namedMatch = arg.match(/^(\w+):\s*([\s\S]*)$/);
    if (namedMatch) {
      const [, key, valueRaw] = namedMatch;
      if (key === "code") topic.code = unquote(valueRaw.trim());
      continue;
    }
    if (pos === 0) topic.id = unquote(arg);
    else if (pos === 1) topic.title = unquote(arg);
    else if (pos === 2) topic.summary = unquote(arg);
    else if (pos === 3) topic.keyPoints = parseStringList(arg);
    else if (pos === 4) topic.interviewPrompt = unquote(arg);
    pos++;
  }
  return topic;
}

function parseQuizCall(callText) {
  const openIdx = callText.indexOf("(");
  const closeIdx = matchParen(callText, openIdx);
  const inner = callText.slice(openIdx + 1, closeIdx);
  const args = splitArgs(inner);
  return { question: unquote(args[0]), answer: unquote(args[1]) };
}

function findCallsAtTopLevel(text, name) {
  // Find all `name(...)` calls whose contents are not nested inside a *different* name(...) call
  // (used to pull _topic(...)/_quiz(...) items directly out of a `topics:`/`quiz:` list body).
  const results = [];
  let idx = 0;
  while (true) {
    const found = text.indexOf(name + "(", idx);
    if (found === -1) break;
    const close = matchParen(text, found + name.length);
    results.push(text.slice(found, close + 1));
    idx = close + 1;
  }
  return results;
}

function parseMlPart(callText) {
  const openIdx = callText.indexOf("(");
  const closeIdx = matchParen(callText, openIdx);
  const inner = callText.slice(openIdx + 1, closeIdx);
  const args = splitArgs(inner);
  const part = { topics: [], quiz: [] };
  for (const arg of args) {
    const namedMatch = arg.match(/^(\w+):\s*([\s\S]*)$/);
    if (!namedMatch) continue;
    const [, key, valueRaw] = namedMatch;
    const value = valueRaw.trim();
    if (key === "id") part.id = unquote(value);
    else if (key === "number") part.number = unquote(value);
    else if (key === "title") part.title = unquote(value);
    else if (key === "description") part.description = unquote(value);
    else if (key === "color") part.color = COLOR_VARS[value.trim()] ?? "#4285F4";
    else if (key === "icon") part.icon = ICON_MAP[value.trim()] ?? "Blocks";
    else if (key === "topics") part.topics = findCallsAtTopLevel(value, "_topic").map(parseTopicCall);
    else if (key === "quiz") part.quiz = findCallsAtTopLevel(value, "_quiz").map(parseQuizCall);
  }
  return part;
}

const declRe = /final mlParts = <MlPart>\[/;
const m = declRe.exec(src);
const openIdx = m.index + m[0].length - 1;
const closeIdx = matchParen(src, openIdx);
const inner = src.slice(openIdx + 1, closeIdx);

const parts = [];
let idx = 0;
while (true) {
  const found = inner.indexOf("MlPart(", idx);
  if (found === -1) break;
  const close = matchParen(inner, found + "MlPart".length);
  parts.push(parseMlPart(inner.slice(found, close + 1)));
  idx = close + 1;
}

// --- Emit public TS (questions only, no answers) ---
function emitTopic(t, indent) {
  const lines = [];
  lines.push(`${indent}{`);
  lines.push(`${indent}  id: ${jsStr(t.id)},`);
  lines.push(`${indent}  title: ${jsStr(t.title)},`);
  lines.push(`${indent}  summary: ${jsStr(t.summary)},`);
  lines.push(`${indent}  keyPoints: [${t.keyPoints.map(jsStr).join(", ")}],`);
  lines.push(`${indent}  interviewPrompt: ${jsStr(t.interviewPrompt)},`);
  if (t.code) lines.push(`${indent}  code: ${jsStr(t.code)},`);
  lines.push(`${indent}},`);
  return lines.join("\n");
}

function emitPart(p, indent = "  ") {
  const lines = [];
  lines.push(`${indent}{`);
  lines.push(`${indent}  id: ${jsStr(p.id)},`);
  lines.push(`${indent}  number: ${jsStr(p.number)},`);
  lines.push(`${indent}  title: ${jsStr(p.title)},`);
  lines.push(`${indent}  description: ${jsStr(p.description)},`);
  lines.push(`${indent}  color: ${jsStr(p.color)},`);
  lines.push(`${indent}  icon: ${jsStr(p.icon)},`);
  lines.push(`${indent}  topics: [\n${p.topics.map((t) => emitTopic(t, indent + "    ")).join("\n")}\n${indent}  ],`);
  lines.push(
    `${indent}  quiz: [${p.quiz.map((q) => `{ question: ${jsStr(q.question)} }`).join(", ")}],`
  );
  lines.push(`${indent}},`);
  return lines.join("\n");
}

const header = `// AUTO-GENERATED by scripts/port-ml-study-data.mjs from lib/ml_study_data.dart.
// Quiz ANSWERS are intentionally not included here (see scripts/quizAnswers.json) -
// they're premium content served only from Firestore. See the plan's "Premium quiz architecture".

export interface MlTopic {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  interviewPrompt: string;
  code?: string;
}

export interface MlQuizQuestion {
  question: string;
}

export interface MlPart {
  id: string;
  number: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  topics: MlTopic[];
  quiz: MlQuizQuestion[];
}

`;

const out =
  header +
  `export const mlParts: MlPart[] = [\n${parts.map((p) => emitPart(p)).join("\n")}\n];\n\n` +
  `export const mlTopicsById: Record<string, MlTopic> = Object.fromEntries(
  mlParts.flatMap((part) => part.topics.map((topic) => [topic.id, topic] as const))
);

export const mlPartsById: Record<string, MlPart> = Object.fromEntries(mlParts.map((part) => [part.id, part]));

export const mlPartIdForTopic: Record<string, string> = Object.fromEntries(
  mlParts.flatMap((part) => part.topics.map((topic) => [topic.id, part.id] as const))
);

export const mlTopicCount: number = mlParts.reduce((sum, part) => sum + part.topics.length, 0);
`;

writeFileSync(new URL("../src/lib/mlStudyData.generated.ts", import.meta.url), out, "utf8");

// --- Emit the private quiz-answers seed JSON (ml-<partId> -> answers[]) ---
const quizAnswers = {};
for (const part of parts) {
  if (part.quiz.length > 0) {
    quizAnswers[`ml-${part.id}`] = part.quiz.map((q) => q.answer);
  }
}
writeFileSync(
  new URL("../scripts/mlQuizAnswers.generated.json", import.meta.url),
  JSON.stringify(quizAnswers, null, 2),
  "utf8"
);

console.log(
  "Wrote mlStudyData.generated.ts:",
  parts.length,
  "parts,",
  parts.reduce((n, p) => n + p.topics.length, 0),
  "topics,",
  parts.reduce((n, p) => n + p.quiz.length, 0),
  "quiz questions"
);
