"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function ProgressRing({
  done,
  total,
  color,
  size = 40,
  strokeWidth = 2.5,
}: {
  done: number;
  total: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const safeDone = Math.min(Math.max(done, 0), total);
  const progress = total === 0 ? 0 : safeDone / total;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const label = `${safeDone}/${total}`;

  const labelRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);

  // Shrink the label (rather than letting it overflow the ring) when the digit count grows -
  // e.g. "181/199" or "15/15" would otherwise poke past the circle at a fixed font size.
  useLayoutEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    const naturalWidth = el.scrollWidth;
    const maxWidth = size * 0.7;
    setScale(naturalWidth > maxWidth ? maxWidth / naturalWidth : 1);
  }, [label, size]);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${safeDone} of ${total} complete`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-outline)"
          strokeOpacity={0.3}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: "stroke-dashoffset 200ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <span
          ref={labelRef}
          className="inline-block whitespace-nowrap font-extrabold tabular-nums"
          style={{ color, fontSize: size * 0.25, transform: `scale(${scale})` }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
