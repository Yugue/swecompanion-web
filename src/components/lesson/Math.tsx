import katex from "katex";

function render(expr: string, displayMode: boolean): string {
  try {
    return katex.renderToString(expr, {
      throwOnError: false,
      // Some lesson source has literal → / × inside \text{...} (e.g. \boxed{\text{3×3 kernel}}) -
      // valid content, just outside KaTeX's default strict Unicode allowlist.
      strict: false,
      displayMode,
      output: "html",
    });
  } catch {
    return expr;
  }
}

export function InlineMath({ expr }: { expr: string }) {
  return <span dangerouslySetInnerHTML={{ __html: render(expr, false) }} />;
}

export function DisplayMath({ expr }: { expr: string }) {
  return <span dangerouslySetInnerHTML={{ __html: render(expr, true) }} />;
}
