export type Matrix = number[][];

export function validCorrelation(image: Matrix, kernel: Matrix): Matrix {
  const h = image.length, w = image[0]?.length ?? 0;
  const kh = kernel.length, kw = kernel[0]?.length ?? 0;
  if (!h || !w || !kh || !kw || image.some(r => r.length !== w) ||
      kernel.some(r => r.length !== kw) || kh > h || kw > w) {
    throw new Error("Expected rectangular image and a fitting rectangular kernel.");
  }
  return Array.from({ length: h - kh + 1 }, (_, y) =>
    Array.from({ length: w - kw + 1 }, (_, x) =>
      kernel.reduce((sum, row, ky) => sum +
        row.reduce((s, weight, kx) => s + weight * image[y + ky][x + kx], 0), 0)));
}

export const convolutionImage: Matrix = Array.from({ length: 5 }, () => [0, 0, 1, 1, 1]);
export const edgeKernel: Matrix = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]];
export const averageKernel: Matrix = Array.from({ length: 3 }, () => [1 / 9, 1 / 9, 1 / 9]);

export interface MlpParameters { w: Matrix; b: number[]; v: number[]; outBias: number }
export interface MlpGradients { w: Matrix; b: number[]; v: number[]; outBias: number }
export const mlpInputs = [1, 2];
export const mlpTarget = 1;
export const mlpParameters: MlpParameters = {
  w: [[0.5, -0.5], [1, 0]], b: [0, 0], v: [1, 2], outBias: 0,
};

export function mlpForwardBackward(
  parameters: MlpParameters = mlpParameters, inputs = mlpInputs, target = mlpTarget,
) {
  const z = parameters.w.map((row, i) =>
    row.reduce((sum, weight, j) => sum + weight * inputs[j], parameters.b[i]));
  const h = z.map(value => Math.max(0, value));
  const prediction = h.reduce((sum, value, i) => sum + parameters.v[i] * value, parameters.outBias);
  const error = prediction - target;
  const dHidden = parameters.v.map(value => error * value);
  const dZ = dHidden.map((value, i) => z[i] > 0 ? value : 0);
  const gradients: MlpGradients = {
    w: dZ.map(value => inputs.map(input => value * input)),
    b: dZ,
    v: h.map(value => error * value),
    outBias: error,
  };
  return { z, h, prediction, loss: 0.5 * error ** 2, error, dHidden, dZ, gradients };
}

export function updateMlp(parameters: MlpParameters, gradients: MlpGradients, rate: number): MlpParameters {
  return {
    w: parameters.w.map((row, i) => row.map((value, j) => value - rate * gradients.w[i][j])),
    b: parameters.b.map((value, i) => value - rate * gradients.b[i]),
    v: parameters.v.map((value, i) => value - rate * gradients.v[i]),
    outBias: parameters.outBias - rate * gradients.outBias,
  };
}

export function morphology(mask: Matrix, operation: "erode" | "dilate"): Matrix {
  return mask.map((row, y) => row.map((_, x) => {
    const values = [-1, 0, 1].flatMap(dy => [-1, 0, 1].map(dx => mask[y + dy]?.[x + dx] ?? 0));
    return operation === "erode" ? Math.min(...values) : Math.max(...values);
  }));
}

export function formatValue(value: number, digits = 3): string {
  const rounded = Number(value.toFixed(digits));
  return String(Object.is(rounded, -0) ? 0 : rounded);
}
