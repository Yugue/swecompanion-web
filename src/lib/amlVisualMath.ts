export type Point = readonly [number, number];
export const pcaPoints: Point[] = [[-2, -2], [-1.5, -0.5], [-0.5, -1.5], [0, 0], [0.5, 1.5], [1.5, 0.5], [2, 2]];
export const projectDiagonal = ([x, y]: Point) => (x + y) / Math.SQRT2;
export const clockPoint = (hour: number): Point => [Math.cos(2 * Math.PI * hour / 24), Math.sin(2 * Math.PI * hour / 24)];
export const distance = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
export const neighborPoints = [
  { point: [0.4, 0.2] as Point, positive: true },
  { point: [-0.5, 0.3] as Point, positive: false },
  { point: [0.1, -0.7] as Point, positive: true },
  { point: [-1.4, -0.8] as Point, positive: false },
  { point: [1.6, 1.2] as Point, positive: true },
  { point: [1.4, -1.3] as Point, positive: false },
];
export const rankedExamples = [
  { score: 0.9, positive: true }, { score: 0.8, positive: false },
  { score: 0.7, positive: true }, { score: 0.4, positive: false },
  { score: 0.3, positive: true }, { score: 0.1, positive: false },
];
export function curvePoints() {
  const positives = rankedExamples.filter(v => v.positive).length;
  const negatives = rankedExamples.length - positives;
  let tp = 0, fp = 0;
  const points = [{ threshold: Infinity, tp, fp, recall: 0, fpr: 0, precision: 1 }];
  for (const sample of rankedExamples) {
    if (sample.positive) tp++; else fp++;
    points.push({ threshold: sample.score, tp, fp, recall: tp / positives, fpr: fp / negatives, precision: tp / (tp + fp) });
  }
  return points;
}
export function rankingSummaries() {
  const points = curvePoints();
  return points.slice(1).reduce((result, p, i) => ({
    auc: result.auc + (p.fpr - points[i].fpr) * (p.recall + points[i].recall) / 2,
    ap: result.ap + (p.recall - points[i].recall) * p.precision,
  }), { auc: 0, ap: 0 });
}
export const kmeansPoints: Point[] = [[1, 1], [2, 1], [1, 2], [7, 6], [8, 6], [7, 7]];
export const initialCenters: Point[] = [[0, 0], [6, 5]];
export function kmeansStep(points: Point[], centers: Point[]) {
  const assignments = points.map(p => centers.reduce((best, c, i) => distance(p, c) < distance(p, centers[best]) ? i : best, 0));
  const updated = centers.map((center, i): Point => {
    const group = points.filter((_, j) => assignments[j] === i);
    return group.length ? [group.reduce((s, p) => s + p[0], 0) / group.length, group.reduce((s, p) => s + p[1], 0) / group.length] : center;
  });
  return { assignments, updated };
}
export const dbscanPoints: Point[] = [[190, 140], [170, 120], [210, 120], [170, 160], [210, 160], [250, 140], [390, 80], [450, 220]];
export function dbscanRoles(points = dbscanPoints, eps = 55, minSamples = 4) {
  const neighbors = points.map(p => points.map((q, i) => distance(p, q) <= eps ? i : -1).filter(i => i >= 0));
  const core = neighbors.map(n => n.length >= minSamples);
  return neighbors.map((n, i) => core[i] ? "core" : n.some(j => core[j]) ? "border" : "noise");
}
export const normalDensity = (x: number, mean: number) => Math.exp(-0.5 * (x - mean) ** 2) / Math.sqrt(2 * Math.PI);
export const mixtureParts = (x: number) => [0.5 * normalDensity(x, -1.5), 0.5 * normalDensity(x, 1.5)];
export const regularizationTarget: Point = [1.8, 0.4];
export const l1Solution: Point = [1, 0];
export const l2Solution: Point = [regularizationTarget[0] / Math.hypot(...regularizationTarget), regularizationTarget[1] / Math.hypot(...regularizationTarget)];
