import assert from "node:assert/strict";
import { averageKernel, convolutionImage, edgeKernel, mlpForwardBackward, mlpParameters, morphology, updateMlp, validCorrelation, type MlpParameters } from "../src/lib/cvVisualMath";
import { cvVisualIds, cvVisuals } from "../src/lib/cvVisuals";
import { cvTopics } from "../src/lib/cvStudyData";
import { getLessonBlocks } from "../src/lib/getLessonBlocks";
import { parseLesson } from "../src/lib/lessonParser";

const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);
assert.deepEqual(validCorrelation(convolutionImage, edgeKernel), [[3, 3, 0], [3, 3, 0], [3, 3, 0]]);
validCorrelation(convolutionImage, averageKernel).forEach(row => row.forEach((v, i) => close(v, [1 / 3, 2 / 3, 1][i])));
assert.throws(() => validCorrelation([[1]], edgeKernel));
assert.throws(() => validCorrelation([[1, 2], [1]], [[1]]));

// Independent numerical derivatives check every parameter, including a zero-ReLU branch.
for (const parameters of [mlpParameters, { ...mlpParameters, b: [2, 0] }]) {
  const result = mlpForwardBackward(parameters);
  const entries = [
    ...parameters.w.flatMap((row, i) => row.map((_, j) => ({ value: result.gradients.w[i][j], perturb: (p: MlpParameters, d: number) => { p.w[i][j] += d; } }))),
    ...parameters.b.map((_, i) => ({ value: result.gradients.b[i], perturb: (p: MlpParameters, d: number) => { p.b[i] += d; } })),
    ...parameters.v.map((_, i) => ({ value: result.gradients.v[i], perturb: (p: MlpParameters, d: number) => { p.v[i] += d; } })),
    { value: result.gradients.outBias, perturb: (p: MlpParameters, d: number) => { p.outBias += d; } },
  ];
  for (const entry of entries) {
    const plus = JSON.parse(JSON.stringify(parameters)), minus = JSON.parse(JSON.stringify(parameters));
    entry.perturb(plus, 1e-5); entry.perturb(minus, -1e-5);
    close(entry.value, (mlpForwardBackward(plus).loss - mlpForwardBackward(minus).loss) / 2e-5);
  }
}
const result = mlpForwardBackward();
close(result.prediction, 2); close(result.loss, 0.5);
assert.deepEqual(result.gradients.w, [[0, 0], [2, 4]]);
const after = mlpForwardBackward(updateMlp(mlpParameters, result.gradients, 0.05));
close(after.prediction, 0.73); close(after.loss, 0.03645);
assert.ok(after.loss < result.loss);

const speck = Array.from({ length: 9 }, (_, y) => Array.from({ length: 9 }, (_, x) => y >= 3 && y <= 6 && x >= 2 && x <= 5 || y === 0 && x === 8 ? 1 : 0));
const opened = morphology(morphology(speck, "erode"), "dilate");
assert.equal(opened[0][8], 0); assert.equal(opened.flat().reduce((s, v) => s + v, 0), 16);
const hole = Array.from({ length: 9 }, (_, y) => Array.from({ length: 9 }, (_, x) => y >= 2 && y <= 6 && x >= 2 && x <= 6 && !(y === 4 && x === 4) ? 1 : 0));
const closed = morphology(morphology(hole, "dilate"), "erode");
assert.equal(closed[4][4], 1); assert.equal(closed.flat().reduce((s, v) => s + v, 0), 25);

const used = new Set(cvTopics.flatMap(t => getLessonBlocks(t.id, "cv").filter(b => b.type === "visual").map(b => b.text.trim())));
assert.deepEqual([...used].sort(), [...cvVisualIds].sort(), "Missing or orphaned figures");
for (const v of Object.values(cvVisuals)) assert.ok(v.title && v.caption && v.alt);
assert.equal(parseLesson("# Title\n\n```cv-visual\nconvolution\n```")[0].type, "visual");
assert.equal(parseLesson("# Title\n\n```text\na → b\n```")[0].type, "diagram");
assert.equal(parseLesson("# Title\n\n```python\nx = 1\n```")[0].type, "code");
console.log("CV visuals verified: convolution values, all MLP numerical gradients, update, morphology, registered placements, and parser compatibility.");
