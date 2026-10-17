import type { ReactNode } from "react";
import { morphology, type Matrix } from "@/lib/cvVisualMath";
import { cvVisuals, type CvVisualId } from "@/lib/cvVisuals";

const blue = "#2563eb", orange = "#b45309", teal = "#0f766e";
const ink = "var(--color-text, #1f2937)", muted = "var(--color-text-muted, #64748b)";
const surface = "var(--color-surface, #fff)", border = "var(--color-outline, #94a3b8)";

function Text({ x, y, children, size = 14, color = ink, anchor = "middle", bold = false }: {
  x: number; y: number; children: ReactNode; size?: number; color?: string;
  anchor?: "middle" | "start" | "end"; bold?: boolean;
}) {
  const textColor = [blue, orange, teal, "#c2414c"].includes(color)
    ? `color-mix(in srgb, ${color} 65%, ${ink})` : color;
  return <text x={x} y={y} textAnchor={anchor} fill={textColor} fontSize={size} fontWeight={bold ? 650 : 400} fontFamily="inherit">{children}</text>;
}

function Arrow({ x1, y1, x2, y2, color = blue, width = 2, dashed = false }: {
  x1: number; y1: number; x2: number; y2: number; color?: string; width?: number; dashed?: boolean;
}) {
  const a = Math.atan2(y2 - y1, x2 - x1), s = 7;
  return <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dashed ? "5 4" : undefined} />
    <path d={"M " + x2 + " " + y2 + " L " + (x2 - s * Math.cos(a - 0.45)) + " " + (y2 - s * Math.sin(a - 0.45)) + " L " + (x2 - s * Math.cos(a + 0.45)) + " " + (y2 - s * Math.sin(a + 0.45)) + " Z"} fill={color} />
  </g>;
}

function Grid({ values, x, y, cell = 18, color = blue, numbers = false }: {
  values: Matrix; x: number; y: number; cell?: number; color?: string; numbers?: boolean;
}) {
  return <g>{values.flatMap((row, iy) => row.map((v, ix) => <g key={iy + ":" + ix}>
    <rect x={x + ix * cell} y={y + iy * cell} width={cell - 1} height={cell - 1} rx="1"
      fill={v > 0 ? color : surface} fillOpacity={v > 0 ? Math.max(0.1, Math.min(v, 1)) : 1} stroke={border} strokeWidth=".5" />
    {numbers && <Text x={x + (ix + 0.5) * cell} y={y + (iy + 0.67) * cell} size={cell * 0.38} color={v > 0.5 ? "#fff" : ink}>{v}</Text>}
  </g>))}</g>;
}

function Canvas({ id, height = 310, children }: { id: CvVisualId; height?: number; children: ReactNode }) {
  return <div className="overflow-x-auto px-2 py-3 focus-visible:outline-2 focus-visible:outline-blue-500" tabIndex={0} role="region" aria-label={cvVisuals[id].title}>
    <svg role="img" aria-label={cvVisuals[id].alt} viewBox={"0 0 640 " + height} className="h-auto w-full min-w-[540px]">
      {children}
    </svg>
  </div>;
}

function Channels() {
  const colors = ["#dc2626", "#16a34a", "#2563eb", "#f8fafc"];
  const channels = [[255, 0, 0, 255], [0, 255, 0, 255], [0, 0, 255, 255]];
  return <Canvas id="rgb-channels" height={270}>
    <Text x={85} y={35} bold>2 × 2 image</Text>
    {colors.map((c, i) => <rect key={c} x={35 + (i % 2) * 49} y={70 + Math.floor(i / 2) * 49} width="48" height="48" fill={c} stroke={border} />)}
    <Arrow x1={150} y1={120} x2={195} y2={120} />
    {channels.map((values, ch) => <g key={ch}>
      <Text x={255 + ch * 140} y={35} color={[orange, teal, blue][ch]} bold>{["Red", "Green", "Blue"][ch]}</Text>
      {values.map((v, i) => <g key={i}>
        <rect x={206 + ch * 140 + (i % 2) * 49} y={70 + Math.floor(i / 2) * 49} width="48" height="48" rx="3"
          fill={v ? ["#dc2626", "#15803d", "#2563eb"][ch] : surface} stroke={border} />
        <Text x={230 + ch * 140 + (i % 2) * 49} y={100 + Math.floor(i / 2) * 49} color={v ? "#fff" : ink}>{v}</Text>
      </g>)}
    </g>)}
    <Text x={320} y={220} bold>3 channels × 2 rows × 2 columns</Text>
    <Text x={320} y={244} color={muted}>Reorder the axes; keep each channel&apos;s pixels together.</Text>
  </Canvas>;
}

function Aliasing() {
  return <Canvas id="aliasing" height={290}>
    <Text x={30} y={30} anchor="start" bold>Original samples</Text>
    {Array.from({ length: 16 }, (_, i) => <rect key={i} x={70 + i * 29} y={48} width="28" height="40" fill={i % 2 ? "#f8fafc" : "#25334a"} stroke={border} />)}
    <Text x={30} y={130} anchor="start" bold>Keep positions 0, 2, 4…</Text>
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={70 + i * 29} y={148} width="28" height="40" fill="#25334a" stroke={border} />)}
    <Text x={410} y={173} color={orange}>False solid-black pattern</Text>
    <Text x={30} y={230} anchor="start" bold>Average each pair, then keep</Text>
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={70 + i * 29} y={248} width="28" height="30" fill="#808080" stroke={border} />)}
    <Text x={410} y={269} color={teal}>Gray: pair average = 0.5</Text>
  </Canvas>;
}

function EdgeProfile() {
  const start = [25, 245, 465];
  return <Canvas id="canny" height={280}>
    {start.map((x, i) => <g key={x}>
      <Text x={x + 75} y={32} bold>{["Intensity", "Gradient size", "Thinned edge"][i]}</Text>
      <Arrow x1={x + 5} y1={220} x2={x + 155} y2={220} color={border} />
      <Arrow x1={x + 5} y1={220} x2={x + 5} y2={65} color={border} />
      <Text x={x + 80} y={246} size={12} color={muted}>Position along a row</Text>
      {i === 0 && <path d={"M " + (x + 7) + " 190 H " + (x + 65) + " Q " + (x + 75) + " 190 " + (x + 80) + " 120 Q " + (x + 85) + " 80 " + (x + 95) + " 80 H " + (x + 150)} fill="none" stroke={blue} strokeWidth="4" />}
      {i === 1 && <path d={"M " + (x + 7) + " 215 Q " + (x + 48) + " 215 " + (x + 64) + " 135 Q " + (x + 80) + " 20 " + (x + 97) + " 135 Q " + (x + 112) + " 215 " + (x + 150) + " 215"} fill="none" stroke={orange} strokeWidth="4" />}
      {i === 2 && <><line x1={x + 80} y1="215" x2={x + 80} y2="90" stroke={teal} strokeWidth="5" /><Text x={x + 80} y={76} size={12} color={teal}>Keep peak</Text></>}
    </g>)}
    <Arrow x1={195} y1={145} x2={230} y2={145} />
    <Arrow x1={415} y1={145} x2={450} y2={145} />
  </Canvas>;
}

function Morphology() {
  const speck = Array.from({ length: 9 }, (_, y) => Array.from({ length: 9 }, (_, x) =>
    y >= 3 && y <= 6 && x >= 2 && x <= 5 || y === 0 && x === 8 ? 1 : 0));
  const hole = Array.from({ length: 9 }, (_, y) => Array.from({ length: 9 }, (_, x) =>
    y >= 2 && y <= 6 && x >= 2 && x <= 6 && !(y === 4 && x === 4) ? 1 : 0));
  const eroded = morphology(speck, "erode"), dilated = morphology(hole, "dilate");
  const rows = [[speck, eroded, morphology(eroded, "dilate")], [hole, dilated, morphology(dilated, "erode")]];
  return <Canvas id="morphology" height={400}>
    {rows.map((masks, row) => masks.map((mask, col) => <g key={row + ":" + col}>
      <Text x={104 + col * 216} y={30 + row * 185} bold size={13}>
        {row === 0 ? ["Input + speck", "Erode", "Dilate → opening"][col] : ["Input + hole", "Dilate", "Erode → closing"][col]}
      </Text>
      <Grid values={mask} x={43 + col * 216} y={48 + row * 185} cell={13.5} />
      {col < 2 && <Arrow x1={180 + col * 216} y1={108 + row * 185} x2={225 + col * 216} y2={108 + row * 185} />}
    </g>))}
  </Canvas>;
}

function Transforms() {
  const base = [[-30, -30], [30, -30], [30, 30], [-30, 30]];
  const shapes = [
    base.map(([x, y]) => [x * Math.cos(0.35) - y * Math.sin(0.35), x * Math.sin(0.35) + y * Math.cos(0.35)]),
    base.map(([x, y]) => [x * 1.5, y * 1.5]),
    base.map(([x, y]) => [x + 0.55 * y, 0.9 * y]),
    [[-18, -30], [18, -30], [45, 35], [-45, 35]],
  ];
  return <Canvas id="transforms" height={260}>
    {shapes.map((points, i) => <g key={i}>
      <Text x={80 + i * 160} y={35} bold>{["Rigid", "Similarity", "Affine", "Homography"][i]}</Text>
      <rect x={50 + i * 160} y="95" width="60" height="60" fill="none" stroke={border} strokeDasharray="4 3" />
      <polygon points={points.map(([x, y]) => [x + 80 + i * 160, y + 130].join(",")).join(" ")} fill={blue} fillOpacity=".15" stroke={blue} strokeWidth="2.5" />
      <Text x={80 + i * 160} y={220} size={12} color={muted}>{["Rotate / translate", "Uniform scale too", "Shear / unequal scale", "Perspective"][i]}</Text>
    </g>)}
  </Canvas>;
}

function Ransac() {
  const inliers = [[0, 0.2], [1, 1.1], [2, 1.9], [3, 3.2], [4, 4], [5, 5.1], [6, 6], [7, 7.2]];
  const outliers = [[1, 7.5], [2, 8], [6, 1.5]];
  const fit = (points: number[][]) => {
    const n = points.length, sx = points.reduce((s, p) => s + p[0], 0), sy = points.reduce((s, p) => s + p[1], 0);
    const slope = (n * points.reduce((s, p) => s + p[0] * p[1], 0) - sx * sy) /
      (n * points.reduce((s, p) => s + p[0] ** 2, 0) - sx ** 2);
    return [slope, (sy - slope * sx) / n];
  };
  const mapping = ([x, y]: number[]) => [70 + x * 65, 250 - y * 24];
  return <Canvas id="ransac" height={310}>
    <Arrow x1={60} y1={260} x2={600} y2={260} color={border} />
    <Arrow x1={60} y1={260} x2={60} y2={30} color={border} />
    {[{ points: inliers, color: blue }, { points: [...inliers, ...outliers], color: orange }].map(({ points, color }) => {
      const [m, b] = fit(points), [x1, y1] = mapping([0, b]), [x2, y2] = mapping([7.6, m * 7.6 + b]);
      return <line key={color} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" strokeDasharray={color === orange ? "7 4" : undefined} />;
    })}
    {inliers.map((p, i) => <circle key={i} cx={mapping(p)[0]} cy={mapping(p)[1]} r="5" fill={blue} />)}
    {outliers.map((p, i) => <g key={i} stroke={orange} strokeWidth="2.5"><path d={"M " + (mapping(p)[0] - 5) + " " + (mapping(p)[1] - 5) + " l 10 10 m -10 0 l 10 -10"} /></g>)}
    <Text x={185} y={295} color={blue}>Consistent group / fit</Text>
    <Text x={465} y={295} color={orange}>Outliers / all-point fit</Text>
  </Canvas>;
}

function Projection() {
  const hit = 225 + (210 - 65) * (45 - 225) / (560 - 65);
  return <Canvas id="projection" height={345}>
    <line x1="45" y1="225" x2="600" y2="225" stroke={border} strokeDasharray="4 4" />
    <line x1="210" y1="90" x2="210" y2="260" stroke={teal} strokeWidth="3" />
    <line x1="65" y1="225" x2="560" y2="45" stroke={blue} strokeWidth="2.5" />
    <circle cx="65" cy="225" r="7" fill={ink} />
    <circle cx="210" cy={hit} r="6" fill={teal} />
    <circle cx="395" cy="105" r="7" fill={blue} />
    <circle cx="560" cy="45" r="7" fill={orange} />
    <Text x={65} y={250} size={12}>Camera center</Text>
    <Text x={210} y={65} color={teal}>Virtual image plane</Text>
    <Text x={392} y={85} color={blue}>Point P</Text>
    <Text x={560} y={25} color={orange}>Farther Q</Text>
    <Text x={300} y={168} color={teal}>Same pixel</Text>
    <Arrow x1={265} y1={173} x2={221} y2={hit} color={teal} />
    <line x1="65" y1="280" x2="210" y2="280" stroke={ink} />
    <Text x={135} y={302}>f</Text>
    <line x1="65" y1="320" x2="560" y2="320" stroke={border} />
    <Text x={400} y={338} size={12} color={muted}>Scene depth lies along this direction</Text>
  </Canvas>;
}

function Stereo() {
  return <Canvas id="stereo" height={330}>
    {[2, 10].map((depth, i) => <g key={depth}>
      <Text x={160 + i * 320} y={25} bold>{"Depth Z = " + depth + " m"}</Text>
      <line x1={60 + i * 320} y1="215" x2={160 + i * 320} y2={i ? 50 : 105} stroke={blue} strokeWidth="2" />
      <line x1={260 + i * 320} y1="215" x2={160 + i * 320} y2={i ? 50 : 105} stroke={orange} strokeWidth="2" />
      <circle cx={160 + i * 320} cy={i ? 50 : 105} r="6" fill={teal} />
      {[60, 260].map((x, j) => <g key={x}>
        <rect x={x - 15 + i * 320} y="205" width="30" height="24" rx="4" fill="none" stroke={j ? orange : blue} strokeWidth="2" />
        <Text x={x + i * 320} y={250} size={12}>{j ? "Right" : "Left"}</Text>
      </g>)}
      <line x1={60 + i * 320} y1="270" x2={260 + i * 320} y2="270" stroke={border} />
      <Text x={160 + i * 320} y={288} size={12} color={muted}>Baseline B = 0.1 m</Text>
      <rect x={70 + i * 320} y="306" width={i ? 32 : 160} height="9" rx="3" fill={teal} />
      <Text x={i ? 490 : 270} y={316} size={12} color={teal}>{i ? "d = 8 px" : "d = 40 px"}</Text>
    </g>)}
  </Canvas>;
}

function Aperture() {
  return <Canvas id="aperture" height={290}>
    {[35, 250, 465].map((x, i) => <g key={x}>
      <Text x={x + 70} y={35} bold size={13}>{["Straight edge", "After vertical slide", "Corner: cue in both axes"][i]}</Text>
      <rect x={x} y="65" width="140" height="150" fill={surface} stroke={border} />
      {i < 2 ? <rect x={x + 70} y="65" width="70" height="150" fill="#25334a" /> :
        <><path d={"M " + (x + 55) + " 65 V 145 H " + (x + 140)} fill="none" stroke={border} strokeDasharray="5 4" strokeWidth="3" />
          <path d={"M " + (x + 55) + " 95 V 175 H " + (x + 140)} fill="none" stroke={blue} strokeWidth="4" /></>}
      <Arrow x1={x + 30} y1={110} x2={x + 30} y2={180} color={orange} width={3} />
      <Text x={x + 70} y={248} size={12} color={i < 2 ? muted : blue}>{i < 2 ? "Same local appearance" : "Corner location changes"}</Text>
    </g>)}
  </Canvas>;
}

function GradientDescent() {
  const px = (w: number) => 60 + 55 * w, py = (loss: number) => 278 - 5.5 * loss;
  const curve = Array.from({ length: 94 }, (_, i) => {
    const w = i / 10; return px(w) + "," + py((w - 3) ** 2);
  }).join(" ");
  return <Canvas id="gradient-descent" height={330}>
    <Arrow x1={50} y1={278} x2={610} y2={278} color={border} />
    <Arrow x1={50} y1={278} x2={50} y2={35} color={border} />
    <Text x={32} y={35} size={13}>L</Text><Text x={610} y={302} size={13}>w</Text>
    <polyline points={curve} fill="none" stroke={muted} strokeWidth="2" />
    <Arrow x1={px(1)} y1={py(4)} x2={px(9)} y2={py(36)} color={orange} dashed />
    <Arrow x1={px(1)} y1={py(4)} x2={px(1.4)} y2={py(2.56)} color={blue} width={4} />
    {[1, 1.4, 3, 9].map(w => <circle key={w} cx={px(w)} cy={py((w - 3) ** 2)} r="5" fill={w === 9 ? orange : w === 3 ? teal : blue} />)}
    <Text x={110} y={220} size={13}>Start: w = 1</Text>
    <Text x={265} y={247} size={13} color={blue}>Small step → 1.4</Text>
    <Text x={610} y={48} anchor="end" color={orange}>Large step → w = 9, L = 36</Text>
    <Text x={px(3)} y={310} color={teal}>Minimum at w = 3</Text>
  </Canvas>;
}

function LearningCurves() {
  const training = (t: number) => 0.85 * Math.exp(-t / 23) + 0.1;
  const validation = (t: number) => 0.75 * Math.exp(-t / 15) + 0.15 + 0.0001 * t ** 2;
  const coords = (fn: (t: number) => number) => Array.from({ length: 101 }, (_, t) => [55 + t * 5.1, 275 - fn(t) * 200].join(",")).join(" ");
  const best = Array.from({ length: 101 }, (_, t) => t).reduce((a, b) => validation(a) < validation(b) ? a : b);
  return <Canvas id="learning-curves" height={325}>
    <Arrow x1={50} y1={275} x2={610} y2={275} color={border} />
    <Arrow x1={50} y1={275} x2={50} y2={30} color={border} />
    <Text x={25} y={40} size={13}>Loss</Text><Text x={510} y={310} size={13}>Training progress</Text>
    <polyline points={coords(training)} fill="none" stroke={blue} strokeWidth="3" />
    <polyline points={coords(validation)} fill="none" stroke={orange} strokeWidth="3" />
    <line x1={55 + best * 5.1} y1="70" x2={55 + best * 5.1} y2="275" stroke={teal} strokeDasharray="5 4" />
    <circle cx={55 + best * 5.1} cy={275 - validation(best) * 200} r="5" fill={teal} />
    <Text x={55 + best * 5.1} y={50} color={teal}>Validation minimum</Text>
    <Text x={510} y={225} color={blue}>Training</Text>
    <Text x={460} y={75} color={orange}>Validation</Text>
  </Canvas>;
}

function ReceptiveField() {
  return <Canvas id="receptive-field" height={300}>
    <Text x={100} y={32} bold>Input crop · 7 × 7</Text>
    <Grid values={Array.from({ length: 7 }, () => Array(7).fill(1))} x={32} y={75} cell={20} color="#cbd5e1" />
    <rect x="30" y="73" width="142" height="142" fill="none" stroke={teal} strokeWidth="3" />
    <rect x="72" y="115" width="59" height="59" fill={orange} fillOpacity=".25" stroke={orange} strokeWidth="3" />
    <Arrow x1={184} y1={140} x2={254} y2={140} />
    <Text x={220} y={110} size={12}>3 × 3, s = 2</Text>
    <Text x={305} y={32} bold>Layer 1 · 3 × 3</Text>
    <Grid values={Array.from({ length: 3 }, () => Array(3).fill(1))} x={261} y={95} cell={30} />
    <rect x="291" y="125" width="29" height="29" fill={orange} stroke={surface} />
    <Arrow x1={371} y1={140} x2={481} y2={140} />
    <Text x={426} y={110} size={12}>3 × 3, s = 1</Text>
    <Text x={540} y={32} bold>Layer 2 · 1 cell</Text>
    <rect x="510" y="110" width="60" height="60" rx="4" fill={teal} />
    <Text x={540} y={145} color="#fff" bold>7 × 7</Text>
    <Text x={100} y={250} size={12} color={orange}>Orange patch → middle layer-1 cell</Text>
    <Text x={415} y={250} size={12} color={teal}>Final cell → entire outlined crop</Text>
  </Canvas>;
}

function Residual() {
  return <Canvas id="residual" height={290}>
    <Text x={310} y={36} bold color={teal}>Identity shortcut: carry x unchanged</Text>
    <path d="M 100 155 V 70 H 485 V 130" fill="none" stroke={teal} strokeWidth="3" />
    <Arrow x1={485} y1={105} x2={485} y2={135} color={teal} width={3} />
    <Arrow x1={100} y1={155} x2={190} y2={155} />
    <rect x="190" y="120" width="175" height="75" rx="10" fill={surface} stroke={blue} strokeWidth="2" />
    <Text x={277} y={148} bold>Learned branch F(x)</Text>
    <Text x={277} y={176}>[0.1, −0.2]</Text>
    <Arrow x1={365} y1={155} x2={462} y2={155} />
    <circle cx="485" cy="155" r="20" fill={surface} stroke={blue} strokeWidth="2" />
    <Text x={485} y={162} size={24}>+</Text>
    <Arrow x1={505} y1={155} x2={548} y2={155} />
    <Text x={69} y={151} bold>x</Text><Text x={68} y={180} size={13}>[2, 5]</Text>
    <Text x={592} y={148} bold>y</Text><Text x={590} y={177} size={13}>[2.1, 4.8]</Text>
    <Text x={320} y={245} color={muted}>F(x) = 0 would leave y = x.</Text>
  </Canvas>;
}

function PairedAugmentation() {
  return <Canvas id="paired-augmentation" height={270}>
    {[20, 235, 450].map((x, i) => <g key={x}>
      <Text x={x + 85} y={32} bold size={13}>{["Original", "Image + label flipped", "Image only: wrong"][i]}</Text>
      <rect x={x} y="65" width="170" height="135" rx="4" fill={surface} stroke={border} />
      <rect x={x + (i ? 110 : 30)} y="105" width="30" height="60" rx="6" fill={blue} />
      <rect x={x + (i === 1 ? 100 : 20)} y="95" width="50" height="80" fill="none" stroke={i === 2 ? "#c2414c" : teal} strokeWidth="3" strokeDasharray="5 3" />
      <Text x={x + 85} y={237} size={12} color={i === 2 ? "#c2414c" : teal}>{["Box encloses object", "Box follows the object", "Box misses the object"][i]}</Text>
    </g>)}
  </Canvas>;
}

function BoxOverlap() {
  return <Canvas id="box-overlap" height={300}>
    <rect x="120" y="65" width="160" height="160" fill={blue} fillOpacity=".12" stroke={blue} strokeWidth="3" />
    <rect x="216" y="65" width="160" height="160" fill={orange} fillOpacity=".12" stroke={orange} strokeWidth="3" />
    <rect x="216" y="65" width="64" height="160" fill={teal} fillOpacity=".35" />
    <Text x={165} y={45} color={blue} bold>A: 100</Text><Text x={334} y={45} color={orange} bold>B: 100</Text>
    <Text x={248} y={138} bold>40</Text><Text x={248} y={160} size={12}>shared</Text>
    <Text x={500} y={105} bold>Union = 160</Text>
    <Text x={500} y={137}>100 + 100 − 40</Text>
    <Text x={500} y={190} bold color={teal}>IoU = 0.25</Text>
    <Text x={320} y={275} color={muted}>Shared area / total covered area</Text>
  </Canvas>;
}

function Segmentation() {
  return <Canvas id="segmentation" height={305}>
    {[20, 235, 450].map((x, i) => <g key={x}>
      <Text x={x + 85} y={32} bold>{["Semantic", "Instance", "Panoptic"][i]}</Text>
      <rect x={x} y="65" width="170" height="160" fill={i === 1 ? surface : "#dbeafe"} stroke={border} />
      {i !== 1 && <rect x={x} y="190" width="170" height="35" fill="#94a3b8" />}
      {[48, 120].map((offset, j) => <g key={offset}>
        <circle cx={x + offset} cy="110" r="14" fill={i === 0 || j === 0 ? blue : orange} />
        <rect x={x + offset - 15} y="128" width="30" height="65" rx="6" fill={i === 0 || j === 0 ? blue : orange} />
        {i !== 0 && <Text x={x + offset} y={164} color="#fff" bold>{j + 1}</Text>}
      </g>)}
      <Text x={x + 85} y={255} size={12}>{["Same person category", "Person 1 / person 2", "People + road + sky"][i]}</Text>
      <Text x={x + 85} y={277} size={12} color={muted}>{i === 1 ? "Background unassigned" : "Every included pixel labeled"}</Text>
    </g>)}
  </Canvas>;
}

function Heatmap() {
  const values = Array.from({ length: 9 }, (_, y) => Array.from({ length: 9 }, (_, x) => Math.exp(-((x - 6) ** 2 + (y - 3) ** 2) / (2 * 1.2 ** 2))));
  return <Canvas id="keypoint-heatmap" height={295}>
    <Text x={155} y={30} bold>Image: labeled wrist</Text>
    <circle cx="135" cy="80" r="17" fill="none" stroke={muted} strokeWidth="3" />
    <path d="M 135 97 V 170 M 135 120 L 90 150 M 135 120 L 185 125 L 222 95 M 135 170 L 105 225 M 135 170 L 165 225" fill="none" stroke={muted} strokeWidth="4" strokeLinecap="round" />
    <circle cx="222" cy="95" r="7" fill={orange} />
    <Arrow x1={250} y1={140} x2={335} y2={140} />
    <Text x={446} y={30} bold>One joint&apos;s heatmap</Text>
    <Grid values={values} x={370} y={65} cell={18} color={orange} />
    <rect x={370 + 6 * 18} y={65 + 3 * 18} width="17" height="17" fill="none" stroke={blue} strokeWidth="3" />
    <Text x={450} y={260} size={13} color={blue}>Argmax at cell (6, 3), zero-based</Text>
  </Canvas>;
}

function Tracking() {
  const positions = [[40, 130], [75, 95], [130, 40]];
  return <Canvas id="tracking" height={310}>
    {[20, 235, 450].map((x, frame) => <g key={x}>
      <Text x={x + 85} y={30} bold>{"Frame " + (frame + 1)}</Text>
      <rect x={x} y="60" width="170" height="150" fill={surface} stroke={border} />
      {positions[frame].map((offset, identity) => <g key={identity}>
        <circle cx={x + offset} cy="110" r="12" fill="#94a3b8" />
        <rect x={x + offset - 11} y="126" width="22" height="45" rx="4" fill="#94a3b8" />
        <Text x={x + offset} y={194} color={identity ? orange : blue} bold>{identity ? "B" : "A"}</Text>
      </g>)}
      {frame === 1 && <><rect x={x + 58} y="65" width="55" height="140" fill="#cbd5e1" /><Text x={x + 85} y={235} size={12} color={muted}>Occluded crossing</Text></>}
      {frame === 0 && <Text x={x + 85} y={235} size={12} color={muted}>True identities</Text>}
      {frame === 2 && <>
        <Text x={x + 85} y={235} size={12} color={muted}>True identities after crossing</Text>
        <Text x={x + 40} y={270} size={12} color="#c2414c">Wrong: A</Text>
        <Text x={x + 130} y={270} size={12} color="#c2414c">Wrong: B</Text>
      </>}
    </g>)}
  </Canvas>;
}

function Attention() {
  return <Canvas id="attention" height={305}>
    <rect x="20" y="115" width="90" height="65" rx="10" fill={surface} stroke={blue} strokeWidth="2" />
    <Text x={65} y={153} bold>Query</Text>
    {[60, 190].map((y, i) => <g key={y}>
      <Arrow x1={110} y1={147} x2={225} y2={y + 25} color={i ? orange : blue} width={i ? 1.5 : 4} />
      <Text x={165} y={i ? 220 : 65} color={i ? orange : blue} bold>{i ? "0.25" : "0.75"}</Text>
      <rect x="225" y={y} width="110" height="50" rx="8" fill={surface} stroke={border} />
      <Text x={280} y={y + 30}>{i ? "Key B" : "Key A"}</Text>
      <Arrow x1={335} y1={y + 25} x2={385} y2={y + 25} color={border} />
      <rect x="385" y={y} width="85" height="50" rx="8" fill={surface} stroke={i ? orange : blue} />
      <Text x={428} y={y + 30} bold>{i ? "Value 10" : "Value 2"}</Text>
      <Arrow x1={470} y1={y + 25} x2={550} y2={147} color={i ? orange : blue} width={i ? 1.5 : 4} />
    </g>)}
    <rect x="550" y="115" width="70" height="65" rx="10" fill={surface} stroke={teal} strokeWidth="2" />
    <Text x={585} y={145} size={12}>Output</Text><Text x={585} y={168} bold color={teal}>4</Text>
    <Text x={320} y={285} bold>0.75 × 2 + 0.25 × 10 = 4</Text>
  </Canvas>;
}

function PatchTokens() {
  const colors = [blue, teal, orange, "#8b5cf6"];
  return <Canvas id="patch-tokens" height={285}>
    <Text x={127} y={30} bold>8 × 8 image</Text>
    {Array.from({ length: 8 }, (_, y) => Array.from({ length: 8 }, (_, x) =>
      <rect key={y + ":" + x} x={55 + x * 18} y={60 + y * 18} width="17" height="17" fill={colors[Math.floor(y / 4) * 2 + Math.floor(x / 4)]} fillOpacity=".65" />))}
    {[0, 1, 2, 3].map(i => <g key={i}>
      <circle cx={91 + (i % 2) * 72} cy={97 + Math.floor(i / 2) * 72} r="14" fill={surface} />
      <Text x={91 + (i % 2) * 72} y={104 + Math.floor(i / 2) * 72} size={20} bold>{i}</Text>
    </g>)}
    <Arrow x1={214} y1={132} x2={260} y2={132} />
    <Text x={442} y={30} bold>Shared projection + position</Text>
    {colors.map((color, i) => <g key={color}>
      {Array.from({ length: 5 }, (_, j) => <rect key={j} x={280 + i * 82} y={80 + j * 21} width="55" height="19" rx="2" fill={color} fillOpacity={0.3 + j * 0.13} />)}
      <Text x={307 + i * 82} y={221} size={13}>{"Token " + i}</Text>
      <Text x={307 + i * 82} y={247} size={12} color={muted}>{"Position " + i}</Text>
    </g>)}
  </Canvas>;
}

function PromptMask() {
  return <Canvas id="prompt-mask" height={300}>
    {[45, 375].map((x, i) => <g key={x}>
      <Text x={x + 110} y={30} bold>{i ? "Candidate mask" : "Image + positive point"}</Text>
      <rect x={x} y="65" width="220" height="170" rx="4" fill={i ? "#25334a" : surface} stroke={border} />
      <circle cx={x + 60} cy="150" r="38" fill={i ? "#5eead4" : "#94a3b8"} />
      {!i && <rect x={x + 130} y="120" width="60" height="70" rx="8" fill="#94a3b8" />}
      {!i && <><circle cx={x + 55} cy="145" r="9" fill={teal} stroke="#fff" strokeWidth="2" /><Text x={x + 55} y={150} color="#fff" size={16}>+</Text></>}
      <Text x={x + 110} y={270} size={12} color={muted}>{i ? "Selected region, not a class label" : "The point specifies spatial intent"}</Text>
    </g>)}
    <Arrow x1={285} y1={150} x2={352} y2={150} />
  </Canvas>;
}

function Letterbox() {
  return <Canvas id="letterbox" height={315}>
    <Text x={140} y={30} bold>Original: 640 × 480</Text>
    <Text x={480} y={30} bold>Canvas: 640 × 640</Text>
    <rect x="40" y="85" width="200" height="150" fill="#e2e8f0" stroke={border} />
    <rect x="380" y="55" width="200" height="200" fill="#fef3c7" stroke={border} />
    <rect x="380" y="80" width="200" height="150" fill="#e2e8f0" />
    {[40, 380].map((x, i) => <g key={x}>
      <rect x={x + 80} y={i ? 130 : 135} width="70" height="65" rx="8" fill={blue} fillOpacity=".3" />
      <circle cx={x + 31.25} cy={i ? 95.625 : 100.625} r="5" fill="#c2414c" />
    </g>)}
    <Text x={480} y={73} size={12} color="#92400e">80 px padding</Text>
    <Text x={480} y={248} size={12} color="#92400e">80 px padding</Text>
    <Text x={140} y={275} bold>(100, 50)</Text>
    <Text x={480} y={290} bold>(100, 130)</Text>
    <Arrow x1={260} y1={160} x2={355} y2={160} />
    <Text x={307} y={135} size={12}>Scale = 1</Text>
  </Canvas>;
}

function Calibration() {
  const points = [[0.2, 0.12], [0.4, 0.25], [0.6, 0.38], [0.8, 0.6], [0.95, 0.78]];
  const x = (v: number) => 80 + v * 475, y = (v: number) => 265 - v * 225;
  return <Canvas id="calibration" height={335}>
    <Arrow x1={80} y1={265} x2={585} y2={265} color={border} />
    <Arrow x1={80} y1={265} x2={80} y2={25} color={border} />
    <line x1={80} y1={265} x2={555} y2={40} stroke={muted} strokeDasharray="6 4" strokeWidth="2" />
    <polyline points={points.map(([a, b]) => [x(a), y(b)].join(",")).join(" ")} fill="none" stroke={blue} strokeWidth="3" />
    {points.map(([a, b]) => <circle key={a} cx={x(a)} cy={y(b)} r="5" fill={blue} />)}
    <line x1={x(0.8)} y1={y(0.6)} x2={x(0.8)} y2={y(0.8)} stroke={orange} strokeWidth="3" />
    <Text x={610} y={30} anchor="end" size={13} color={orange}>0.8 confidence; 0.6 correctness</Text>
    {[0, 0.5, 1].map(v => <g key={v}>
      <Text x={x(v)} y={287} size={12} color={muted}>{v}</Text>
      <Text x={65} y={y(v) + 4} anchor="end" size={12} color={muted}>{v}</Text>
    </g>)}
    <Text x={330} y={317}>Predicted confidence</Text>
    <text x="22" y="155" textAnchor="middle" transform="rotate(-90 22 155)" fill={ink} fontSize="14">Observed correctness</text>
    <Text x={315} y={80} size={12} color={muted}>Dashed: perfect calibration</Text>
  </Canvas>;
}

export function StaticCvVisual({ id }: { id: CvVisualId }) {
  switch (id) {
    case "rgb-channels": return <Channels />;
    case "aliasing": return <Aliasing />;
    case "canny": return <EdgeProfile />;
    case "morphology": return <Morphology />;
    case "transforms": return <Transforms />;
    case "ransac": return <Ransac />;
    case "projection": return <Projection />;
    case "stereo": return <Stereo />;
    case "aperture": return <Aperture />;
    case "gradient-descent": return <GradientDescent />;
    case "learning-curves": return <LearningCurves />;
    case "receptive-field": return <ReceptiveField />;
    case "residual": return <Residual />;
    case "paired-augmentation": return <PairedAugmentation />;
    case "box-overlap": return <BoxOverlap />;
    case "segmentation": return <Segmentation />;
    case "keypoint-heatmap": return <Heatmap />;
    case "tracking": return <Tracking />;
    case "attention": return <Attention />;
    case "patch-tokens": return <PatchTokens />;
    case "prompt-mask": return <PromptMask />;
    case "letterbox": return <Letterbox />;
    case "calibration": return <Calibration />;
    default: return null;
  }
}
