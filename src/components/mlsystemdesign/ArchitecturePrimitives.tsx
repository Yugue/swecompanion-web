export const width = 224;
export const colors = {
  serving: "var(--color-orange)",
  learning: "var(--color-blue)",
  ingestion: "var(--color-green)",
};

export type PathKind = keyof typeof colors;

export function Service({ x, y, title, detail }: { x: number; y: number; title: string[]; detail: string[] }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={172} rx={12} fill="var(--color-surface)" stroke="var(--color-outline)" strokeWidth={1.5} />
      <text x={x + width / 2} y={y + 34} textAnchor="middle" fill="var(--color-text)" fontSize={21} fontWeight={650}>
        {title.map((line, index) => <tspan key={line} x={x + width / 2} dy={index ? 27 : 0}>{line}</tspan>)}
      </text>
      <text x={x + width / 2} y={y + 96} textAnchor="middle" fill="var(--color-text-muted)" fontSize={18}>
        {detail.map((line, index) => <tspan key={line} x={x + width / 2} dy={index ? 23 : 0}>{line}</tspan>)}
      </text>
    </g>
  );
}

export function Store({ x, y, title, detail }: { x: number; y: number; title: string; detail: string[] }) {
  return (
    <g>
      <path d={`M${x} ${y + 18} C${x} ${y - 6} ${x + width} ${y - 6} ${x + width} ${y + 18} V${y + 154} C${x + width} ${y + 178} ${x} ${y + 178} ${x} ${y + 154} Z`} fill="var(--color-surface)" stroke="var(--color-outline)" strokeWidth={1.5} />
      <path d={`M${x} ${y + 18} C${x} ${y + 42} ${x + width} ${y + 42} ${x + width} ${y + 18}`} fill="none" stroke="var(--color-outline)" strokeWidth={1.5} />
      <text x={x + width / 2} y={y + 61} textAnchor="middle" fill="var(--color-text)" fontSize={20} fontWeight={650}>{title}</text>
      <text x={x + width / 2} y={y + 96} textAnchor="middle" fill="var(--color-text-muted)" fontSize={18}>
        {detail.map((line, index) => <tspan key={line} x={x + width / 2} dy={index ? 23 : 0}>{line}</tspan>)}
      </text>
    </g>
  );
}

export type EdgeProps = { path: string; kind: PathKind; label: string[]; x: number; y: number; dashed?: boolean; markerPrefix?: string };

export function Edge({ path, kind, label, x, y, dashed, markerPrefix = "duplicate" }: EdgeProps) {
  const shortConnection = /^M[\d.]+ [\d.]+ H[\d.]+$/.test(path);
  const lines = shortConnection
    ? label.join(" ").replace(/^\d+\.\s*/, "").split(/\s+/).reduce<string[]>((lines, word) => {
        const last = lines.length - 1;
        if (last >= 0 && `${lines[last]} ${word}`.length <= 10) lines[last] += ` ${word}`;
        else lines.push(word);
        return lines;
      }, [])
    : label;
  const fontSize = shortConnection ? Math.min(14, 140 / Math.max(...lines.map(line => line.length))) : 16;
  return (
    <g>
      <path d={path} fill="none" stroke={colors[kind]} strokeWidth={2.5} strokeDasharray={dashed ? "7 5" : undefined} strokeLinejoin="round" markerEnd={`url(#${markerPrefix}-${kind}-arrow)`} />
      <text x={x} y={y} textAnchor="middle" fill="var(--color-text-muted)" fontSize={fontSize}>
        {lines.map((line, index) => <tspan key={index} x={x} dy={index ? 19 : 0}>{line}</tspan>)}
      </text>
    </g>
  );
}

