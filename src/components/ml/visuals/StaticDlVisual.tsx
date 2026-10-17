import type { ReactNode } from "react";
import { dlVisuals, type DlVisualId } from "@/lib/dlVisuals";
import { clipNorm, geluApprox, huber, lstmExample, maskAllows, matrixProduct, normalDensity, rotatePair, sigmoid, softmaxAtTemperature, thresholdCounts, thresholdSamples, warmupCosine } from "@/lib/dlVisualMath";

const blue = "#2563eb", orange = "#b45309", teal = "#0f766e", red = "#c2414c";
const ink = "var(--color-text, #202124)", muted = "var(--color-text-muted, #5f6368)";
const surface = "var(--color-surface, #fff)", border = "var(--color-outline, #94a3b8)";

function Text({ x, y, children, size = 14, color = ink, anchor = "middle", bold = false }: {
  x: number; y: number; children: ReactNode; size?: number; color?: string; anchor?: "middle" | "start" | "end"; bold?: boolean;
}) {
  const textColor = [blue, orange, teal, red].includes(color) ? `color-mix(in srgb, ${color} 65%, ${ink})` : color;
  return <text x={x} y={y} textAnchor={anchor} fill={textColor} fontSize={size} fontFamily="inherit" fontWeight={bold ? 650 : 400}>{children}</text>;
}
function Arrow({ x1, y1, x2, y2, color = blue, width = 2, dashed = false }: {
  x1: number; y1: number; x2: number; y2: number; color?: string; width?: number; dashed?: boolean;
}) {
  const a = Math.atan2(y2 - y1, x2 - x1), s = 7;
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dashed ? "5 4" : undefined} />
    <polygon points={[[x2, y2], [x2 - s * Math.cos(a - 0.45), y2 - s * Math.sin(a - 0.45)], [x2 - s * Math.cos(a + 0.45), y2 - s * Math.sin(a + 0.45)]].map(p => p.join(",")).join(" ")} fill={color} />
  </g>;
}
function Box({ x, y, w, h = 48, children, color = blue, size = 14 }: {
  x: number; y: number; w: number; h?: number; children: ReactNode; color?: string; size?: number;
}) {
  return <g><rect x={x} y={y} width={w} height={h} rx="8" fill={surface} stroke={color} strokeWidth="2" />
    <Text x={x + w / 2} y={y + h / 2 + 5} size={size}>{children}</Text></g>;
}
function Canvas({ id, height = 320, children }: { id: DlVisualId; height?: number; children: ReactNode }) {
  return <div className="overflow-x-auto px-2 py-3 focus-visible:outline-2 focus-visible:outline-blue-500" tabIndex={0} role="region" aria-label={dlVisuals[id].title}>
    <svg role="img" aria-label={dlVisuals[id].alt} viewBox={`0 0 640 ${height}`} className="h-auto w-full min-w-[540px]">{children}</svg>
  </div>;
}
function Grid({ x, y, rows, cols, cell = 22, selected, color = blue, values }: {
  x: number; y: number; rows: number; cols: number; cell?: number; selected?: (row: number, col: number) => boolean;
  color?: string; values?: number[][];
}) {
  return <g>{Array.from({ length: rows }, (_, row) => Array.from({ length: cols }, (_, col) => {
    const active = selected?.(row, col) ?? false;
    return <g key={`${row}:${col}`}>
      <rect x={x + col * cell} y={y + row * cell} width={cell - 1} height={cell - 1} rx="2" fill={active ? color : surface} fillOpacity={active ? 0.18 : 1} stroke={active ? color : border} />
      {values && <Text x={x + (col + 0.5) * cell} y={y + (row + 0.65) * cell} size={15}>{values[row][col]}</Text>}
    </g>;
  }))}</g>;
}
type PlotSpec = { x: number; y: number; w: number; h: number; xmin: number; xmax: number; ymin: number; ymax: number };
function coordinates(p: PlotSpec) {
  return { x: (v: number) => p.x + (v - p.xmin) / (p.xmax - p.xmin) * p.w,
    y: (v: number) => p.y + p.h - (v - p.ymin) / (p.ymax - p.ymin) * p.h };
}
function Curve({ plot, fn, color, dashed = false }: { plot: PlotSpec; fn: (x: number) => number; color: string; dashed?: boolean }) {
  const c = coordinates(plot);
  const points = Array.from({ length: 181 }, (_, i) => { const x = plot.xmin + i / 180 * (plot.xmax - plot.xmin); return [c.x(x), c.y(fn(x))].join(","); }).join(" ");
  return <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={dashed ? "5 4" : undefined} />;
}
function Axes({ plot, xticks, yticks }: { plot: PlotSpec; xticks: number[]; yticks: number[] }) {
  const c = coordinates(plot);
  return <g>
    <line x1={plot.x} y1={plot.y + plot.h} x2={plot.x + plot.w} y2={plot.y + plot.h} stroke={border} />
    <line x1={plot.x} y1={plot.y} x2={plot.x} y2={plot.y + plot.h} stroke={border} />
    {plot.xmin < 0 && plot.xmax > 0 && <line x1={c.x(0)} y1={plot.y} x2={c.x(0)} y2={plot.y + plot.h} stroke={border} strokeDasharray="3 3" />}
    {plot.ymin < 0 && plot.ymax > 0 && <line x1={plot.x} y1={c.y(0)} x2={plot.x + plot.w} y2={c.y(0)} stroke={border} strokeDasharray="3 3" />}
    {xticks.map(t => <Text key={t} x={c.x(t)} y={plot.y + plot.h + 19} size={11} color={muted}>{t}</Text>)}
    {yticks.map(t => <Text key={t} x={plot.x - 9} y={c.y(t) + 4} size={11} color={muted} anchor="end">{t}</Text>)}
  </g>;
}

function MatrixProduct() {
  const w = [[1, 2], [3, 4]], x = [[5], [6]], out = matrixProduct(w, x);
  return <Canvas id="matrix-product" height={300}>
    <Text x={155} y={40} bold>W · 2 × 2</Text><Text x={320} y={40} bold>x · 2 × 1</Text><Text x={510} y={40} bold>Wx · 2 × 1</Text>
    <Grid x={105} y={85} rows={2} cols={2} cell={50} values={w} selected={r => r === 0} />
    <Text x={250} y={144} size={25}>×</Text>
    <Grid x={295} y={85} rows={2} cols={1} cell={50} values={x} selected={() => true} color={orange} />
    <Text x={408} y={144} size={25}>=</Text>
    <Grid x={485} y={85} rows={2} cols={1} cell={50} values={out} selected={r => r === 0} color={teal} />
    <Text x={320} y={235} bold color={teal}>1 × 5 + 2 × 6 = 17</Text>
    <Text x={320} y={269} color={muted}>One row meets one column → one output cell.</Text>
  </Canvas>;
}
function Tangent() {
  const plot = { x: 65, y: 38, w: 355, h: 235, xmin: -3, xmax: 4, ymin: 0, ymax: 17 };
  const c = coordinates(plot);
  return <Canvas id="tangent" height={335}>
    <Axes plot={plot} xticks={[-3, 0, 3, 4]} yticks={[0, 9, 16]} />
    <Curve plot={plot} fn={x => x * x} color={blue} />
    <line x1={c.x(1.6)} y1={c.y(0.6)} x2={c.x(4)} y2={c.y(15)} stroke={orange} strokeWidth="2.5" />
    <circle cx={c.x(3)} cy={c.y(9)} r="6" fill={orange} />
    <Text x={c.x(3) - 15} y={c.y(9) - 15} anchor="end" color={orange}>(3, 9)</Text>
    <Text x={155} y={28} color={blue} bold>f(x) = x²</Text>
    <Text x={525} y={95} color={orange} bold>Tangent slope = 6</Text>
    <Text x={525} y={137} size={13}>Δx = 0.1</Text><Text x={525} y={166} size={13}>Δf ≈ 6 × 0.1 = 0.6</Text>
    <Text x={525} y={207} size={12} color={muted}>Exact change = 0.61</Text>
    <Text x={237} y={319} size={13}>Input x</Text><Text x={42} y={29} size={13}>f(x)</Text>
  </Canvas>;
}
function Activations() {
  const panels = [
    { title: "ReLU / Leaky ReLU", xmin: -3, xmax: 3, ymin: -0.6, ymax: 3, ticks: [0, 3], fn: (x: number) => Math.max(0, x) },
    { title: "Sigmoid", xmin: -6, xmax: 6, ymin: 0, ymax: 1, ticks: [0, 0.5, 1], fn: sigmoid },
    { title: "Tanh", xmin: -4, xmax: 4, ymin: -1, ymax: 1, ticks: [-1, 0, 1], fn: Math.tanh },
    { title: "GELU (tanh approximation)", xmin: -3, xmax: 3, ymin: -0.6, ymax: 3, ticks: [0, 3], fn: geluApprox },
  ];
  return <Canvas id="activations" height={480}>
    {panels.map((p, i) => {
      const x = 48 + i % 2 * 320, y = 50 + Math.floor(i / 2) * 220;
      const plot = { ...p, x, y, w: 235, h: 135 };
      return <g key={p.title}>
        <Text x={x + 116} y={y - 20} size={14} bold>{p.title}</Text>
        <Axes plot={plot} xticks={[p.xmin, 0, p.xmax]} yticks={p.ticks} />
        <Curve plot={plot} fn={p.fn} color={blue} />
        {i === 0 && <><Curve plot={plot} fn={v => v >= 0 ? v : 0.1 * v} color={orange} dashed />
          <Text x={x + 116} y={y + 179} size={12} color={orange}>Dashed: negative slope 0.1</Text></>}
        {i > 0 && <Text x={x + 116} y={y + 179} size={12} color={muted}>{i < 3 ? "Flatter ends → smaller derivatives" : "Small negative inputs are attenuated"}</Text>}
      </g>;
    })}
    <Text x={320} y={470} size={12} color={muted}>Horizontal: input x · vertical: activation f(x)</Text>
  </Canvas>;
}
function NormalDistribution() {
  const plot = { x: 65, y: 70, w: 520, h: 210, xmin: -6, xmax: 6, ymin: 0, ymax: 0.45 };
  const curves = [{ mean: 0, std: 1, color: blue }, { mean: 0, std: 2, color: orange }, { mean: 2, std: 1, color: teal }];
  return <Canvas id="normal-distribution" height={340}>
    <Axes plot={plot} xticks={[-6, -2, 0, 2, 6]} yticks={[0, 0.2, 0.4]} />
    {curves.map((v, i) => <g key={i}>
      <Curve plot={plot} fn={x => normalDensity(x, v.mean, v.std)} color={v.color} dashed={i === 1} />
      <line x1={80 + i * 175} y1="30" x2={105 + i * 175} y2="30" stroke={v.color} strokeWidth="3" strokeDasharray={i === 1 ? "5 3" : undefined} />
      <Text x={113 + i * 175} y={35} anchor="start" size={13} color={v.color}>{`μ = ${v.mean}, σ = ${v.std}`}</Text>
    </g>)}
    <Text x={325} y={326} size={13}>Value x</Text>
    <text x="22" y="175" textAnchor="middle" transform="rotate(-90 22 175)" fill={ink} fontSize="13">Probability density</text>
  </Canvas>;
}
function RegressionLosses() {
  const plot = { x: 65, y: 65, w: 520, h: 210, xmin: -3, xmax: 3, ymin: 0, ymax: 10 };
  return <Canvas id="regression-losses" height={340}>
    <Axes plot={plot} xticks={[-3, 0, 3]} yticks={[0, 5, 10]} />
    <Curve plot={plot} fn={x => x * x} color={blue} />
    <Curve plot={plot} fn={Math.abs} color={orange} dashed />
    <Curve plot={plot} fn={x => huber(x)} color={teal} />
    {[{ text: "MSE: e²", color: blue }, { text: "MAE: |e|", color: orange }, { text: "Huber: δ = 1", color: teal }].map((v, i) => <g key={v.text}>
      <line x1={95 + i * 175} y1="28" x2={120 + i * 175} y2="28" stroke={v.color} strokeWidth="3" strokeDasharray={i === 1 ? "4 3" : undefined} />
      <Text x={128 + i * 175} y={33} size={13} anchor="start" color={v.color}>{v.text}</Text>
    </g>)}
    <Text x={325} y={321} size={13}>Prediction error e = ŷ − y</Text><Text x={31} y={53} size={13}>Loss</Text>
  </Canvas>;
}
function LearningRate() {
  const plot = { x: 65, y: 55, w: 510, h: 200, xmin: 0, xmax: 100, ymin: 0, ymax: 1.1 };
  const c = coordinates(plot);
  return <Canvas id="learning-rate" height={325}>
    <Axes plot={plot} xticks={[0, 10, 50, 100]} yticks={[0, 0.5, 1]} />
    <Curve plot={plot} fn={x => warmupCosine(x / 100)} color={blue} />
    <line x1={c.x(10)} y1="55" x2={c.x(10)} y2="255" stroke={orange} strokeDasharray="4 3" />
    <Text x={115} y={32} size={13} color={orange}>Warmup</Text><Text x={370} y={32} size={13} color={blue}>Cosine decay</Text>
    <Text x={325} y={306} size={13}>Training progress (%)</Text>
    <text x="22" y="155" transform="rotate(-90 22 155)" textAnchor="middle" fill={ink} fontSize="13">Rate / peak rate</text>
  </Canvas>;
}
function GradientClipping() {
  const origin = [130, 240], scale = 20, clipped = clipNorm([6, 8], 5);
  const vectors = [{ v: [6, 8], color: muted, label: "Original (6, 8)" }, { v: [5, 5], color: orange, label: "Value clip (5, 5)" }, { v: clipped, color: blue, label: "Norm clip (3, 4)" }];
  return <Canvas id="gradient-clipping" height={360}>
    <circle cx={origin[0]} cy={origin[1]} r={100} fill="none" stroke={teal} strokeDasharray="5 4" />
    <Arrow x1={20} y1={240} x2={330} y2={240} color={border} /><Arrow x1={130} y1={345} x2={130} y2={35} color={border} />
    {vectors.map(({ v, color, label }) => <g key={label}>
      <Arrow x1={origin[0]} y1={origin[1]} x2={origin[0] + v[0] * scale} y2={origin[1] - v[1] * scale} color={color} width={3} />
    </g>)}
    <Text x={130} y={355} size={12} color={teal}>‖g‖ = 5</Text>
    {vectors.map(({ color, label }, i) => <g key={label}>
      <line x1="365" y1={90 + i * 66} x2="390" y2={90 + i * 66} stroke={color} strokeWidth="3" />
      <Text x={400} y={95 + i * 66} anchor="start" color={color} bold size={14}>{label}</Text>
      <Text x={400} y={117 + i * 66} anchor="start" size={12} color={muted}>{["Norm = 10", "Norm ≈ 7.07; direction changed", "Norm = 5; direction preserved"][i]}</Text>
    </g>)}
    <Text x={330} y={263} size={12}>g₁</Text><Text x={132} y={23} size={12}>g₂</Text>
  </Canvas>;
}
function Dropout() {
  const values = [2, 1.5, 0.7, 3.1], mask = [1, 0, 1, 0];
  return <Canvas id="dropout" height={350}>
    {[0, 1].map(panel => <g key={panel}>
      <Text x={160 + panel * 320} y={30} bold>{panel ? "Evaluation: all paths" : "Training: one random mask"}</Text>
      {values.map((v, i) => {
        const x = 42 + i * 77 + panel * 320, kept = panel || mask[i];
        return <g key={i}>
          <circle cx={x} cy="87" r="23" fill={surface} stroke={blue} strokeWidth="2" /><Text x={x} y={92} size={13}>{v}</Text>
          <Arrow x1={x} y1={113} x2={x} y2={202} color={kept ? blue : border} dashed={!kept} />
          {!kept && <Text x={x} y={169} size={24} color={red}>×</Text>}
          <circle cx={x} cy="232" r="23" fill={surface} stroke={kept ? blue : border} strokeWidth="2" />
          <Text x={x} y={237} size={13}>{panel ? v : Math.round(v * mask[i] * 2 * 10) / 10}</Text>
        </g>;
      })}
      <Text x={160 + panel * 320} y={300} size={13} color={muted}>{panel ? "No drop, no rescale" : "Keep probability 0.5 → survivors × 2"}</Text>
    </g>)}
  </Canvas>;
}
function NormalizationAxes() {
  return <Canvas id="normalization-axes" height={350}>
    {[0, 1].map(panel => <g key={panel}>
      <Text x={160 + panel * 320} y={32} bold>{panel ? "LayerNorm: one row" : "BatchNorm: one column"}</Text>
      <Text x={170 + panel * 320} y={72} size={13} color={muted}>D features →</Text>
      <Grid x={90 + panel * 320} y={95} rows={3} cols={4} cell={40} selected={(r, c) => panel ? r === 1 : c === 1} color={panel ? orange : blue} />
      {[0, 1, 2].map(row => <Text key={row} x={76 + panel * 320} y={120 + row * 40} size={12} anchor="end">{"b" + (row + 1)}</Text>)}
      <text x={35 + panel * 320} y="158" transform={`rotate(-90 ${35 + panel * 320} 158)`} textAnchor="middle" fill={muted} fontSize="13">B examples</text>
      {panel ? <Arrow x1={405} y1={245} x2={565} y2={245} color={orange} width={3} /> : <Arrow x1={285} y1={98} x2={285} y2={210} color={blue} width={3} />}
      <Text x={160 + panel * 320} y={295} size={13} color={panel ? orange : blue}>{panel ? "Statistics across D for each example" : "Statistics across B for each feature"}</Text>
    </g>)}
  </Canvas>;
}

function ReceptiveField() {
  return <Canvas id="receptive-field" height={300}>
    <Text x={105} y={32} bold>Input · 5 × 5</Text><Text x={320} y={32} bold>Layer 1 · 3 × 3</Text><Text x={535} y={32} bold>Layer 2 · 1 cell</Text>
    <Grid x={35} y={75} rows={5} cols={5} cell={28} />
    <rect x="33" y="73" width="142" height="142" fill="none" stroke={teal} strokeWidth="3" />
    <rect x="63" y="103" width="83" height="83" fill={orange} fillOpacity=".2" stroke={orange} strokeWidth="3" />
    <Arrow x1={190} y1={145} x2={260} y2={145} /><Text x={225} y={115} size={12}>3 × 3, s = 1</Text>
    <Grid x={275} y={100} rows={3} cols={3} cell={30} selected={() => true} />
    <rect x="305" y="130" width="29" height="29" fill={orange} fillOpacity=".6" stroke={orange} />
    <Arrow x1={380} y1={145} x2={485} y2={145} /><Text x={432} y={115} size={12}>3 × 3, s = 1</Text>
    <rect x="505" y="115" width="60" height="60" rx="5" fill={teal} /><Text x={535} y={151} bold color="#fff">5 × 5</Text>
    <Text x={130} y={255} size={12} color={orange}>Orange: one first-layer footprint</Text>
    <Text x={450} y={255} size={12} color={teal}>Green: final cell&apos;s entire footprint</Text>
  </Canvas>;
}
function RnnUnrolled() {
  const centers = [117, 257, 397, 537];
  return <Canvas id="rnn-unrolled" height={340}>
    <Text x={320} y={30} bold>Shared Wₓ, Wₕ, b</Text>
    <path d="M 117 92 V 55 H 537 V 92" fill="none" stroke={muted} strokeDasharray="4 4" />
    {centers.map((x, i) => <g key={x}>
      {i > 0 && i < 3 && <line x1={x} y1="55" x2={x} y2="92" stroke={muted} strokeDasharray="4 4" />}
      <Text x={x} y={111} size={12} color={muted}>{"Step " + (i + 1)}</Text>
      <Box x={x - 38} y={130} w={76} h={55}>RNN</Box>
      <Arrow x1={x} y1={235} x2={x} y2={190} />
      <Text x={x} y={263} bold>{["I", "love", "deep", "learning"][i]}</Text>
      <Text x={x} y={288} size={12} color={muted}>{"x" + ["₁", "₂", "₃", "₄"][i]}</Text>
      <Arrow x1={x + 38} y1={157} x2={i < 3 ? centers[i + 1] - 39 : 620} y2={157} color={teal} width={2.5} />
      <Text x={i < 3 ? x + 70 : 608} y={143} size={13} color={teal}>{"h" + ["₁", "₂", "₃", "₄"][i]}</Text>
    </g>)}
    <Text x={23} y={143} size={13} color={teal}>h₀</Text><Arrow x1={20} y1={157} x2={77} y2={157} color={teal} />
    <Text x={320} y={326} size={13} color={muted}>Different inputs and states; the same trainable cell.</Text>
  </Canvas>;
}
function BpttTruncation() {
  const xs = [90, 220, 350, 480];
  return <Canvas id="bptt-truncation" height={430}>
    {[0, 1].map(row => {
      const y = row ? 310 : 125;
      return <g key={row}>
        <Text x={32} y={y - 65} bold anchor="start">{row ? "Truncate after step 2" : "Full backward history"}</Text>
        {xs.map((x, i) => <g key={x}>
          <circle cx={x} cy={y} r="23" fill={surface} stroke={blue} strokeWidth="2" /><Text x={x} y={y + 5}>{"h" + ["₁", "₂", "₃", "₄"][i]}</Text>
          <Arrow x1={x + 24} y1={y} x2={i < 3 ? xs[i + 1] - 24 : 556} y2={y} />
          {row && i === 1 ? <>
            <Arrow x1={350} y1={y + 37} x2={292} y2={y + 37} color={orange} width={2.5} />
            <Arrow x1={275} y1={y + 37} x2={220} y2={y + 37} color={border} dashed />
          </> : <Arrow x1={i < 3 ? xs[i + 1] : 580} y1={y + 37} x2={x} y2={y + 37} color={row && i === 0 ? border : orange} dashed={!!row && i === 0} width={2.5} />}
        </g>)}
        <Box x={556} y={y - 23} w={48} h={46} color={orange}>L₄</Box>
        {!row && <Text x={320} y={y + 75} size={12} color={orange}>Loss sensitivity travels back through all time steps.</Text>}
        {!!row && <>
          <line x1="285" y1={y + 20} x2="285" y2={y + 64} stroke={red} strokeWidth="3" />
          <Text x={285} y={y + 91} color={red} size={12}>Stop backward history here</Text>
          <Text x={285} y={y - 36} color={blue} size={12}>Forward value continues</Text>
        </>}
      </g>;
    })}
  </Canvas>;
}
function LstmMemory() {
  const v = lstmExample;
  const op = (x: number, y: number, sign: string, color = teal) => <g><circle cx={x} cy={y} r="18" fill={surface} stroke={color} strokeWidth="2" /><Text x={x} y={y + 7} size={23}>{sign}</Text></g>;
  return <Canvas id="lstm-memory" height={455}>
    <Text x={75} y={85} bold>{"cₜ₋₁ = " + v.old}</Text><Arrow x1={65} y1={110} x2={180} y2={110} color={teal} width={3} />
    {op(200, 110, "×")}<Arrow x1={220} y1={110} x2={365} y2={110} color={teal} width={3} />
    <Text x={200} y={35} color={orange} bold>{"fₜ = " + v.forget}</Text><Arrow x1={200} y1={48} x2={200} y2={89} color={orange} />
    <Text x={292} y={89} size={12} color={teal}>Keep 1.6</Text>
    {op(385, 110, "+")}<Arrow x1={405} y1={110} x2={595} y2={110} color={teal} width={3} />
    <Text x={552} y={85} color={teal} bold>{"cₜ = " + v.cell}</Text>
    <Box x={220} y={240} w={100} color={blue}>{"c̃ₜ = " + v.candidate}</Box><Arrow x1={322} y1={264} x2={365} y2={264} />
    {op(385, 264, "×", blue)}<Arrow x1={385} y1={244} x2={385} y2={130} color={blue} />
    <Text x={365} y={189} anchor="end" size={12} color={blue}>Write 0.2</Text>
    <Text x={385} y={330} color={orange} bold>{"iₜ = " + v.input}</Text><Arrow x1={385} y1={310} x2={385} y2={284} color={orange} />
    <circle cx="500" cy="110" r="4" fill={teal} /><Arrow x1={500} y1={111} x2={500} y2={207} color={teal} />
    <Box x={455} y={210} w={90} h={45} color={teal}>tanh</Box><Arrow x1={500} y1={256} x2={500} y2={301} color={teal} />
    {op(500, 320, "×", teal)}<Text x={590} y={289} color={orange} bold>{"oₜ = " + v.output}</Text><Arrow x1={595} y1={320} x2={520} y2={320} color={orange} />
    <Arrow x1={500} y1={340} x2={500} y2={376} color={teal} /><Text x={500} y={404} bold color={teal}>{"hₜ ≈ " + v.hidden.toFixed(3)}</Text>
    <Text x={224} y={425} size={12} color={muted}>Gates and candidate ← [xₜ, hₜ₋₁]</Text>
  </Canvas>;
}
function AttentionMask() {
  const tokens = ["A", "B", "C", "D", "PAD"];
  return <Canvas id="attention-mask" height={340}>
    {[0, 1].map(panel => <g key={panel}>
      <Text x={160 + panel * 320} y={30} bold>{panel ? "Causal + padding mask" : "Bidirectional + padding mask"}</Text>
      <Text x={160 + panel * 320} y={60} size={12} color={muted}>Key tokens →</Text>
      {tokens.map((t, col) => <Text key={t} x={92 + col * 34 + panel * 320} y={86} size={12}>{t}</Text>)}
      {[0, 1, 2, 3].map(row => <g key={row}>
        <Text x={64 + panel * 320} y={123 + row * 34} size={12}>{tokens[row]}</Text>
        {tokens.map((t, col) => {
          const allowed = maskAllows(row, col, !!panel);
          return <g key={t}>
            <rect x={75 + col * 34 + panel * 320} y={101 + row * 34} width="32" height="32" rx="2" fill={allowed ? blue : surface} fillOpacity={allowed ? 0.2 : 1} stroke={border} />
            <Text x={91 + col * 34 + panel * 320} y={122 + row * 34} size={allowed ? 20 : 14} color={allowed ? blue : muted}>{allowed ? "•" : "×"}</Text>
          </g>;
        })}
      </g>)}
      <text x={30 + panel * 320} y="169" transform={`rotate(-90 ${30 + panel * 320} 169)`} textAnchor="middle" fill={muted} fontSize="12">Query tokens</text>
      <Text x={160 + panel * 320} y={282} size={13} color={muted}>• allowed · × blocked</Text>
    </g>)}
  </Canvas>;
}
function Rope() {
  const radians = Math.PI / 6;
  return <Canvas id="rope" height={360}>
    {[0, 1].map(panel => {
      const cx = 165 + panel * 310, cy = 190, positions = [1 + panel * 2, 3 + panel * 2];
      const vectors = positions.map(p => rotatePair([1, 0], p * radians));
      const [a, b] = vectors.map(v => [cx + v[0] * 50, cy - v[1] * 50]);
      const dot = vectors[0].reduce((s, v, i) => s + v * vectors[1][i], 0);
      return <g key={panel}>
        <Text x={cx} y={32} bold>{`Positions ${positions[0]} and ${positions[1]}`}</Text>
        <circle cx={cx} cy={cy} r="95" fill="none" stroke={border} />
        <line x1={cx - 112} y1={cy} x2={cx + 112} y2={cy} stroke={border} /><line x1={cx} y1={cy - 112} x2={cx} y2={cy + 112} stroke={border} />
        <path d={`M ${cx} ${cy} L ${a[0]} ${a[1]} A 50 50 0 0 0 ${b[0]} ${b[1]} Z`} fill={teal} fillOpacity=".15" />
        {vectors.map((v, i) => <g key={i}>
          <Arrow x1={cx} y1={cy} x2={cx + 95 * v[0]} y2={cy - 95 * v[1]} color={i ? orange : blue} width={3} />
          <Text x={cx + 114 * v[0]} y={cy - 114 * v[1] - 7} size={13} color={i ? orange : blue}>{`${i ? "K" : "Q"}@${positions[i]}`}</Text>
        </g>)}
        <Text x={cx + (panel ? -30 : 30)} y={cy - 21} size={12} color={teal}>60°</Text>
        <Text x={cx} y={333} color={teal} bold>{"Q · K = " + dot.toFixed(1)}</Text>
      </g>;
    })}
    <Arrow x1={295} y1={190} x2={345} y2={190} color={muted} /><Text x={320} y={224} size={12} color={muted}>Both +2</Text>
  </Canvas>;
}
function NormPlacement() {
  return <Canvas id="norm-placement" height={375}>
    <Text x={35} y={30} anchor="start" bold>Pre-LN</Text><Text x={320} y={40} size={13} color={teal}>Identity bypasses LN</Text>
    <Text x={35} y={116} bold>x</Text><Arrow x1={50} y1={110} x2={155} y2={110} />
    <path d="M 75 110 V 55 H 520 V 88" fill="none" stroke={teal} strokeWidth="3" /><Arrow x1={520} y1={65} x2={520} y2={88} color={teal} />
    <Box x={155} y={86} w={100}>LN</Box><Arrow x1={255} y1={110} x2={310} y2={110} /><Box x={310} y={86} w={100}>F</Box><Arrow x1={410} y1={110} x2={496} y2={110} />
    <circle cx="520" cy="110" r="22" fill={surface} stroke={teal} strokeWidth="2" /><Text x={520} y={117} size={24}>+</Text>
    <Arrow x1={543} y1={110} x2={595} y2={110} /><Text x={615} y={116} bold>y</Text>
    <Text x={35} y={203} anchor="start" bold>Post-LN</Text><Text x={270} y={215} size={13} color={teal}>Shortcut joins before LN</Text>
    <Text x={35} y={286} bold>x</Text><Arrow x1={50} y1={280} x2={175} y2={280} />
    <path d="M 75 280 V 230 H 395 V 258" fill="none" stroke={teal} strokeWidth="3" /><Arrow x1={395} y1={239} x2={395} y2={258} color={teal} />
    <Box x={175} y={256} w={100}>F</Box><Arrow x1={275} y1={280} x2={371} y2={280} />
    <circle cx="395" cy="280" r="22" fill={surface} stroke={teal} strokeWidth="2" /><Text x={395} y={287} size={24}>+</Text>
    <Arrow x1={418} y1={280} x2={460} y2={280} /><Box x={460} y={256} w={100} color={orange}>LN</Box><Arrow x1={560} y1={280} x2={595} y2={280} /><Text x={615} y={286} bold>y</Text>
    <Text x={320} y={355} size={13} color={muted}>Follow the green route from x to y.</Text>
  </Canvas>;
}
function AttentionArea() {
  return <Canvas id="attention-area" height={320}>
    <Text x={140} y={30} bold>N = 4</Text><Text x={455} y={30} bold>N = 8</Text>
    <Grid x={96} y={120} rows={4} cols={4} cell={22} selected={() => true} />
    <Grid x={367} y={76} rows={8} cols={8} cell={22} selected={() => true} />
    <Arrow x1={214} y1={164} x2={337} y2={164} color={orange} />
    <Text x={275} y={132} size={13} color={orange}>2× tokens</Text><Text x={275} y={203} size={13} color={orange}>4× pairs</Text>
    <Text x={140} y={283} color={blue} bold>16 score entries</Text><Text x={455} y={283} color={blue} bold>64 score entries</Text>
  </Canvas>;
}

function Lora() {
  return <Canvas id="lora" height={365}>
    <Text x={28} y={170} bold>x</Text><line x1="45" y1="165" x2="70" y2="165" stroke={blue} strokeWidth="2" />
    <path d="M 70 165 V 97 H 200" fill="none" stroke={muted} strokeWidth="2" /><Arrow x1={160} y1={97} x2={200} y2={97} color={muted} />
    <Text x={305} y={43} bold color={muted}>Frozen base weights</Text><Box x={205} y={65} w={200} h={65} color={muted}>W: 4096 × 4096</Box>
    <path d="M 405 97 H 560 V 144" fill="none" stroke={muted} strokeWidth="2" /><Arrow x1={560} y1={118} x2={560} y2={144} color={muted} />
    <path d="M 70 165 V 247 H 125" fill="none" stroke={blue} strokeWidth="2" /><Arrow x1={95} y1={247} x2={125} y2={247} />
    <Box x={125} y={220} w={110} h={55}>A: 8 × 4096</Box><Arrow x1={235} y1={247} x2={310} y2={247} />
    <Text x={272} y={288} size={12} color={blue}>8 features</Text>
    <Box x={310} y={220} w={110} h={55}>B: 4096 × 8</Box><Arrow x1={420} y1={247} x2={465} y2={247} />
    <Box x={465} y={222} w={60} h={50}>× s</Box><path d="M 525 247 H 560 V 186" fill="none" stroke={blue} strokeWidth="2" /><Arrow x1={560} y1={215} x2={560} y2={186} />
    <circle cx="560" cy="165" r="20" fill={surface} stroke={teal} strokeWidth="2" /><Text x={560} y={173} size={25}>+</Text><Arrow x1={582} y1={165} x2={610} y2={165} color={teal} /><Text x={625} y={170} bold>y</Text>
    <Text x={320} y={340} bold size={14} color={blue}>65,536 trainable / 16,777,216 frozen weights</Text>
  </Canvas>;
}
function Temperature() {
  return <Canvas id="temperature" height={335}>
    {[0.5, 1, 2].map((t, panel) => {
      const values = softmaxAtTemperature([2, 1, 0], t), left = 42 + panel * 210;
      return <g key={t}>
        <Text x={left + 67} y={30} bold>{"T = " + t}</Text>
        <line x1={left} y1="255" x2={left + 140} y2="255" stroke={border} /><line x1={left} y1="55" x2={left} y2="255" stroke={border} />
        {[0, 0.5, 1].map(v => <g key={v}><line x1={left} y1={255 - v * 180} x2={left + 140} y2={255 - v * 180} stroke={border} strokeDasharray="3 4" /><Text x={left - 6} y={259 - v * 180} anchor="end" size={11} color={muted}>{v}</Text></g>)}
        {values.map((p, i) => <g key={i}>
          <rect x={left + 12 + i * 44} y={255 - p * 180} width="28" height={p * 180} rx="2" fill={[blue, teal, orange][i]} />
          <Text x={left + 26 + i * 44} y={246 - p * 180} size={12}>{p.toFixed(2)}</Text>
          <Text x={left + 26 + i * 44} y={278} size={12}>{["A", "B", "C"][i]}</Text>
        </g>)}
      </g>;
    })}
    <Text x={320} y={320} size={13} color={muted}>Same token scores; different probability concentration.</Text>
  </Canvas>;
}
function KvCache() {
  const centers = [100, 190, 280, 400];
  return <Canvas id="kv-cache" height={355}>
    <Text x={190} y={30} bold>Cached prefix</Text><Box x={520} y={35} w={70} h={45} color={orange}>Q₄</Box>
    <line x1="100" y1="57" x2="520" y2="57" stroke={orange} strokeWidth="2" />
    <rect x="55" y="85" width="272" height="155" rx="8" fill={blue} fillOpacity=".05" stroke={blue} strokeDasharray="4 3" />
    <rect x="355" y="85" width="90" height="155" rx="8" fill={orange} fillOpacity=".06" stroke={orange} strokeDasharray="4 3" />
    {centers.map((x, i) => <g key={x}>
      <Arrow x1={x} y1={57} x2={x} y2={96} color={orange} />
      <Box x={x - 30} y={100} w={60} h={44} color={i === 3 ? orange : blue}>{"K" + ["₁", "₂", "₃", "₄"][i]}</Box>
      <Box x={x - 30} y={183} w={60} h={44} color={i === 3 ? orange : blue}>{"V" + ["₁", "₂", "₃", "₄"][i]}</Box>
      <line x1={x} y1="231" x2={x} y2="285" stroke={teal} strokeWidth="2" />
    </g>)}
    <Text x={190} y={164} size={12} color={blue}>Read without recomputing</Text>
    <Text x={400} y={164} size={12} color={orange}>New pair</Text>
    <line x1="100" y1="285" x2="490" y2="285" stroke={teal} strokeWidth="2" /><Arrow x1={450} y1={285} x2={495} y2={285} color={teal} />
    <Box x={500} y={262} w={110} h={46} color={teal} size={12}>Weighted sum</Box>
    <Text x={305} y={329} size={13} color={teal}>Softmax(Q₄Kᵀ) supplies the weights for mixing V.</Text>
  </Canvas>;
}
function ClassificationThreshold() {
  const px = (s: number) => 80 + s * 490;
  return <Canvas id="classification-threshold" height={475}>
    {[0.4, 0.7].map((threshold, panel) => {
      const offset = panel * 240, counts = thresholdCounts(threshold);
      return <g key={threshold}>
        <Text x={165} y={26 + offset} bold>{"Threshold = " + threshold}</Text><Text x={480} y={45 + offset} size={12} color={blue}>Predicted positive →</Text>
        <rect x={px(threshold)} y={50 + offset} width={px(1) - px(threshold)} height="110" fill={blue} fillOpacity=".08" />
        <line x1={px(threshold)} y1={50 + offset} x2={px(threshold)} y2={160 + offset} stroke={orange} strokeWidth="2" strokeDasharray="4 3" />
        <Text x={65} y={90 + offset} size={12} anchor="end">Actual +</Text><Text x={65} y={140 + offset} size={12} anchor="end">Actual −</Text>
        {thresholdSamples.map((s, i) => {
          const predicted = s.score >= threshold, wrong = predicted !== s.positive, y = offset + (s.positive ? 85 : 135);
          return <g key={i}>
            <circle cx={px(s.score)} cy={y} r="11" fill={surface} stroke={wrong ? orange : teal} strokeWidth="2.5" />
            <Text x={px(s.score)} y={y + 5} size={14} color={wrong ? orange : teal}>{s.positive ? "+" : "−"}</Text>
            {wrong && <Text x={px(s.score)} y={y + (s.positive ? -20 : 27)} size={11} color={orange}>{s.positive ? "FN" : "FP"}</Text>}
          </g>;
        })}
        <line x1={px(0)} y1={180 + offset} x2={px(1)} y2={180 + offset} stroke={border} />
        {[0, 0.5, 1].map(v => <Text key={v} x={px(v)} y={198 + offset} size={11} color={muted}>{v}</Text>)}
        <Text x={320} y={224 + offset} size={13} bold>{`TP ${counts.tp} · FP ${counts.fp} · FN ${counts.fn} · TN ${counts.tn}`}</Text>
        <Text x={610} y={184 + offset} size={11} color={muted}>Score</Text>
      </g>;
    })}
  </Canvas>;
}
function Pareto() {
  const plot = { x: 70, y: 55, w: 500, h: 210, xmin: 0, xmax: 100, ymin: 70, ymax: 95 }, c = coordinates(plot);
  const points = [{ name: "A", latency: 20, quality: 80 }, { name: "B", latency: 40, quality: 88 }, { name: "C", latency: 80, quality: 91 }, { name: "D", latency: 70, quality: 88 }];
  return <Canvas id="pareto" height={335}>
    <rect x={c.x(0)} y={plot.y} width={c.x(50) - c.x(0)} height={plot.h} fill={teal} fillOpacity=".06" />
    <Axes plot={plot} xticks={[0, 20, 40, 60, 80, 100]} yticks={[70, 80, 90, 95]} />
    <line x1={c.x(50)} y1={plot.y} x2={c.x(50)} y2={plot.y + plot.h} stroke={orange} strokeDasharray="5 4" /><Text x={c.x(50)} y={30} color={orange} size={13}>50 ms budget</Text>
    <polyline points={points.slice(0, 3).map(p => [c.x(p.latency), c.y(p.quality)].join(",")).join(" ")} fill="none" stroke={blue} strokeDasharray="5 4" />
    {points.map(p => <g key={p.name}>
      <circle cx={c.x(p.latency)} cy={c.y(p.quality)} r="6" fill={p.name === "D" ? orange : blue} />
      <Text x={c.x(p.latency)} y={c.y(p.quality) + (p.name === "D" ? 28 : -14)} size={14} bold color={p.name === "D" ? orange : blue}>{p.name === "D" ? "D: dominated" : p.name}</Text>
    </g>)}
    <Arrow x1={c.x(70) - 12} y1={c.y(88)} x2={c.x(40) + 12} y2={c.y(88)} color={orange} dashed />
    <Text x={320} y={317} size={13}>Latency (ms) · lower is better</Text>
    <text x="23" y="160" textAnchor="middle" transform="rotate(-90 23 160)" fill={ink} fontSize="13">Quality score · higher is better</text>
  </Canvas>;
}

export function StaticDlVisual({ id }: { id: DlVisualId }) {
  switch (id) {
    case "matrix-product": return <MatrixProduct />;
    case "tangent": return <Tangent />;
    case "normal-distribution": return <NormalDistribution />;
    case "activations": return <Activations />;
    case "regression-losses": return <RegressionLosses />;
    case "learning-rate": return <LearningRate />;
    case "gradient-clipping": return <GradientClipping />;
    case "dropout": return <Dropout />;
    case "normalization-axes": return <NormalizationAxes />;
    case "receptive-field": return <ReceptiveField />;
    case "rnn-unrolled": return <RnnUnrolled />;
    case "bptt-truncation": return <BpttTruncation />;
    case "lstm-memory": return <LstmMemory />;
    case "attention-mask": return <AttentionMask />;
    case "rope": return <Rope />;
    case "norm-placement": return <NormPlacement />;
    case "attention-area": return <AttentionArea />;
    case "lora": return <Lora />;
    case "temperature": return <Temperature />;
    case "kv-cache": return <KvCache />;
    case "classification-threshold": return <ClassificationThreshold />;
    case "pareto": return <Pareto />;
    default: throw new Error("Expected a static Deep Learning visual: " + id);
  }
}
