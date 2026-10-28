// Deterministic, small examples shared by the figures and content validator.
export function softmax(logits: readonly number[], temperature = 1): number[] {
  if (!(temperature > 0) || !Number.isFinite(temperature) || !logits.length) throw new Error("A finite positive temperature and nonempty logits are required.");
  const maximum = Math.max(...logits);
  const values = logits.map(value => Math.exp((value - maximum) / temperature));
  const sum = values.reduce((a, b) => a + b, 0);
  return values.map(value => value / sum);
}
export const samplingExample = { logits: [Math.log(4), Math.log(2), 0], temperatures: [1, 0.5] } as const;
export function dpoPreference(winnerRatio: number, loserRatio: number, beta = 1) {
  return 1 / (1 + Math.exp(-beta * (Math.log(winnerRatio) - Math.log(loserRatio))));
}
export const groupRewards = [0, 1, 1, 0] as const;
export function centered(values: readonly number[]): number[] {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.map(value => value - mean);
}
export function kvBytes(layers: number, batch: number, positions: number, kvHeads: number, headWidth: number, bytes: number) {
  return 2 * layers * batch * positions * kvHeads * headWidth * bytes;
}
export function quantize(value: number, scale = 0.5, maxLevel = 2) {
  if (!(scale > 0) || !Number.isFinite(scale) || !Number.isInteger(maxLevel) || maxLevel < 1) throw new Error("Quantization needs a finite positive scale and positive integer level bound.");
  return Math.max(-maxLevel, Math.min(maxLevel, Math.round(value / scale))) * scale;
}
export const quantizationValues = [-0.8, -0.2, 0.3, 0.9] as const;
export function guided(unconditional: readonly number[], conditional: readonly number[], scale: number) {
  return unconditional.map((value, i) => value + scale * (conditional[i] - value));
}
export const guidanceExample = { unconditional: [1, 0], conditional: [2, 1], scales: [0, 1, 2] } as const;
function gaussianNoise(count: number) {
  let seed = 1729;
  const uniform = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return (seed + 1) / 4294967297; };
  return Array.from({ length: count }, () => Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform()));
}
export const diffusionSignal = Array.from({ length: 64 }, (_, i) => {
  const row = Math.floor(i / 8), col = i % 8;
  return (row >= 2 && row <= 5 && col >= 2 && col <= 5 && !(row === 2 && col === 2)) ? 0.9 : -0.9;
});
export const diffusionNoise = gaussianNoise(64);
export const diffusionRetentions = [1, 0.65, 0.2, 0] as const;
export function noisyState(retention: number) {
  return diffusionSignal.map((value, i) => Math.sqrt(retention) * value + Math.sqrt(1 - retention) * diffusionNoise[i]);
}
export function toyFlow(x: number, y: number) { return [1, -y] as const; }
export function flowPath(x: number, y: number, steps = 6, dt = 0.25): number[][] {
  const states = [[x, y]];
  for (let i = 0; i < steps; i++) { const velocity = toyFlow(x, y); x += dt * velocity[0]; y += dt * velocity[1]; states.push([x, y]); }
  return states;
}
export function speculativeAcceptance(target: number, draft: number) { return Math.min(1, target / draft); }
export function rejectionDistribution(target: readonly number[], draft: readonly number[]) {
  const residual = target.map((value, i) => Math.max(0, value - draft[i]));
  const total = residual.reduce((a, b) => a + b, 0);
  return total > 0 ? residual.map(value => value / total) : residual;
}

export const imageConvolutionExample = {
  input: [[1, 0, 2], [2, 1, 1], [0, 1, 3]],
  kernel: [[1, -1], [1, -1]],
} as const;
export function imageConvolution() {
  const { input, kernel } = imageConvolutionExample;
  return Array.from({ length: 2 }, (_, row) => Array.from({ length: 2 }, (_, col) =>
    kernel.reduce((total, weights, r) => total + weights.reduce((subtotal, weight, c) => subtotal + weight * input[row + r][col + c], 0), 0)));
}

export const rotaryExample = { query: [1, 0], key: [1, 0], degreesPerPosition: 45, positions: [[0, 1], [1, 2]] } as const;
export function rotatePair(vector: readonly [number, number], degrees: number): [number, number] {
  const radians = degrees * Math.PI / 180, cosine = Math.cos(radians), sine = Math.sin(radians);
  return [cosine * vector[0] - sine * vector[1], sine * vector[0] + cosine * vector[1]];
}
export const denoisingExample = { clean: 2, noise: 0.5, retention: 0.36, prediction: 0.4 } as const;
export function addScalarNoise(clean: number, noise: number, retention: number) {
  return Math.sqrt(retention) * clean + Math.sqrt(1 - retention) * noise;
}
export function cleanFromNoise(noisy: number, prediction: number, retention: number) {
  if (!(retention > 0 && retention <= 1)) throw new Error("A clean estimate requires signal retention in (0, 1].");
  return (noisy - Math.sqrt(1 - retention) * prediction) / Math.sqrt(retention);
}
