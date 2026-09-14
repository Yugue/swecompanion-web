const COLORS = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];

export function ProductMark({ size }: { size: number }) {
  const gap = size * 0.1;
  const tile = (size - gap) / 2;
  return (
    <div
      className="grid shrink-0"
      style={{ width: size, height: size, gridTemplateColumns: `${tile}px ${tile}px`, gap }}
    >
      {COLORS.map((color, i) => (
        <div
          key={color}
          style={{
            width: tile,
            height: tile,
            background: color,
            borderRadius: i === 1 || i === 2 ? tile / 2 : 3,
          }}
        />
      ))}
    </div>
  );
}
