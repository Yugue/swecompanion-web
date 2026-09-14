import { parseInline } from "@/lib/lessonParser";
import { InlineMath } from "./Math";

export function InlineMarkdown({ text, className }: { text: string; className?: string }) {
  const tokens = parseInline(text);
  return (
    <span className={className}>
      {tokens.map((token, i) => {
        if (token.kind === "math") return <InlineMath key={i} expr={token.text} />;
        if (token.kind === "code")
          return (
            <code
              key={i}
              className="rounded bg-surface-high px-1 py-px font-mono text-[0.9em]"
            >
              {token.text}
            </code>
          );
        if (token.kind === "bold") return <strong key={i}>{token.text}</strong>;
        return <span key={i}>{token.text}</span>;
      })}
    </span>
  );
}
