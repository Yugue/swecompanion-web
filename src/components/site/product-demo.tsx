'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Code2, Eye, EyeOff, LockKeyhole, MessageSquare, Mic, MicOff, Monitor, MoreHorizontal, Play, Pointer, RotateCw, Settings2, ShieldCheck, Smile, SquareArrowUp, Users, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import captures from '../../../public/previews/manifest.json'
import styles from './product-demo.module.css'

const substringProblem = 'Given s, return the length of its longest contiguous substring with no repeated characters.'
const substringExamples = ['s = "abcabcbb" → 3 ("abc")', 's = "abba" → 2 ("ab" or "ba")']
const substringConstraints = ['0 ≤ s.length ≤ 50,000; any characters; empty → 0.']

const workflows = [
  {
    id: 'coding', group: 'Coding', label: 'Solve', title: 'Longest Substring Without Repeating Characters', key: 'F2',
    difficulty: 'Medium', problem: substringProblem, examples: substringExamples, constraints: substringConstraints,
    task: 'Implement the function in O(n) time.',
    draft: 'def length_of_longest_substring(s):\n    pass',
    alt: 'Complete native sliding-window solution to Longest Substring Without Repeating Characters, with explanation, Python code, and complexity.',
  },
  {
    id: 'debug', group: 'Coding', label: 'Debug', title: 'Longest Substring Without Repeating Characters', key: 'F3',
    difficulty: 'Medium', problem: substringProblem, examples: substringExamples, constraints: substringConstraints,
    task: 'Fix "abba": expected 2, current 3. Keep O(n) time.',
    draft: 'def length_of_longest_substring(s):\n    last = {}\n    left = best = 0\n    for right, ch in enumerate(s):\n        left = last.get(ch, -1) + 1\n        last[ch] = right\n        best = max(best, right - left + 1)\n    return best',
    alt: 'Complete native debugging answer identifying a backward-moving window boundary, with corrected Python code and complexity.',
  },
  {
    id: 'optimize', group: 'Coding', label: 'Optimize', title: 'Longest Substring Without Repeating Characters', key: 'F4',
    difficulty: 'Medium', problem: substringProblem, examples: substringExamples, constraints: substringConstraints,
    task: 'Replace repeated scans with O(n) time.',
    draft: 'def length_of_longest_substring(s):\n    best = 0\n    for start in range(len(s)):\n        seen = set()\n        for end in range(start, len(s)):\n            if s[end] in seen: break\n            seen.add(s[end])\n            best = max(best, end - start + 1)\n    return best',
    alt: 'Complete native optimization answer replacing repeated scans with one sliding window, including full Python code and complexity comparison.',
  },
  {
    id: 'system-design', group: 'System design', label: 'System design', title: 'Design an API Rate Limiter', key: 'F2',
    difficulty: 'Architecture',
    problem: 'Design a distributed rate limiter for stateless API gateways. Allow at most 100 requests per API key in any rolling 60 seconds, including concurrent requests across gateways.',
    examples: ['100 recent requests → next request gets 429 + Retry-After', 'Cannot verify the limit → return 503'],
    constraints: ['50,000 requests/s. Added p95 latency ≤ 5 ms. Preserve the limit during failover.'],
    task: 'Show the request path, atomic decision, shared state, scaling, and failure handling.',
    draft: 'API key → 100 requests / rolling 60 s\n50,000 requests/s · p95 ≤ 5 ms\n\nDecisions: allow / 429 / 503\nShared state across gateways\nStrict limit during failover',
    alt: 'Complete concise native rate-limiter design with atomic admission, scaling, strict failover behavior, and architecture diagram.',
  },
  {
    id: 'ml-design', group: 'ML system design', label: 'ML design', title: 'Classify Multilingual Support Messages', key: 'F2',
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
    <aside className={styles.participants} aria-label="Illustrated Zoom participants">
      <div className={styles.participantTitle}><span className={styles.zoomWordmark}>zoom</span><span>2 participants</span></div>
      <div className={cn(styles.videoTile, styles.speakerTile)}>
        <span className={styles.participantAvatar}>I</span>
        <span className={styles.participantName}><Mic size={10} aria-hidden />{captured ? 'You · Host' : 'Interviewer'}</span>
        <span className={styles.audioLevel} aria-hidden><i /><i /><i /></span>
      </div>
      <div className={styles.videoTile}>
        <span className={cn(styles.participantAvatar, styles.candidateAvatar)}>C</span>
        <span className={styles.participantName}><MicOff size={10} aria-hidden />{captured ? 'Candidate' : 'You'}</span>
      </div>
    </aside>
  )
}

const zoomTools = [
  { icon: Mic, label: 'Audio' },
  { icon: Video, label: 'Video' },
  { icon: ShieldCheck, label: 'Security', optional: true },
  { icon: Users, label: 'Participants' },
  { icon: MessageSquare, label: 'Chat' },
  { icon: SquareArrowUp, label: 'Share', sharing: true },
  { icon: Smile, label: 'Reactions', optional: true },
  { icon: MoreHorizontal, label: 'More', optional: true },
]

function MeetingControls({ captured }: { captured: boolean }) {
  return (
    <div className={styles.zoomControls} aria-hidden>
      <div className={styles.sharingStrip}>
        <span><Monitor size={12} />{captured ? "You are viewing Candidate’s screen" : 'You are screen sharing'}</span>
        <span className={captured ? styles.viewOptions : styles.stopShare}>{captured ? <>View options<ChevronDown size={10} /></> : 'Stop share'}</span>
      </div>
      <div className={styles.meetingTools}>
        {zoomTools.map(({ icon: Icon, label, optional, sharing }) => (
          <span key={label} className={cn(styles.zoomTool, optional && styles.optionalTool, sharing && !captured && styles.sharingTool)}><Icon size={19} strokeWidth={1.7} /><span>{label}</span></span>
        ))}
        <span className={styles.leaveMeeting}>Leave</span>
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
  const [playback, setPlayback] = useState({ scene: 0, phase: 0, run: 0 })
  const [visible, setVisible] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const tabButtons = useRef<(HTMLButtonElement | null)[]>([])
  const generation = useRef(0)
  const remaining = useRef({ run: 0, durationMs: Number(phases[0].durationMs) })
  const phase = phases[playback.phase]
  const workflow = workflows[playback.scene]
  const showingCapture = phase.id === 'scan' || phase.id === 'compare' || phase.id === 'reveal' || phase.id === 'captured'
  const comparing = phase.id === 'compare'
  const activeCategory = categories.findIndex((category) => category.group === workflow.group)
  const splitting = showingCapture && phase.id !== 'captured'
  const hasAnswer = phase.id !== 'problem' && phase.id !== 'key'

  function selectCategory(index: number) {
    const run = ++generation.current
    remaining.current = { run, durationMs: phases[0].durationMs }
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
      const next = playback.phase === phases.length - 1
        ? { ...playback, scene: (playback.scene + 1) % workflows.length, phase: 0 }
        : { ...playback, phase: playback.phase + 1 }
      clock.durationMs = phases[next.phase].durationMs
      setPlayback(next)
    }, clock.durationMs)
    return () => {
      window.clearTimeout(timeout)
      // A category click creates its own clock; old effect cleanup cannot shorten it.
      if (!finished && remaining.current === clock) clock.durationMs = Math.max(0, clock.durationMs - (performance.now() - startedAt))
    }
  }, [visible, playback])

  const timing = Object.fromEntries(phases.map((step) => [
    `--${step.id}-duration`, `${step.durationMs}ms`,
  ])) as CSSProperties

  return (
    <div id="demo" ref={container} className="scroll-mt-24" role="region" aria-roledescription="carousel" aria-label="Product walkthrough" aria-describedby="demo-summary">
      <p id="demo-summary" className="sr-only">
        Solve, debug, optimize, system design, and ML system design play automatically in sequence.
        Each shows the entire concise problem, examples, and constraints at once for twelve seconds, without scrolling,
        an animated physical key press, and the native answer streaming for three seconds, followed by eight seconds to read the complete answer.
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
      <div id="demo-panel" role="tabpanel" tabIndex={0} aria-labelledby={`demo-tab-${categories[activeCategory].id}`} className={styles.demo} data-scene={workflow.id} data-phase={phase.id} data-view={comparing ? 'comparison' : showingCapture ? 'capture' : 'private'} data-running={visible} style={timing}>
        <div className={styles.stage}>
          {workflows.map((example, index) => {
            const active = playback.scene === index
            const showingAnswer = active && phase.id !== 'problem' && phase.id !== 'key' && phase.id !== 'captured'
            const desktop = captures[example.id]
            const mobile = captures[`${example.id}-mobile`]
            return (
              <div key={example.id} className={cn(styles.scene, active && styles.activeScene)} aria-hidden={!active} inert={!active}>
                <DesktopView workflow={example} captured={false}>
                  <div className={cn(styles.solutionLayer, showingAnswer && styles.answerVisible)} aria-hidden={!showingAnswer}>
                    <div className={styles.nativeWindow} style={{
                      '--desktop-ratio': desktop.width / desktop.height,
                      '--mobile-ratio': mobile.width / mobile.height,
                    } as CSSProperties}>
                      <picture>
                        <source media="(max-width: 639px)" srcSet={`/previews/${example.id}-mobile.webp`} />
                        <Image src={`/previews/${example.id}.webp`} alt={example.alt}
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
                  {(['F2', 'F3', 'F4'] as const).map((key) => (
                    <kbd key={key} className={key === workflow.key ? styles.pressedKey : styles.neighborKey}
                      style={key === workflow.key ? { position: 'relative' } : undefined}>
                      {key}
                      {key === workflow.key && <Pointer className={styles.pressFinger} size={42} strokeWidth={1.6} />}
                    </kbd>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
