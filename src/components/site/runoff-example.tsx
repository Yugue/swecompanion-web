import type { CSSProperties } from 'react'
import styles from './product-demo.module.css'

export const runoffHeights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]

// One square is a 1 m × 1 m × 1 m volume, with runoff escaping at either end.
const waterCells = runoffHeights.flatMap((height, index) => {
  const level = Math.min(Math.max(...runoffHeights.slice(0, index + 1)), Math.max(...runoffHeights.slice(index)))
  return Array.from({ length: level - height }, (_, layer) => ({ index, level: height + layer }))
})

export function RunoffExample() {
  return (
    <figure className={styles.runoffExample}>
      <div className={styles.runoffHeading}><strong>Example 1</strong><span>Retained volume: <b>{waterCells.length} m³</b></span></div>
      <code>height = [{runoffHeights.join(',')}]</code>
      <svg viewBox="0 0 288 86" className={styles.runoffDiagram} aria-hidden="true">
        <path d="M10 65H278" stroke="#d5dfe8" />
        {runoffHeights.map((height, index) => <g key={index}>
          {height > 0 && <rect x={12 + index * 22} y={65 - height * 17} width="20" height={height * 17} rx="1" fill="#8998a6" />}
          <text x={22 + index * 22} y="79" textAnchor="middle" fill="#647585" fontSize="9">{height}</text>
        </g>)}
        {waterCells.map((cell, index) => <rect key={`${cell.index}-${cell.level}`}
          x={12 + cell.index * 22} y={65 - (cell.level + 1) * 17} width="20" height="16"
          rx="1" fill="#69b8ed" className={styles.runoffWater} style={{ '--fill-delay': `${index * 180}ms` } as CSSProperties} />)}
      </svg>
      <figcaption><span><i />Ground elevation</span><span><i />Each blue square stores 1 m³</span></figcaption>
    </figure>
  )
}
