import type { ReactNode } from "react";
import { amlVisuals, type AmlVisualId } from "@/lib/amlVisuals";
import { clockPoint, curvePoints, dbscanPoints, dbscanRoles, distance, initialCenters, kmeansPoints, kmeansStep, l1Solution, l2Solution, mixtureParts, neighborPoints, pcaPoints, projectDiagonal, regularizationTarget, sigmoid } from "@/lib/amlVisualMath";

const blue = "#2563eb", orange = "#b45309", teal = "#0f766e", red = "#c2414c";
const ink = "var(--color-text, #202124)", muted = "var(--color-text-muted, #5f6368)";
const surface = "var(--color-surface, #fff)", border = "var(--color-outline, #94a3b8)";
function Text({ x, y, children, size = 14, color = ink, anchor = "middle", bold = false }: {
  x: number; y: number; children: ReactNode; size?: number; color?: string; anchor?: "middle" | "start" | "end"; bold?: boolean;
}) {
  const fill = [blue, orange, teal, red].includes(color) ? `color-mix(in srgb, ${color} 65%, ${ink})` : color;
  return <text x={x} y={y} textAnchor={anchor} fill={fill} fontSize={size} fontFamily="inherit" fontWeight={bold ? 650 : 400}>{children}</text>;
}
function Arrow({ x1, y1, x2, y2, color = blue, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1), s = 7;
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeDasharray={dashed ? "5 4" : undefined} />
    <polygon points={[[x2, y2], [x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45)], [x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)]].map(p => p.join(",")).join(" ")} fill={color} /></g>;
}
function Box({ x, y, w, h = 42, children, color = blue, size = 13 }: { x: number; y: number; w: number; h?: number; children: ReactNode; color?: string; size?: number }) {
  return <g><rect x={x} y={y} width={w} height={h} rx="7" fill={surface} stroke={color} strokeWidth="1.8" /><Text x={x + w / 2} y={y + h / 2 + 5} size={size}>{children}</Text></g>;
}
function Canvas({ id, height = 320, children }: { id: AmlVisualId; height?: number; children: ReactNode }) {
  return <div className="overflow-x-auto px-2 py-3 focus-visible:outline-2 focus-visible:outline-blue-500" tabIndex={0} role="region" aria-label={amlVisuals[id].title}>
    <svg role="img" aria-label={amlVisuals[id].alt} viewBox={`0 0 640 ${height}`} className="h-auto w-full min-w-[540px]">{children}</svg>
  </div>;
}
type Plot = { x: number; y: number; w: number; h: number; xmin: number; xmax: number; ymin: number; ymax: number };
function coordinates(p: Plot) { return { x: (v: number) => p.x + (v - p.xmin) / (p.xmax - p.xmin) * p.w, y: (v: number) => p.y + p.h - (v - p.ymin) / (p.ymax - p.ymin) * p.h }; }
function Axes({ p, xticks, yticks }: { p: Plot; xticks: number[]; yticks: number[] }) {
  const c = coordinates(p);
  return <g><path d={`M${p.x},${p.y} V${p.y + p.h} H${p.x + p.w}`} fill="none" stroke={border} />
    {xticks.map(t => <Text key={t} x={c.x(t)} y={p.y + p.h + 19} size={11} color={muted}>{t}</Text>)}
    {yticks.map(t => <Text key={t} x={p.x - 10} y={c.y(t) + 4} size={11} color={muted} anchor="end">{t}</Text>)}
  </g>;
}
function Curve({ p, fn, color = blue, dashed = false }: { p: Plot; fn: (x: number) => number; color?: string; dashed?: boolean }) {
  const c = coordinates(p);
  return <polyline points={Array.from({ length: 161 }, (_, i) => { const x = p.xmin + i / 160 * (p.xmax - p.xmin); return `${c.x(x)},${c.y(fn(x))}`; }).join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={dashed ? "5 4" : undefined} />;
}
function Dot({ x, y, positive = true, color }: { x: number; y: number; positive?: boolean; color?: string }) {
  const fill = color ?? (positive ? blue : orange);
  return positive ? <circle cx={x} cy={y} r="5.5" fill={fill} stroke={surface} strokeWidth="1.5" /> : <rect x={x - 5} y={y - 5} width="10" height="10" fill={fill} stroke={surface} strokeWidth="1.5" />;
}
function Cross({ x, y, color = ink, size = 6 }: { x: number; y: number; color?: string; size?: number }) { return <path d={`M${x - size},${y - size} l${2 * size},${2 * size} M${x - size},${y + size} l${2 * size},${-2 * size}`} stroke={color} strokeWidth="2.5" />; }

function DataSplits() {
  return <Canvas id="data-splits" height={300}>
    {[[40, 336, "Train · 60%", blue], [376, 112, "Val · 20%", orange], [488, 112, "Test · 20%", teal]].map(([x, w, label, color]) => <g key={String(label)}><rect x={Number(x)} y="30" width={Number(w)} height="52" fill={String(color)} fillOpacity="0.13" stroke={String(color)} /><Text x={Number(x) + Number(w) / 2} y={62} size={14} bold>{label}</Text></g>)}
    <Text x={208} y={116} color={blue}>Fit parameters</Text><Text x={432} y={116} color={orange}>Choose</Text><Text x={544} y={116} color={teal}>Assess</Text>
    <Text x={320} y={163} bold>For future-period prediction</Text>
    <Box x={40} y={188} w={250} color={blue}>Earlier training data</Box><Box x={330} y={188} w={120} color={orange}>Later validation</Box><Box x={475} y={188} w={125} color={teal}>Final period</Box>
    <Arrow x1={40} y1={260} x2={600} y2={260} /><Text x={320} y={286} color={muted} size={12}>Time →   use only features and labels available at each cutoff</Text>
  </Canvas>;
}
function ConfusionMatrix() {
  return <Canvas id="confusion-matrix" height={375}>
    <Text x={353} y={25} bold>Actual class</Text><Text x={253} y={57} color={blue}>Fraud · positive</Text><Text x={453} y={57}>Legitimate · negative</Text>
    <rect x="155" y="74" width="196" height="166" rx="8" fill={blue} fillOpacity="0.08" stroke={blue} strokeWidth="2" />
    <rect x="155" y="74" width="396" height="80" rx="8" fill={orange} fillOpacity="0.08" stroke={orange} strokeWidth="2" />
    <line x1="353" y1="74" x2="353" y2="240" stroke={border} /><line x1="155" y1="157" x2="551" y2="157" stroke={border} />
    <Text x={141} y={108} anchor="end" size={13}>Predicted fraud</Text><Text x={141} y={130} anchor="end" size={12} color={orange}>Flagged</Text>
    <Text x={141} y={204} anchor="end" size={13}>Predicted legit</Text>
    <Text x={253} y={111} size={22} bold color={teal}>80 TP</Text><Text x={453} y={111} size={22} bold color={red}>100 FP</Text>
    <Text x={253} y={201} size={22} bold color={red}>20 FN</Text><Text x={453} y={201} size={22} bold>9,800 TN</Text>
    <Text x={320} y={285} color={orange} bold>Flagged row: 80 / (80 + 100) ≈ 44% precision</Text>
    <Text x={320} y={322} color={blue} bold>Actual-fraud column: 80 / (80 + 20) = 80% recall</Text>
    <Text x={320} y={358} color={muted} size={12}>The numerator is the same overlap; the denominator changes.</Text>
  </Canvas>;
}
function BiasVariance() {
  return <Canvas id="bias-variance" height={305}>
    {[0, 1].map(panel => {
      const p = { x: 55 + panel * 310, y: 53, w: 235, h: 175, xmin: -2, xmax: 2, ymin: -1.6, ymax: 1.4 };
      return <g key={panel}><Text x={p.x + 117} y={26} bold>{panel === 0 ? "Systematically misses the bend" : "Changes with the sample"}</Text>
        <Axes p={p} xticks={[-2, 0, 2]} yticks={[-1, 0, 1]} />
        {[-1, 0, 1].map((v, i) => <Curve key={v} p={p} fn={x => panel === 0 ? -0.4 + v * 0.12 + v * x * 0.06 : 0.45 * x * x - 1 + v * 0.35 * Math.sin(4 * x)} color={[blue, orange, teal][i]} />)}
        <Curve p={p} fn={x => 0.45 * x * x - 1} color={ink} dashed />
      </g>;
    })}
    <Text x={320} y={280} size={13} color={muted}>Dashed: true relationship · colored: fits from different samples</Text>
  </Canvas>;
}
function FeatureScaling() {
  return <Canvas id="feature-scaling" height={330}>
    <Text x={320} y={25} size={13}>From query: A differs by ($10,000, 1 year); B by ($2,000, 20 years).</Text>
    {[false, true].map((scaled, i) => {
      const x = 65 + i * 315, width = 225, max = scaled ? 2.3 : 11500;
      const a = scaled ? distance([1, 0.1], [0, 0]) : distance([10000, 1], [0, 0]);
      const b = scaled ? distance([0.2, 2], [0, 0]) : distance([2000, 20], [0, 0]);
      return <g key={i}><Text x={x + width / 2} y={72} bold>{scaled ? "After chosen rescaling" : "Raw numeric distance"}</Text>
        {[[a, blue, "A"], [b, orange, "B"]].map(([value, color, label], j) => <g key={String(label)}>
          <Text x={x - 15} y={126 + j * 65} size={14} bold>{label}</Text>
          <rect x={x} y={105 + j * 65} width={Number(value) / max * width} height="30" rx="4" fill={String(color)} fillOpacity="0.5" stroke={String(color)} />
          <Text x={x + Number(value) / max * width + 5} y={126 + j * 65} size={12} anchor="start">{scaled ? Number(value).toFixed(2) : Math.round(Number(value)).toLocaleString("en-US")}</Text>
        </g>)}
        <line x1={x} y1="220" x2={x + width} y2="220" stroke={border} />
        <Text x={x} y={240} size={11}>0</Text><Text x={x + width / 2} y={268} size={12}>Euclidean distance from query</Text>
        <Text x={x + width / 2} y={310} color={teal} bold>{scaled ? "A becomes nearest" : "B is nearest"}</Text>
      </g>;
    })}
  </Canvas>;
}
function CyclicFeatures() {
  const cx = 452, cy = 158, r = 78;
  return <Canvas id="cyclic-features" height={300}>
    <Text x={165} y={33} bold>Hours on a number line</Text><Arrow x1={45} y1={145} x2={288} y2={145} />
    {[0, 12, 23].map(h => <g key={h}><circle cx={55 + h * 9.5} cy="145" r="6" fill={h === 23 ? orange : blue} /><Text x={55 + h * 9.5} y={176}>{h}</Text></g>)}
    <Text x={165} y={222} size={13} color={muted}>0 and 23 look far apart.</Text>
    <Text x={452} y={33} bold>Hours on a circle</Text><circle cx={cx} cy={cy} r={r} fill="none" stroke={border} strokeWidth="2" />
    <line x1={cx - r - 12} y1={cy} x2={cx + r + 12} y2={cy} stroke={border} /><line x1={cx} y1={cy - r - 12} x2={cx} y2={cy + r + 12} stroke={border} />
    {[0, 6, 12, 18, 23].map(h => { const [x, y] = clockPoint(h); return <g key={h}><circle cx={cx + x * r} cy={cy - y * r} r="6" fill={h === 23 ? orange : blue} /><Text x={cx + x * (r + 23)} y={cy - y * (r + 23) + 5} size={13} color={h === 23 ? orange : ink}>{h}</Text></g>; })}
    <Text x={452} y={285} size={12} color={muted}>Horizontal: cosine · vertical: sine</Text>
  </Canvas>;
}
function PcaProjection() {
  const p = { x: 50, y: 45, w: 250, h: 250, xmin: -3, xmax: 3, ymin: -3, ymax: 3 }, c = coordinates(p);
  return <Canvas id="pca-projection" height={350}>
    <Text x={175} y={25} bold>Centered input cloud</Text><Axes p={p} xticks={[-2, 0, 2]} yticks={[-2, 0, 2]} />
    <line x1={c.x(-2.6)} y1={c.y(-2.6)} x2={c.x(2.6)} y2={c.y(2.6)} stroke={teal} strokeWidth="2" />
    {pcaPoints.map((v, i) => { const projection = (v[0] + v[1]) / 2; return <g key={i}><line x1={c.x(v[0])} y1={c.y(v[1])} x2={c.x(projection)} y2={c.y(projection)} stroke={orange} strokeDasharray="4 3" /><Dot x={c.x(v[0])} y={c.y(v[1])} /><circle cx={c.x(projection)} cy={c.y(projection)} r="3" fill={teal} /></g>; })}
    <Text x={175} y={338} size={13} color={teal}>PC1 direction: (1, 1) / √2</Text>
    <Arrow x1={330} y1={166} x2={380} y2={166} /><Text x={495} y={70} bold>Keep one coordinate</Text>
    <line x1="395" y1="166" x2="605" y2="166" stroke={border} />
    {pcaPoints.map((v, i) => <circle key={i} cx={500 + projectDiagonal(v) * 32} cy={166 + (i % 2 ? -5 : 5)} r="5" fill={teal} />)}
    <Text x={405} y={205} size={11}>−3</Text><Text x={500} y={205} size={11}>0</Text><Text x={595} y={205} size={11}>3</Text>
    <Text x={500} y={248} size={12}>z = (x₁ + x₂) / √2</Text><Text x={500} y={277} size={12} color={muted}>Small vertical offsets separate dots.</Text>
  </Canvas>;
}
function LinearFit() {
  const p = { x: 75, y: 45, w: 470, h: 230, xmin: 40, xmax: 130, ymin: 140, ymax: 440 }, c = coordinates(p);
  return <Canvas id="linear-fit" height={345}>
    <Axes p={p} xticks={[50, 70, 90, 120]} yticks={[180, 250, 310, 390]} /><Curve p={p} fn={x => 3 * x + 40} />
    {[[50, 180], [70, 250], [90, 310], [120, 390]].map(([x, y]) => <g key={x}><line x1={c.x(x)} y1={c.y(y)} x2={c.x(x)} y2={c.y(3 * x + 40)} stroke={orange} strokeWidth="4" /><Dot x={c.x(x)} y={c.y(y)} color={teal} /></g>)}
    <Text x={310} y={25} bold>Candidate: price = 3 × area + 40</Text>
    <Arrow x1={c.x(50) + 28} y1={c.y(180) + 13} x2={c.x(50)} y2={c.y(185)} color={orange} />
    <Text x={c.x(50) + 35} y={c.y(180) + 20} size={12} color={orange} anchor="start">residual −10</Text>
    <Text x={c.x(120) - 18} y={c.y(400) - 12} size={12} color={orange} anchor="end">residual −10</Text>
    <Text x={310} y={321} size={13}>Area (m²)</Text><Text x={75} y={31} size={11} anchor="start" color={muted}>Price ($ thousands)</Text>
  </Canvas>;
}
function LogisticSigmoid() {
  const p = { x: 65, y: 55, w: 500, h: 220, xmin: -6, xmax: 6, ymin: 0, ymax: 1 }, c = coordinates(p);
  return <Canvas id="logistic-sigmoid" height={350}>
    <Axes p={p} xticks={[-6, -2, 0, 2, 6]} yticks={[0, 0.5, 1]} /><Curve p={p} fn={sigmoid} />
    <line x1={p.x} y1={c.y(0.5)} x2={p.x + p.w} y2={c.y(0.5)} stroke={orange} strokeDasharray="5 4" />
    {[-2, 0, 2].map(z => <g key={z}><line x1={c.x(z)} y1={p.y + p.h} x2={c.x(z)} y2={c.y(sigmoid(z))} stroke={border} strokeDasharray="3 3" /><Dot x={c.x(z)} y={c.y(sigmoid(z))} /><Text x={c.x(z)} y={c.y(sigmoid(z)) - 15} size={13} bold>{sigmoid(z).toFixed(z ? 3 : 1)}</Text></g>)}
    <Text x={315} y={25} bold>p = sigmoid(z)</Text><Text x={315} y={321} size={13}>Linear score z = wᵀx + b</Text>
    <Text x={575} y={c.y(0.5) + 5} size={11} color={orange} anchor="start">0.5 cut</Text><Text x={65} y={43} size={12} anchor="start" color={muted}>P(positive)</Text>
  </Canvas>;
}
function NearestNeighbors() {
  const cx = 240, cy = 165, scale = 72, nearest = [...neighborPoints].sort((a, b) => distance(a.point, [0, 0]) - distance(b.point, [0, 0])).slice(0, 3);
  const radius = distance(nearest[2].point, [0, 0]) * scale;
  return <Canvas id="nearest-neighbors" height={330}>
    <line x1="60" y1={cy} x2="420" y2={cy} stroke={border} /><line x1={cx} y1="30" x2={cx} y2="295" stroke={border} />
    <circle cx={cx} cy={cy} r={radius} fill={teal} fillOpacity="0.07" stroke={teal} strokeWidth="2" strokeDasharray="5 4" />
    {neighborPoints.map((v, i) => <Dot key={i} x={cx + v.point[0] * scale} y={cy - v.point[1] * scale} positive={v.positive} />)}
    <Cross x={cx} y={cy} /><Text x={cx + 14} y={cy + 20} size={12} anchor="start">query</Text>
    <Dot x={475} y={75} /><Text x={493} y={80} anchor="start" size={13}>Positive</Text><Dot x={475} y={109} positive={false} /><Text x={493} y={114} anchor="start" size={13}>Negative</Text>
    <Text x={520} y={177} bold>k = 3</Text><Text x={520} y={210} size={13}>2 positive votes</Text><Text x={520} y={238} size={13}>1 negative vote</Text>
    <Text x={240} y={320} size={12} color={muted}>Distances use the chosen feature representation.</Text>
  </Canvas>;
}
function SvmMargin() {
  const p = { x: 100, y: 60, w: 420, h: 225, xmin: -3, xmax: 3, ymin: -2, ymax: 2 }, c = coordinates(p);
  return <Canvas id="svm-margin" height={365}>
    <rect x={c.x(-1)} y={p.y} width={c.x(1) - c.x(-1)} height={p.h} fill={teal} fillOpacity="0.07" />
    <Axes p={p} xticks={[-3, -1, 0, 1, 3]} yticks={[-2, 0, 2]} />
    {[-1, 0, 1].map(v => <line key={v} x1={c.x(v)} y1={p.y} x2={c.x(v)} y2={p.y + p.h} stroke={v ? teal : ink} strokeWidth={v ? 2 : 2.5} strokeDasharray={v ? "5 4" : undefined} />)}
    {[[-2.5, 1.4], [-2, -1.2], [-1, 0.6], [-1, -0.6], [1, 0.8], [1, -0.9], [2, 1.5], [2.6, -1]].map(([x, y], i) => <g key={i}><Dot x={c.x(x)} y={c.y(y)} positive={x > 0} />{Math.abs(x) === 1 && <circle cx={c.x(x)} cy={c.y(y)} r="11" fill="none" stroke={teal} strokeWidth="2" />}</g>)}
    <Text x={310} y={26} bold>Boundary: f(x) = x₁ = 0</Text>
    <Arrow x1={c.x(-1)} y1={328} x2={c.x(1)} y2={328} color={teal} /><Text x={310} y={354} color={teal} size={13}>Margin width = 2 / ||w|| = 2</Text>
    <Text x={550} y={170} size={13}>x₂</Text><Text x={550} y={290} size={13}>x₁</Text>
  </Canvas>;
}
function DecisionTree() {
  return <Canvas id="decision-tree" height={350}>
    <Text x={165} y={25} bold>Questions</Text><Box x={82} y={50} w={166}>Amount &gt; $500?</Box>
    <Arrow x1={130} y1={92} x2={65} y2={153} /><Text x={76} y={117} size={12}>No</Text><Box x={30} y={160} w={70} color={teal}>Leaf A</Box>
    <Arrow x1={210} y1={92} x2={230} y2={153} /><Text x={244} y={117} size={12}>Yes</Text><Box x={160} y={160} w={145}>Age &lt; 7 days?</Box>
    <Arrow x1={195} y1={202} x2={174} y2={262} /><Text x={173} y={236} size={12}>Yes</Text><Box x={132} y={270} w={75} color={orange}>Leaf B</Box>
    <Arrow x1={267} y1={202} x2={280} y2={262} /><Text x={289} y={236} size={12}>No</Text><Box x={243} y={270} w={75} color={blue}>Leaf C</Box>
    <Text x={480} y={25} bold>Feature regions</Text>
    <rect x="385" y="65" width="92" height="225" fill={teal} fillOpacity="0.13" stroke={teal} />
    <rect x="477" y="202.5" width="128" height="87.5" fill={orange} fillOpacity="0.13" stroke={orange} />
    <rect x="477" y="65" width="128" height="137.5" fill={blue} fillOpacity="0.13" stroke={blue} />
    <Text x={431} y={180} bold color={teal}>A</Text><Text x={541} y={250} bold color={orange}>B</Text><Text x={541} y={137} bold color={blue}>C</Text>
    <Text x={370} y={207} size={12}>7</Text><Text x={477} y={312} size={12}>500</Text><Text x={495} y={340} size={12}>Amount ($)</Text><Text x={385} y={54} anchor="start" size={12}>Account age (days)</Text>
  </Canvas>;
}
function EnsembleMethods() {
  return <Canvas id="ensemble-methods" height={370}>
    <Text x={320} y={25} bold>Bagging: independent fits, then average</Text>
    <Box x={25} y={110} w={110}>Training data</Box>
    {[55, 115, 175].map((y, i) => <g key={i}><Arrow x1={135} y1={131} x2={215} y2={y + 21} /><Box x={220} y={y} w={125}>Bootstrap {i + 1}</Box><Arrow x1={345} y1={y + 21} x2={375} y2={y + 21} /><Box x={380} y={y} w={85}>Tree {i + 1}</Box><Arrow x1={465} y1={y + 21} x2={507} y2={131} /></g>)}
    <Box x={510} y={110} w={105} color={teal}>Average</Box>
    <line x1="25" y1="238" x2="615" y2="238" stroke={border} />
    <Text x={320} y={270} bold>Boosting: corrections depend on the current sum</Text>
    <Box x={25} y={295} w={85} color={orange}>Start F₀</Box><Arrow x1={110} y1={316} x2={150} y2={316} color={orange} />
    <Box x={155} y={295} w={120} color={orange}>Add η · tree 1</Box><Arrow x1={275} y1={316} x2={315} y2={316} color={orange} />
    <Box x={320} y={295} w={120} color={orange}>Add η · tree 2</Box><Arrow x1={440} y1={316} x2={480} y2={316} color={orange} /><Box x={485} y={295} w={125} color={teal}>Current sum F₂</Box>
  </Canvas>;
}
function RegularizationGeometry() {
  return <Canvas id="regularization-geometry" height={325}>
    {[true, false].map((l1, i) => {
      const ox = 100 + i * 315, oy = 190, scale = 65, [a, b] = regularizationTarget, solution = l1 ? l1Solution : l2Solution;
      const x = (v: number) => ox + scale * v, y = (v: number) => oy - scale * v;
      const radius = distance(regularizationTarget, solution) * scale;
      return <g key={i}><Text x={160 + i * 315} y={25} bold>{l1 ? 'L1 constraint: |w₁| + |w₂| ≤ 1' : 'L2 constraint: √(w₁² + w₂²) ≤ 1'}</Text>
        <line x1={ox - 80} y1={oy} x2={ox + 175} y2={oy} stroke={border} /><line x1={ox} y1={oy + 80} x2={ox} y2={oy - 115} stroke={border} />
        {l1 ? <polygon points={`${x(-1)},${y(0)} ${x(0)},${y(1)} ${x(1)},${y(0)} ${x(0)},${y(-1)}`} fill={blue} fillOpacity="0.1" stroke={blue} strokeWidth="2" /> : <circle cx={ox} cy={oy} r={scale} fill={teal} fillOpacity="0.1" stroke={teal} strokeWidth="2" />}
        <circle cx={x(a)} cy={y(b)} r={radius} fill="none" stroke={orange} strokeDasharray="5 4" strokeWidth="2" />
        <Cross x={x(a)} y={y(b)} color={orange} /><Text x={x(a)} y={y(b) - 15} color={orange} size={12}>(1.8, 0.4)</Text>
        <circle cx={x(solution[0])} cy={y(solution[1])} r="5" fill={l1 ? blue : teal} />
        <Text x={160 + i * 315} y={294} size={13} bold color={l1 ? blue : teal}>{l1 ? "Solution (1, 0): one coefficient zero" : "Solution ≈ (0.976, 0.217)"}</Text>
        <Text x={ox - 13} y={oy + 21} size={11}>0</Text><Text x={ox + 170} y={oy + 21} size={12}>w₁</Text><Text x={ox + 15} y={oy - 106} size={12}>w₂</Text>
      </g>;
    })}
  </Canvas>;
}
function CrossValidation() {
  return <Canvas id="cross-validation" height={330}>
    <Text x={315} y={25} bold>Development data: five separate pipeline fits</Text>
    {Array.from({ length: 5 }, (_, row) => <g key={row}><Text x={100} y={79 + row * 39} size={13} anchor="end">Fit {row + 1}</Text>
      {Array.from({ length: 5 }, (_, col) => <g key={col}><rect x={120 + col * 90} y={55 + row * 39} width="85" height="32" rx="4" fill={row === col ? orange : blue} fillOpacity={row === col ? 0.2 : 0.08} stroke={row === col ? orange : border} /><Text x={162 + col * 90} y={77 + row * 39} size={12}>{row === col ? "Held out" : "Train"}</Text></g>)}
    </g>)}
    <Text x={320} y={278} size={12} color={muted}>Every column serves once as validation; each row is a new fit.</Text>
    <Box x={155} y={294} w={330} h={30} color={teal} size={12}>Final test: outside this development rotation</Box>
  </Canvas>;
}
function ThresholdCurves() {
  const points = curvePoints();
  return <Canvas id="threshold-curves" height={355}>
    {[false, true].map((pr, i) => {
      const p = { x: 60 + i * 315, y: 65, w: 220, h: 210, xmin: 0, xmax: 1, ymin: 0, ymax: 1 }, c = coordinates(p);
      const xy = (v: typeof points[number]) => [c.x(pr ? v.recall : v.fpr), c.y(pr ? v.precision : v.recall)];
      return <g key={i}><Text x={p.x + 110} y={25} bold>{pr ? "Precision–recall" : "ROC"}</Text>
        <Axes p={p} xticks={[0, 0.5, 1]} yticks={[0, 0.5, 1]} />
        <line x1={p.x} y1={pr ? c.y(0.5) : c.y(0)} x2={p.x + p.w} y2={pr ? c.y(0.5) : c.y(1)} stroke={border} strokeDasharray="5 4" />
        <polyline points={points.map(v => xy(v).join(",")).join(" ")} stroke={blue} strokeWidth="2" fill="none" />
        {points.map((v, j) => { const [x, y] = xy(v); return <circle key={j} cx={x} cy={y} r={v.threshold === 0.7 ? 7 : 3.5} fill={v.threshold === 0.7 ? orange : blue} />; })}
        <Text x={p.x + 110} y={322} size={13}>{pr ? "Recall" : "False-positive rate"}</Text><Text x={p.x} y={51} size={12} anchor="start" color={muted}>{pr ? "Precision" : "True-positive rate (recall)"}</Text>
      </g>;
    })}
    <Text x={320} y={349} size={12} color={orange}>Cutoff 0.7: flag scores ≥ 0.7 · 2 TP and 1 FP</Text>
  </Canvas>;
}
function Calibration() {
  const p = { x: 75, y: 55, w: 360, h: 240, xmin: 0, xmax: 1, ymin: 0, ymax: 1 }, c = coordinates(p);
  const bins = [[0.1, 0.1], [0.3, 0.23], [0.5, 0.35], [0.8, 0.6], [0.95, 0.8]];
  return <Canvas id="calibration" height={365}>
    <Axes p={p} xticks={[0, 0.5, 0.8, 1]} yticks={[0, 0.5, 1]} />
    <line x1={c.x(0)} y1={c.y(0)} x2={c.x(1)} y2={c.y(1)} stroke={teal} strokeWidth="2" strokeDasharray="5 4" />
    <polyline points={bins.map(([x, y]) => `${c.x(x)},${c.y(y)}`).join(" ")} stroke={blue} strokeWidth="2" fill="none" />
    {bins.map(([x, y]) => <Dot key={x} x={c.x(x)} y={c.y(y)} color={x === 0.8 ? orange : blue} />)}
    <line x1={c.x(0.8)} y1={c.y(0.6)} x2={c.x(0.8)} y2={c.y(0.8)} stroke={orange} strokeWidth="2" />
    <Text x={75} y={30} anchor="start" size={12}>Observed positive fraction</Text><Text x={255} y={341} size={13}>Mean predicted P(positive) in bin</Text>
    <Text x={535} y={110} bold color={orange}>One toy bin</Text><Text x={535} y={145} size={13}>Mean prediction: 0.8</Text><Text x={535} y={177} size={13}>60 / 100 positives</Text><Text x={535} y={209} size={13}>Observed rate: 0.6</Text>
    <Text x={535} y={258} size={12} color={muted}>Risk is overpredicted.</Text>
  </Canvas>;
}
function KmeansStep() {
  const step = kmeansStep(kmeansPoints, initialCenters);
  return <Canvas id="kmeans-step" height={330}>
    {[false, true].map((updated, panel) => {
      const p = { x: 50 + panel * 315, y: 60, w: 235, h: 205, xmin: -1, xmax: 9, ymin: -1, ymax: 8 }, c = coordinates(p);
      return <g key={panel}><Text x={p.x + 117} y={25} bold>{updated ? "2. Move centers to means" : "1. Assign to initial centers"}</Text>
        <Axes p={p} xticks={[0, 4, 8]} yticks={[0, 4, 8]} />
        {kmeansPoints.map((v, i) => <g key={i}>{!updated && <line x1={c.x(v[0])} y1={c.y(v[1])} x2={c.x(initialCenters[step.assignments[i]][0])} y2={c.y(initialCenters[step.assignments[i]][1])} stroke={border} />}
          <Dot x={c.x(v[0])} y={c.y(v[1])} color={step.assignments[i] ? orange : blue} /></g>)}
        {initialCenters.map((center, i) => { const next = updated ? step.updated[i] : center; return <g key={i}>{updated && <Arrow x1={c.x(center[0])} y1={c.y(center[1])} x2={c.x(next[0])} y2={c.y(next[1])} dashed color={i ? orange : blue} />}
          <Cross x={c.x(next[0])} y={c.y(next[1])} size={9} color={i ? orange : blue} /></g>; })}
      </g>;
    })}
    <Text x={320} y={317} size={12} color={muted}>Dots: examples · crosses: centers · colors: assigned groups</Text>
  </Canvas>;
}
function Dendrogram() {
  const y = (h: number) => 280 - h * 42;
  return <Canvas id="dendrogram" height={330}>
    <Text x={60} y={24} size={12} anchor="start">Merge height</Text><line x1="60" y1={y(5)} x2="60" y2={y(0)} stroke={border} />
    {[0, 1, 2, 3, 5].map(h => <Text key={h} x={47} y={y(h) + 4} size={12}>{h}</Text>)}
    <path d={`M120,280 V${y(1)} H230 V280 M430,280 V${y(2)} H540 V280 M175,${y(1)} V${y(5)} H485 V${y(2)}`} fill="none" stroke={ink} strokeWidth="2.5" />
    <line x1="75" y1={y(3)} x2="600" y2={y(3)} stroke={orange} strokeDasharray="6 4" strokeWidth="2" /><Text x={585} y={y(3) - 13} color={orange} size={13} anchor="end">Cut at 3 → two groups</Text>
    {[[120, "A"], [230, "B"], [430, "C"], [540, "D"]].map(([x, label]) => <Text key={label} x={Number(x)} y={305} bold color={Number(x) < 300 ? blue : teal}>{label}</Text>)}
  </Canvas>;
}
function DbscanNeighborhood() {
  const roles = dbscanRoles();
  return <Canvas id="dbscan-neighborhood" height={325}>
    <circle cx="190" cy="140" r="55" fill={blue} fillOpacity="0.07" stroke={blue} strokeDasharray="5 4" strokeWidth="2" />
    <line x1="210" y1="120" x2="250" y2="140" stroke={teal} strokeWidth="2" /><line x1="210" y1="160" x2="250" y2="140" stroke={teal} strokeWidth="2" />
    {dbscanPoints.map(([x, y], i) => roles[i] === "noise" ? <Cross key={i} x={x} y={y} color={red} /> : <Dot key={i} x={x} y={y} positive={roles[i] === "core"} color={roles[i] === "core" ? blue : orange} />)}
    <Text x={190} y={57} bold color={blue}>5 points within eps</Text><Text x={270} y={171} anchor="start" size={13} color={orange}>Border</Text>
    <Text x={390} y={57} size={13} color={red}>Noise</Text><Text x={450} y={249} size={13} color={red}>Noise</Text>
    <Text x={190} y={235} size={13}>Core neighborhood includes itself.</Text>
    <Dot x={80} y={290} /><Text x={98} y={295} size={12} anchor="start">Core: count ≥ 4</Text><Dot x={295} y={290} positive={false} /><Text x={313} y={295} size={12} anchor="start">Border: near core, count &lt; 4</Text>
  </Canvas>;
}
function GaussianMixture() {
  const p = { x: 65, y: 70, w: 510, h: 200, xmin: -5, xmax: 5, ymin: 0, ymax: 0.25 }, c = coordinates(p);
  return <Canvas id="gaussian-mixture" height={350}>
    <Axes p={p} xticks={[-5, -1.5, 0, 1.5, 5]} yticks={[0, 0.1, 0.2]} />
    <Curve p={p} fn={x => mixtureParts(x)[0]} color={blue} dashed /><Curve p={p} fn={x => mixtureParts(x)[1]} color={orange} dashed /><Curve p={p} fn={x => mixtureParts(x).reduce((a, b) => a + b, 0)} color={ink} />
    <line x1={c.x(0)} y1={c.y(0)} x2={c.x(0)} y2={c.y(mixtureParts(0)[0] * 2)} stroke={teal} strokeDasharray="4 3" />
    <Text x={155} y={30} color={blue} size={13}>0.5 × left density</Text><Text x={340} y={30} color={orange} size={13}>0.5 × right density</Text><Text x={525} y={30} bold size={13}>Sum: mixture</Text>
    <Text x={320} y={315} size={13}>Input x</Text><Text x={320} y={342} size={12} color={teal}>At x = 0: equal contributions → responsibilities [0.5, 0.5]</Text>
    <Text x={65} y={58} anchor="start" size={12} color={muted}>Density</Text>
  </Canvas>;
}
function FeatureAttributions() {
  const p = { x: 65, y: 55, w: 510, h: 220, xmin: 0, xmax: 5, ymin: 0, ymax: 0.6 }, c = coordinates(p);
  const bars = [{ label: "Reference", start: 0, end: 0.2, color: blue }, { label: "Amount", start: 0.2, end: 0.35, color: teal }, { label: "Long history", start: 0.35, end: 0.3, color: orange }, { label: "New device", start: 0.3, end: 0.4, color: teal }, { label: "Prediction", start: 0, end: 0.4, color: blue }];
  return <Canvas id="feature-attributions" height={345}>
    <Axes p={p} xticks={[]} yticks={[0, 0.2, 0.4, 0.6]} />
    {bars.map((bar, i) => {
      const x = p.x + i * 102 + 17, top = c.y(Math.max(bar.start, bar.end)), bottom = c.y(Math.min(bar.start, bar.end));
      return <g key={i}><rect x={x} y={top} width="66" height={bottom - top} fill={bar.color} fillOpacity="0.5" stroke={bar.color} />
        {i < 4 && <line x1={x + 66} y1={c.y(bar.end)} x2={x + 102} y2={c.y(bar.end)} stroke={border} strokeDasharray="4 3" />}
        <Text x={x + 33} y={top - 13} bold color={bar.color} size={13}>{i === 0 || i === 4 ? bar.end.toFixed(2) : `${bar.end > bar.start ? "+" : "−"}${Math.abs(bar.end - bar.start).toFixed(2)}`}</Text>
        <Text x={x + 33} y={300} size={12}>{bar.label}</Text></g>;
    })}
    <Text x={65} y={32} anchor="start" size={12}>Probability-scale output</Text><Text x={320} y={335} size={12} color={muted}>0.20 + 0.15 − 0.05 + 0.10 = 0.40</Text>
  </Canvas>;
}

export function StaticAmlVisual({ id }: { id: AmlVisualId }) {
  switch (id) {
    case "data-splits": return <DataSplits />;
    case "confusion-matrix": return <ConfusionMatrix />;
    case "bias-variance": return <BiasVariance />;
    case "feature-scaling": return <FeatureScaling />;
    case "cyclic-features": return <CyclicFeatures />;
    case "pca-projection": return <PcaProjection />;
    case "linear-fit": return <LinearFit />;
    case "logistic-sigmoid": return <LogisticSigmoid />;
    case "nearest-neighbors": return <NearestNeighbors />;
    case "svm-margin": return <SvmMargin />;
    case "decision-tree": return <DecisionTree />;
    case "ensemble-methods": return <EnsembleMethods />;
    case "regularization-geometry": return <RegularizationGeometry />;
    case "cross-validation": return <CrossValidation />;
    case "threshold-curves": return <ThresholdCurves />;
    case "calibration": return <Calibration />;
    case "kmeans-step": return <KmeansStep />;
    case "dendrogram": return <Dendrogram />;
    case "dbscan-neighborhood": return <DbscanNeighborhood />;
    case "gaussian-mixture": return <GaussianMixture />;
    case "feature-attributions": return <FeatureAttributions />;
    default: throw new Error("Shared Applied ML visual requires its registered renderer: " + id);
  }
}
