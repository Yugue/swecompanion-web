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
      <span
        className="absolute inset-0 flex items-center justify-center font-extrabold tabular-nums"
        style={{ color, fontSize: size * 0.25 }}
      >
        {safeDone}/{total}
      </span>
    </div>
  );
}
