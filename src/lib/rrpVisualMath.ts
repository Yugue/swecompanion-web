export type Point = readonly [number, number];
export const dot = (a: Point, b: Point) => a[0] * b[0] + a[1] * b[1];
export const distance = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const cosine = (a: Point, b: Point) => dot(a, b) / (Math.hypot(...a) * Math.hypot(...b));
export const positionWeight = (rank: number) => 1 / Math.log2(rank + 1);
export const dcg = (relevance: number[]) => relevance.reduce((s, gain, i) => s + gain * positionWeight(i + 1), 0);
export const metricLists = [[1, 1, 0, 0], [0, 0, 1, 1]];
export const userFactors: Point[] = [[1, 2], [2, 1], [-1, 1]];
export const itemFactors: Point[] = [[2, 1], [1, -1], [0, 2]];
export const vectorQuery: Point = [1, 0];
export const vectorItems: Point[] = [[1, 0], [2, 2]];
export const annCenters: Point[] = [[1, 1], [5, 1], [1, 5], [5, 5]];
export const annQuery: Point = [2.9, 2.9];
export const annItems: Point[] = [[0.7, 1.2], [1.2, 0.7], [2.6, 2.5], [3.1, 2.8], [4.8, 0.8], [1, 5.1], [5.2, 5.3]];
export const closest = (point: Point, candidates: Point[]) => candidates.reduce((best, p, i) => distance(point, p) < distance(point, candidates[best]) ? i : best, 0);
export const annBucket = (point: Point) => closest(point, annCenters);
export function annExample() {
  const bucket = annBucket(annQuery), candidates = annItems.filter(p => annBucket(p) === bucket);
  return { bucket, candidates, approximate: candidates[closest(annQuery, candidates)], exact: annItems[closest(annQuery, annItems)] };
}
export const sourceLists = { Vector: ["A", "B", "C"], History: ["B", "D"], Fresh: ["C", "E"] };
export function mergedSources() {
  const result: Record<string, string[]> = {};
  for (const [source, ids] of Object.entries(sourceLists)) for (const id of ids) (result[id] ??= []).push(source);
  return result;
}
export const rerankExamples = [{ id: "B", relevance: 0.9, similarity: 0.95 }, { id: "C", relevance: 0.8, similarity: 0.2 }];
export const rerankUtility = (relevance: number, similarity: number, beta = 0.3) => relevance - beta * similarity;
export const ipsRows = [
  { action: "A", count: 8, rewards: 2, logging: 0.8, target: 0.5 },
  { action: "B", count: 2, rewards: 2, logging: 0.2, target: 0.5 },
];
export const ipsEstimate = () => ipsRows.reduce((s, r) => s + r.rewards * r.target / r.logging, 0) / ipsRows.reduce((s, r) => s + r.count, 0);
export const servingBudget = [{ label: "Context", ms: 5 }, { label: "Retrieve", ms: 10 }, { label: "Features", ms: 15 }, { label: "Rank", ms: 15 }, { label: "Finalize", ms: 5 }];
export function wilson(successes: number, count: number, z = 1.96): Point {
  const p = successes / count, denominator = 1 + z * z / count;
  const center = (p + z * z / (2 * count)) / denominator;
  const half = z * Math.sqrt(p * (1 - p) / count + z * z / (4 * count * count)) / denominator;
  return [center - half, center + half];
}
export const explorationExamples = [{ id: "A", clicks: 2500, impressions: 50000 }, { id: "B", clicks: 3, impressions: 100 }];
export const correctDownsampling = (sampled: number, negativeRetention: number) => negativeRetention * sampled / (1 - sampled + negativeRetention * sampled);
