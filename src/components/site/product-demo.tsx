'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ArrowUp, Check, ChevronDown, ChevronUp, Code2, Eye, EyeOff, LockKeyhole, MessageSquare, Mic, MicOff, Monitor, MoreHorizontal, Minus, Pause, Play, Pointer, Rows2, RotateCw, Settings2, Smile, Square, Users, VideoOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import captures from '../../../public/previews/manifest.json'
import styles from './product-demo.module.css'

const rainWaterProblem = 'Given non-negative bar heights, each one unit wide, return the total water trapped after rain.'
const rainWaterExamples = ['[0,1,0,2,1,0,1,3,2,1,2,1] → 6', '[4,2,0,3,2,5] → 9']
const rainWaterConstraints = ['1 ≤ height.length ≤ 20,000; 0 ≤ height[i] ≤ 100,000.']

const workflows = [
  {
    id: 'coding', group: 'Coding', label: 'Solve', title: 'Trapping Rain Water — LeetCode 42', key: 'F2',
    description: 'Generate the complete solution, code, and complexity.',
    difficulty: 'Hard', problem: rainWaterProblem, examples: rainWaterExamples, constraints: rainWaterConstraints,
    task: "Solve in O(n) time and O(1) extra space.",
    draft: "def trap(height):\n    pass",
    alt: "Native Trapping Rain Water answer with two pointers, complete Python code, explanation, and complexity.",
  },
  {
    id: 'debug', group: 'Coding', label: 'Debug', title: 'Trapping Rain Water — LeetCode 42', key: 'F3',
    description: 'Find two bugs and show both fixes.',
    difficulty: 'Hard', problem: rainWaterProblem, examples: rainWaterExamples, constraints: rainWaterConstraints,
    task: "Fix both marked bugs: accumulate water; preserve the right maximum.",
    draft: "def trap(height):\n    left, right = 0, len(height) - 1\n    left_max = right_max = water = 0\n    while left < right:\n        if height[left] <= height[right]:\n            left_max = max(left_max, height[left])\n            water = left_max - height[left]  # BUG 1\n            left += 1\n        else:\n            right_max = min(right_max, height[right])  # BUG 2\n            water += right_max - height[right]\n            right -= 1\n    return water",
    alt: "Native debugging answer with two numbered bugs and both corrected lines: accumulate water and use max for the right boundary.",
  },
  {
    id: 'optimize', group: 'Coding', label: 'Improve', title: 'Trapping Rain Water — LeetCode 42', key: 'F4',
    description: 'Show two improvements: faster code and less memory.',
    difficulty: 'Hard', problem: rainWaterProblem, examples: rainWaterExamples, constraints: rainWaterConstraints,
    task: "1. O(n²) → O(n) time. 2. O(n) → O(1) extra space.",
    draft: "def trap(height):\n    water = 0\n    for i in range(1, len(height) - 1):\n        # 1. Repeated max scans: O(n²) time\n        # 2. Slices allocate O(n) extra space\n        left_max = max(height[:i + 1])\n        right_max = max(height[i:])\n        water += min(left_max, right_max) - height[i]\n    return water",
    alt: "Native improvement answer with two numbered gains: eliminate repeated scans and slice allocations using two pointers.",
  },
  {
    id: 'system-design', group: 'System design', label: 'System design', title: 'Ticket booking — Ticketmaster', key: 'F2',
    description: 'Design the architecture, data flow, and failure handling.',
    difficulty: 'Architecture',
    problem: 'Design a service to discover events, view available seats, hold seats for 5 minutes, pay, and receive tickets.',
    examples: ['Two fans select the same seat → only one gets the hold', 'Payment retry → one booking, one charge'],
    constraints: ['1 million fans arrive for a 50,000-seat event. Never sell the same seat twice. Handle expired holds, payment failures, and traffic spikes.'],
    task: 'Show the architecture, booking data, and failure handling.',
    draft: '1M fans · 50,000 seats\n\nBrowse → select → hold → pay → ticket\nHold expires after 5 minutes\nOne seat → one confirmed booking\nPayment retries must be safe',
    alt: 'Native Ticketmaster design with a waiting room, atomic seat holds, idempotent payments, ticket delivery, and architecture diagram.',
  },
  {
    id: 'ml-design', group: 'ML system design', label: 'ML design', title: 'Classify Multilingual Support Messages', key: 'F2',
    description: 'Plan the data, model, training, and serving architecture.',
    difficulty: 'ML architecture',
    problem: 'Build a multilingual system that predicts every applicable issue among 150 stable categories from a support message. A message may contain several issues or mixed languages.',
    examples: ['“Charged twice; impossible de me connecter.”\n→ Duplicate charge + login issue, each with a score'],
    constraints: ['Return scored labels, review if uncertain, or no known label. Distinguish unknown issues from low confidence.'],
    task: 'Cover data, model, training, decision thresholds, evaluation, and serving.',
    draft: '150 stable categories · multiple labels\nMultilingual and mixed-language input\n\nOutput: labels + confidence scores\nUncertain → human review\nUnknown → no known label',
    alt: 'Complete concise native multilingual classification design with data, model, training, calibration, evaluation, and serving diagram.',
  },
] as const

type Workflow = (typeof workflows)[number]

const categories = [
  { id: 'coding', label: 'Coding', group: 'Coding', firstScene: 0 },
  { id: 'system-design', label: 'System Design', group: 'System design', firstScene: 3 },
  { id: 'ml-design', label: 'ML System Design', group: 'ML system design', firstScene: 4 },
] as const

// Each workflow plays automatically; category tabs can restart a different one.
const phases = [
  { id: 'problem', durationMs: 12000 },
  { id: 'key', durationMs: 1400 },
  { id: 'stream', durationMs: 3000 },
  { id: 'answer', durationMs: 8000 },
  { id: 'scan', durationMs: 1800 },
  { id: 'compare', durationMs: 6500 },
  { id: 'reveal', durationMs: 1400 },
  { id: 'captured', durationMs: 5000 },
] as const

type Playback = { scene: number; phase: number; run: number }

function phaseDuration({ scene, phase }: Pick<Playback, 'scene' | 'phase'>): number {
  const step = phases[phase]
  if (workflows[scene].group !== 'Coding') return step.durationMs
  switch (step.id) {
    case 'problem': return scene === categories[0].firstScene ? 4000 : 1500
    case 'key': return 1000
    case 'stream': return 1600
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

function ProblemStatement({ workflow }: { workflow: Workflow }) {
  return (
    <section className={styles.questionPanel}>
      <div className={styles.questionTabs}><span>Problem</span><span>Notes</span></div>
      <div className={styles.prompt}>
        <div className={styles.questionMeta}><span>{workflow.difficulty}</span><span>{workflow.label}</span></div>
        <h3>{workflow.title}</h3>
        <p>{workflow.problem}</p>
        <div className={styles.input}>{workflow.examples.join('\n')}</div>
        <p className={styles.constraints}><strong>{workflow.group === 'Coding' ? 'Constraints' : 'Requirements'}:</strong> {workflow.constraints.join(' ')}</p>
        <p><strong>{workflow.label}:</strong> {workflow.task}</p>
      </div>
    </section>
  )
}

function Workspace({ workflow, captured }: { workflow: Workflow; captured: boolean }) {
  const coding = workflow.group === 'Coding'
  return (
    <div className={styles.browserWindow}>
      <div className={styles.browserTabs}>
        <span className={styles.trafficLights} aria-hidden><i /><i /><i /></span>
        <span className={styles.browserTab}><span className={styles.tabMark}>H</span>{captured ? 'Interviewer workspace' : 'Technical interview'} · HackerRank<span className={styles.tabClose} aria-hidden>×</span></span>
        <span className={styles.newTab} aria-hidden>+</span>
      </div>
      <div className={styles.addressBar}>
        <span className={styles.browserArrows} aria-hidden><ArrowLeft size={13} /><ArrowRight size={13} /><RotateCw size={12} /></span>
        <span className={styles.address}><LockKeyhole size={11} aria-hidden />hackerrank.com</span>
        <span className={cn(styles.browserProfile, captured && styles.interviewerProfile)} role="img" aria-label={captured ? 'Interviewer browser profile' : 'Candidate browser profile'}>{captured ? 'I' : 'C'}</span>
        <MoreHorizontal size={15} aria-hidden />
      </div>
      <div className={styles.hackerHeader}>
        <span className={styles.hackerLogo}>HackerRank<span aria-hidden>▮</span></span>
        <span className={styles.interviewName}>{captured ? 'Interviewer workspace' : 'Technical interview'}</span>
        {captured && <span className={styles.interviewerBadge}>Interviewer</span>}
        <span className={styles.connection}><i />{captured ? 'Candidate connected' : 'Connected'}</span>
        <span className={styles.interviewTimer}>38:42</span>
      </div>
      <div className={styles.interviewGrid}>
        <ProblemStatement workflow={workflow} />
        <section className={styles.codePanel} aria-label="Candidate answer editor">
          <div className={styles.editorToolbar}>
            <span><Code2 size={12} aria-hidden />{coding ? 'solution.py' : 'design.md'}</span>
            <span className={styles.language}>{coding ? 'Python 3' : 'Plain Text'}<ChevronDown size={11} aria-hidden /></span>
            <Settings2 size={12} aria-hidden />
          </div>
          <div className={styles.candidateHeading}>
            <span className={styles.candidateInitial} aria-hidden>C</span>
            <span>Candidate’s {coding ? 'code' : 'notes'}</span>
            <span className={styles.savedStatus}>{captured ? <><Monitor size={10} aria-hidden />Live</> : <><Check size={10} aria-hidden />Saved</>}</span>
          </div>
          <div className={styles.candidateInput}>
            <SourceCode workflow={workflow} />
            <div className={styles.inputStatus}><span>{captured ? 'Viewing candidate’s work' : coding ? 'Write your solution here' : 'Write your approach here'}</span><span>Ln {workflow.draft.split('\n').length}, Col {workflow.draft.split('\n').at(-1)!.length + 1}</span></div>
          </div>
          <div className={styles.runBar}>
            {captured ? <><span className={styles.testCases}>Interviewer tools</span><span className={styles.runCode}>Private notes</span><span className={styles.submitCode}>Scorecard</span></> : coding ? <><span className={styles.testCases}>Test cases<ChevronDown size={10} aria-hidden /></span>
              <span className={styles.runCode}><Play size={10} aria-hidden />Run code</span>
              <span className={styles.submitCode}>Submit code</span></> : <><span className={styles.testCases}>Interview notes</span><span className={styles.runCode}>Whiteboard</span></>}
          </div>
          <div className={styles.editorStatus}><span>Changes saved automatically</span><span>UTF-8</span><span>{coding ? 'Python' : 'Markdown'}</span></div>
        </section>
      </div>
    </div>
  )
}

function MeetingParticipants({ captured }: { captured: boolean }) {
  return (
    <aside className={styles.participants} aria-label="Illustrated Zoom floating video panel">
      <div className={styles.participantTitle} aria-hidden>
        <span className={styles.panelLayout}><Minus size={11} /><Square size={10} /><span className={styles.selectedLayout}><Rows2 size={12} /></span></span>
        <span className={styles.panelGrip}><i /><i /><i /><i /><i /><i /></span>
      </div>
      <div className={cn(styles.videoTile, styles.speakerTile)}>
        <span className={styles.cameraOffName}>Interviewer</span>
        <span className={styles.tileOptions} aria-hidden><MoreHorizontal size={13} /></span>
        <span className={styles.participantName}><Mic size={11} aria-hidden />{captured ? 'Interviewer (me)' : 'Interviewer'}</span>
        <span className={styles.audioLevel} aria-hidden><i /><i /><i /></span>
      </div>
      <div className={styles.videoTile}>
        <span className={styles.cameraOffName}>Candidate</span>
        <span className={styles.tileOptions} aria-hidden><MoreHorizontal size={13} /></span>
        <span className={styles.participantName}><MicOff size={11} className={styles.mutedMic} aria-hidden />{captured ? 'Candidate' : 'Candidate (me)'}</span>
      </div>
    </aside>
  )
}

function MeetingControls({ captured }: { captured: boolean }) {
  const tools = [
    { icon: captured ? Mic : MicOff, label: 'Audio', menu: true, muted: !captured },
    { icon: VideoOff, label: 'Video', menu: true, muted: true, divider: true },
    { icon: Users, label: 'Participants', menu: true, count: '2' },
    { icon: MessageSquare, label: 'Chat', menu: true },
    { icon: Smile, label: 'React', optional: true },
    { icon: ArrowUp, label: 'Share', menu: true, sharing: !captured },
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
          return <span key={label} className={cn(styles.zoomTool, optional && styles.optionalTool, muted && styles.mutedControl, sharing && styles.sharingTool, 'divider' in tool && tool.divider && styles.toolDivider)}>
            <span className={styles.toolIconRow}>
              <span className={cn(styles.toolGlyph, label === 'Share' && styles.shareGlyph)}><Icon size={22} strokeWidth={1.9} /></span>
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

function DesktopView({ workflow, captured, children }: { workflow: Workflow; captured: boolean; children?: ReactNode }) {
  return (
    <div className={styles.desktopView}>
      <Workspace workflow={workflow} captured={captured} />
      <MeetingParticipants captured={captured} />
      <MeetingControls captured={captured} />
      {children}
    </div>
  )
}

function ViewLabel({ shared, hasAnswer }: { shared: boolean; hasAnswer: boolean }) {
  return (
    <div className={cn(styles.viewLabel, shared && styles.sharedLabel)}>
      {shared ? <Monitor size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
      <div><strong>{shared ? 'SCREEN SHARE' : 'YOUR SCREEN'}</strong>
        <span>{shared && <EyeOff size={11} aria-hidden />}{shared ? 'Hidden from interviewer' : hasAnswer ? 'Visible only to you' : 'Your candidate desktop'}</span>
      </div>
    </div>
  )
}

export function ProductDemo() {
  const [playback, setPlayback] = useState<Playback>({ scene: 0, phase: 0, run: 0 })
  const [visible, setVisible] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const tabButtons = useRef<(HTMLButtonElement | null)[]>([])
  const generation = useRef(0)
  const remaining = useRef({ run: 0, durationMs: phaseDuration({ scene: 0, phase: 0 }) })
  const phase = phases[playback.phase]
  const workflow = workflows[playback.scene]
  const showingCapture = phase.id === 'scan' || phase.id === 'compare' || phase.id === 'reveal' || phase.id === 'captured'
  const comparing = phase.id === 'compare'
  const activeCategory = categories.findIndex((category) => category.group === workflow.group)
  const splitting = showingCapture && phase.id !== 'captured'
  const hasAnswer = phase.id !== 'problem' && phase.id !== 'key'

  function selectCategory(index: number) {
    const run = ++generation.current
    remaining.current = { run, durationMs: phaseDuration({ scene: categories[index].firstScene, phase: 0 }) }
    setPlayback({ scene: categories[index].firstScene, phase: 0, run })
  }

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
    if (!visible) return
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
  }, [visible, playback])

  const timing = Object.fromEntries(phases.map((step, index) => [
    `--${step.id}-duration`, `${phaseDuration({ scene: playback.scene, phase: index })}ms`,
  ])) as CSSProperties
  const keyNumber = Number(workflow.key.slice(1))

  return (
    <div id="demo" ref={container} className="scroll-mt-24" role="region" aria-roledescription="carousel" aria-label="Product walkthrough" aria-describedby="demo-summary">
      <p id="demo-summary" className="sr-only">
        Solve, debug, improve, system design, and ML system design play automatically in sequence.
        Each shows the entire concise problem, examples, and constraints without scrolling, an animated physical key press,
        and the complete native answer. Coding uses shorter pauses and a 1.6-second example stream to move quickly through its three features.
        Design examples keep longer reading holds.
        Coding shows Solve, Debug, and Improve before a single screen-share comparison.
        System Design and ML System Design each have their own comparison.
        A scanning transition pauses halfway for six and a half seconds to compare your screen with an illustrated Zoom screen share of the same HackerRank page
        with no companion window. Category tabs can jump to Coding, System Design, or ML System Design; playback otherwise continues automatically.
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
      <div className={styles.featureCaption} aria-live="polite" aria-atomic="true">
        <strong>{workflow.label}</strong><span>{workflow.description}</span>
      </div>
      <div id="demo-panel" role="tabpanel" tabIndex={0} aria-labelledby={`demo-tab-${categories[activeCategory].id}`} className={styles.demo} data-scene={workflow.id} data-phase={phase.id} data-view={comparing ? 'comparison' : showingCapture ? 'capture' : 'private'} data-running={visible} style={timing}>
        <div className={styles.stage}>
          {workflows.map((example, index) => {
            const active = playback.scene === index
            const showingAnswer = active && phase.id !== 'problem' && phase.id !== 'key' && phase.id !== 'captured'
            const desktop = captures[example.id]
            const mobile = captures[`${example.id}-mobile`]
            const captureRevision = example.id === 'system-design' ? '?v=ticketmaster-2' : ''
            return (
              <div key={example.id} className={cn(styles.scene, active && styles.activeScene)} aria-hidden={!active} inert={!active}>
                <DesktopView workflow={example} captured={false}>
                  <div className={cn(styles.solutionLayer, showingAnswer && styles.answerVisible)} aria-hidden={!showingAnswer}>
                    <div className={styles.nativeWindow} style={{
                      '--desktop-ratio': desktop.width / desktop.height,
                      '--mobile-ratio': mobile.width / mobile.height,
                    } as CSSProperties}>
                      <picture>
                        <source media="(max-width: 639px)" srcSet={`/previews/${example.id}-mobile.webp${captureRevision}`} />
                        <Image src={`/previews/${example.id}.webp${captureRevision}`} alt={example.alt}
                          width={desktop.width} height={desktop.height} draggable={false}
                          loading="eager" fetchPriority={index === 0 ? 'high' : 'auto'}
                          className={cn(styles.capture, active && phase.id === 'stream' && styles.streaming)} />
                      </picture>
                    </div>
                  </div>
                </DesktopView>
                <div className={styles.captureView} aria-hidden>
                  <DesktopView workflow={example} captured />
                </div>
              </div>
            )
          })}

          {showingCapture && phase.id !== 'captured' && <div className={styles.scanBeam} aria-hidden />}
          {splitting ? <div className={styles.comparisonLabels} aria-hidden>
            <ViewLabel shared hasAnswer={false} /><ViewLabel shared={false} hasAnswer />
          </div> : phase.id !== 'key' && <div className={styles.singleViewLabel} aria-hidden><ViewLabel shared={phase.id === 'captured'} hasAnswer={hasAnswer} /></div>}
          {phase.id === 'key' && (
            <div className={styles.keyOverlay} aria-hidden>
              <div className={styles.keyboardAction}>
                <div className={styles.keyboardDeck}>
                  <span className={styles.neighborKey}>F{keyNumber - 1}</span>
                  <kbd className={styles.pressedKey}>{workflow.key}</kbd>
                  <span className={styles.neighborKey}>F{keyNumber + 1}</span>
                </div>
                <Pointer className={styles.pressFinger} size={42} strokeWidth={1.6} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
