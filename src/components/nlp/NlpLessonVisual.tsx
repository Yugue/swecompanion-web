import type { ReactNode } from "react";
import { LessonFigure } from "@/components/lesson/LessonFigure";
import { CvLessonVisual } from "@/components/cv/visuals/CvLessonVisual";
import { isNlpVisualId, nlpVisuals, type NlpVisualId, type NlpVisualSpec } from "@/lib/nlpVisuals";
import { attentionExample, attentionMixture, causalAccess, contrastiveLogits, convolutionExample, convolveText, crfExample, decodingExample, embeddingExample, lstmExample, lstmStep, pathScore, softmax, subwordSteps, teacherForcingExample, vectorExample } from "@/lib/nlpVisualMath";

const fmt = (value: number) => Number(value.toFixed(3));
const label = "text-xs font-semibold leading-relaxed text-text-muted";
const tones = { neutral: "border-outline/70 bg-surface-high/50", blue: "border-accent-blue/50 bg-accent-blue/10", green: "border-accent-green/50 bg-accent-green/10" };
function Box({ children, detail, tone = "neutral" }: { children: ReactNode; detail?: string; tone?: keyof typeof tones }) {
  return <div className={`min-w-0 rounded-lg border px-3 py-2.5 text-center text-sm leading-relaxed text-text ${tones[tone]}`}>
    {children}{detail && <p className="mt-1 text-xs leading-relaxed text-text-muted">{detail}</p>}
  </div>;
}
function Down() { return <div aria-hidden="true" className="py-1 text-center text-lg text-accent-blue">↓</div>; }
function Tokens({ values }: { values: readonly string[] }) {
  return <div className="flex flex-wrap justify-center gap-2">{values.map((value, i) => <span key={i} className="rounded border border-outline/70 bg-surface-high px-2 py-1 font-mono text-xs text-text">{value}</span>)}</div>;
}

function VisualContent({ id }: { id: NlpVisualId }) {
  switch (id) {
    case "split-boundaries":
      return <div className="grid gap-3 sm:grid-cols-3">{["Training", "Validation", "Test"].map((name, i) => <Box key={name} tone={i === 0 ? "blue" : "neutral"} detail={`C${i + 1}: both messages stay together`}>
        <p className="mb-2 font-bold">{name}</p><Tokens values={[`C${i + 1} · msg 1`, `C${i + 1} · msg 2`]} />
      </Box>)}</div>;
    case "vector-direction":
      return <svg viewBox="0 0 320 240" className="mx-auto w-full max-w-lg text-text-muted" aria-hidden="true">
        <path d="M40 16V200H288" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {[1, 2].map(tick => <g key={tick}><path d={`M${40 + tick * 90} 196v8 M36 ${200 - tick * 90}h8`} stroke="currentColor" /><text x={40 + tick * 90} y="222" textAnchor="middle" fill="currentColor" fontSize="12">{tick}</text><text x="25" y={204 - tick * 90} textAnchor="middle" fill="currentColor" fontSize="12">{tick}</text></g>)}
        <text x="27" y="218" fill="currentColor" fontSize="12">0</text>
        <line x1="40" y1="200" x2={40 + vectorExample.b[0] * 90} y2={200 - vectorExample.b[1] * 90} stroke="#00897B" strokeWidth="3" strokeDasharray="6 4" />
        <line x1="40" y1="200" x2="130" y2="110" stroke="#E37400" strokeWidth="3" />
        <line x1="40" y1="200" x2="130" y2="200" stroke="#4285F4" strokeWidth="3" />
        <circle cx="130" cy="110" r="4" fill="#E37400" /><circle cx="220" cy="20" r="4" fill="#00897B" /><circle cx="130" cy="200" r="4" fill="#4285F4" />
        <text x="141" y="112" fill="currentColor" fontSize="14">A=[1,1]</text><text x="231" y="27" fill="currentColor" fontSize="14">B=[2,2]</text><text x="141" y="190" fill="currentColor" fontSize="14">q=[1,0]</text>
      </svg>;
    case "subwords":
      return <div className="grid gap-3">{subwordSteps.map((pieces, step) => <div key={step} className="grid grid-cols-[4rem_1fr] items-center gap-2"><span className={label}>{step === 0 ? "Start" : `Merge ${step}`}</span><Tokens values={pieces} /></div>)}</div>;
    case "neural-forward":
      return <div><Box detail="Two input coordinates">x = [1, 2]</Box><Down /><Box detail="Learned weighted sums and bias">Wx + b = [−1, 3]</Box><Down /><Box tone="blue" detail="ReLU keeps positive entries">h = [0, 3]</Box><Down /><Box detail="A learned mapping to the required outputs">Task head → scores</Box></div>;
    case "embedding-lookup":
      return <div className="grid gap-4 sm:grid-cols-2"><div><p className={`${label} mb-2`}>Learned table E</p>{embeddingExample.table.map((row, i) => <div key={i} className="mb-2 grid grid-cols-[3rem_1fr] items-center gap-2"><span className={label}>ID {i}</span><Box tone={i === 1 ? "neutral" : "blue"}>[{row.join(", ")}]</Box></div>)}</div><div><p className={`${label} mb-2`}>Gather IDs [0, 2, 0]</p>{embeddingExample.ids.map((id, i) => <div key={i} className="mb-2"><Box detail={`Position ${i + 1} selects row ${id}`}>[{embeddingExample.table[id].join(", ")}]</Box></div>)}</div></div>;
    case "skipgram":
      return <div><Tokens values={["Ada", "enjoys", "fresh", "coffee"]} /><Down /><Box tone="blue">Center vector: fresh</Box><Down /><div className="grid gap-3 sm:grid-cols-2"><Box tone="green" detail="Observed context pairs, target 1">fresh + enjoys<br />fresh + coffee</Box><Box detail="Sampled alternative pair, target 0">fresh + vehicle</Box></div><Down /><Box detail="Both vector tables receive learning signals">Shared pair-scoring objective</Box></div>;
    case "text-convolution": {
      const responses = convolveText(convolutionExample.input, convolutionExample.kernel);
      return <div><Tokens values={convolutionExample.input.map(String)} /><p className={`${label} my-3 text-center`}>Shared filter [1, −1] · stride 1 · no padding</p><div className="grid gap-2">{responses.map((value, i) => <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"><Box>[{convolutionExample.input.slice(i, i + 2).join(", ")}]</Box><span aria-hidden="true">→</span><Box tone={value > 0 ? "blue" : "neutral"}>response {value}</Box></div>)}</div><Down /><Box detail="Apply ReLU, then take the maximum">[{responses.map(value => Math.max(0, value)).join(", ")}] → {Math.max(...responses.map(value => Math.max(0, value)))}</Box></div>;
    }
    case "sequence":
      return <div className="grid gap-3"><p className={label}>Initial state h₀</p>{["not", "very", "good"].map((token, i) => <div key={token} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"><Box>{token} + h{i}</Box><span aria-hidden="true">→</span><Box tone="blue">h{i + 1}</Box></div>)}<p className={`${label} text-center`}>The same learned update is reused at each step.</p></div>;
    case "lstm-cell": {
      const step = lstmStep();
      return <div><div className="grid grid-cols-2 gap-3"><Box detail="Forget gate × previous memory">{lstmExample.forget} × {lstmExample.previous} = {step.retained}</Box><Box detail="Input gate × candidate">{lstmExample.inputGate} × (−0.4) = {step.added}</Box></div><Down /><Box tone="blue" detail="Add the retained and new content">Cell memory c = {step.memory}</Box><Down /><Box detail="Output gate × tanh(memory)">Hidden output h ≈ {step.hidden.toFixed(3)}</Box></div>;
    }
    case "teacher-forcing":
      return <div className="grid gap-3"><p className={label}>Decoder inputs</p><div className="grid grid-cols-3 gap-2">{teacherForcingExample.inputs.map((token, i) => <Box key={i}>{token}</Box>)}</div><div aria-hidden="true" className="grid grid-cols-3 text-center text-accent-blue"><span>↓</span><span>↓</span><span>↓</span></div><p className={label}>Targets predicted from those prefixes</p><div className="grid grid-cols-3 gap-2">{teacherForcingExample.labels.map((token, i) => <Box key={i} tone="blue">{token}</Box>)}</div></div>;
    case "attention": {
      const mixture = attentionMixture(attentionExample.scores, attentionExample.values);
      return <div><Box detail="Compatibility scores for two allowed keys">[log 3, 0] → softmax</Box><Down /><div className="grid gap-3">{attentionExample.values.map((value, i) => <div key={i} className="rounded-lg border border-outline/70 p-3"><p className="mb-2 text-sm text-text">Weight {fmt(mixture.weights[i])} × value [{value.join(", ")}]</p><div className="h-3 rounded bg-surface-high"><div className="h-3 rounded bg-accent-blue" style={{ width: `${mixture.weights[i] * 100}%` }} /></div><p className={`${label} mt-2`}>Contribution [{value.map(v => fmt(v * mixture.weights[i])).join(", ")}]</p></div>)}</div><Down /><Box tone="blue" detail="Add both contributions">Output [{mixture.output.map(fmt).join(", ")}]</Box></div>;
    }
    case "multihead":
      return <div><Box>Input states X</Box><Down /><div className="grid grid-cols-2 gap-3"><Box tone="blue" detail="Own Q/K/V projections">Head 1 → mixture 1</Box><Box tone="green" detail="Own Q/K/V projections">Head 2 → mixture 2</Box></div><Down /><Box detail="Retain both head outputs as feature coordinates">Concatenate</Box><Down /><Box>Learned output projection</Box></div>;
    case "positions":
      return <div className="grid gap-4">{[["dog", "bites", "man"], ["man", "bites", "dog"]].map((words, row) => <div key={row} className="grid grid-cols-3 gap-2">{words.map((word, i) => <Box key={i} detail={`token vector + position ${i + 1}`} tone={word === "dog" ? "blue" : "neutral"}>{word}</Box>)}</div>)}<p className={`${label} text-center`}>Same word set · different position assignments</p></div>;
    case "masks":
      return <div className="grid grid-cols-4 gap-1 text-center text-[11px] leading-relaxed"><span className={`${label} text-[10px]`}>Query ↓<br />Key →</span>{["cats", "sleep", "END"].map(token => <span key={token} className="py-2 font-semibold text-text">{token}</span>)}{causalAccess.map((row, i) => <div key={i} className="contents"><span className="py-2 font-semibold text-text">{["cats", "sleep", "END"][i]}</span>{row.map((allowed, j) => <span key={j} className={`rounded border px-1 py-2 ${allowed ? "border-accent-blue/50 bg-accent-blue/10 text-text" : "border-outline/70 text-text-muted"}`}>{allowed ? "Read" : "Blocked"}</span>)}</div>)}</div>;
    case "transformer-block":
      return <div><Box tone="blue">Input x</Box><Down /><div className="grid grid-cols-[1fr_5rem] gap-3"><div className="grid gap-2"><Box>Layer norm</Box><Box>Attention</Box></div><div className="flex items-center justify-center rounded-r-xl border-b-2 border-r-2 border-accent-blue text-xs text-text-muted">skip x ↓</div></div><Down /><Box tone="blue">Add x → u</Box><Down /><div className="grid grid-cols-[1fr_5rem] gap-3"><div className="grid gap-2"><Box>Layer norm</Box><Box>Per-token FFN</Box></div><div className="flex items-center justify-center rounded-r-xl border-b-2 border-r-2 border-accent-blue text-xs text-text-muted">skip u ↓</div></div><Down /><Box tone="blue">Add u → output y</Box></div>;
    case "encoder-decoder":
      return <div><div className="grid grid-cols-2 gap-3"><div><Box>Source: les chats dorment</Box><Down /><Box detail="All valid source positions">Encoder → source K/V</Box></div><div><Box>Target prefix: cats</Box><Down /><Box tone="blue" detail="Causal target self-attention">Decoder → queries</Box></div></div><Down /><Box detail="Target queries read the encoded source">Cross-attention</Box><Down /><Box tone="green" detail="The next target, not a visible future input">Predict sleep</Box></div>;
    case "kv-cache":
      return <div><Box detail="Past keys and values can be reused">Cache: K/V(A), K/V(B), K/V(C)</Box><Down /><Box tone="blue" detail="Compute only the new position’s projections">New token D → qD, kD, vD</Box><Down /><Box detail="Include the current token’s key/value too">Append → K/V(A, B, C, D)</Box><Down /><Box tone="green" detail="One new query reads the available prefix">qD attends to cached + current K/V</Box></div>;
    case "lora":
      return <div><Box>Input x · width din</Box><Down /><div className="grid grid-cols-2 gap-3"><Box detail="Base weights stay fixed">W₀<br />din → dout</Box><div className="grid gap-2"><Box tone="blue">Train A: din → r</Box><Box tone="blue">Train B: r → dout</Box></div></div><Down /><Box tone="green" detail="Both branches have output width dout">Add W₀x + sB(Ax)</Box></div>;
    case "decoding-tree":
      return <div><Box>Starting prefix</Box><Down /><div className="grid grid-cols-2 gap-3">{decodingExample.tokens.map((token, i) => <div key={token} className="grid gap-2"><Box tone={i ? "green" : "blue"} detail={i ? "Kept by width-2 beam" : "Greedy first choice"}>P({token}) = {decodingExample.first[i]}</Box><Down /><Box>P(EOS | {token}) = {decodingExample.end[i]}</Box><Box tone={i ? "green" : "neutral"} detail="Complete sequence probability">{(decodingExample.first[i] * decodingExample.end[i]).toFixed(2)}</Box></div>)}</div></div>;
    case "bio-spans":
      return <div><p className="mb-3 text-sm text-text">Source: Ada visits New York.</p><div className="grid grid-cols-4 gap-1">{["Ada", "visits", "New", "York"].map((token, i) => <div key={token} className="min-w-0 text-center"><div className={`rounded-t border px-1 py-2 text-sm text-text ${i === 1 ? tones.neutral : tones.blue}`}>{token}</div><div className="border-x border-b border-outline/70 px-1 py-2 font-mono text-[10px] text-text">{["B-PER", "O", "B-LOC", "I-LOC"][i]}</div></div>)}<div className="col-start-3 col-end-5 rounded border border-accent-blue/60 px-2 py-2 text-center text-xs font-semibold text-text">One location span [11,19)</div></div></div>;
    case "crf-path":
      return <div className="grid gap-3">{[[0, 2], [0, 1]].map((path, i) => <Box key={i} tone={i ? "green" : "neutral"} detail={i ? "Emissions 2 + 2, transition bonus +2" : "Emissions 2 + 3, transition bonus 0"}><Tokens values={path.map(labelId => crfExample.labels[labelId])} /><p className="mt-2 font-bold">Sequence score = {pathScore(path)}</p></Box>)}<p className={`${label} text-center`}>The locally best second label O loses to the stronger complete path.</p></div>;
    case "contrastive-matrix":
      return <div><div className="grid grid-cols-4 gap-1 text-center text-xs"><span className={label}>Query ↓<br />Doc →</span>{[1, 2, 3].map(i => <span key={i} className="py-2 font-semibold text-text">d{i}</span>)}{contrastiveLogits.map((row, i) => <div key={i} className="contents"><span className="py-2 font-semibold text-text">q{i + 1}</span>{row.map((score, j) => <span key={j} className={`rounded border py-2 ${i === j ? tones.blue : tones.neutral} text-text`}>{score}</span>)}</div>)}</div><p className={`${label} mt-3 text-center`}>Row softmax: positive probability ≈ {softmax(contrastiveLogits[0])[0].toFixed(3)}</p></div>;
    case "bi-cross":
      return <div className="grid gap-5 sm:grid-cols-2"><div><p className={`${label} mb-2 text-center`}>Bi-encoder</p><div className="grid grid-cols-2 gap-2"><Box detail="Encoded independently">Query → vector</Box><Box detail="Reusable across queries">Document → vector</Box></div><Down /><Box tone="blue">Vector comparison → score</Box></div><div><p className={`${label} mb-2 text-center`}>Cross-encoder</p><Box>Query + document tokens</Box><Down /><Box detail="States depend on this query-document pair">Joint contextual encoder</Box><Down /><Box tone="green">Pair head → score</Box></div></div>;
    case "rag":
      return <div><p className={`${label} mb-2`}>Indexing path</p><Box>Sources → chunks → searchable index</Box><div className="my-4 border-t border-dashed border-outline/80" /><p className={`${label} mb-2`}>Answering path</p><Box>Question → retrieve candidates</Box><Down /><Box>Rerank / select passages</Box><Down /><Box tone="blue">Question + selected evidence → generator</Box><Down /><Box tone="green" detail="Check whether each claim is supported">Answer + source attribution</Box></div>;
    default:
      throw new Error(`No native renderer for NLP visual ${id}`);
  }
}

export function NlpLessonVisual({ id }: { id: string }) {
  if (!isNlpVisualId(id)) throw new Error(`Unknown NLP figure: ${id}`);
  const visual: NlpVisualSpec = nlpVisuals[id];
  if (visual.sharedCv) return <div data-nlp-visual={id}><CvLessonVisual id={visual.sharedCv} /></div>;
  return <LessonFigure id={id} track="nlp" visual={visual}><div className="p-4" role="img" aria-label={visual.alt}><VisualContent id={id} /></div></LessonFigure>;
}
