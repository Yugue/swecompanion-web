'use client'

import { EyeOff } from 'lucide-react'
import { ProductMark } from '@/components/ProductMark'
import { cn } from '@/lib/utils'
import styles from './companion-preview.module.css'
import coreCodingPreview from './core-coding-preview.json'
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
        <code>{text.split(tokens).map((token, part) => <span key={part} className={token.startsWith('#') ? styles.comment : /^(def|return|if|else|while|for|in)$/.test(token) ? styles.keyword : /^\d+$/.test(token) ? styles.number : undefined}>{token}</span>)}</code>
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

function createFlow({ nodes }: { nodes: string[] }) {
  return <div className={styles.flow}>{nodes.map((node, index) => <div key={node} className={styles.flowStep}>
    {index > 0 && <span className={styles.arrow}>→</span>}<span className={styles.node}>{node}</span>
  </div>)}</div>
}

function createArchitecture({ ml }: { ml: boolean }) {
  return <div className={styles.diagram}>
    {ml ? <>
      <span className={styles.laneTitle}>Online inference</span>
      {createFlow({ nodes: ['Message', 'XLM-R', '150 scores + policy', 'Labels / review / unknown'] })}
      <span className={styles.flowNote}>↓ Outcome audits feed reviewed training data</span>
      <span className={styles.laneTitle}>Learning pipeline</span>
      {createFlow({ nodes: ['Reviewed data', 'Train + calibrate + evaluate', 'Versioned bundle'] })}
      <span className={styles.flowNote}>Approved release → model, tokenizer, and thresholds</span>
    </> : <>
      {createFlow({ nodes: ['Fans', 'Waiting room', 'Booking', 'SQL + outbox'] })}
      <span className={styles.flowNote}>Signed token → admission · atomic seat holds + order state</span>
      {createFlow({ nodes: ['Search / seat cache', 'Booking', 'Payments'] })}
      <span className={styles.flowNote}>Order ID → payment · verified callback → booking</span>
      {createFlow({ nodes: ['SQL + outbox', 'Retry delivery', 'Tickets'] })}
    </>}
  </div>
}

const designPoints = [
  ['Flash sale', 'Cache search and seat maps. A signed waiting room meters 1M fans into checkout; cached availability is advisory.'],
  ['No double booking', 'One SQL writer per event. Lock seats in sorted order; claim all or none. Store hold ID, owner, state, and DB-clock expiry. Atomically reclaim expired 5-minute holds.'],
  ['Safe payment', 'Before expiry, save the order and mark its hold PAYMENT_PENDING in one transaction. Order ID deduplicates retries. Verified success confirms seats + ticket outbox atomically; dedupe callbacks. Failure → release. Unknown → reconcile before release; late success after cancellation → refund.'],
  ['Recovery', 'Retry outbox delivery; unique ticket per order/seat. Sweep expired holds. Shard by event; throttle hot sales. Fence failed writers; pause bookings during uncertain failover.'],
]
const mlPoints = [
  ['Data', 'Reviewed multilabel messages; mask unknown annotations. Split by time and conversation; cover rare labels and mixed languages.'],
  ['Model', 'XLM-R → 150 sigmoid outputs + a no-known-label head. Train with weighted binary cross-entropy.'],
  ['Decisions', 'Calibrate per-label cutoffs. Borderline → review. No accepted labels + confident unknown head → no known label.'],
  ['Quality', 'Micro/macro F1 and recall at target precision, by language and category. Audit every outcome.'],
  ['Serving', 'Version weights, tokenizer, and cutoffs together. Batch inference; canary releases. Model failure → review.'],
]

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
  </> : <>
    <h4>{workflow === 'ml-design' ? 'Model & training' : 'Design'}</h4>
    <ul className={styles.designPoints}>{(workflow === 'ml-design' ? mlPoints : designPoints).map(([title, text]) => <li key={title}><strong>{title}:</strong> {text}</li>)}</ul>
    <h4>Architecture</h4>{createArchitecture({ ml: workflow === 'ml-design' })}
  </>
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
        <span><kbd>F3</kbd>Debug</span><span><kbd>F4</kbd>Improve</span>
        <span><kbd>F6/F7</kbd>Scroll up/down</span><span><kbd>F12</kbd>Clear</span>
      </div>
    </div>
    <div className={styles.answer}>
      {streaming ? <StreamedAnswer durationMs={streamDurationMs} running={running}>{content}</StreamedAnswer> : content}
    </div>
  </div>
}
