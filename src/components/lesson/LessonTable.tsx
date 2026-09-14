import { parseTableRows } from "@/lib/lessonParser";
import { InlineMarkdown } from "./InlineMarkdown";

export function LessonTable({ markdown }: { markdown: string }) {
  const rows = parseTableRows(markdown);
  if (rows.length === 0) return null;
  const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);

  return (
    <div className="my-3 overflow-x-auto rounded-md border border-outline">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex === 0
                  ? "bg-[color-mix(in_srgb,var(--accent)_11%,transparent)]"
                  : rowIndex % 2 === 0
                    ? "bg-surface-high/30"
                    : "bg-surface/40"
              }
            >
              {Array.from({ length: columnCount }).map((_, col) => (
                <td
                  key={col}
                  className={`min-w-[7.25rem] max-w-[21rem] border border-outline/40 px-3 py-2.5 align-top ${
                    rowIndex === 0 ? "font-bold text-text" : "text-text-muted"
                  }`}
                >
                  <InlineMarkdown text={row[col]?.trim() ?? ""} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
