// Small, deterministic examples used by the Deep Learning figures.
export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
export const geluApprox = (x: number) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)));
export const huber = (error: number, delta = 1) => Math.abs(error) <= delta
  ? 0.5 * error ** 2 : delta * (Math.abs(error) - 0.5 * delta);
export function normalDensity(x: number, mean = 0, std = 1): number {
  if (std <= 0) throw new Error("Expected positive standard deviation.");
  return Math.exp(-0.5 * ((x - mean) / std) ** 2) / (std * Math.sqrt(2 * Math.PI));
}

export function matrixProduct(a: number[][], b: number[][]): number[][] {
  const inner = a[0]?.length ?? 0, columns = b[0]?.length ?? 0;
  if (!a.length || !inner || !columns || inner !== b.length ||
    a.some(row => row.length !== inner) || b.some(row => row.length !== columns)) {
    throw new Error("Expected compatible rectangular matrices.");
  }
  return a.map(row => Array.from({ length: columns }, (_, col) =>
    row.reduce((sum, value, k) => sum + value * b[k][col], 0)));
}

export function clipNorm(gradient: number[], threshold: number): number[] {
  const norm = Math.hypot(...gradient);
  if (threshold < 0) throw new Error("Expected a nonnegative threshold.");
  return gradient.map(value => value * (norm > threshold ? threshold / norm : 1));
}

export function warmupCosine(progress: number): number {
  const t = Math.max(0, Math.min(1, progress));
  return t <= 0.1 ? t / 0.1 : 0.01 + 0.99 * (1 + Math.cos(Math.PI * (t - 0.1) / 0.9)) / 2;
}

export function rotatePair(pair: number[], angle: number): number[] {
  return [pair[0] * Math.cos(angle) - pair[1] * Math.sin(angle),
    pair[0] * Math.sin(angle) + pair[1] * Math.cos(angle)];
}

export function softmaxAtTemperature(logits: number[], temperature: number): number[] {
  if (temperature <= 0 || !logits.length) throw new Error("Expected logits and positive temperature.");
  const max = Math.max(...logits);
  const values = logits.map(value => Math.exp((value - max) / temperature));
  const sum = values.reduce((a, b) => a + b, 0);
  return values.map(value => value / sum);
}

export const thresholdSamples = [
  { score: 0.1, positive: false }, { score: 0.2, positive: false },
  { score: 0.35, positive: true }, { score: 0.45, positive: false },
  { score: 0.55, positive: true }, { score: 0.65, positive: false },
  { score: 0.8, positive: true }, { score: 0.9, positive: true },
];
export function thresholdCounts(threshold: number) {
  return thresholdSamples.reduce((counts, sample) => {
    const key = sample.score >= threshold ? sample.positive ? "tp" : "fp" : sample.positive ? "fn" : "tn";
    counts[key]++;
    return counts;
  }, { tp: 0, fp: 0, fn: 0, tn: 0 });
}

export const maskAllows = (query: number, key: number, causal: boolean) => key < 4 && (!causal || key <= query);
export const lstmExample = (() => {
  const old = 2, forget = 0.8, input = 0.5, candidate = 0.4, output = 0.9;
  const cell = forget * old + input * candidate;
  return { old, forget, input, candidate, output, cell, hidden: output * Math.tanh(cell) };
})();
