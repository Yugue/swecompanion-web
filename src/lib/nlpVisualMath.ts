/** Small deterministic examples shared by NLP figures and their numerical audit. */
export const dot = (a: readonly number[], b: readonly number[]) => a.reduce((sum, value, i) => sum + value * b[i], 0);
export function softmax(scores: readonly number[]) {
  const maximum = Math.max(...scores);
  if (!scores.length || !Number.isFinite(maximum) || scores.some(Number.isNaN)) throw new Error("Softmax requires an allowed finite score");
  const exponents = scores.map(score => Math.exp(score - maximum));
  const total = exponents.reduce((sum, value) => sum + value, 0);
  return exponents.map(value => value / total);
}
export const attentionExample = { scores: [Math.log(3), 0], values: [[2, 0], [0, 4]] };
export function attentionMixture(scores: readonly number[], values: readonly (readonly number[])[]) {
  const weights = softmax(scores);
  if (values.length !== weights.length || !values.length || values.some(value => value.length !== values[0].length)) throw new Error("Attention shapes disagree");
  return { weights, output: values[0].map((_, coordinate) => values.reduce((sum, value, i) => sum + weights[i] * value[coordinate], 0)) };
}
export const subwordSteps = [["l", "o", "w", "e", "r"], ["lo", "w", "e", "r"], ["low", "e", "r"], ["low", "er"]];
export const causalAccess = Array.from({ length: 3 }, (_, row) => Array.from({ length: 3 }, (_, column) => column <= row));
export const vectorExample = { query: [1, 0], a: [1, 1], b: [2, 2] } as const;
export const embeddingExample = { table: [[1, 0], [0, 1], [-1, 2]], ids: [0, 2, 0] };
export const convolutionExample = { input: [1, 2, -1, 0], kernel: [1, -1] };
export function convolveText(input: readonly number[], kernel: readonly number[]) {
  return Array.from({ length: input.length - kernel.length + 1 }, (_, start) => dot(input.slice(start, start + kernel.length), kernel));
}
export const lstmExample = { previous: 4, forget: 0.75, inputGate: 0.5, candidate: -0.4, outputGate: 0.8 };
export function lstmStep(example = lstmExample) {
  const retained = example.forget * example.previous, added = example.inputGate * example.candidate;
  const memory = retained + added;
  return { retained, added, memory, hidden: example.outputGate * Math.tanh(memory) };
}
export const teacherForcingExample = { inputs: ["BOS", "I", "agree"], labels: ["I", "agree", "EOS"] };
export const decodingExample = { tokens: ["A", "B"], first: [0.6, 0.4], end: [0.5, 0.9] };
export const contrastiveExample = { vectors: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], temperature: 0.5 };
export const contrastiveLogits = contrastiveExample.vectors.map(query => contrastiveExample.vectors.map(document => dot(query, document) / contrastiveExample.temperature));
export const crfExample = {
  labels: ["B-PER", "I-PER", "O"], emissions: [[2, 0, 1], [0, 2, 3]],
  transitions: [[0, 2, 0], [0, 0, 0], [0, -Infinity, 0]], start: [0, -Infinity, 0],
};
export function pathScore(labels: readonly number[], example = crfExample) {
  return labels.reduce((sum, label, t) => sum + example.emissions[t][label] + (t ? example.transitions[labels[t - 1]][label] : example.start[label]), 0);
}
export function viterbi(example = crfExample) {
  let scores = example.emissions[0].map((score, label) => score + example.start[label]);
  const back: number[][] = [];
  for (let t = 1; t < example.emissions.length; t++) {
    const predecessors = example.labels.map((_, label) => {
      const candidates = scores.map((score, previous) => score + example.transitions[previous][label]);
      return candidates.indexOf(Math.max(...candidates));
    });
    scores = predecessors.map((previous, label) => scores[previous] + example.transitions[previous][label] + example.emissions[t][label]);
    back.push(predecessors);
  }
  const score = Math.max(...scores), path = [scores.indexOf(score)];
  for (let t = back.length - 1; t >= 0; t--) path.unshift(back[t][path[0]]);
  return { score, path };
}
export function crfLogPartition(example = crfExample) {
  let scores = example.emissions[0].map((score, label) => score + example.start[label]);
  for (let t = 1; t < example.emissions.length; t++) {
    scores = example.labels.map((_, label) => {
      const terms = scores.map((score, previous) => score + example.transitions[previous][label]);
      const max = Math.max(...terms);
      return example.emissions[t][label] + max + Math.log(terms.reduce((sum, value) => sum + Math.exp(value - max), 0));
    });
  }
  const max = Math.max(...scores);
  return max + Math.log(scores.reduce((sum, value) => sum + Math.exp(value - max), 0));
}
export const loraParameterCounts = (input: number, output: number, rank: number) => ({ full: input * output, adapter: rank * (input + output) });
