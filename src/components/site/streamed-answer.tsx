'use client'

import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './companion-preview.module.css'

// Answer builders supply native elements so text can stream without losing formatting.
function textLength(content: ReactNode): number {
  return Children.toArray(content).reduce<number>((total, node) => {
    if (typeof node === 'string' || typeof node === 'number') return total + Array.from(String(node)).length
    return total + (isValidElement<{ children?: ReactNode }>(node) ? textLength(node.props.children) : 0)
  }, 0)
}

function textPrefix(content: ReactNode, budget: { remaining: number }): ReactNode {
  return Children.map(content, (node) => {
    if (budget.remaining <= 0) return null
    if (typeof node === 'string' || typeof node === 'number') {
      const characters = Array.from(String(node))
      const taken = Math.min(characters.length, budget.remaining)
      budget.remaining -= taken
      const text = characters.slice(0, taken).join('')
      return budget.remaining === 0
        ? <>{text}<span className={styles.streamCursor} aria-hidden /></>
        : text
    }
    if (!isValidElement<{ children?: ReactNode }>(node)) return node
    const children = textPrefix(node.props.children, budget)
    return cloneElement(node, {}, children)
  })
}

export function StreamedAnswer({ children, durationMs, running }: {
  children: ReactNode
  durationMs: number
  running: boolean
}) {
  const total = textLength(children)
  const [visibleCharacters, setVisibleCharacters] = useState(0)
  const elapsed = useRef(0)

  useEffect(() => {
    if (!running) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const started = performance.now()
    const previousElapsed = elapsed.current
    let frame: number
    function tick(now: number) {
      elapsed.current = Math.min(durationMs, previousElapsed + now - started)
      // Emit small chunks rather than revealing rows or clipping the answer window.
      const progress = reduceMotion ? 1 : elapsed.current / durationMs
      setVisibleCharacters(progress >= 1 ? total : Math.floor(total * progress / 6) * 6)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame) }
  }, [running, durationMs, total])

  return <div className={styles.streamLayout}>
    <div className={styles.streamMeasure} aria-hidden>{children}</div>
    <div className={styles.streamOutput}>
      {visibleCharacters >= total ? children : visibleCharacters === 0
        ? <span className={styles.streamCursor} aria-hidden />
        : textPrefix(children, { remaining: visibleCharacters })}
    </div>
  </div>
}
