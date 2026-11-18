'use client'

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ArrowUp, Circle, ChevronDown, ChevronUp, Code2, Eye, LockKeyhole, MessageSquare, Mic, Monitor, MoreHorizontal, Minus, Pause, Play, Pointer, Rows2, RotateCw, Settings2, Smile, Square, Users, VideoOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CompanionPreview } from './companion-preview'
import { RunoffExample } from './runoff-example'
import styles from './product-demo.module.css'

const rainWaterProblem = 'A city is sizing drainage for a roadside channel. The array height gives ground elevations in metres across consecutive 1 m × 1 m sections. After heavy rain, water fills depressions between higher sections and drains away at either end. Return the volume of water retained, in cubic metres.'
const rainWaterExamples = [
  'Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6 m³',
  'Input: height = [4,2,0,3,2,5]\nOutput: 9 m³',
]
const rainWaterConstraints = ['1 ≤ height.length ≤ 20,000', '0 ≤ height[i] ≤ 100,000']
const solveConstraints = [...rainWaterConstraints, 'Time complexity: O(n)', 'Extra space: O(1)']

const workflows = [
  {
    id: 'coding', group: 'Coding', label: 'Solve', title: 'Roadside Drainage Capacity', key: 'F2',
    difficulty: 'Hard', problem: rainWaterProblem, examples: rainWaterExamples,
    constraints: solveConstraints,
    task: "Solve in O(n) time and O(1) extra space.",
    draft: "def retained_runoff(height):\n    pass",
  },
  {
    id: 'debug', group: 'Coding', label: 'Debug', title: 'Roadside Drainage Capacity', key: 'F3',
    difficulty: 'Hard', problem: rainWaterProblem, examples: rainWaterExamples, constraints: solveConstraints,
    task: "Find and fix the errors in the candidate’s solution.",
    draft: "def retained_runoff(height):\n    left, right = 0, len(height) - 1\n    left_max = right_max = water = 0\n    while left < right:\n        if height[left] <= height[right]:\n            left_max = max(left_max, height[left])\n            water = left_max - height[left]\n            left += 1\n        else:\n            right_max = min(right_max, height[right])\n            water += right_max - height[right]\n            right -= 1\n    return water",
  },
  {
    id: 'optimize', group: 'Coding', label: 'Improve', title: 'Roadside Drainage Capacity', key: 'F4',
    difficulty: 'Hard', problem: rainWaterProblem, examples: rainWaterExamples, constraints: rainWaterConstraints,
    task: "1. O(n²) → O(n) time. 2. O(n) → O(1) extra space.",
    draft: "def retained_runoff(height):\n    water = 0\n    for i in range(1, len(height) - 1):\n        # 1. Repeated max scans: O(n²) time\n        # 2. Slices allocate O(n) extra space\n        left_max = max(height[:i + 1])\n        right_max = max(height[i:])\n        water += min(left_max, right_max) - height[i]\n    return water",
  },
  {
    id: 'system-design', group: 'System design', label: 'System design', title: 'Ticket booking — Ticketmaster', key: 'F2',
    difficulty: 'Architecture',
    problem: 'Design a service to discover events, view available seats, hold seats for 5 minutes, pay, and receive tickets.',
    examples: ['Two fans select the same seat → only one gets the hold', 'Payment retry → one booking, one charge'],
    constraints: ['1 million fans arrive for a 50,000-seat event. Never sell the same seat twice. Handle expired holds, payment failures, and traffic spikes.'],
    task: 'Show the architecture, booking data, and failure handling.',
    draft: '1M fans · 50,000 seats\n\nBrowse → select → hold → pay → ticket\nHold expires after 5 minutes\nOne seat → one confirmed booking\nPayment retries must be safe',
  },
  {
    id: 'ml-design', group: 'ML system design', label: 'ML design', title: 'Classify Multilingual Support Messages', key: 'F2',
    difficulty: 'ML architecture',
    problem: 'Build a multilingual system that predicts every applicable issue among 150 stable categories from a support message. A message may contain several issues or mixed languages.',
    examples: ['“Charged twice; impossible de me connecter.”\n→ Duplicate charge + login issue, each with a score'],
    constraints: ['Return scored labels, review if uncertain, or no known label. Distinguish unknown issues from low confidence.'],
    task: 'Cover data, model, training, decision thresholds, evaluation, and serving.',
    draft: '150 stable categories · multiple labels\nMultilingual and mixed-language input\n\nOutput: labels + confidence scores\nUncertain → human review\nUnknown → no known label',
  },
] as const

type Workflow = (typeof workflows)[number]

const categories = [
  { id: 'coding', label: 'Coding', group: 'Coding', firstScene: 0 },
  { id: 'system-design', label: 'System Design', group: 'System design', firstScene: 3 },
  { id: 'ml-design', label: 'ML System Design', group: 'ML system design', firstScene: 4 },
] as const

// Workflows advance manually by default, with optional automatic playback.
const phases = [
  { id: 'problem', durationMs: 12000 },
  { id: 'key', durationMs: 2200 },
  { id: 'stream', durationMs: 3000 },
  { id: 'answer', durationMs: 8000 },
  { id: 'scan', durationMs: 1800 },
  { id: 'compare', durationMs: 6500 },
  { id: 'reveal', durationMs: 1400 },
  { id: 'captured', durationMs: 5000 },
] as const

type Playback = { scene: number; phase: number; run: number }
const devStepStorageKey = 'swecompanion:dev-preview-step:v1'

function phaseDuration({ scene, phase }: Pick<Playback, 'scene' | 'phase'>): number {
  const step = phases[phase]
  if (workflows[scene].group !== 'Coding') return step.durationMs
  switch (step.id) {
    case 'problem': return scene === categories[0].firstScene ? 4000 : 1500
    case 'key': return 1800
    case 'stream': return 2200
    case 'answer': return 4000
    default: return step.durationMs
  }
}

function advancePlayback(playback: Playback): Playback {
  const nextScene = (playback.scene + 1) % workflows.length
  const codingContinues = workflows[playback.scene].group === 'Coding'
    && workflows[nextScene].group === 'Coding'
  // Show all three coding actions before revealing the shared screen once.
  if (playback.phase === phases.length - 1 || (phases[playback.phase].id === 'answer' && codingContinues)) {
    return { ...playback, scene: nextScene, phase: 0 }
  }
  return { ...playback, phase: playback.phase + 1 }
}

// Follow the same route as autoplay, including the single comparison after Coding.
const reviewSequence: Pick<Playback, 'scene' | 'phase'>[] = []
let reviewStep: Playback = { scene: 0, phase: 0, run: 0 }
do {
  reviewSequence.push({ scene: reviewStep.scene, phase: reviewStep.phase })
  reviewStep = advancePlayback(reviewStep)
} while (reviewStep.scene !== 0 || reviewStep.phase !== 0)

const phaseLabels: Record<(typeof phases)[number]['id'], string> = {
  problem: 'Problem', key: 'Key press', stream: 'Answer streaming', answer: 'Complete answer',
  scan: 'Scan to midpoint', compare: 'Side-by-side comparison', reveal: 'Finish reveal', captured: 'What others see',
}

const pythonTokens = /(#.*$|"[^"\n]*"|'[^'\n]*'|\b(?:def|return|if|elif|else|while|for|in|import|from|pass)\b|\b\d+\b)/g

function SourceCode({ workflow }: { workflow: Workflow }) {
  const lines = workflow.draft.split('\n')
  return (
    <div className={styles.sourceCode} role="textbox" aria-readonly="true" aria-multiline="true" aria-label={workflow.group === 'Coding' ? 'Candidate code, illustrated editor' : 'Candidate notes, illustrated editor'}>
      {lines.map((line, index) => (
        <div key={index} className={cn(styles.codeLine, index === lines.length - 1 && styles.currentLine)}>
          <span className={styles.lineNumber} aria-hidden>{index + 1}</span>
          <code>{workflow.group === 'Coding' ? line.split(pythonTokens).map((token, part) => (
            <span key={part} className={token.startsWith('#') ? styles.codeComment : /^("|')/.test(token) ? styles.codeString : /^(def|return|if|elif|else|while|for|in|import|from|pass)$/.test(token) ? styles.codeKeyword : /^\d+$/.test(token) ? styles.codeNumber : undefined}>{token}</span>
          )) : line}{!line && ' '}{index === lines.length - 1 && <span className={styles.editorCaret} aria-hidden />}</code>
        </div>
      ))}
    </div>
  )
}

function ProblemStatement({ workflow, captured }: { workflow: Workflow; captured: boolean }) {
  const pastedProblem = workflow.id === 'coding' || workflow.id === 'debug'
  return (
    <section className={styles.questionPanel}>
      <div className={styles.questionTabs}><span>Problem</span><span>Shared by interviewer</span></div>
      <div className={cn(styles.prompt, pastedProblem && styles.pastedProblem)}>
        {!pastedProblem && <div className={styles.questionMeta}><span>{workflow.difficulty}</span><span>{workflow.label}</span></div>}
        <h3>{workflow.title}</h3>
        <p>{workflow.problem}</p>
        {pastedProblem ? <>
          <RunoffExample />
          <div className={styles.runoffSecondExample}><strong>Example 2:</strong> [4,2,0,3,2,5] → 9 m³</div>
        </> : <div className={styles.input}>{workflow.examples.join('\n\n')}</div>}
        <div className={styles.constraintsRow}>
          <div className={styles.constraints}>
            <p><strong>{workflow.group === 'Coding' ? 'Constraints' : 'Requirements'}</strong></p>
            <ul>{workflow.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}</ul>
          </div>
          <MeetingParticipants captured={captured} mobile />
        </div>
        {!pastedProblem && <p><strong>{workflow.label}:</strong> {workflow.task}</p>}
      </div>
    </section>
  )
}

function Workspace({ workflow, captured, sessionTime }: { workflow: Workflow; captured: boolean; sessionTime: string }) {
  const coding = workflow.group === 'Coding'
  return (
    <div className={styles.browserWindow}>
      <div className={styles.browserTabs}>
        <span className={styles.trafficLights} aria-hidden><i /><i /><i /></span>
        <span className={styles.browserTab}><span className={styles.tabMark}>H</span>Live interview · HackerRank<span className={styles.tabClose} aria-hidden>×</span></span>
        <span className={styles.newTab} aria-hidden>+</span>
      </div>
      <div className={styles.addressBar}>
        <span className={styles.browserArrows} aria-hidden><ArrowLeft size={13} /><ArrowRight size={13} /><RotateCw size={12} /></span>
        <span className={styles.address}><LockKeyhole size={11} aria-hidden /><span>hackerrank.com/interview/demo-7f3a9c</span></span>
        <span className={cn(styles.browserProfile, captured && styles.interviewerProfile)} role="img" aria-label={captured ? 'Interviewer browser profile' : 'Candidate browser profile'}>{captured ? 'I' : 'C'}</span>
        <MoreHorizontal size={15} aria-hidden />
      </div>
      <div className={styles.hackerHeader}>
        <span className={styles.hackerLogo}>HackerRank<span aria-hidden>▮</span></span>
        <span className={styles.interviewName}>Live technical interview</span>
        {captured && <span className={styles.interviewerBadge}>Interviewer</span>}
        <span className={styles.connection}><i />Live<span className={styles.participantCount}> · 2 participants</span></span>
        <span className={styles.recordingBadge}><i />Recording</span>
        <span className={styles.interviewTimer}>{sessionTime}</span>
      </div>
      <div className={styles.interviewGrid}>
        <ProblemStatement workflow={workflow} captured={captured} />
        <section className={styles.codePanel} aria-label="Candidate answer editor">
          <div className={styles.editorToolbar}>
            <span><Code2 size={12} aria-hidden />{coding ? 'solution.py' : 'design.md'}</span>
            <span className={styles.language}>{coding ? 'Python 3' : 'Plain Text'}<ChevronDown size={11} aria-hidden /></span>
            <Settings2 size={12} aria-hidden />
          </div>
          <div className={styles.candidateHeading}>
            <span className={styles.candidateInitial} aria-hidden>C</span>
            <span>Candidate’s {coding ? 'code' : 'notes'}</span>
            <span className={styles.savedStatus}><><Users size={10} aria-hidden />Live sync</></span>
          </div>
          <div className={styles.candidateInput}>
            <SourceCode workflow={workflow} />
            <div className={styles.inputStatus}><span>{captured ? 'Viewing candidate live' : 'Shared live with interviewer'}</span><span>Ln {workflow.draft.split('\n').length}, Col {workflow.draft.split('\n').at(-1)!.length + 1}</span></div>
          </div>
          <div className={styles.runBar}>
            {captured ? <><span className={styles.testCases}>Interviewer tools</span><span className={styles.runCode}>Private notes</span><span className={styles.submitCode}>Scorecard</span></> : coding ? <><span className={styles.testCases}>Console<ChevronDown size={10} aria-hidden /></span>
              <span className={styles.runCode}><Play size={10} aria-hidden />Run code</span>
              <span className={styles.endInterview}>Leave interview</span></> : <><span className={styles.testCases}>Interview notes</span><span className={styles.runCode}>Whiteboard</span></>}
          </div>
          <div className={styles.editorStatus}><span>Live collaboration · changes synced</span><span>UTF-8</span><span>{coding ? 'Python' : 'Markdown'}</span></div>
        </section>
      </div>
    </div>
  )
}

function MeetingParticipants({ captured, mobile = false }: { captured: boolean; mobile?: boolean }) {
  return (
    <aside className={cn(styles.participants, mobile ? styles.mobileParticipants : styles.desktopParticipants)} aria-label="Illustrated Zoom floating video panel">
      <div className={styles.participantTitle} aria-hidden>
        <span className={styles.panelLayout}><Minus size={11} /><Square size={10} /><span className={styles.selectedLayout}><Rows2 size={12} /></span></span>
        <span className={styles.panelGrip}><i /><i /><i /><i /><i /><i /></span>
      </div>
      <div className={styles.videoTile}>
        <span className={styles.cameraOffName}>Interviewer</span>
        <span className={styles.tileOptions} aria-hidden><MoreHorizontal size={13} /></span>
        <span className={styles.participantName}><Mic size={11} aria-hidden />{captured ? 'Interviewer (me)' : 'Interviewer'}</span>
      </div>
      <div className={cn(styles.videoTile, styles.speakerTile)}>
        <span className={styles.cameraOffName}>Candidate</span>
        <span className={styles.tileOptions} aria-hidden><MoreHorizontal size={13} /></span>
        <span className={styles.participantName}><Mic size={11} aria-hidden />{captured ? 'Candidate' : 'Candidate (me)'}</span>
        <span className={styles.audioLevel} aria-hidden><i /><i /><i /></span>
      </div>
    </aside>
  )
}

function MeetingControls({ captured }: { captured: boolean }) {
  const tools = [
    { icon: Mic, label: 'Audio', menu: true },
    { icon: VideoOff, label: 'Video', menu: true, muted: true, divider: true },
    { icon: Users, label: 'Participants', menu: true, count: '2' },
    { icon: MessageSquare, label: 'Chat', menu: true },
    { icon: Smile, label: 'React', optional: true },
    { icon: ArrowUp, label: 'Share', menu: true, sharing: !captured },
    { icon: Circle, label: 'Recording', recording: true },
    ...(!captured ? [{ icon: Pause, label: 'Pause', optional: true }] : []),
    { icon: MoreHorizontal, label: 'More', optional: true },
  ]
  return (
    <div className={styles.zoomControls} aria-hidden>
      <div className={styles.toolbarGrip} />
      <div className={cn(styles.sharingStrip, captured && styles.viewingStrip)}>
        <span><Monitor size={12} />{captured ? "You are viewing Candidate’s screen" : 'You are screen sharing'}</span>
        <span className={captured ? styles.viewOptions : styles.stopShare}>{captured ? <>View options<ChevronDown size={10} /></> : <><Square size={8} fill="currentColor" />Stop share</>}</span>
      </div>
      <div className={styles.meetingTools}>
        {tools.map((tool) => {
          const { icon: Icon, label } = tool
          const optional = 'optional' in tool && tool.optional
          const muted = 'muted' in tool && tool.muted
          const sharing = 'sharing' in tool && tool.sharing
          return <span key={label} className={cn(styles.zoomTool, label === 'Chat' && styles.mobileHiddenTool, optional && styles.optionalTool, muted && styles.mutedControl, sharing && styles.sharingTool, 'recording' in tool && tool.recording && styles.recordingTool, 'divider' in tool && tool.divider && styles.toolDivider)}>
            <span className={styles.toolIconRow}>
              <span className={cn(styles.toolGlyph, label === 'Share' && styles.shareGlyph)}>
                <Icon size={22} strokeWidth={1.9} />
                {label === 'Audio' && !captured && <span className={styles.micLevel}><Mic size={22} strokeWidth={1.9} fill="currentColor" fillOpacity={0.45} /></span>}
              </span>
              {'count' in tool && <span className={styles.toolCount}>{tool.count}</span>}
              {'menu' in tool && tool.menu && <ChevronUp className={styles.toolChevron} size={9} />}
            </span>
            <span>{label}</span>
          </span>
        })}
        <span className={styles.leaveMeeting}>{captured ? 'End' : 'Leave'}</span>
      </div>
    </div>
  )
}

function DesktopView({ workflow, captured, sessionTime, children }: { workflow: Workflow; captured: boolean; sessionTime: string; children?: ReactNode }) {
  return (
    <div className={styles.desktopView}>
      <Workspace workflow={workflow} captured={captured} sessionTime={sessionTime} />
      <MeetingParticipants captured={captured} />
      <MeetingControls captured={captured} />
      {children}
    </div>
  )
}

function ViewLabel({ shared }: { shared: boolean }) {
  return (
    <div className={cn(styles.viewLabel, shared && styles.sharedLabel)}>
      {shared ? <Monitor size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
      <strong>{shared ? 'What others see' : 'Your screen'}</strong>
    </div>
  )
}

export function ProductDemo() {
  const [playback, setPlayback] = useState<Playback>({ scene: 0, phase: 0, run: 0 })
  const [reviewing, setReviewing] = useState(true)
  const [stepRestored, setStepRestored] = useState(process.env.NODE_ENV !== 'development')
  const [visible, setVisible] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(4 * 60 + 32)
  const sessionTime = `${Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:${(elapsedSeconds % 60).toString().padStart(2, '0')}`
  const container = useRef<HTMLDivElement>(null)
  const tabButtons = useRef<(HTMLButtonElement | null)[]>([])
  const generation = useRef(0)
  const remaining = useRef({ run: 0, durationMs: phaseDuration({ scene: 0, phase: 0 }) })
  const phase = phases[playback.phase]
  const workflow = workflows[playback.scene]
  const showingCapture = phase.id === 'scan' || phase.id === 'compare' || phase.id === 'reveal' || phase.id === 'captured'
  const comparing = phase.id === 'compare'
  const activeCategory = categories.findIndex((category) => category.group === workflow.group)
  const running = visible && !reviewing
  const stepIndex = reviewSequence.findIndex((step) => step.scene === playback.scene && step.phase === playback.phase)
  const splitting = showingCapture && phase.id !== 'captured'

  useLayoutEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(devStepStorageKey) ?? 'null')
      if (saved && typeof saved === 'object' && 'workflow' in saved && 'phase' in saved) {
        const restored = reviewSequence.find((step) => workflows[step.scene].id === saved.workflow && phases[step.phase].id === saved.phase)
        if (restored) {
          const run = ++generation.current
          remaining.current = { run, durationMs: phaseDuration(restored) }
          // Restore browser-local preview state after hydration.
          setPlayback({ ...restored, run })
        }
      }
    } catch {
      // Missing, invalid, or unavailable storage leaves the demo at its first step.
    }
    setStepRestored(true)
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || !stepRestored) return
    try {
      localStorage.setItem(devStepStorageKey, JSON.stringify({ workflow: workflow.id, phase: phase.id }))
    } catch {
      // Playback remains usable when local storage is blocked or full.
    }
  }, [stepRestored, workflow.id, phase.id])

  function selectCategory(index: number) {
    const run = ++generation.current
    remaining.current = { run, durationMs: phaseDuration({ scene: categories[index].firstScene, phase: 0 }) }
    setPlayback({ scene: categories[index].firstScene, phase: 0, run })
  }

  function seekStep(index: number) {
    const next = reviewSequence[(index + reviewSequence.length) % reviewSequence.length]
    const run = ++generation.current
    remaining.current = { run, durationMs: phaseDuration(next) }
    setReviewing(true)
    setPlayback({ ...next, run })
  }

  function toggleReview() {
    // Restart the current phase when resuming so its animation and clock stay aligned.
    if (reviewing) {
      const run = ++generation.current
      remaining.current = { run, durationMs: phaseDuration(playback) }
      setPlayback({ ...playback, run })
    }
    setReviewing(!reviewing)
  }

  useEffect(() => {
    if (!visible) return
    const interval = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(interval)
  }, [visible])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && document.visibilityState === 'visible')
    }, { threshold: 0.1 })
    if (container.current) observer.observe(container.current)
    const sync = () => {
      const bounds = container.current?.getBoundingClientRect()
      setVisible(document.visibilityState === 'visible' && Boolean(bounds && bounds.bottom > 0 && bounds.top < innerHeight))
    }
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync) }
  }, [])

  useEffect(() => {
    if (!running) return
    const clock = remaining.current
    if (clock.run !== playback.run) return
    const startedAt = performance.now()
    let finished = false
    const timeout = window.setTimeout(() => {
      if (remaining.current !== clock) return
      finished = true
      const next = advancePlayback(playback)
      clock.durationMs = phaseDuration(next)
      setPlayback(next)
    }, clock.durationMs)
    return () => {
      window.clearTimeout(timeout)
      // A category click creates its own clock; old effect cleanup cannot shorten it.
      if (!finished && remaining.current === clock) clock.durationMs = Math.max(0, clock.durationMs - (performance.now() - startedAt))
    }
  }, [running, playback])

  const timing = Object.fromEntries(phases.map((step, index) => [
    `--${step.id}-duration`, `${phaseDuration({ scene: playback.scene, phase: index })}ms`,
  ])) as CSSProperties

  return (
    <div id="demo" ref={container} className={cn("scroll-mt-24", styles.preview)} role="region" aria-roledescription="carousel" aria-label="Product walkthrough" aria-describedby="demo-summary">
      <p id="demo-summary" className="sr-only">
        Explore Solve, Debug, Improve, System Design, and ML System Design step by step, or choose Play demo to watch automatically.
        Each shows the entire concise problem, examples, and constraints without scrolling, an animated physical key press,
        and the complete companion answer. Coding uses shorter pauses and a 2.2-second example stream to move quickly through its three features.
        Design examples keep longer reading holds.
        Coding shows Solve, Debug, and Improve before a single screen-share comparison.
        System Design and ML System Design each have their own comparison.
        A scanning transition pauses halfway for six and a half seconds to compare your screen with an illustrated Zoom screen share of the same HackerRank page
        with no companion window. Category tabs jump to Coding, System Design, or ML System Design. Previous and Next move between steps; Pause returns to step-by-step mode.
      </p>
      <div className={styles.categoryTabs} role="tablist" aria-label="Preview category" style={{ '--active-category': activeCategory } as CSSProperties}>
        <span className={styles.categoryThumb} aria-hidden />
        {categories.map((category, index) => <button key={category.id} ref={(element) => { tabButtons.current[index] = element }}
          id={`demo-tab-${category.id}`} role="tab" type="button" aria-selected={activeCategory === index} aria-controls="demo-panel"
          tabIndex={activeCategory === index ? 0 : -1} onClick={() => selectCategory(index)}
          onKeyDown={(event) => {
            const next = event.key === 'ArrowRight' ? (index + 1) % categories.length
              : event.key === 'ArrowLeft' ? (index + categories.length - 1) % categories.length
                : event.key === 'Home' ? 0 : event.key === 'End' ? categories.length - 1 : -1
            if (next === -1) return
            event.preventDefault()
            selectCategory(next)
            tabButtons.current[next]?.focus()
          }}><span>{category.label}</span></button>)}
      </div>
      <div id="demo-panel" role="tabpanel" tabIndex={0} aria-labelledby={`demo-tab-${categories[activeCategory].id}`} className={styles.demo} data-scene={workflow.id} data-phase={phase.id} data-view={comparing ? 'comparison' : showingCapture ? 'capture' : 'private'} data-running={running} data-visible={visible} data-review={reviewing} style={{ ...timing, '--preview-play-state': running ? 'running' : 'paused' } as CSSProperties}
        onCopy={(event) => event.preventDefault()} onCut={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()} onContextMenu={(event) => event.preventDefault()}>
        <div className={styles.stage} aria-hidden="true" inert>
          {workflows.map((example, index) => {
            const active = playback.scene === index
            const showingAnswer = active && phase.id !== 'problem' && phase.id !== 'key' && phase.id !== 'captured'
            return (
              <div key={example.id} className={cn(styles.scene, active && styles.activeScene)} aria-hidden={!active} inert={!active}>
                <DesktopView workflow={example} captured={false} sessionTime={sessionTime}>
                  <div className={cn(styles.solutionLayer, showingAnswer && styles.answerVisible)} aria-hidden={!showingAnswer}>
                    <div className={styles.nativeWindow}>
                      <CompanionPreview key={active && phase.id === 'stream' ? playback.run : 'complete'} workflow={example.id} streaming={active && phase.id === 'stream'} running={visible && active} streamDurationMs={phaseDuration({ scene: index, phase: 2 })} />
                    </div>
                  </div>
                </DesktopView>
                <div className={styles.captureView} aria-hidden>
                  <DesktopView workflow={example} captured sessionTime={sessionTime} />
                </div>
              </div>
            )
          })}

          {showingCapture && phase.id !== 'captured' && <div className={styles.scanBeam} aria-hidden />}
          {splitting ? <div className={styles.comparisonLabels} aria-hidden>
            <ViewLabel shared /><ViewLabel shared={false} />
          </div> : phase.id !== 'key' && <div className={styles.singleViewLabel} aria-hidden><ViewLabel shared={phase.id === 'captured'} /></div>}
          {phase.id === 'key' && (
            <div key={playback.run} className={styles.keyOverlay} aria-hidden>
              <div className={styles.keyPrompt}>
                Press <strong>{workflow.key}</strong> to {workflow.id === 'debug' ? 'debug' : workflow.id === 'optimize' ? 'optimize' : 'solve'}
              </div>
              <div className={styles.keyboardAction}>
                <div className={styles.keyboardDeck}>
                  {['F2', 'F3', 'F4'].map((key) => (
                    <span key={key} className={styles.keySlot}>
                      <kbd className={key === workflow.key ? styles.pressedKey : styles.neighborKey}>{key}</kbd>
                      {key === workflow.key && <Pointer className={styles.pressFinger} size={42} strokeWidth={1.6} />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.playbackControls} role="group" aria-label="Demo playback controls">
        <div className={styles.playbackHeading}>
          <span className={styles.playbackBadge}>{reviewing ? 'Step by step' : 'Autoplay'}</span>
          <span className={styles.playbackStatus} aria-live="polite" aria-atomic="true">
            Step {stepIndex + 1} of {reviewSequence.length} · {workflow.label} · {phaseLabels[phase.id]}
          </span>
        </div>
        <div className={styles.playbackActions}>
          <button type="button" onClick={() => seekStep(stepIndex - 1)}><ArrowLeft size={14} aria-hidden />Previous step</button>
          <button type="button" onClick={toggleReview} aria-pressed={!reviewing}>
            {reviewing ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
            {reviewing ? 'Play demo' : 'Pause'}
          </button>
          <button type="button" onClick={() => seekStep(stepIndex + 1)}>Next step<ArrowRight size={14} aria-hidden /></button>
          <button type="button" onClick={() => seekStep(0)}><RotateCw size={14} aria-hidden />Restart</button>
          {process.env.NODE_ENV === 'development' && (
            <form className={styles.stepJump} onSubmit={(event) => {
              event.preventDefault()
              const value = new FormData(event.currentTarget).get('step')
              const step = Number(value)
              if (Number.isInteger(step) && step >= 1 && step <= reviewSequence.length) seekStep(step - 1)
            }}>
              <label>
                Jump to step
                <input name="step" type="number" min={1} max={reviewSequence.length} step={1} required placeholder={String(stepIndex + 1)} />
              </label>
              <button type="submit">Go</button>
            </form>
          )}
        </div>
        <p>{reviewing ? 'Explore at your own pace, or press Play demo to watch it unfold.' : 'Playing automatically. Pause or choose a step to explore at your own pace.'}</p>
      </div>
    </div>
  )
}
