// One-off conversion script: lib/study_data.dart -> src/lib/studyData.ts
// Not part of the shipped app; run once with `node scripts/port-study-data.mjs`.
import { readFileSync, writeFileSync } from "node:fs";
import { LEETCODE_QUIZZES } from "./leetcodeQuizContent.mjs";

const src = readFileSync(new URL("../../lib/study_data.dart", import.meta.url), "utf8");

// Find the char index right after `name(` and return the index of the matching `)`,
// respecting nested (), [], {} and simple single-quoted strings (no escapes/interpolation
// in this file, confirmed separately).
function matchParen(text, openIdx) {
  let depth = 0;
  let inString = false;
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (c === "'") inString = false;
      continue;
    }
    if (c === "'") {
      inString = true;
    } else if (c === "(" || c === "[" || c === "{") {
      depth++;
    } else if (c === ")" || c === "]" || c === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error("unbalanced parens from " + openIdx);
}

// Split a call's inner argument text on top-level commas.
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

function parseStudyProblem(callText) {
  // callText is like: StudyProblem('1', 'Two Sum', initiallyComplete: true, difficulty: 'Hard', subcategory: '...')
  const openIdx = callText.indexOf("(");
  const closeIdx = matchParen(callText, openIdx);
  const inner = callText.slice(openIdx + 1, closeIdx);
  const args = splitArgs(inner);
  const obj = { initiallyComplete: false };
  let posIndex = 0;
  for (const arg of args) {
    const namedMatch = arg.match(/^(\w+):\s*([\s\S]*)$/);
    if (namedMatch) {
      const [, key, valueRaw] = namedMatch;
      const value = valueRaw.trim();
      if (key === "initiallyComplete") obj.initiallyComplete = value === "true";
      else if (key === "difficulty") obj.difficulty = unquote(value);
      else if (key === "slug") obj.slug = unquote(value);
      else if (key === "subcategory") obj.subcategory = unquote(value);
    } else {
      if (posIndex === 0) obj.id = unquote(arg);
      else if (posIndex === 1) obj.title = unquote(arg);
      posIndex++;
    }
  }
  return obj;
}

const ICON_MAP = {
  "Icons.data_object_rounded": "Braces",
  "Icons.sort_rounded": "ArrowDownUp",
  "Icons.view_week_rounded": "Columns3",
  "Icons.compare_arrows_rounded": "ArrowLeftRight",
  "Icons.layers_rounded": "Layers",
  "Icons.search_rounded": "Search",
  "Icons.link_rounded": "Link",
  "Icons.account_tree_outlined": "GitBranch",
  "Icons.alt_route_rounded": "Route",
  "Icons.calendar_view_week_rounded": "CalendarRange",
  "Icons.developer_board_rounded": "CircuitBoard",
  "Icons.flag_rounded": "Flag",
  "Icons.hub_outlined": "Share2",
  "Icons.join_inner_rounded": "Combine",
  "Icons.manage_search_rounded": "Search",
  "Icons.park_outlined": "TreePine",
  "Icons.schema_rounded": "Network",
  "Icons.stacked_line_chart_rounded": "LineChart",
  "Icons.trending_up_rounded": "TrendingUp",
  "Icons.checklist_rounded": "ListChecks",
};

function parseColor(colorText) {
  // Color(0xFF4285F4) -> #4285F4
  const m = colorText.match(/0x([0-9A-Fa-f]{8})/);
  if (!m) return "#4285F4";
  return "#" + m[1].slice(2);
}

function parseStudyTopic(callText) {
  const openIdx = callText.indexOf("(");
  const closeIdx = matchParen(callText, openIdx);
  const inner = callText.slice(openIdx + 1, closeIdx);
  const args = splitArgs(inner);
  const topic = {};
  for (const arg of args) {
    const namedMatch = arg.match(/^(\w+):\s*([\s\S]*)$/);
    if (!namedMatch) continue;
    const [, key, valueRaw] = namedMatch;
    const value = valueRaw.trim();
    if (key === "group") topic.group = unquote(value);
    else if (key === "title") topic.title = unquote(value);
    else if (key === "shortTitle") topic.shortTitle = unquote(value);
    else if (key === "icon") topic.icon = ICON_MAP[value.trim()] || "Shapes";
    else if (key === "color") topic.color = parseColor(value);
    else if (key === "note") topic.note = unquote(value);
    else if (key === "problems") {
      const problems = [];
      const problemsInner = value.slice(value.indexOf("[") + 1, value.lastIndexOf("]"));
      let idx = 0;
      while (true) {
        const found = problemsInner.indexOf("StudyProblem(", idx);
        if (found === -1) break;
        const pClose = matchParen(problemsInner, problemsInner.indexOf("(", found));
        problems.push(parseStudyProblem(problemsInner.slice(found, pClose + 1)));
        idx = pClose + 1;
      }
      topic.problems = problems;
    }
  }
  return topic;
}

function parseTopicList(varName) {
  const declRe = new RegExp("const " + varName + " = <StudyTopic>\\[");
  const m = declRe.exec(src);
  if (!m) throw new Error("not found: " + varName);
  const openIdx = m.index + m[0].length - 1;
  const closeIdx = matchParen(src, openIdx);
  const inner = src.slice(openIdx + 1, closeIdx);
  const topics = [];
  let idx = 0;
  while (true) {
    const found = inner.indexOf("StudyTopic(", idx);
    if (found === -1) break;
    const close = matchParen(inner, inner.indexOf("(", found));
    topics.push(parseStudyTopic(inner.slice(found, close + 1)));
    idx = close + 1;
  }
  return topics;
}

const coreStudyTopics = parseTopicList("coreStudyTopics");
const challengeTopics = parseTopicList("challengeTopics");

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function emitTopic(t, indent = "  ") {
  const lines = [];
  lines.push(`${indent}{`);
  lines.push(`${indent}  slug: ${jsStr(slugify(t.title))},`);
  lines.push(`${indent}  group: ${jsStr(t.group)},`);
  lines.push(`${indent}  title: ${jsStr(t.title)},`);
  lines.push(`${indent}  shortTitle: ${jsStr(t.shortTitle)},`);
  lines.push(`${indent}  icon: ${jsStr(t.icon)},`);
  lines.push(`${indent}  color: ${jsStr(t.color)},`);
  lines.push(`${indent}  note: ${jsStr(t.note)},`);
  lines.push(`${indent}  problems: [`);
  for (const p of t.problems) {
    const parts = [`id: ${jsStr(p.id)}`, `title: ${jsStr(p.title)}`];
    if (p.initiallyComplete) parts.push(`initiallyComplete: true`);
    if (p.difficulty) parts.push(`difficulty: ${jsStr(p.difficulty)}`);
    if (p.slug) parts.push(`slug: ${jsStr(p.slug)}`);
    if (p.subcategory) parts.push(`subcategory: ${jsStr(p.subcategory)}`);
    lines.push(`${indent}    { ${parts.join(", ")} },`);
  }
  lines.push(`${indent}  ],`);
  const quiz = LEETCODE_QUIZZES[slugify(t.title)];
  if (quiz) {
    lines.push(`${indent}  quizQuestionCount: ${quiz.length},`);
  }
  lines.push(`${indent}},`);
  return lines.join("\n");
}

const header = `// AUTO-GENERATED by scripts/port-study-data.mjs from lib/study_data.dart.
// Ported verbatim (same ids/order) from the Flutter app's data model.

export interface StudyProblem {
  id: string;
  title: string;
  initiallyComplete?: boolean;
  difficulty?: "Easy" | "Medium" | "Hard";
  slug?: string;
  subcategory?: string;
}

export interface StudyTopic {
  slug: string;
  group: string;
  title: string;
  shortTitle: string;
  icon: string;
  color: string;
  note: string;
  problems: StudyProblem[];
  // Quiz questions AND answers are premium content, served only from Firestore
  // (see quizzes/{quizId} + firestore.rules) - only the count is public.
  quizQuestionCount?: number;
}

export function leetCodeSlug(p: StudyProblem): string {
  return (
    p.slug ??
    p.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

export function leetCodeUrl(p: StudyProblem): string {
  return \`https://leetcode.com/problems/\${leetCodeSlug(p)}/\`;
}

`;

const out =
  header +
  `export const coreStudyTopics: StudyTopic[] = [\n${coreStudyTopics.map((t) => emitTopic(t)).join("\n")}\n];\n\n` +
  `export const challengeTopics: StudyTopic[] = [\n${challengeTopics.map((t) => emitTopic(t)).join("\n")}\n];\n\n` +
  `export const studyTopics: StudyTopic[] = [...coreStudyTopics, ...challengeTopics];

export const coreProblemIds: Set<string> = new Set(
  coreStudyTopics.flatMap((topic) => topic.problems.map((p) => p.id))
);

export const initialCompletedProblems: Set<string> = new Set(
  studyTopics.flatMap((topic) => topic.problems.filter((p) => p.initiallyComplete).map((p) => p.id))
);

export const uniqueProblems: StudyProblem[] = (() => {
  const byId = new Map<string, StudyProblem>();
  for (const topic of studyTopics) {
    for (const problem of topic.problems) {
      if (!byId.has(problem.id)) byId.set(problem.id, problem);
    }
  }
  return [...byId.values()];
})();

export const studyTopicsBySlug: Record<string, StudyTopic> = Object.fromEntries(
  studyTopics.map((t) => [t.slug, t])
);
`;

writeFileSync(new URL("../src/lib/studyData.generated.ts", import.meta.url), out, "utf8");

const leetcodeQuizzes = Object.fromEntries(
  Object.entries(LEETCODE_QUIZZES).map(([slug, questions]) => [
    `lc-${slug}`,
    { questions: questions.map((q) => q.question), answers: questions.map((q) => q.answer) },
  ])
);
writeFileSync(
  new URL("./leetcodeQuizzes.generated.json", import.meta.url),
  JSON.stringify(leetcodeQuizzes, null, 2),
  "utf8"
);

console.log(
  "Wrote studyData.generated.ts:",
  coreStudyTopics.length,
  "core topics,",
  challengeTopics.length,
  "challenge topics,",
  coreStudyTopics.reduce((n, t) => n + t.problems.length, 0) +
    challengeTopics.reduce((n, t) => n + t.problems.length, 0),
  "problems"
);
