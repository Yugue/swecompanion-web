import type { NlpDesignProblem } from "@/lib/nlpSystemDesignData";

const nodeWidth = 176;
const nodeHeight = 82;
const centerX = (index: number) => 24 + index * 204 + nodeWidth / 2;

export function SystemDesignDiagram({ problem }: { problem: NlpDesignProblem }) {
  const { diagram } = problem;
  const markerId = `${problem.id}-arrow`;
  const titleId = `${problem.id}-diagram-title`;
  const descriptionId = `${problem.id}-diagram-description`;
  const targetX = centerX(diagram.feedsStep) - (diagram.bypass?.fromStep === diagram.feedsStep ? 54 : 0);
  const feedStartX = centerX(diagram.offline.length - 1) + (diagram.feedbackLabel ? 50 : 0);
  const ink = "var(--color-text)";
  const muted = "var(--color-text-muted)";
  const description = [
    `${diagram.servingLabel ?? "Serving"}: ${diagram.online.map((node) => `${node.title} (${node.detail})`).join(" → ")}.`,
    `${diagram.offlineLabel}: ${diagram.offline.map((node) => `${node.title} (${node.detail})`).join(" → ")}.`,
    `${diagram.feedLabel} into serving step ${diagram.feedsStep + 1}.`,
    diagram.bypass ? `Alternative from serving step ${diagram.bypass.fromStep + 1}: ${diagram.bypass.label}.` : "",
    diagram.parallelStep ? `Step ${diagram.parallelStep.index + 1} runs ${diagram.parallelStep.branches.join(" and ")} in parallel and sends both outputs onward.` : "",
    diagram.feedbackLabel ? `Learning feedback: ${diagram.feedbackLabel}.` : "",
    diagram.ingestion ? `New-ticket ingestion: ${diagram.ingestion.nodes.map((node) => `${node.title} (${node.detail})`).join(" → ")}. ${diagram.ingestion.label}.` : "",
  ].filter(Boolean).join(" ");

  return (
    <figure className="overflow-hidden rounded-xl border border-outline/70 bg-surface lg:-mx-24">
      <div
        className="overflow-x-auto p-3 focus-visible:outline-2 focus-visible:outline-accent-blue sm:p-5"
        role="region"
        aria-label={`${problem.title}: scrollable system design diagram`}
        tabIndex={0}
      >
        <svg viewBox={`0 0 1040 ${diagram.ingestion ? 560 : 366}`} className="h-auto w-full min-w-[760px]" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
          <title id={titleId}>{`${problem.title}: system design`}</title>
          <desc id={descriptionId}>{description}</desc>
          <defs>
            <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0 L8 4 L0 8 Z" fill={muted} />
            </marker>
          </defs>
          <text x="24" y="37" fill={muted} fontSize="14" fontWeight="700" letterSpacing="1">{(diagram.servingLabel ?? "Serving path").toUpperCase()}</text>
          <text x="24" y="247" fill={muted} fontSize="14" fontWeight="700" letterSpacing="1">{diagram.offlineLabel.toUpperCase()}</text>
          {diagram.ingestion && <text x="24" y="445" fill={muted} fontSize="14" fontWeight="700" letterSpacing="1">NEW-TICKET INGESTION</text>}
          {([
            { nodes: diagram.online, y: 66, accent: true },
            { nodes: diagram.offline, y: 264, accent: false },
            ...(diagram.ingestion ? [{ nodes: diagram.ingestion.nodes, y: 462, accent: false }] : []),
          ]).map(({ nodes, y, accent }) => (
            <g key={y}>
              {nodes.map((node, index) => (
                <g key={node.title}>
                  {accent && diagram.parallelStep?.index === index ? (
                    <g>
                      {diagram.parallelStep.branches.map((branch, branchIndex) => (
                        <g key={branch}>
                          <rect x={24 + index * 204} y={y + branchIndex * 46} width={nodeWidth} height="36" rx="8" fill="color-mix(in srgb, var(--color-blue) 7%, var(--color-surface))" stroke="color-mix(in srgb, var(--color-blue) 50%, var(--color-outline))" />
                          <text x={centerX(index)} y={y + branchIndex * 46 + 23} textAnchor="middle" fontSize="12.5" fill={ink} fontWeight="650">{branch}</text>
                        </g>
                      ))}
                    </g>
                  ) : (
                    <g>
                      <rect
                        x={24 + index * 204}
                        y={y}
                        width={nodeWidth}
                        height={nodeHeight}
                        rx="10"
                        fill={accent ? "color-mix(in srgb, var(--color-blue) 7%, var(--color-surface))" : "var(--color-bg)"}
                        stroke={accent ? "color-mix(in srgb, var(--color-blue) 50%, var(--color-outline))" : "var(--color-outline)"}
                      />
                      <text x={centerX(index)} y={y + 32} textAnchor="middle" fontSize="14" fill={ink} fontWeight="650">{node.title}</text>
                      <text x={centerX(index)} y={y + 56} textAnchor="middle" fontSize="12.5" fill={muted}>{node.detail}</text>
                    </g>
                  )}
                  {index < nodes.length - 1 && (
                    accent && diagram.parallelStep?.index === index + 1 ? (
                      <g fill="none" stroke={muted} strokeWidth="1.5">
                        <path d={`M${203 + index * 204} ${y + 41} H${214 + index * 204} M${214 + index * 204} ${y + 18} V${y + 64}`} />
                        {[18, 64].map((offset) => <path key={offset} d={`M${214 + index * 204} ${y + offset} H${225 + index * 204}`} markerEnd={`url(#${markerId})`} />)}
                      </g>
                    ) : accent && diagram.parallelStep?.index === index ? (
                      <g fill="none" stroke={muted} strokeWidth="1.5">
                        {[18, 64].map((offset) => <path key={offset} d={`M${203 + index * 204} ${y + offset} H${214 + index * 204}`} />)}
                        <path d={`M${214 + index * 204} ${y + 18} V${y + 64} M${214 + index * 204} ${y + 41} H${225 + index * 204}`} markerEnd={`url(#${markerId})`} />
                      </g>
                    ) : (
                      <path d={`M${24 + index * 204 + nodeWidth + 3} ${y + nodeHeight / 2} h19`} fill="none" stroke={muted} strokeWidth="1.5" markerEnd={`url(#${markerId})`} />
                    )
                  )}
                </g>
              ))}
            </g>
          ))}
          <path
            d={`M${feedStartX} 264 V206 H${targetX} V151`}
            fill="none"
            stroke={muted}
            strokeWidth="1.5"
            strokeDasharray="6 4"
            markerEnd={`url(#${markerId})`}
          />
          <text x={(feedStartX + targetX) / 2} y="192" textAnchor="middle" fill={muted} fontSize="13">{diagram.feedLabel}</text>
          {diagram.feedbackLabel && <g>
            <path d={`M${centerX(diagram.online.length - 1)} 148 V233 H${centerX(0)} V261`} fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeDasharray="3 4" markerEnd={`url(#${markerId})`} />
            <text x="510" y="225" textAnchor="middle" fill={muted} fontSize="12">{diagram.feedbackLabel}</text>
          </g>}
          {diagram.ingestion && <g>
            <path d={`M${centerX(diagram.ingestion.nodes.length - 1)} 462 V410 H1028 V160 H${centerX(diagram.ingestion.feedsStep) + 52} V151`} fill="none" stroke={muted} strokeWidth="1.5" strokeDasharray="7 4" markerEnd={`url(#${markerId})`} />
            <text x="1036" y="310" transform="rotate(-90 1036 310)" textAnchor="middle" fill={muted} fontSize="12">{diagram.ingestion.label}</text>
          </g>}
          {diagram.bypass && (
            <g>
              <path d={`M${centerX(diagram.bypass.fromStep)} 148 V175 H${centerX(diagram.online.length - 1)} V151`} fill="none" stroke={muted} strokeWidth="1.5" markerEnd={`url(#${markerId})`} />
              <text x={(centerX(diagram.bypass.fromStep) + centerX(diagram.online.length - 1)) / 2} y="168" textAnchor="middle" fill={muted} fontSize="12">{diagram.bypass.label}</text>
            </g>
          )}
        </svg>
      </div>
      <figcaption className="border-t border-outline/55 px-5 py-4 text-sm leading-relaxed text-text-muted">
        <p>{diagram.caption}</p>
        <p className="mt-2"><span className="font-semibold text-text">Learning loop: </span>{diagram.learningLoop}</p>
        <p className="mt-2 text-xs sm:hidden">Swipe the diagram to follow each stage.</p>
      </figcaption>
    </figure>
  );
}
