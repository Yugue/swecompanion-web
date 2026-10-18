import type { ReactNode } from "react";
import { rrpVisuals, type RrpVisualId } from "@/lib/rrpVisuals";
import { clickOperatingPoint, clickThresholdExample, annBucket, annCenters, annExample, annItems, annQuery, cosine, dcg, dot, explorationExamples, ipsEstimate, ipsRows, itemFactors, mergedSources, metricLists, positionWeight, rerankExamples, rerankUtility, servingBudget, sourceLists, userFactors, vectorItems, vectorQuery, wilson } from "@/lib/rrpVisualMath";

const blue = "#2563eb", orange = "#b45309", teal = "#0f766e", red = "#c2414c";
const ink = "var(--color-text, #202124)", muted = "var(--color-text-muted, #5f6368)";
const surface = "var(--color-surface, #fff)", border = "var(--color-outline, #94a3b8)";
function Text({ x, y, children, size = 14, color = ink, anchor = "middle", bold = false }: { x: number; y: number; children: ReactNode; size?: number; color?: string; anchor?: "middle" | "start" | "end"; bold?: boolean }) {
  const fill = [blue, orange, teal, red].includes(color) ? `color-mix(in srgb, ${color} 65%, ${ink})` : color;
  return <text x={x} y={y} textAnchor={anchor} fill={fill} fontSize={size} fontFamily="inherit" fontWeight={bold ? 650 : 400}>{children}</text>;
}
function Arrow({ x1, y1, x2, y2, color = blue, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1), size = 7;
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeDasharray={dashed ? "5 4" : undefined} /><polygon points={[[x2, y2], [x2 - size * Math.cos(angle - 0.45), y2 - size * Math.sin(angle - 0.45)], [x2 - size * Math.cos(angle + 0.45), y2 - size * Math.sin(angle + 0.45)]].map(p => p.join(",")).join(" ")} fill={color} /></g>;
}
function Box({ x, y, w, h = 44, children, color = blue, size = 13 }: { x: number; y: number; w: number; h?: number; children: ReactNode; color?: string; size?: number }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="7" fill={surface} stroke={color} strokeWidth="1.8" /><Text x={x + w / 2} y={y + h / 2 + 5} size={size}>{children}</Text></g>;
}
function Canvas({ id, height = 320, children }: { id: RrpVisualId; height?: number; children: ReactNode }) {
  return <div className="overflow-x-auto px-2 py-3 focus-visible:outline-2 focus-visible:outline-blue-500" tabIndex={0} role="region" aria-label={rrpVisuals[id].title}>
    <svg role="img" aria-label={rrpVisuals[id].alt} viewBox={`0 0 640 ${height}`} className="h-auto w-full min-w-[540px]">{children}</svg>
  </div>;
}
function Matrix({ x, y, values, cell = 36, selected, color = blue }: { x: number; y: number; values: (number | string | null)[][]; cell?: number; selected?: (row: number, col: number) => boolean; color?: string }) {
  return <g>{values.map((row, r) => row.map((v, c) => <g key={`${r}:${c}`}><rect x={x + c * cell} y={y + r * cell} width={cell - 1} height={cell - 1} rx="3" fill={selected?.(r, c) ? color : surface} fillOpacity={selected?.(r, c) ? 0.14 : 1} stroke={selected?.(r, c) ? color : border} /><Text x={x + (c + 0.5) * cell} y={y + (r + 0.65) * cell} size={14}>{v === null ? "?" : v}</Text></g>))}</g>;
}

function PredictionMetrics() {
  const point = clickOperatingPoint();
  const panels = [
    { x: 55, title: "ROC view", xlabel: "False-positive rate", ylabel: "Recall (TPR)", px: point.fpr, py: point.tpr, color: blue },
    { x: 370, title: "Precision–recall view", xlabel: "Recall", ylabel: "Precision", px: point.tpr, py: point.precision, color: orange },
  ];
  return <Canvas id="prediction-metrics" height={370}>
    {panels.map(panel => <g key={panel.title}>
      <Text x={panel.x + 110} y={24} bold>{panel.title}</Text>
      <Text x={panel.x} y={47} size={11} anchor="start">{panel.ylabel}</Text>
      <path d={`M${panel.x},55 V235 H${panel.x + 220}`} fill="none" stroke={border} />
      {[0, 0.5, 1].map(value => <g key={value}>
        <Text x={panel.x + value * 220} y={256} size={11}>{value}</Text>
        <Text x={panel.x - 12} y={239 - value * 180} size={11} anchor="end">{value}</Text>
      </g>)}
      <Text x={panel.x + 110} y={282} size={12}>{panel.xlabel}</Text>
      <path d={`M${panel.x},${235 - panel.py * 180} H${panel.x + panel.px * 220} V235`} fill="none" stroke={panel.color} strokeDasharray="4 4" />
      <circle cx={panel.x + panel.px * 220} cy={235 - panel.py * 180} r="5" fill={panel.color} />
    </g>)}
    <Text x={88} y={82} size={12} anchor="start" color={blue}>1% FPR</Text>
    <Text x={88} y={103} size={12} anchor="start" color={blue}>80% recall</Text>
    <Text x={440} y={104} size={12} anchor="start" color={orange}>80% recall</Text>
    <Text x={440} y={125} size={12} anchor="start" color={orange}>44.7% precision</Text>
    <Text x={320} y={321} size={12}>{`TP ${clickThresholdExample.tp} · FP ${clickThresholdExample.fp} · FN ${clickThresholdExample.fn} · TN ${clickThresholdExample.tn.toLocaleString("en-US")}`}</Text>
    <Text x={320} y={351} size={13} color={teal} bold>Precision = 80 / (80 + 99) ≈ 44.7%</Text>
  </Canvas>;
}

function RankingFunnel() {
  const levels = [{ width: 540, label: "10,000,000 catalogue entries", color: muted }, { width: 430, label: "800 retrieved candidates", color: blue }, { width: 300, label: "50-item ranked shortlist", color: orange }, { width: 170, label: "6 displayed", color: teal }];
  return <Canvas id="ranking-funnel" height={360}>
    {levels.map((v, i) => <g key={i}><rect x={320 - v.width / 2} y={18 + i * 85} width={v.width} height="49" rx="8" fill={v.color} fillOpacity="0.1" stroke={v.color} /><Text x={320} y={49 + i * 85} bold>{v.label}</Text>
      {i < 3 && <><Arrow x1={320} y1={68 + i * 85} x2={320} y2={95 + i * 85} /><Text x={337} y={87 + i * 85} anchor="start" size={12}>{["Retrieval", "Ranking", "Re-ranking"][i]}</Text></>}</g>)}
    <Text x={320} y={348} size={12} color={muted}>Counts are illustrative; measure each handoff separately.</Text>
  </Canvas>;
}
function InteractionMatrix() {
  const values = [[1, 0, null, 1], [null, 1, 0, null], [0, null, 1, 0]];
  return <Canvas id="interaction-matrix" height={325}>
    <Text x={320} y={24} bold>Items</Text>
    {["A", "B", "C", "D"].map((v, i) => <Text key={v} x={205 + i * 65} y={54}>{v}</Text>)}
    {["Ann", "Ben", "Cara"].map((v, i) => <Text key={v} x={155} y={101 + i * 57} anchor="end">{v}</Text>)}
    {values.map((row, r) => row.map((v, c) => {
      const color = v === null ? border : v ? blue : orange;
      return <g key={`${r}:${c}`}><rect x={173 + c * 65} y={70 + r * 57} width="62" height="53" rx="5" fill={color} fillOpacity={v === null ? 0.06 : 0.13} stroke={color} /><Text x={205 + c * 65} y={103 + r * 57} color={v === null ? muted : v ? blue : orange} size={20} bold>{v === null ? "?" : v}</Text></g>;
    }))}
    <Text x={320} y={274} size={13}>1: clicked · 0: exposure, no click · ?: exposure unknown</Text><Text x={320} y={307} size={12} color={muted}>An event log preserves detail that one pair-level cell cannot.</Text>
  </Canvas>;
}
function RankingDiscount() {
  const ideal = dcg([1, 1, 0, 0]);
  return <Canvas id="ranking-discount" height={350}>
    {metricLists.map((values, row) => <g key={row}><Text x={320} y={28 + row * 155} bold>{row ? "Relevant items late" : "Relevant items first"}</Text>
      {values.map((v, i) => <g key={i}><rect x={55 + i * 100} y={45 + row * 155} width="83" height="53" rx="6" fill={v ? blue : surface} fillOpacity={v ? 0.13 : 1} stroke={v ? blue : border} /><Text x={97 + i * 100} y={68 + row * 155} size={12}>Rank {i + 1}</Text><Text x={97 + i * 100} y={89 + row * 155} bold color={v ? blue : muted}>{v ? "Relevant" : "Not rel."}</Text><Text x={97 + i * 100} y={123 + row * 155} size={12}>{`Gain ${v ? positionWeight(i + 1).toFixed(3) : "0"}`}</Text></g>)}
      <Text x={530} y={65 + row * 155} size={13}>Precision@4 = 0.5</Text><Text x={530} y={95 + row * 155} size={13} bold color={teal}>NDCG = {(dcg(values) / ideal).toFixed(3)}</Text>
    </g>)}
    <Text x={320} y={337} size={12} color={muted}>Binary gains; the same two reference positives appear in both lists.</Text>
  </Canvas>;
}
function CollaborativeNeighbors() {
  const users = ["Ann", "Ben", "Cara"], items = ["A", "B", "C"], edges = [[0, 0], [0, 1], [1, 0], [1, 1], [1, 2], [2, 0]];
  return <Canvas id="collaborative-neighbors" height={355}>
    <Text x={110} y={25} bold>Users</Text><Text x={350} y={25} bold>Items</Text>
    {edges.map(([u, i], n) => <line key={n} x1="150" y1={75 + u * 100} x2="310" y2={75 + i * 100} stroke={blue} strokeOpacity="0.7" strokeWidth="2" />)}
    <line x1="150" y1="275" x2="310" y2="175" stroke={teal} strokeWidth="2.5" strokeDasharray="6 4" />
    {users.map((v, i) => <Box key={v} x={70} y={53 + i * 100} w={80} color={i === 2 ? orange : blue}>{v}</Box>)}
    {items.map((v, i) => <Box key={v} x={310} y={53 + i * 100} w={80} color={i === 1 ? teal : blue}>{v}</Box>)}
    <Text x={510} y={93} bold>Cara has used A.</Text><Text x={510} y={140} size={13}>Other A users also used:</Text><Text x={510} y={181} color={teal} bold>B: 2 shared users</Text><Text x={510} y={216} size={13}>C: 1 shared user</Text>
    <Text x={320} y={338} size={12} color={muted}>Solid: observed · dashed: suggested, not yet observed</Text>
  </Canvas>;
}
function MatrixFactorization() {
  const observed = [[1, null, 1], [1, 1, null], [null, null, 1]];
  return <Canvas id="matrix-factorization" height={330}>
    <Text x={115} y={27} bold>Observed pairs</Text><Text x={317} y={27} bold>Users P · 3 × 2</Text><Text x={507} y={27} bold>Items Q · 3 × 2</Text>
    <Matrix x={55} y={74} values={observed} cell={40} selected={(r, c) => r === 0 && c === 1} color={orange} />
    <Matrix x={277} y={74} values={userFactors.map(v => [...v])} cell={40} selected={r => r === 0} />
    <Matrix x={467} y={74} values={itemFactors.map(v => [...v])} cell={40} selected={r => r === 1} color={teal} />
    <Text x={42} y={100} size={11} anchor="end">Ann</Text><Text x={115} y={63} size={11}>B ↑</Text>
    <Text x={255} y={100} size={11} anchor="end">Ann</Text><Text x={451} y={140} size={11} anchor="end">B</Text>
    <Arrow x1={180} y1={134} x2={235} y2={134} color={orange} />
    <Text x={320} y={246} bold color={teal}>Ann × B: [1, 2] · [1, −1] = −1</Text><Text x={320} y={279} size={13}>Select one user row and one item row; multiply and sum.</Text><Text x={320} y={312} size={12} color={muted}>Illustrative factors, zero offsets; score matrix = P Qᵀ</Text>
  </Canvas>;
}
function EmbeddingGeometry() {
  const x = (v: number) => 75 + v * 80, y = (v: number) => 265 - v * 80;
  return <Canvas id="embedding-geometry" height={345}>
    <path d="M75,40 V265 H320" fill="none" stroke={border} />
    <Arrow x1={x(0)} y1={y(0)} x2={x(2.9)} y2={y(0)} color={ink} dashed />
    {vectorItems.map((v, i) => <g key={i}><Arrow x1={x(0)} y1={y(0)} x2={x(v[0])} y2={y(v[1])} color={i ? orange : blue} /><circle cx={x(v[0])} cy={y(v[1])} r="5" fill={i ? orange : blue} /><Text x={x(v[0]) + 10} y={y(v[1]) - 15} anchor="start" color={i ? orange : blue} bold>{i ? "B (2, 2)" : "A (1, 0)"}</Text></g>)}
    <Text x={190} y={310} size={13}>Query u = (1, 0): horizontal</Text><Text x={75} y={285} size={11}>0</Text>
    <Text x={492} y={45} bold>Same vectors, different ruler</Text>
    <Text x={410} y={90} size={13}>Item</Text><Text x={485} y={90} size={13}>Dot</Text><Text x={570} y={90} size={13}>Cosine</Text>
    {vectorItems.map((v, i) => <g key={i}><Text x={410} y={135 + i * 45} bold color={i ? orange : blue}>{i ? "B" : "A"}</Text><Text x={485} y={135 + i * 45}>{dot(vectorQuery, v)}</Text><Text x={570} y={135 + i * 45}>{cosine(vectorQuery, v).toFixed(3)}</Text></g>)}
    <Text x={492} y={238} size={13} color={orange}>Dot selects B.</Text><Text x={492} y={274} size={13} color={blue}>Cosine selects A.</Text>
  </Canvas>;
}
function TwoTower() {
  return <Canvas id="two-tower" height={365}>
    <Text x={160} y={25} bold>Request-dependent path</Text><Text x={480} y={25} bold>Reusable item path</Text>
    <Box x={55} y={50} w={210}>User / query / history / context</Box><Box x={390} y={50} w={180} color={orange}>Item attributes / ID</Box>
    <Arrow x1={160} y1={94} x2={160} y2={125} /><Arrow x1={480} y1={94} x2={480} y2={125} color={orange} />
    <Box x={80} y={130} w={160}>Request encoder f</Box><Box x={400} y={130} w={160} color={orange}>Item encoder g</Box>
    <Arrow x1={160} y1={174} x2={160} y2={210} /><Text x={160} y={239} bold color={blue}>u = request vector</Text>
    <Arrow x1={480} y1={174} x2={480} y2={206} color={orange} /><Box x={400} y={211} w={160} color={orange}>Stored vectors + index</Box>
    <Arrow x1={224} y1={250} x2={275} y2={289} /><Arrow x1={430} y1={255} x2={368} y2={289} color={orange} />
    <Box x={245} y={294} w={150} color={teal}>Score: uᵀvᵢ</Box><Text x={320} y={356} size={12} color={muted}>Compatible coordinates and scoring rule; no direct joint input before scoring.</Text>
  </Canvas>;
}
function AnnPartitions() {
  const chosen = annExample(), x = (v: number) => 55 + v * 45, y = (v: number) => 320 - v * 45;
  return <Canvas id="ann-partitions" height={365}>
    {[0, 1, 2, 3].map(i => <rect key={i} x={x(i % 2 * 3)} y={y(Math.floor(i / 2) * 3 + 3)} width="135" height="135" fill={i === chosen.bucket ? blue : surface} fillOpacity={i === chosen.bucket ? 0.08 : 1} stroke={border} />)}
    {annCenters.map(([a, b], i) => <g key={i}><path d={`M${x(a) - 5},${y(b)} h10 M${x(a)},${y(b) - 5} v10`} stroke={muted} strokeWidth="2" /><Text x={x(a)} y={y(b) + 19} size={11} color={muted}>center</Text></g>)}
    {annItems.map((v, i) => <circle key={i} cx={x(v[0])} cy={y(v[1])} r={i === 2 || i === 3 ? 5 : 4} fill={i === 3 ? orange : annBucket(v) === chosen.bucket ? blue : muted} />)}
    <path d={`M${x(annQuery[0]) - 5},${y(annQuery[1]) - 5} l10,10 M${x(annQuery[0]) - 5},${y(annQuery[1]) + 5} l10,-10`} stroke={ink} strokeWidth="2.5" />
    <Text x={x(annQuery[0]) - 16} y={y(annQuery[1]) - 16} size={12} bold>Q</Text><Text x={x(2.6) - 14} y={y(2.5) + 20} size={12} color={blue} bold>A</Text><Text x={x(3.1) + 17} y={y(2.8) - 12} size={12} color={orange} bold>B</Text>
    <Text x={480} y={60} bold>Query near a boundary</Text><Text x={480} y={105} size={13}>Search lower-left bucket.</Text><Text x={480} y={152} size={13} color={blue}>A found: distance 0.500</Text><Text x={480} y={190} size={13} color={orange}>B missed: distance 0.224</Text>
    <Text x={480} y={247} size={13}>Exact nearest: B</Text><Text x={480} y={282} size={13}>Approximate result here: A</Text><Text x={320} y={350} size={12} color={muted}>Chosen centers and toy points; this is an index error, not a missing vector.</Text>
  </Canvas>;
}
function SourceUnion() {
  const merged = mergedSources();
  return <Canvas id="source-union" height={335}>
    {Object.entries(sourceLists).map(([name, ids], i) => <g key={name}><Box x={35} y={38 + i * 86} w={195} color={[blue, orange, teal][i]}>{`${name}: ${ids.join("  ")}`}</Box><Arrow x1={230} y1={60 + i * 86} x2={305} y2={147} color={[blue, orange, teal][i]} /></g>)}
    <Text x={320} y={126} size={12}>Dedupe</Text><Arrow x1={310} y1={147} x2={366} y2={147} />
    <Text x={480} y={24} bold>Unique IDs + all origins</Text>
    {Object.entries(merged).map(([id, sources], i) => <g key={id}><Box x={385} y={40 + i * 47} w={42} h={35}>{id}</Box><Text x={441} y={63 + i * 47} size={12} anchor="start">{sources.join(" + ")}</Text></g>)}
    <Text x={320} y={320} size={13} color={muted}>7 returned entries → 5 unique candidates; raw source scores are not one scale.</Text>
  </Canvas>;
}
function RankingObjectives() {
  return <Canvas id="ranking-objectives" height={350}>
    <Text x={320} y={24} bold>Reference labels: A relevant, B not relevant, C relevant</Text>
    <Text x={106} y={88} anchor="end" bold>Pointwise</Text>
    {["A: 0.8 vs 1", "B: 0.7 vs 0", "C: 0.3 vs 1"].map((v, i) => <Box key={v} x={130 + i * 162} y={61} w={145}>{v}</Box>)}
    <Text x={106} y={178} anchor="end" bold>Pairwise</Text><Box x={150} y={151} w={175} color={teal}>Want A &gt; B · gap +0.1</Box><Box x={365} y={151} w={190} color={orange}>Want C &gt; B · gap −0.4</Box>
    <Text x={106} y={268} anchor="end" bold>Listwise</Text><rect x="130" y="230" width="470" height="65" rx="8" fill={teal} fillOpacity="0.06" stroke={teal} /><Text x={365} y={254} size={13}>Scores [0.8, 0.7, 0.3] and labels [1, 0, 1]</Text><Text x={365} y={280} size={13}>One request-level surrogate objective</Text>
    <Text x={320} y={333} size={12} color={muted}>The same ordering A, B, C puts an irrelevant candidate above C.</Text>
  </Canvas>;
}
function SequenceHistory() {
  return <Canvas id="sequence-history" height={340}>
    <Text x={242} y={25} bold>Inputs available before the decision</Text>
    {[[80, "A", "13:40"], [220, "B", "13:50"], [360, "C", "13:59"]].map(([x, item, time]) => <g key={item}><Text x={Number(x)} y={63} size={12}>{time}</Text><Box x={Number(x) - 40} y={82} w={80}>{item}</Box><Arrow x1={Number(x)} y1={126} x2={220} y2={205} /></g>)}
    <line x1="453" y1="47" x2="453" y2="280" stroke={orange} strokeWidth="2" strokeDasharray="5 4" /><Text x={453} y={307} size={12} color={orange}>14:00 decision</Text>
    <Text x={550} y={63} size={12}>14:02</Text><Box x={510} y={82} w={80} color={muted}>D</Box><Text x={550} y={160} size={12} color={muted}>Future action</Text><Text x={550} y={186} size={12} color={red}>Not an input</Text>
    <Box x={100} y={211} w={245} color={teal}>Past-only history representation</Box><Text x={235} y={286} size={12}>Preserve order/time if the task needs it.</Text>
  </Canvas>;
}
function MultiTaskHeads() {
  return <Canvas id="multi-task-heads" height={360}>
    <Box x={30} y={140} w={145}>Shared representation</Box>
    {[{ y: 45, label: "P(click) = 0.20", color: blue }, { y: 140, label: "E[watch | click] = 60 s", color: orange }, { y: 235, label: "P(hide) = 0.01", color: red }].map(v => <g key={v.y}><Arrow x1={175} y1={162} x2={245} y2={v.y + 22} color={v.color} /><Box x={250} y={v.y} w={215} color={v.color}>{v.label}</Box></g>)}
    <path d="M465,67 H515 V162 H465" fill="none" stroke={teal} strokeWidth="2" /><Text x={548} y={119} color={teal} bold>×</Text>
    <Text x={320} y={317} bold color={teal}>Expected watch per impression = 0.20 × 60 s = 12 s</Text><Text x={320} y={348} size={12} color={muted}>Assumes no watch without a click; task labels and loss weights stay distinct.</Text>
  </Canvas>;
}
function ReRanking() {
  return <Canvas id="re-ranking" height={330}>
    <Box x={210} y={20} w={220} color={teal}>Already selected: A</Box>
    {rerankExamples.map((v, i) => <g key={v.id}><rect x={45 + i * 315} y="95" width="235" height="135" rx="8" fill={surface} stroke={i ? teal : border} strokeWidth="2" /><Text x={162 + i * 315} y={124} bold>Candidate {v.id}</Text><Text x={162 + i * 315} y={159} size={13}>Relevance {v.relevance.toFixed(2)}</Text><Text x={162 + i * 315} y={187} size={13}>Similarity to A {v.similarity.toFixed(2)}</Text><Text x={162 + i * 315} y={216} bold color={i ? teal : orange}>Utility {rerankUtility(v.relevance, v.similarity).toFixed(3)}</Text></g>)}
    <Text x={320} y={272} color={teal} bold>Choose C next: less redundant with A.</Text><Text x={320} y={310} size={12} color={muted}>Utility = relevance − 0.3 × similarity · all candidates assumed eligible</Text>
  </Canvas>;
}
function TemporalEvaluation() {
  return <Canvas id="temporal-evaluation" height={300}>
    <Text x={345} y={24} bold>Later periods →</Text>
    {Array.from({ length: 3 }, (_, row) => <g key={row}><Text x={105} y={76 + row * 57} size={13} anchor="end">Fit {row + 1}</Text>
      {Array.from({ length: 7 }, (_, col) => { const train = col < 2 + row * 2, test = col === 2 + row * 2; return <g key={col}><rect x={125 + col * 65} y={51 + row * 57} width="60" height="35" rx="4" fill={train ? blue : test ? orange : surface} fillOpacity={train || test ? 0.14 : 1} stroke={train ? blue : test ? orange : border} /><Text x={155 + col * 65} y={74 + row * 57} size={11} color={train || test ? ink : muted}>{train ? "Train" : test ? "Assess" : "Later"}</Text></g>; })}
    </g>)}
    <Box x={160} y={244} w={340} h={35} color={teal} size={12}>Reserved final period: outside development choices</Box>
  </Canvas>;
}
function PositionExamination() {
  return <Canvas id="position-examination" height={300}>
    <Text x={205} y={29} bold>Examination</Text><Text x={385} y={29} bold>Attractiveness</Text><Text x={555} y={29} bold>Click rate</Text>
    {[{ rank: 1, e: 0.8 }, { rank: 5, e: 0.4 }].map((v, i) => <g key={v.rank}><Text x={65} y={94 + i * 100} bold>Rank {v.rank}</Text><Box x={150} y={65 + i * 100} w={110}>{v.e.toFixed(2)}</Box><Text x={295} y={94 + i * 100} size={23}>×</Text><Box x={330} y={65 + i * 100} w={110} color={orange}>0.10</Box><Text x={473} y={94 + i * 100} size={23}>=</Text><Box x={505} y={65 + i * 100} w={105} color={teal}>{(v.e * 0.1).toFixed(2)}</Box></g>)}
    <Text x={320} y={276} size={13} color={muted}>Same conditional attractiveness; opportunity changes the observed rate.</Text>
  </Canvas>;
}
function IpsSupport() {
  const cols = [55, 153, 250, 350, 451, 555];
  return <Canvas id="ips-support" height={355}>
    {["Action", "Count", "Rewards", "Logger μ", "Target π", "Weight π/μ"].map((v, i) => <Text key={v} x={cols[i]} y={38} size={13} bold>{v}</Text>)}
    {ipsRows.map((r, i) => [r.action, r.count, r.rewards, r.logging, r.target, r.target / r.logging].map((v, j) => <Text key={`${i}:${j}`} x={cols[j]} y={90 + i * 49} size={15} color={j === 5 ? teal : ink}>{v}</Text>))}
    <line x1="30" y1="166" x2="610" y2="166" stroke={border} />
    <Text x={320} y={208} color={teal} bold>IPS: (2 × 0.625 + 2 × 2.5) / 10 = {ipsEstimate().toFixed(3)}</Text>
    <Text x={320} y={244} size={13}>Raw logged reward: (2 + 2) / 10 = 0.400</Text>
    <Box x={45} y={280} w={550} h={45} color={red} size={12}>If target C &gt; 0 but logger C = 0, that new claim lacks support.</Box>
  </Canvas>;
}
function FeedbackCycle() {
  return <Canvas id="feedback-cycle" height={325}>
    <Box x={45} y={50} w={190}>Model / selection policy</Box><Box x={405} y={50} w={190} color={orange}>Exposure opportunities</Box><Box x={405} y={220} w={190} color={teal}>Observed outcomes</Box><Box x={45} y={220} w={190}>Training evidence</Box>
    <Arrow x1={235} y1={72} x2={395} y2={72} /><Arrow x1={500} y1={94} x2={500} y2={210} color={orange} /><Arrow x1={395} y1={242} x2={245} y2={242} color={teal} /><Arrow x1={140} y1={210} x2={140} y2={104} />
    <Box x={245} y={135} w={150} color={teal}>Exploration</Box><Arrow x1={395} y1={157} x2={466} y2={104} color={teal} dashed />
    <Text x={320} y={310} size={12} color={muted}>No exposure means no outcome from that opportunity, not demonstrated dislike.</Text>
  </Canvas>;
}
function ServingPath() {
  return <Canvas id="serving-path" height={350}>
    <Text x={320} y={25} bold>Independent source work can overlap</Text><Box x={20} y={115} w={95}>Request</Box>
    {[55, 115, 175].map((v, i) => <g key={v}><Arrow x1={115} y1={137} x2={175} y2={v + 22} /><Box x={180} y={v} w={105}>Source {i + 1}</Box><Arrow x1={285} y1={v + 22} x2={340} y2={137} /></g>)}
    <Box x={345} y={115} w={115} color={orange}>Merge + features</Box><Arrow x1={460} y1={137} x2={490} y2={137} /><Box x={495} y={115} w={120} color={teal}>Rank + finalize</Box>
    <Text x={320} y={251} bold>Example request allocation: 50 ms total</Text>
    {servingBudget.map((v, i) => { const x = 40 + servingBudget.slice(0, i).reduce((s, v) => s + v.ms, 0) * 11.2, width = v.ms * 11.2; return <g key={v.label}><rect x={x} y="268" width={width} height="35" fill={[muted, blue, orange, teal, blue][i]} fillOpacity="0.13" stroke={border} /><Text x={x + width / 2} y={291} size={13}>{v.ms}</Text><Text x={x + width / 2} y={325} size={11}>{v.label}</Text></g>; })}
  </Canvas>;
}
function FeatureAvailability() {
  return <Canvas id="feature-availability" height={315}>
    <Arrow x1={55} y1={115} x2={600} y2={115} />
    {[{ x: 100, time: "13:59", label: "Click occurs", color: blue }, { x: 300, time: "14:00", label: "Prediction", color: orange }, { x: 520, time: "14:02", label: "Click arrives", color: teal }].map(v => <g key={v.x}><circle cx={v.x} cy="115" r="6" fill={v.color} /><Text x={v.x} y={62} bold color={v.color}>{v.time}</Text><Text x={v.x} y={89} size={13}>{v.label}</Text></g>)}
    <line x1="300" y1="132" x2="300" y2="205" stroke={orange} strokeDasharray="5 4" /><Arrow x1={106} y1={160} x2={514} y2={160} color={muted} dashed />
    <Text x={300} y={234} color={red} bold>The click is unavailable to the 14:00 prediction.</Text><Text x={320} y={280} size={13}>Historical inputs must respect arrival and publication time too.</Text>
  </Canvas>;
}
function ExplorationUncertainty() {
  const x = (rate: number) => 100 + rate * 4500;
  return <Canvas id="exploration-uncertainty" height={330}>
    <Text x={320} y={25} bold>Observed click rate and approximate 95% Wilson interval</Text>
    {explorationExamples.map((v, i) => { const y = 105 + i * 95, [lo, hi] = wilson(v.clicks, v.impressions), color = i ? orange : blue; return <g key={v.id}><Text x={70} y={y + 5} bold>Item {v.id}</Text><line x1={x(lo)} y1={y} x2={x(hi)} y2={y} stroke={color} strokeWidth="3" /><line x1={x(lo)} y1={y - 8} x2={x(lo)} y2={y + 8} stroke={color} strokeWidth="2" /><line x1={x(hi)} y1={y - 8} x2={x(hi)} y2={y + 8} stroke={color} strokeWidth="2" /><circle cx={x(v.clicks / v.impressions)} cy={y} r="6" fill={color} /><Text x={320} y={y + 35} size={12} color={color}>{v.clicks.toLocaleString("en-US")} clicks / {v.impressions.toLocaleString("en-US")} impressions</Text></g>; })}
    <line x1="100" y1="270" x2="550" y2="270" stroke={border} />{[0, 0.025, 0.05, 0.075, 0.1].map(v => <Text key={v} x={x(v)} y={293} size={12}>{(v * 100).toFixed(v === 0.025 || v === 0.075 ? 1 : 0)}%</Text>)}
    <Text x={320} y={322} size={12} color={muted}>A lower point estimate is not certainty that an alternative is worse.</Text>
  </Canvas>;
}

export function StaticRrpVisual({ id }: { id: RrpVisualId }) {
  switch (id) {
    case "prediction-metrics": return <PredictionMetrics />;
    case "ranking-funnel": return <RankingFunnel />;
    case "interaction-matrix": return <InteractionMatrix />;
    case "ranking-discount": return <RankingDiscount />;
    case "collaborative-neighbors": return <CollaborativeNeighbors />;
    case "matrix-factorization": return <MatrixFactorization />;
    case "embedding-geometry": return <EmbeddingGeometry />;
    case "two-tower": return <TwoTower />;
    case "ann-partitions": return <AnnPartitions />;
    case "source-union": return <SourceUnion />;
    case "ranking-objectives": return <RankingObjectives />;
    case "sequence-history": return <SequenceHistory />;
    case "multi-task-heads": return <MultiTaskHeads />;
    case "re-ranking": return <ReRanking />;
    case "temporal-evaluation": return <TemporalEvaluation />;
    case "position-examination": return <PositionExamination />;
    case "ips-support": return <IpsSupport />;
    case "feedback-cycle": return <FeedbackCycle />;
    case "serving-path": return <ServingPath />;
    case "feature-availability": return <FeatureAvailability />;
    case "exploration-uncertainty": return <ExplorationUncertainty />;
    default: throw new Error("Shared RRP visual requires its registered renderer: " + id);
  }
}
