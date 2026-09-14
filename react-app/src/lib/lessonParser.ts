// Ported 1:1 from lib/ml_lesson_view.dart's bespoke markdown-subset parser, so all 57 lesson
// files in src/content/ml-lessons render identically to the Flutter app, unedited.

export type LessonBlockType =
  | "heading1"
  | "heading2"
  | "heading3"
  | "paragraph"
  | "bullet"
  | "numbered"
  | "quote"
  | "code"
  | "diagram"
  | "table"
  | "math"
  | "divider";

export interface LessonBlock {
  type: LessonBlockType;
  text: string;
}

const NUMBERED_ITEM = /^\d+\.\s+/;
const DIAGRAM_CHARS = /[↓↑→←│─┌┐└┘├┤┬┴▼▲]/;

function isTableLine(line: string): boolean {
  return line.startsWith("|") && line.endsWith("|") && line.length > 2;
}

function tableCells(line: string): string[] {
  const trimmed = line.trim();
  if (!isTableLine(trimmed)) return [];
  return trimmed.slice(1, -1).split("|");
}

function startsTable(lines: string[], index: number): boolean {
  if (index + 1 >= lines.length || !isTableLine(lines[index].trim())) return false;
  const separatorCells = tableCells(lines[index + 1]);
  return (
    separatorCells.length > 0 && separatorCells.every((cell) => /^:?-{3,}:?$/.test(cell.trim()))
  );
}

function looksLikeDiagram(text: string): boolean {
  return DIAGRAM_CHARS.test(text);
}

function isBoundary(line: string): boolean {
  const trimmed = line.trim();
  return (
    trimmed.length === 0 ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("```") ||
    trimmed === "\\[" ||
    trimmed === "\\]" ||
    trimmed === "---" ||
    trimmed.startsWith("- ") ||
    trimmed.startsWith("* ") ||
    NUMBERED_ITEM.test(trimmed) ||
    trimmed.startsWith(">") ||
    isTableLine(trimmed)
  );
}

function removeSourceTitle(lines: string[]): void {
  while (lines.length > 0 && lines[0].trim().length === 0) lines.shift();
  if (lines.length === 0 || !lines[0].trim().startsWith("#")) return;
  const wasPartHeading = lines[0].trim().startsWith("## Part ");
  lines.shift();
  while (lines.length > 0 && lines[0].trim().length === 0) lines.shift();
  if (wasPartHeading && lines.length > 0 && lines[0].trim().startsWith("### Topic ")) {
    lines.shift();
  }
}

export function parseLesson(source: string): LessonBlock[] {
  const lines = source.replace(/\r/g, "").split("\n");
  removeSourceTitle(lines);
  const blocks: LessonBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].replace(/\s+$/, "");
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      index++;
      continue;
    }
    if (trimmed === "---") {
      blocks.push({ type: "divider", text: "" });
      index++;
      continue;
    }
    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim().toLowerCase();
      index++;
      const content: string[] = [];
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        content.push(lines[index]);
        index++;
      }
      if (index < lines.length) index++;
      const fencedText = content.join("\n").replace(/\s+$/, "");
      blocks.push({
        type: language === "text" && looksLikeDiagram(fencedText) ? "diagram" : "code",
        text: fencedText,
      });
      continue;
    }
    if (trimmed === "\\[") {
      index++;
      const content: string[] = [];
      while (index < lines.length && lines[index].trim() !== "\\]") {
        content.push(lines[index]);
        index++;
      }
      if (index < lines.length) index++;
      blocks.push({ type: "math", text: content.join("\n").trim() });
      continue;
    }
    if (startsTable(lines, index)) {
      const content: string[] = [];
      while (index < lines.length && isTableLine(lines[index].trim())) {
        content.push(lines[index].trim());
        index++;
      }
      blocks.push({ type: "table", text: content.join("\n") });
      continue;
    }
    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "heading3", text: trimmed.slice(4) });
      index++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "heading2", text: trimmed.slice(3) });
      index++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      blocks.push({ type: "heading1", text: trimmed.slice(2) });
      index++;
      continue;
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      blocks.push({ type: "bullet", text: trimmed.slice(2) });
      index++;
      continue;
    }
    if (NUMBERED_ITEM.test(trimmed)) {
      blocks.push({ type: "numbered", text: trimmed });
      index++;
      continue;
    }
    if (trimmed.startsWith(">")) {
      const content: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        content.push(lines[index].trim().replace(/^>\s?/, ""));
        index++;
      }
      blocks.push({ type: "quote", text: content.join(" ") });
      continue;
    }

    const paragraph = [trimmed];
    index++;
    while (index < lines.length && !isBoundary(lines[index])) {
      paragraph.push(lines[index].trim());
      index++;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

export function parseTableRows(markdown: string): string[][] {
  const rawRows = markdown.split("\n").map(tableCells);
  if (rawRows.length < 2) return [];
  return [rawRows[0], ...rawRows.slice(2)];
}

/**
 * Plain-text fallback conversion for LaTeX-ish commands that show up outside a math span
 * (e.g. bare `\rightarrow` in prose). Ported from `_readableInline` in ml_lesson_view.dart.
 */
export function readableInline(value: string): string {
  let result = value
    .replaceAll("\\(", "")
    .replaceAll("\\)", "")
    .replaceAll("\\rightarrow", "→")
    .replaceAll("\\Rightarrow", "⇒")
    .replaceAll("\\leftarrow", "←")
    .replaceAll("\\times", "×")
    .replaceAll("\\cdot", "·")
    .replaceAll("\\approx", "≈")
    .replaceAll("\\neq", "≠")
    .replaceAll("\\leq", "≤")
    .replaceAll("\\geq", "≥")
    .replaceAll("\\nabla", "∇")
    .replaceAll("\\partial", "∂")
    .replaceAll("\\sum", "Σ")
    .replaceAll("\\theta", "θ")
    .replaceAll("\\lambda", "λ")
    .replaceAll("\\sigma", "σ")
    .replaceAll("\\mu", "μ");
  result = result.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (_m, a, b) => `(${a})/(${b})`);
  result = result.replace(/\\sqrt\{([^{}]+)\}/g, (_m, a) => `√(${a})`);
  result = result.replace(/\\(?:text|mathrm|mathbf|mathbb)\{([^{}]+)\}/g, (_m, a) => a);
  result = result.replaceAll("{{", "{").replaceAll("}}", "}");
  result = result.replace(/_\{([^{}]+)\}/g, (_m, a) => `_${a}`);
  result = result.replace(/\^\{([^{}]+)\}/g, (_m, a) => `^${a}`);
  return result;
}

export interface InlineToken {
  kind: "text" | "bold" | "code" | "math";
  text: string;
}

const INLINE_PATTERN = /(\*\*|`[^`]*`|\\\(.*?\\\))/g;

/** Ported from `_InlineMarkdown` in ml_lesson_view.dart: splits text into plain/bold/code/math runs. */
export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let cursor = 0;
  let bold = false;
  INLINE_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;

  const appendText = (value: string) => {
    if (!value) return;
    tokens.push({ kind: bold ? "bold" : "text", text: readableInline(value) });
  };

  while ((match = INLINE_PATTERN.exec(text))) {
    appendText(text.slice(cursor, match.index));
    const token = match[0];
    if (token === "**") {
      bold = !bold;
    } else if (token.startsWith("\\(")) {
      tokens.push({ kind: "math", text: token.slice(2, -2) });
    } else {
      tokens.push({ kind: "code", text: token.slice(1, -1) });
    }
    cursor = match.index + token.length;
  }
  appendText(text.slice(cursor));
  return tokens;
}
