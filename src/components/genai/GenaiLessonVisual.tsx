import type { ReactNode } from "react";
import { LessonFigure } from "@/components/lesson/LessonFigure";
import { NlpLessonVisual } from "@/components/nlp/NlpLessonVisual";
import { genaiVisuals, isGenaiVisualId, type GenaiVisualId, type GenaiVisualSpec } from "@/lib/genaiVisuals";
import { rotaryExample, rotatePair, denoisingExample, addScalarNoise, cleanFromNoise, centered, diffusionRetentions, dpoPreference, flowPath, groupRewards, guidanceExample, guided, noisyState, quantizationValues, quantize, samplingExample, softmax, toyFlow, imageConvolutionExample, imageConvolution } from "@/lib/genaiVisualMath";

const tones = {
  neutral: "border-outline/70 bg-surface-high/40",
  blue: "border-accent-blue/50 bg-accent-blue/10",
  green: "border-accent-green/50 bg-accent-green/10",
};
function Box({ children, detail, tone = "neutral" }: { children: ReactNode; detail?: string; tone?: keyof typeof tones }) {
  return <div className={`min-w-0 rounded-lg border px-3 py-2.5 text-center text-sm leading-relaxed text-text ${tones[tone]}`}>
    {children}{detail && <p className="mt-1 text-xs leading-relaxed text-text-muted">{detail}</p>}
  </div>;
}
function Down({ label }: { label?: string }) {
  return <div className="py-1 text-center text-sm text-text-muted"><span aria-hidden="true" className="text-accent-blue">↓</span>{label && <span className="ml-2 text-xs">{label}</span>}</div>;
}
function Small({ children }: { children: ReactNode }) { return <p className="mb-2 text-xs font-semibold leading-relaxed text-text-muted">{children}</p>; }
const fmt = (value: number) => Number(value.toFixed(3));

function Content({ id }: { id: GenaiVisualId }) {
  switch (id) {
    case "rotary-relative":
      return <div><div className="grid grid-cols-2 gap-3">{rotaryExample.positions.map(([m, n]) => {
        const q = rotatePair(rotaryExample.query, m * rotaryExample.degreesPerPosition);
        const k = rotatePair(rotaryExample.key, n * rotaryExample.degreesPerPosition);
        const dot = q[0] * k[0] + q[1] * k[1];
        return <div key={m}><Small>Positions q={m}, k={n}</Small><svg viewBox="0 0 160 150" className="mx-auto w-full max-w-48 text-text-muted" aria-hidden="true"><circle cx="78" cy="78" r="53" fill="none" stroke="currentColor" opacity="0.25" /><path d="M15 78H145 M78 15V140" stroke="currentColor" opacity="0.3" />{[{ vector: q, name: "q", color: "var(--color-accent-blue)" }, { vector: k, name: "k", color: "var(--color-accent-green)" }].map(({ vector, name, color }) => {
          const x = 78 + vector[0] * 53, y = 78 - vector[1] * 53;
          return <g key={name}><line x1="78" y1="78" x2={x} y2={y} stroke={color} strokeWidth="3" /><circle cx={x} cy={y} r="4" fill={color} /><text x={x + 7} y={y - 7} fill="var(--color-text)" fontSize="13">{name}</text></g>;
        })}<text x="80" y="146" textAnchor="middle" fill="currentColor" fontSize="12">Dot product ≈ {fmt(dot)}</text></svg></div>;
      })}</div><Box tone="blue" detail="Compare the same unrotated content vectors">Same gap n−m=1 → same comparison</Box></div>;
    case "denoising-target": {
      const toy = denoisingExample;
      const noisy = addScalarNoise(toy.clean, toy.noise, toy.retention);
      const estimate = cleanFromNoise(noisy, toy.prediction, toy.retention);
      return <div><Box detail="Signal retention 0.36: coefficients 0.6 and 0.8">Clean 2 + known noise 0.5 → noisy {fmt(noisy)}</Box><Down /><Box tone="blue" detail="Reads noisy input and timestep">Denoiser predicts noise {toy.prediction}</Box><Down /><div className="grid gap-3 sm:grid-cols-2"><Box detail="Training: compare with sampled target">Noise loss = {fmt((toy.noise - toy.prediction) ** 2)}</Box><Box tone="green" detail="Use with the sampler’s defined update">Clean estimate ≈ {fmt(estimate)}</Box></div></div>;
    }
    case "expert-routing":
      return <div><Box>One token state</Box><Down /><Box tone="blue" detail="Select two experts and their mixing weights">Learned router</Box><Down /><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[1, 2, 3, 4].map(i => <Box key={i} tone={i % 2 ? "blue" : "neutral"} detail={i % 2 ? "Selected" : "Inactive"}>Expert {i}</Box>)}</div><Down /><Box tone="green">Weighted combination of experts 1 and 3</Box></div>;
    case "response-masking":
      return <div className="grid grid-cols-[minmax(0,1.4fr)_1fr_1fr] gap-2 text-center text-xs"><Small>Token role</Small><Small>Visible input?</Small><Small>Target loss?</Small>{[["User prompt", "Yes", "No"], ["Assistant answer", "Yes", "Yes"]].map((row, i) => <div key={i} className="contents">{row.map((cell, j) => <Box key={j} tone={j === 2 && i === 1 ? "blue" : "neutral"}>{cell}</Box>)}</div>)}</div>;
    case "sampling":
      return <div className="grid gap-4 sm:grid-cols-2">{samplingExample.temperatures.map(temperature => <div key={temperature}><Small>Temperature {temperature}</Small>{softmax(samplingExample.logits, temperature).map((p, i) => <div key={i} className="mb-3"><div className="mb-1 flex justify-between gap-2 text-xs text-text"><span>{["A", "B", "C"][i]}</span><span>{fmt(p)}</span></div><div className="h-4 overflow-hidden rounded bg-surface-high"><div className="h-full rounded bg-accent-blue" style={{ width: `${p * 100}%` }} /></div></div>)}</div>)}</div>;
    case "policy-loop":
      return <div><Box>Prompt + current prefix</Box><Down /><Box tone="blue" detail="Policy parameters determine token probabilities">Sample actions → complete response</Box><Down /><Box tone="green" detail="Checker or reward model">Outcome → reward</Box><Down /><Box detail="Increase rewarded behavior, constrain unwanted drift">Estimate advantage → update policy parameters ↺</Box></div>;
    case "rlhf-stages":
      return <div className="grid gap-4"><div><Small>1 · Demonstrations</Small><Box>Requests + desired responses → supervised policy</Box></div><div><Small>2 · Human comparisons</Small><Box tone="blue">Preferred / rejected pairs → reward model</Box></div><div><Small>3 · Policy optimization</Small><Box>Current policy → sampled responses</Box><Down /><Box tone="green">Reward model score + reference constraint</Box><Down /><Box>Update policy → generate new samples ↺</Box></div></div>;
    case "dpo-ratios":
      return <div><div className="grid gap-3 sm:grid-cols-2"><Box tone="blue" detail="Preferred response">Policy / reference = 2</Box><Box detail="Rejected response">Policy / reference = 0.5</Box></div><Down /><Box>Δ = log 2 − log 0.5 = log 4</Box><Down /><Box tone="green" detail="Beta = 1; sigmoid of delta">Pairwise probability = {dpoPreference(2, 0.5)}</Box></div>;
    case "group-rewards": {
      const advantages = centered(groupRewards);
      return <div><Small>One prompt → four sampled responses</Small><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{groupRewards.map((reward, i) => <Box key={i} tone={reward ? "blue" : "neutral"} detail={`Centered: ${advantages[i] > 0 ? "+" : ""}${advantages[i]}`}>Sample {i + 1}<br />Reward {reward}</Box>)}</div><p className="mt-3 text-center text-xs text-text-muted">Group mean = 0.5 · subtract it from each reward</p></div>;
    }
    case "candidate-verification":
      return <div><Box>One problem</Box><Down /><div className="grid gap-2 sm:grid-cols-3">{["A · fails test", "B · passes test", "C · fails test"].map((text, i) => <Box key={text} tone={i === 1 ? "green" : "neutral"}>Candidate {text}</Box>)}</div><Down /><Box tone="blue">Select B under the stated verifier</Box></div>;
    case "vae-latent":
      return <div className="grid gap-5 sm:grid-cols-2"><div><Small>Training</Small><Box>Observed image x</Box><Down /><Box>Encoder → μ(x), σ(x)</Box><Down /><Box tone="blue" detail="Random ε; gradients pass through μ and σ">z = μ + σ ⊙ ε</Box><Down /><Box>Decoder → reconstruction</Box></div><div><Small>Generation</Small><Box>Sample z from prior N(0,I)</Box><Down /><Box tone="blue">Same trained decoder</Box><Down /><Box tone="green">New image</Box><p className="mt-3 text-xs leading-relaxed text-text-muted">KL regularization connects the encoded latent distributions with this prior.</p></div></div>;
    case "gan-game":
      return <div><div className="grid grid-cols-2 gap-3"><Box tone="blue">Real image x</Box><Box detail="Sampled noise → generator G">Generated image G(z)</Box></div><Down /><Box tone="green" detail="Compare real and generated examples">Discriminator D → real probability</Box><div className="mt-4 grid gap-3 sm:grid-cols-2"><Box detail="Hold G fixed">Update D to distinguish</Box><Box tone="blue" detail="Hold D weights fixed; pass gradients through D">Update G to receive a better score</Box></div></div>;
    case "diffusion-path":
      return <div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{diffusionRetentions.map(retention => <div key={retention}><Small>Signal ᾱ = {retention}</Small><svg viewBox="0 0 80 80" className="mx-auto w-full max-w-36 rounded border border-outline" aria-hidden="true">{noisyState(retention).map((value, i) => {
        const intensity = Math.round((Math.max(-2, Math.min(2, value)) + 2) / 4 * 255);
        return <rect key={i} x={(i % 8) * 10} y={Math.floor(i / 8) * 10} width="10" height="10" fill={`rgb(${intensity},${intensity},${intensity})`} />;
      })}</svg></div>)}</div><p className="mt-4 text-center text-xs text-text-muted">Forward: add known noise →<br />← Generation: learn successive reverse updates</p></div>;
    case "image-convolution": {
      const result = imageConvolution();
      return <div><div className="grid gap-4 sm:grid-cols-3">{[
        { title: "Input · highlighted window", values: imageConvolutionExample.input, highlight: true },
        { title: "Shared filter", values: imageConvolutionExample.kernel, highlight: false },
        { title: "Output responses", values: result, highlight: false },
      ].map(({ title, values, highlight }, panel) => <div key={title}><Small>{title}</Small><div className="mx-auto grid max-w-44 gap-1" style={{ gridTemplateColumns: `repeat(${values[0].length}, minmax(0, 1fr))` }}>{values.map((row, r) => row.map((value, c) => <span key={`${r},${c}`} className={`rounded border py-3 text-center font-mono text-sm text-text ${highlight && r < 2 && c < 2 || panel === 2 && r === 0 && c === 0 ? tones.blue : tones.neutral}`}>{value}</span>))}</div></div>)}</div><p className="mt-4 text-center text-xs leading-relaxed text-text-muted">First window: (1×1) + (0×−1) + (2×1) + (1×−1) = 2<br />Slide the same filter one column right → −2</p></div>;
    }
    case "latent-diffusion":
      return <div><Small>Prepare training targets</Small><Box>Real image → image encoder → clean latent</Box><Down /><Box>Add known noise → train latent denoiser</Box><div className="my-4 border-t border-dashed border-outline" /><Small>Generate</Small><Box>Sample latent noise</Box><Down label="Repeated learned updates" /><Box tone="blue">U-Net or Transformer denoiser</Box><Down /><Box>Image decoder</Box><Down /><Box tone="green">Generated image</Box></div>;
    case "guidance":
      return <svg viewBox="0 0 320 230" className="mx-auto w-full max-w-md text-text-muted" aria-hidden="true"><path d="M35 20V195H305" fill="none" stroke="currentColor" strokeWidth="1.5" />{guidanceExample.scales.map((scale, i) => {
        const [x, y] = guided(guidanceExample.unconditional, guidanceExample.conditional, scale), px = 35 + x * 75, py = 195 - y * 65;
        return <g key={scale}><line x1="35" y1="195" x2={px} y2={py} stroke={i === 1 ? "var(--color-accent-green)" : "var(--color-accent-blue)"} strokeWidth="2" strokeDasharray={i === 2 ? "5 3" : undefined} /><circle cx={px} cy={py} r="5" fill={i === 1 ? "var(--color-accent-green)" : "var(--color-accent-blue)"} /><text x={px} y={py - 12} textAnchor="middle" fill="var(--color-text)" fontSize="12">s={scale} · [{x},{y}]</text></g>;
      })}<text x="38" y="218" fill="currentColor" fontSize="11">Toy prediction coordinates · arrows start at [0,0]</text></svg>;
    case "flow-field": {
      const px = (x: number) => 40 + x * 85, py = (y: number) => 125 - y * 75;
      return <svg viewBox="0 0 320 250" className="mx-auto w-full max-w-lg text-text-muted" aria-hidden="true"><defs><marker id="genai-flow-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="currentColor" /></marker></defs><path d="M30 125H300" stroke="currentColor" strokeDasharray="3 5" />{[0, 0.6, 1.2, 1.8, 2.4].flatMap(x => [-1, -0.5, 0, 0.5, 1].map(y => {
        const [vx, vy] = toyFlow(x, y);
        return <line key={`${x},${y}`} x1={px(x)} y1={py(y)} x2={px(x + vx * 0.32)} y2={py(y + vy * 0.32)} stroke="currentColor" opacity="0.45" markerEnd="url(#genai-flow-arrow)" />;
      }))}{[-1, 0, 1].map((y, i) => <g key={y}><polyline points={flowPath(0.1, y).map(([x, yy]) => `${px(x)},${py(yy)}`).join(" ")} fill="none" stroke={i === 1 ? "var(--color-accent-green)" : "var(--color-accent-blue)"} strokeWidth="2.5" />{flowPath(0.1, y).map(([x, yy], step) => <circle key={step} cx={px(x)} cy={py(yy)} r="3" fill={i === 1 ? "var(--color-accent-green)" : "var(--color-accent-blue)"} />)}</g>)}<text x="160" y="222" textAnchor="middle" fontSize="12" fill="currentColor">Time advances →</text><text x="160" y="239" textAnchor="middle" fontSize="11" fill="currentColor">Vertical drift returns particles toward y=0.</text></svg>;
    }
    case "contrastive-pairs":
      return <div className="grid grid-cols-4 gap-1 text-center text-xs"><Small>Image ↓<br />Caption →</Small>{[1, 2, 3].map(i => <Small key={i}>Text {i}</Small>)}{[1, 2, 3].map(i => <div key={i} className="contents"><Small>Image {i}</Small>{[1, 2, 3].map(j => <div key={j} className={`rounded border px-1 py-3 ${i === j ? tones.blue : tones.neutral} text-text`}>{i === j ? "Match" : "Alternative"}</div>)}</div>)}</div>;
    case "vision-language":
      return <div><Box>Image → patches / visual features</Box><Down /><Box>Visual encoder</Box><Down /><Box tone="blue" detail="Learned representation bridge">Projector → visual tokens</Box><Down /><Box detail="Text request is supplied alongside visual information">Visual tokens + text tokens → language model</Box><Down /><Box tone="green">Answer grounded in the image</Box></div>;
    case "chunk-boundaries":
      return <div className="grid gap-4"><div><Small>Boundary loses the account condition</Small><div className="grid gap-2 sm:grid-cols-2"><Box>Upload limit: 20 MB.</Box><Box>Enterprise accounts: 100 MB.</Box></div><p className="mt-2 text-xs text-text-muted">Returning only the first chunk can mislead an enterprise user.</p></div><div><Small>One coherent evidence unit</Small><Box tone="blue">Standard accounts: 20 MB.<br />Enterprise accounts: 100 MB.</Box></div></div>;
    case "trust-boundary":
      return <div><Box>Retrieved page: task evidence + attacker instruction</Box><Down /><Box tone="blue">Read as untrusted data</Box><Down /><Box>Model proposes tool name and arguments</Box><Down /><Box tone="green" detail="Check requester, action, record access, and destination">Independent authorization gate</Box><Down /><div className="grid grid-cols-2 gap-3"><Box>Unauthorized → deny</Box><Box tone="green">Authorized → execute</Box></div></div>;
    case "quantization":
      return <svg viewBox="0 0 320 215" className="mx-auto w-full max-w-md text-text-muted" aria-hidden="true"><text x="20" y="25" fontSize="12" fill="currentColor">Original values</text><text x="20" y="185" fontSize="12" fill="currentColor">Stored levels · scale 0.5</text>{[-1, -0.5, 0, 0.5, 1].map(value => <g key={value}><circle cx={160 + value * 120} cy="140" r="5" fill="var(--color-accent-blue)" /><text x={160 + value * 120} y="160" textAnchor="middle" fontSize="11" fill="currentColor">{value}</text></g>)}{quantizationValues.map(value => <g key={value}><line x1={160 + value * 120} y1="65" x2={160 + quantize(value) * 120} y2="132" stroke="currentColor" strokeDasharray="4 3" /><circle cx={160 + value * 120} cy="65" r="4" fill="var(--color-accent-green)" /><text x={160 + value * 120} y="50" textAnchor="middle" fontSize="11" fill="currentColor">{value}</text></g>)}</svg>;
    case "grouped-heads":
      return <div className="grid grid-cols-2 gap-4">{[1, 2].map(group => <div key={group}><div className="grid grid-cols-2 gap-2"><Box>Q{group * 2 - 1}</Box><Box>Q{group * 2}</Box></div><Down /><Box tone="blue" detail="Both queries read this group’s cached projections">Shared K/V {group}</Box></div>)}</div>;
    case "continuous-batching":
      return <div className="grid grid-cols-4 gap-1 text-center text-xs"><Small>Slot</Small>{[1, 2, 3].map(i => <Small key={i}>Step {i}</Small>)}{[["1", "A · ends", "D", "D"], ["2", "B", "B", "B"], ["3", "C", "C", "C · ends"]].map((row, i) => <div key={i} className="contents">{row.map((value, j) => <div key={j} className={`rounded border px-1 py-3 ${value === "D" ? tones.blue : tones.neutral} text-text`}>{value}</div>)}</div>)}</div>;
    case "speculative-block":
      return <div><Small>Draft proposes</Small><div className="grid grid-cols-4 gap-2">{["A", "B", "C", "D"].map(token => <Box key={token}>{token}</Box>)}</div><Down label="One target verification pass" /><div className="grid grid-cols-4 gap-2">{["Accept", "Accept", "Reject", "Discard"].map((state, i) => <div key={i} className={`rounded border px-1 py-3 text-center text-xs ${i < 2 ? tones.green : tones.neutral} text-text`}>{state}</div>)}</div><Down /><Box tone="blue">Emit A, B, then a corrected replacement token</Box></div>;
    default:
      throw new Error(`Missing native Generative AI figure: ${id}`);
  }
}

export function GenaiLessonVisual({ id }: { id: string }) {
  if (!isGenaiVisualId(id)) throw new Error(`Unknown Generative AI figure: ${id}`);
  const visual: GenaiVisualSpec = genaiVisuals[id];
  if (visual.sharedNlp) return <div data-genai-visual={id}><NlpLessonVisual id={visual.sharedNlp} /></div>;
  return <LessonFigure id={id} track="genai" visual={visual}><div className="p-4" role="img" aria-label={visual.alt}><Content id={id} /></div></LessonFigure>;
}
