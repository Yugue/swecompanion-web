import type { ArchitectureGraph } from "@/lib/systemDesignArchitecture";
import { colors, width, Service, Store, Edge, type PathKind } from "./ArchitecturePrimitives";

const pathLabels = {
  serving: "Orange · Serving",
  learning: "Blue · Learning and evaluation",
  ingestion: "Green · Data and release updates",
};

export function SystemDesignArchitecture({ id, title, graph }: { id: string; title: string; graph: ArchitectureGraph }) {
  const paths = (Object.keys(colors) as PathKind[]).filter(kind => graph.edges.some(edge => edge.kind === kind));
  return (
    <figure className="my-5 overflow-hidden rounded-xl border border-outline bg-surface lg:-mx-28 xl:-mx-52">
      <div role="region" aria-label={`${title}: scrollable architecture`} tabIndex={0} className="overflow-x-auto p-3 focus-visible:outline-2 focus-visible:outline-accent-blue sm:p-5">
        <svg viewBox="0 0 1504 1020" className="h-auto w-full min-w-[1240px]" role="img" aria-labelledby={`${id}-architecture-title ${id}-architecture-description`}>
          <title id={`${id}-architecture-title`}>{`${title}: architecture`}</title>
          <desc id={`${id}-architecture-description`}>{graph.description}</desc>
          <defs>
            {paths.map(kind => (
              <marker key={kind} id={`${id}-${kind}-arrow`} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 Z" fill={colors[kind]} />
              </marker>
            ))}
          </defs>
          {paths.map((kind, index) => (
            <g key={kind}>
              <path d={`M${32 + index * 460} 30 h38`} stroke={colors[kind]} strokeWidth={3} />
              <text x={82 + index * 460} y={36} fill="var(--color-text-muted)" fontSize={19}>{pathLabels[kind]}</text>
            </g>
          ))}
          <text x={32} y={94} fill="var(--color-text-muted)" fontSize={17} fontWeight={700} letterSpacing={1}>{graph.primaryLabel ?? "SERVING"}</text>
          <text x={32} y={748} fill="var(--color-text-muted)" fontSize={17} fontWeight={700} letterSpacing={1}>{graph.learningLabel ?? "LEARNING AND EVALUATION"}</text>
          {graph.nodes.map(node => {
            const key = `${node.x}-${node.y}`;
            if (node.kind === "store") return <Store key={key} x={node.x} y={node.y} title={node.title.join(" ")} detail={[node.detail]} />;
            if (node.kind === "result") return (
              <g key={key}>
                <rect x={node.x} y={node.y} width={width} height={172} rx={70} fill="color-mix(in srgb, var(--color-orange) 7%, var(--color-surface))" stroke="var(--color-orange)" strokeWidth={2} />
                <text x={node.x + width / 2} y={node.y + 44} textAnchor="middle" fill="var(--color-text)" fontSize={20} fontWeight={650}>
                  {node.title.map((line, index) => <tspan key={line} x={node.x + width / 2} dy={index ? 27 : 0}>{line}</tspan>)}
                </text>
                <text x={node.x + width / 2} y={node.y + 110} textAnchor="middle" fill="var(--color-text-muted)" fontSize={18}>{node.detail}</text>
              </g>
            );
            return <Service key={key} x={node.x} y={node.y} title={node.title} detail={[node.detail]} />;
          })}
          {graph.edges.map((edge, index) => <Edge key={index} {...edge} markerPrefix={id} />)}
        </svg>
      </div>
      <figcaption className="border-t border-outline/60 px-5 py-4 text-sm leading-relaxed text-text-muted">
        {graph.caption}
        <p className="mt-2 text-xs">Scroll horizontally to follow the flow.</p>
      </figcaption>
    </figure>
  );
}
