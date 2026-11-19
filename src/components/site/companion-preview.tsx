'use client'

import type { CSSProperties } from 'react'
import { EyeOff } from 'lucide-react'
import { ProductMark } from '@/components/ProductMark'
import { cn } from '@/lib/utils'
import styles from './companion-preview.module.css'
import coreCodingPreview from './core-coding-preview.json'
import coreMlDesignPreview from './core-ml-design-preview.json'
import coreSystemDesignPreview from './core-system-design-preview.json'
import { StreamedAnswer } from './streamed-answer'

export type PreviewWorkflow = 'coding' | 'debug' | 'optimize' | 'system-design' | 'ml-design'

const solution = coreCodingPreview.solution

const original = `def retained_runoff(height):
    water = 0
    for i in range(1, len(height) - 1):
        left_max = max(height[:i + 1])
        right_max = max(height[i:])
        water += min(left_max, right_max) - height[i]
    return water`

const tokens = /(#.*$|"[^"\n]*"|'[^'\n]*'|\b(?:def|return|if|else|while|for|in)\b|\b\d+\b)/g

type CodeLine = { text: string; change?: 'removed' | 'added' }

function answerLines(workflow: PreviewWorkflow): CodeLine[] {
  if (workflow === 'optimize') return [
    ...original.split('\n').map((text) => ({ text, change: 'removed' as const })),
    ...solution.split('\n').map((text) => ({ text, change: 'added' as const })),
  ]
  if (workflow === 'coding') return coreCodingPreview.solution.split('\n').map((text) => ({ text }))
  return solution.split('\n').flatMap((text): CodeLine[] => {
    if (workflow === 'debug' && text.includes('water += left_max')) return [
      { text: text.replace('+=', '='), change: 'removed' }, { text, change: 'added' },
    ]
    if (workflow === 'debug' && text.includes('right_max = max')) return [
      { text: text.replace('max(', 'min('), change: 'removed' }, { text, change: 'added' },
    ]
    return [{ text }]
  })
}

function createCodeAnswer({ workflow }: { workflow: PreviewWorkflow }) {
  const lines = answerLines(workflow)
  return <>
    <div className={styles.sectionTitle}><h4>{workflow === 'coding' ? 'Solution' : 'Code diff'}</h4><span>python · {lines.length} lines</span></div>
    <div className={styles.codeBlock}>
      {lines.map(({ text, change }, index) => <div key={index} className={cn(styles.codeLine, change && styles[change])}>
        <span className={styles.lineNumber}>{change === 'added' ? '+' : change === 'removed' ? '−' : index + 1}</span>
        <code style={{ '--indent': `${text.length - text.trimStart().length}ch` } as CSSProperties}>{text.trimStart().split(tokens).map((token, part) => <span key={part} className={token.startsWith('#') ? styles.comment : /^(def|return|if|else|while|for|in)$/.test(token) ? styles.keyword : /^\d+$/.test(token) ? styles.number : undefined}>{token}</span>)}</code>
      </div>)}
    </div>
    <section className={styles.complexity}>
      <h4>Complexity</h4>
      {workflow === 'coding' ? coreCodingPreview.complexity.map((line) => <p key={line}>{line}</p>) : <>
        <p><strong>Time: O(n).</strong> Each section is processed at most once.</p>
        <p><strong>Space: O(1) extra.</strong> Two pointers, two maxima, and the total; no auxiliary arrays.</p>
      </>}
    </section>
  </>
}

// Design answers are saved Core generations for the hero's screenshots
// (core-system-design-preview.json, core-ml-design-preview.json). Each Mermaid
// diagram is redrawn as SVG with the same components, numbered edges, and
// Core's path colours; narrow windows get one lane per path instead.
type Box = { x: number; y: number; w: number; h: number; title: string; lines: string[]; kind?: 'store' | 'actor' }
type Edge = { step: number; path: string; d: string; badge: [number, number]; label?: [string, number, number, 'start' | 'middle' | 'end'] }
type Lane = { path: string; nodes: [number | null, string][]; note?: string }
type Diagram = { label: string; viewBox: string; paths: Record<string, [colour: string, name: string]>; boxes: Box[]; edges: Edge[]; lanes: Lane[] }

const ticketDiagram: Diagram = {
  label: 'Ticket booking architecture',
  viewBox: '0 -14 688 250',
  paths: { write: ['#ff8a65', 'Orange — Write path'], read: ['#64b5f6', 'Blue — Read path'], async: ['#81c784', 'Green — Async work'] },
  boxes: [
    { x: 4, y: 82, w: 62, h: 36, title: 'Client', lines: [], kind: 'actor' },
    { x: 110, y: 12, w: 122, h: 42, title: 'Waiting Room', lines: ['signed-token batches'] },
    { x: 290, y: 12, w: 122, h: 42, title: 'Seat Service', lines: ['holds seats 5 min'] },
    { x: 110, y: 138, w: 122, h: 42, title: 'Payment Service', lines: ['key = hold_id'] },
    { x: 124, y: 204, w: 94, h: 26, title: 'Payment Provider', lines: [], kind: 'actor' },
    { x: 462, y: 2, w: 116, h: 60, title: 'Cache', lines: ['event_id · KEY', 'seat_bitmap · 1 s TTL'], kind: 'store' },
    { x: 462, y: 94, w: 116, h: 92, title: 'Inventory Database', lines: ['event_id, seat_id · PK', 'status · enum', 'hold_id · UNIQUE', 'hold_expires_at'], kind: 'store' },
    { x: 600, y: 106, w: 86, h: 46, title: 'Message Queue', lines: ['by hold_id'], kind: 'store' },
    { x: 600, y: 186, w: 86, h: 44, title: 'Ticket Service', lines: ['1 ticket / hold_id'] },
  ],
  edges: [
    { step: 1, path: 'write', d: 'M66 92 H88 V33 H110', badge: [88, 62], label: ['Join queue', 95, 76, 'start'] },
    { step: 2, path: 'write', d: 'M232 33 H290', badge: [261, 33], label: ['Admit', 261, 50, 'middle'] },
    { step: 3, path: 'write', d: 'M368 54 V116 H462', badge: [368, 82], label: ['Hold if free', 376, 98, 'start'] },
    { step: 4, path: 'write', d: 'M66 108 H88 V159 H110', badge: [88, 134], label: ['Pay', 95, 124, 'start'] },
    { step: 5, path: 'write', d: 'M171 180 V204', badge: [171, 192], label: ['Charge', 182, 195, 'start'] },
    { step: 6, path: 'write', d: 'M232 162 H462', badge: [270, 162], label: ['Confirm SOLD + outbox', 282, 175, 'start'] },
    { step: 7, path: 'read', d: 'M35 82 V-2 H332 V12', badge: [120, -2], label: ['Open seat map', 132, -7, 'start'] },
    { step: 8, path: 'read', d: 'M412 33 H462', badge: [437, 33], label: ['GET', 437, 50, 'middle'] },
    { step: 9, path: 'read', d: 'M332 54 V140 H462', badge: [332, 100], label: ['On miss', 376, 152, 'start'] },
    { step: 10, path: 'async', d: 'M578 129 H600', badge: [589, 129] },
    { step: 11, path: 'async', d: 'M643 152 V186', badge: [643, 169], label: ['Consume', 653, 172, 'start'] },
  ],
  lanes: [
    { path: 'write', nodes: [[null, 'Client'], [1, 'Waiting Room'], [2, 'Seat Service'], [3, 'Inventory Database']] },
    { path: 'write', nodes: [[null, 'Client'], [4, 'Payment Service'], [6, 'Inventory Database']], note: '5 · Payment Provider charged with key = hold_id' },
    { path: 'read', nodes: [[null, 'Client'], [7, 'Seat Service'], [8, 'Cache'], [9, 'Inventory Database']] },
    { path: 'async', nodes: [[null, 'Inventory Database'], [10, 'Message Queue'], [11, 'Ticket Service']] },
  ],
}

const supportDiagram: Diagram = {
  label: 'Multilingual support classification architecture',
  viewBox: '0 -4 694 190',
  paths: { inference: ['#ff8a65', 'Orange — Inference path'], training: ['#64b5f6', 'Blue — Training loop'] },
  boxes: [
    { x: 4, y: 3, w: 58, h: 34, title: 'Client', lines: [], kind: 'actor' },
    { x: 92, y: 0, w: 120, h: 40, title: 'Inference Service', lines: ['micro-batches 16'] },
    { x: 242, y: 0, w: 120, h: 40, title: 'Model Server', lines: ['151 scores · 2 GPUs'] },
    { x: 392, y: 0, w: 120, h: 40, title: 'Decision Policy', lines: ['tag · review · NOVEL'] },
    { x: 542, y: 0, w: 136, h: 40, title: 'Review Queue', lines: ['agents confirm tags'] },
    { x: 242, y: 70, w: 120, h: 40, title: 'Model Registry', lines: ['versions · rollback'], kind: 'store' },
    { x: 392, y: 70, w: 120, h: 40, title: 'Prediction Log', lines: ['scores · language'], kind: 'store' },
    { x: 542, y: 70, w: 136, h: 40, title: 'Teacher Language Model', lines: ['text → pseudo-labels'] },
    { x: 542, y: 140, w: 136, h: 40, title: 'Labeled Data', lines: ['multi-hot · splits'], kind: 'store' },
    { x: 392, y: 140, w: 120, h: 40, title: 'Training Job', lines: ['BCE, hard negatives'] },
    { x: 242, y: 140, w: 120, h: 40, title: 'Offline Eval', lines: ['macro-F1 vs live'] },
  ],
  edges: [
    { step: 1, path: 'inference', d: 'M62 20 H92', badge: [77, 20] },
    { step: 2, path: 'inference', d: 'M212 20 H242', badge: [227, 20] },
    { step: 3, path: 'inference', d: 'M302 40 V70', badge: [302, 55], label: ['Load live version', 312, 58, 'start'] },
    { step: 4, path: 'inference', d: 'M362 20 H392', badge: [377, 20] },
    { step: 5, path: 'inference', d: 'M512 20 H542', badge: [527, 20] },
    { step: 6, path: 'inference', d: 'M452 40 V70', badge: [452, 55], label: ['Log prediction', 462, 58, 'start'] },
    { step: 7, path: 'training', d: 'M512 90 H542', badge: [527, 90] },
    { step: 8, path: 'training', d: 'M610 110 V140', badge: [610, 125], label: ['Teacher labels', 620, 128, 'start'] },
    { step: 9, path: 'training', d: 'M678 20 H687 V160 H678', badge: [687, 90] },
    { step: 10, path: 'training', d: 'M542 160 H512', badge: [527, 160] },
    { step: 11, path: 'training', d: 'M392 160 H362', badge: [377, 160] },
    { step: 12, path: 'training', d: 'M302 140 V110', badge: [302, 125], label: ['Promote if better', 312, 128, 'start'] },
  ],
  lanes: [
    { path: 'inference', nodes: [[null, 'Client'], [1, 'Inference Service'], [2, 'Model Server'], [4, 'Decision Policy']], note: '3 · Model Server loads the live version from Model Registry' },
    { path: 'inference', nodes: [[null, 'Decision Policy'], [6, 'Prediction Log']], note: '5 · Decision Policy routes uncertain messages to Review Queue' },
    { path: 'training', nodes: [[null, 'Prediction Log'], [7, 'Teacher Language Model'], [8, 'Labeled Data']], note: '9 · Review Queue corrections → Labeled Data' },
    { path: 'training', nodes: [[null, 'Labeled Data'], [10, 'Training Job'], [11, 'Offline Eval'], [12, 'Model Registry']] },
  ],
}

function ArchitectureDiagram({ diagram }: { diagram: Diagram }) {
  const { label, viewBox, paths, boxes, edges, lanes } = diagram
  const colour = (path: string) => paths[path][0]
  return <div className={styles.sdDiagram}>
    <svg className={styles.sdSvg} viewBox={viewBox} role="img" aria-label={label}>
      <defs>{Object.entries(paths).map(([path, [fill]]) => <marker key={path} id={`sd-arrow-${path}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 0 L8 4 L0 8 z" fill={fill} />
      </marker>)}</defs>
      {edges.map(({ step, path, d }) => <path key={step} d={d} fill="none" stroke={colour(path)} strokeWidth={1.6} markerEnd={`url(#sd-arrow-${path})`} />)}
      {boxes.map((box) => <g key={box.title} className={box.kind === 'store' ? styles.sdStore : box.kind === 'actor' ? styles.sdActor : styles.sdService}>
        <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={box.kind === 'actor' ? box.h / 2 : 5} />
        <text x={box.x + box.w / 2} y={box.y + (box.lines.length ? 15 : box.h / 2 + 3.5)} className={styles.sdTitle}>{box.title}</text>
        {box.kind === 'store' && box.lines.length > 1 && <line x1={box.x + 6} x2={box.x + box.w - 6} y1={box.y + 20} y2={box.y + 20} />}
        {box.lines.map((line, index) => <text key={line} x={box.x + box.w / 2} y={box.y + (box.kind === 'store' && box.lines.length > 1 ? 31 : 29) + index * 13} className={styles.sdLine}>{line}</text>)}
      </g>)}
      {edges.map(({ step, path, badge: [x, y], label: edgeLabel }) => <g key={step}>
        <circle cx={x} cy={y} r={6.5} fill="#121216" stroke={colour(path)} strokeWidth={1.3} />
        <text x={x} y={y + 2.8} className={styles.sdBadge} fill={colour(path)}>{step}</text>
        {edgeLabel && <text x={edgeLabel[1]} y={edgeLabel[2]} textAnchor={edgeLabel[3]} className={styles.sdEdgeLabel}>{edgeLabel[0]}</text>}
      </g>)}
    </svg>
    <div className={styles.sdLanes}>{lanes.map(({ path, nodes, note }, index) => <div key={index} className={styles.sdLane} style={{ '--lane': colour(path) } as CSSProperties}>
      <div className={styles.flow}>{nodes.map(([step, node], position) => <div key={position} className={styles.flowStep}>
        {step !== null && <span className={styles.sdLaneArrow}><b>{step}</b>→</span>}<span className={styles.node}>{node}</span>
      </div>)}</div>
      {note && <span className={styles.flowNote}>{note}</span>}
    </div>)}</div>
    <div className={styles.sdLegend}>{Object.entries(paths).map(([path, [fill, name]]) => <span key={path} style={{ color: fill, borderColor: fill }}>{name}</span>)}</div>
  </div>
}

function createSystemDesignAnswer() {
  // Nice to Have is kept in the JSON but left out here so the window fits the stage.
  const { summary, explanation } = coreSystemDesignPreview
  return <>
    <section className={styles.intro}>
      <h4>Summary</h4>
      <p>{summary}</p>
    </section>
    <section className={styles.intro}>
      <h4>Explanation</h4>
      <ul className={styles.designPoints}>{explanation.map(([title, text]) => <li key={title}><strong>{title}:</strong> {text}</li>)}</ul>
    </section>
    <h4>Architecture</h4>
    <ArchitectureDiagram diagram={ticketDiagram} />
  </>
}

// Core's Markdown inline: **bold** spans, with ASCII arrows shown as glyphs.
function inline(text: string) {
  return text.replaceAll('->', '→').replaceAll('>=', '≥').split(/(\*\*[^*]+\*\*)/g)
    .map((part, index) => part.startsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part)
}

// The full answer is in the JSON; the window shows the bullets that carry the
// main decisions, verbatim, so it fits the stage without scrolling.
const mlSections: [title: string, bullets: string[][], keep: string[]][] = [
  ['Data', coreMlDesignPreview.data, ['ML Objective', 'Labels', 'Flow']],
  ['Model & Training', coreMlDesignPreview.modelTraining, ['Model', 'Decision rule']],
  ['Evaluation & Scaling', coreMlDesignPreview.evaluationScaling, ['Offline monitoring']],
]

function createMlDesignAnswer() {
  return <>
    {mlSections.map(([title, bullets, keep]) => <section key={title} className={styles.intro}>
      <h4>{title}</h4>
      <ul className={styles.designPoints}>{bullets.filter(([label]) => keep.includes(label)).map(([label, text]) => <li key={label}><strong>{label}:</strong> {inline(text)}</li>)}</ul>
    </section>)}
    <h4>Architecture</h4>
    <ArchitectureDiagram diagram={supportDiagram} />
  </>
}

function createAnswerContent(workflow: PreviewWorkflow) {
  const coding = workflow === 'coding' || workflow === 'debug' || workflow === 'optimize'
  return coding ? <>
    <section className={styles.intro}>
      <h4>{workflow === 'coding' ? 'Explanation' : workflow === 'debug' ? 'Two bugs' : 'Two improvements'}</h4>
      {workflow === 'coding' ? <div className={styles.explanation}>
        <p>{coreCodingPreview.explanation.split(/(`[^`]+`)/g).map((part, index) => part.startsWith('`') ? <code key={index}>{part.slice(1, -1)}</code> : part)}</p>
        <p><strong>Example:</strong> {coreCodingPreview.example}</p>
        <ol>{coreCodingPreview.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      </div>
        : workflow === 'debug' ? <ol><li><strong>Overwritten total:</strong> = discards earlier water. Use +=.</li><li><strong>Wrong right boundary:</strong> min loses the tallest bar. Use max.</li></ol>
          : <ol><li><strong>Faster:</strong> Replace repeated maximum scans with one two-pointer pass. <strong>O(n²) → O(n)</strong> time.</li><li><strong>Less memory:</strong> Remove array slices; keep two running maxima. <strong>O(n) → O(1)</strong> extra space.</li></ol>}
    </section>
    {createCodeAnswer({ workflow })}
  </> : workflow === 'system-design' ? createSystemDesignAnswer() : createMlDesignAnswer()
}

/** Decorative Core answer window, adapted from a saved Core generation for the preview. */
export function CompanionPreview({ workflow, streaming, running, streamDurationMs }: { workflow: PreviewWorkflow; streaming: boolean; running: boolean; streamDurationMs: number }) {
  const coding = workflow === 'coding' || workflow === 'debug' || workflow === 'optimize'
  const content = createAnswerContent(workflow)
  const label = workflow === 'debug' ? 'Debug' : workflow === 'optimize' ? 'Improve' : 'Solve'
  return <div className={styles.window} data-workflow={workflow}>
    <div className={styles.statusBar}>
      <ProductMark size={20} /><span className={styles.statusDot} /><span className={styles.mode}>{coding ? 'Coding' : workflow === 'ml-design' ? 'ML design' : 'System design'} /</span><strong>{label}</strong>
      <span className={styles.privacy}><EyeOff size={12} />Hide from screen share on</span>
      <div className={styles.shortcuts}>
        <span><kbd>F1</kbd>Capture</span><span><kbd>F2</kbd>Solve</span>
        <span><kbd>F3</kbd>Debug</span>{coding && <span><kbd>F4</kbd>Improve</span>}
        <span><kbd>F6/F7</kbd>Scroll up/down</span><span><kbd>F12</kbd>Clear</span>
      </div>
    </div>
    <div className={styles.answer}>
      {streaming ? <StreamedAnswer durationMs={streamDurationMs} running={running}>{content}</StreamedAnswer> : content}
    </div>
  </div>
}
