import { EyeOff } from 'lucide-react'
import { ProductMark } from '@/components/ProductMark'
import { cn } from '@/lib/utils'
import styles from './companion-preview.module.css'

export type PreviewWorkflow = 'coding' | 'debug' | 'optimize' | 'system-design' | 'ml-design'

const solution = `def retained_runoff(height):
    left, right = 0, len(height) - 1
    left_max = right_max = water = 0
    while left < right:
        if height[left] <= height[right]:
            left_max = max(left_max, height[left])
            water += left_max - height[left]
            left += 1
        else:
            right_max = max(right_max, height[right])
            water += right_max - height[right]
            right -= 1
    return water`

const original = `def retained_runoff(height):
    water = 0
    for i in range(1, len(height) - 1):
        left_max = max(height[:i + 1])
        right_max = max(height[i:])
        water += min(left_max, right_max) - height[i]
    return water`

const tokens = /("[^"\n]*"|'[^'\n]*'|\b(?:def|return|if|else|while|for|in)\b|\b\d+\b)/g

type CodeLine = { text: string; change?: 'removed' | 'added' }

function answerLines(workflow: PreviewWorkflow): CodeLine[] {
  if (workflow === 'optimize') return [
    ...original.split('\n').map((text) => ({ text, change: 'removed' as const })),
    ...solution.split('\n').map((text) => ({ text, change: 'added' as const })),
  ]
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

function CodeAnswer({ workflow }: { workflow: PreviewWorkflow }) {
  const lines = answerLines(workflow)
  return <>
    <div className={styles.sectionTitle}><h4>{workflow === 'coding' ? 'Solution' : 'Code diff'}</h4><span>python · {lines.length} lines</span></div>
    <div className={styles.codeBlock}>
      {lines.map(({ text, change }, index) => <div key={index} className={cn(styles.codeLine, change && styles[change])}>
        <span className={styles.lineNumber}>{change === 'added' ? '+' : change === 'removed' ? '−' : index + 1}</span>
        <code>{text.split(tokens).map((token, part) => <span key={part} className={/^(def|return|if|else|while|for|in)$/.test(token) ? styles.keyword : /^\d+$/.test(token) ? styles.number : undefined}>{token}</span>)}</code>
      </div>)}
    </div>
    <section className={styles.complexity}>
      <h4>Complexity</h4>
      <p><strong>Time: O(n).</strong> Each pointer moves inward without revisiting a section, so at most n sections are processed.</p>
      <p><strong>Space: O(1) extra.</strong> Only two pointers, two running maxima, and the total are stored; no auxiliary arrays or slices are needed.</p>
    </section>
  </>
}

function Flow({ nodes }: { nodes: string[] }) {
  return <div className={styles.flow}>{nodes.map((node, index) => <div key={node} className={styles.flowStep}>
    {index > 0 && <span className={styles.arrow}>→</span>}<span className={styles.node}>{node}</span>
  </div>)}</div>
}

function Architecture({ ml }: { ml: boolean }) {
  return <div className={styles.diagram}>
    {ml ? <>
      <span className={styles.laneTitle}>Online inference</span>
      <Flow nodes={['Message', 'XLM-R', '150 scores + policy', 'Labels / review / unknown']} />
      <span className={styles.flowNote}>↓ Outcome audits feed reviewed training data</span>
      <span className={styles.laneTitle}>Learning pipeline</span>
      <Flow nodes={['Reviewed data', 'Train + calibrate + evaluate', 'Versioned bundle']} />
      <span className={styles.flowNote}>Approved release → model, tokenizer, and thresholds</span>
    </> : <>
      <Flow nodes={['Fans', 'Waiting room', 'Booking', 'SQL + outbox']} />
      <span className={styles.flowNote}>Signed token → admission · atomic seat holds + order state</span>
      <Flow nodes={['Search / seat cache', 'Booking', 'Payments']} />
      <span className={styles.flowNote}>Order ID → payment · verified callback → booking</span>
      <Flow nodes={['SQL + outbox', 'Retry delivery', 'Tickets']} />
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

/** Decorative web rendering of the Core answer window; all content is editable here. */
export function CompanionPreview({ workflow, streaming }: { workflow: PreviewWorkflow; streaming: boolean }) {
  const coding = workflow === 'coding' || workflow === 'debug' || workflow === 'optimize'
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
    <div className={cn(styles.answer, streaming && styles.streaming)}>
      {coding ? <>
        <section className={styles.intro}>
          <h4>{workflow === 'coding' ? 'Explanation' : workflow === 'debug' ? 'Two bugs' : 'Two improvements'}</h4>
          {workflow === 'coding' ? <div className={styles.explanation}>
            <p>Water at a section is limited by the lower of the highest ground elevations to its left and right. Subtract the section’s elevation to get the retained depth. Each section covers 1 m², so that depth contributes the same number of cubic metres.</p>
            <p>Start one pointer at each end and track the highest elevation seen from each side. Process the lower current elevation: the opposite boundary is already high enough, so this side’s running maximum determines its water depth. Add that depth and move the pointer inward.</p>
            <p>Stop when the pointers meet. In the first example, the retained depths are 1, 1, 2, 1, and 1 across the low sections: <strong>6 m³</strong> in total. The second example retains <strong>9 m³</strong>.</p>
          </div>
            : workflow === 'debug' ? <ol><li><strong>Overwritten total:</strong> = discards earlier water. Use +=.</li><li><strong>Wrong right boundary:</strong> min loses the tallest bar. Use max.</li></ol>
              : <ol><li><strong>Faster:</strong> Replace repeated maximum scans with one two-pointer pass. <strong>O(n²) → O(n)</strong> time.</li><li><strong>Less memory:</strong> Remove array slices; keep two running maxima. <strong>O(n) → O(1)</strong> extra space.</li></ol>}
        </section>
        <CodeAnswer workflow={workflow} />
      </> : <>
        <h4>{workflow === 'ml-design' ? 'Model & training' : 'Design'}</h4>
        <ul className={styles.designPoints}>{(workflow === 'ml-design' ? mlPoints : designPoints).map(([title, text]) => <li key={title}><strong>{title}:</strong> {text}</li>)}</ul>
        <h4>Architecture</h4><Architecture ml={workflow === 'ml-design'} />
      </>}
    </div>
  </div>
}
