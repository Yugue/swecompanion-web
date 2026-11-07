import { colors, width, Service, Store, Edge, type PathKind } from "./ArchitecturePrimitives";

export function DuplicateDetectionArchitecture() {
  return (
    <figure className="my-5 overflow-hidden rounded-xl border border-outline bg-surface lg:-mx-28 xl:-mx-52">
      <div role="region" aria-label="Scrollable duplicate detection architecture" tabIndex={0} className="overflow-x-auto p-3 focus-visible:outline-2 focus-visible:outline-accent-blue sm:p-5">
        <svg viewBox="0 0 1504 1020" className="h-auto w-full min-w-[1240px]" role="img" aria-labelledby="duplicate-architecture-title duplicate-architecture-description">
          <title id="duplicate-architecture-title">Semantic duplicate detection architecture</title>
          <desc id="duplicate-architecture-description">
            Orange serving path. A multilingual Sentence-BERT encoder produces a query vector.
            Search the main and delta indexes for 20 candidates, compare each pair with a cross-encoder,
            apply a calibrated threshold, and resolve accepted tickets to their current canonical group.
            Return the canonical ID or NOVEL and log the result. Green ingestion path. New and updated
            tickets are embedded and inserted independently of the duplicate verdict. Blue learning path.
            Sample predictions and reviewer corrections, assemble reviewed pairs, train candidate models
            and build their candidate index, evaluate against the live release, and register an approved
            bundle. Catch up new arrivals and activate the encoder, verifier, thresholds, and compatible
            index together, retaining the previous release for rollback.
          </desc>
          <defs>
            {(Object.keys(colors) as PathKind[]).map((kind) => (
              <marker key={kind} id={`duplicate-${kind}-arrow`} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 Z" fill={colors[kind]} />
              </marker>
            ))}
          </defs>

          {([
            { kind: "serving", x: 32, label: "Orange · Serving" },
            { kind: "learning", x: 380, label: "Blue · Learning and evaluation" },
            { kind: "ingestion", x: 916, label: "Green · Ingestion and activation" },
          ] as const).map(({ kind, x, label }) => (
            <g key={kind}>
              <path d={`M${x} 30 h38`} stroke={colors[kind]} strokeWidth={3} />
              <text x={x + 50} y={36} fill="var(--color-text-muted)" fontSize={19}>{label}</text>
            </g>
          ))}

          <text x={32} y={94} fill="var(--color-text-muted)" fontSize={17} fontWeight={700} letterSpacing={1}>SERVING · ONE NEW TICKET</text>
          <Service
            x={32}
            y={146}
            title={["Inference service", "SBERT bi-encoder"]}
            detail={["Text → vector"]}
          />
          <Store
            x={336}
            y={146}
            title="Ticket search store"
            detail={["Find similar tickets"]}
          />
          <Service
            x={640}
            y={146}
            title={["Cross-encoder", "pair verifier"]}
            detail={["Score ticket pairs"]}
          />
          <Service
            x={944}
            y={146}
            title={["Decision policy"]}
            detail={["Match or NOVEL"]}
          />
          <g>
            <rect x={1248} y={172} width={width} height={120} rx={60} fill="color-mix(in srgb, var(--color-orange) 7%, var(--color-surface))" stroke="var(--color-orange)" strokeWidth={2} />
            <text x={1360} y={219} textAnchor="middle" fill="var(--color-text)" fontSize={22} fontWeight={650}>
              <tspan x={1360}>Canonical ID</tspan><tspan x={1360} dy={29}>or NOVEL</tspan>
            </text>
          </g>

          <Service
            x={336}
            y={430}
            title={["Ticket ingestion"]}
            detail={["Index new tickets"]}
          />
          <Service
            x={640}
            y={430}
            title={["Release activation"]}
            detail={["Activate model + index"]}
          />
          <Store
            x={944}
            y={430}
            title="Canonical groups"
            detail={["Resolve issue groups"]}
          />
          <Store
            x={1248}
            y={430}
            title="Prediction log"
            detail={["Log match decisions"]}
          />

          <text x={32} y={748} fill="var(--color-text-muted)" fontSize={17} fontWeight={700} letterSpacing={1}>LEARNING AND RELEASE</text>
          <Store
            x={32}
            y={808}
            title="Reviewed pairs"
            detail={["Store verified labels"]}
          />
          <Service
            x={336}
            y={808}
            title={["Candidate", "preparation"]}
            detail={["Train candidate models"]}
          />
          <Service
            x={640}
            y={808}
            title={["Evaluation gate"]}
            detail={["Check release quality"]}
          />
          <Store
            x={944}
            y={808}
            title="Model registry"
            detail={["Track approved versions"]}
          />

          <Edge path="M256 232 H333" kind="serving" label={["1. Search", "neighbors"]} x={296} y={196} />
          <Edge path="M560 232 H637" kind="serving" label={["2. Top 20", "tickets"]} x={600} y={196} />
          <Edge path="M864 232 H941" kind="serving" label={["3. Pair", "scores"]} x={904} y={196} />
          <Edge path="M1056 430 V321" kind="serving" label={["4. Resolve", "current ID"]} x={1124} y={370} />
          <Edge path="M1168 232 H1245" kind="serving" label={["5. Return", "result"]} x={1208} y={196} />
          <Edge path="M1360 292 V427" kind="serving" label={["6. Log", "decision"]} x={1413} y={358} />
          <Edge path="M448 430 V321" kind="ingestion" label={["7. Fresh", "inserts"]} x={374} y={382} />
          <Edge path="M1360 602 V708 H16 V894 H29" kind="learning" label={["8. Review pairs"]} x={752} y={695} />
          <Edge path="M256 894 H333" kind="learning" label={["9. Train", "candidate"]} x={296} y={858} />
          <Edge path="M560 894 H637" kind="learning" label={["10. Test", "bundle"]} x={600} y={858} />
          <Edge path="M864 894 H941" kind="learning" label={["11. Approve", "if better"]} x={904} y={858} />
          <Edge path="M1056 808 V674 H752 V605" kind="ingestion" label={["12. Prepare", "approved bundle"]} x={1188} y={730} dashed />
          <Edge path="M640 516 H616 V630 H10 V185 H29" kind="ingestion" label={["13. Activate models"]} x={300} y={619} dashed />
          <Edge path="M752 430 V374 H504 V321" kind="ingestion" label={["14. Switch index"]} x={640} y={364} dashed />
          <Edge path="M800 430 V321" kind="ingestion" label={["15. Activate", "pair verifier"]} x={878} y={377} dashed />
        </svg>
      </div>
      <figcaption className="border-t border-outline/60 px-5 py-4 text-sm leading-relaxed text-text-muted">
        Orange serves requests. Blue improves models. Green updates data and releases.
        <p className="mt-2 text-xs">Scroll horizontally to follow the flow.</p>
      </figcaption>
    </figure>
  );
}
