import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { dlVisualIds, dlVisuals, isDlVisualId, type DlVisualSpec } from "../src/lib/dlVisuals";
import { clipNorm, geluApprox, huber, lstmExample, maskAllows, matrixProduct, normalDensity, rotatePair, sigmoid, softmaxAtTemperature, thresholdCounts, warmupCosine } from "../src/lib/dlVisualMath";
import { isCvVisualId } from "../src/lib/cvVisuals";
import { mlParts } from "../src/lib/mlStudyData";
import { getLessonBlocks } from "../src/lib/getLessonBlocks";
import { parseLesson } from "../src/lib/lessonParser";

const close = (a: number, b: number, tolerance = 1e-8) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
assert.deepEqual(matrixProduct([[1, 2], [3, 4]], [[5], [6]]), [[17], [39]]);
assert.deepEqual(matrixProduct([[1, 2, 3]], [[1, 0], [0, 1], [1, 1]]), [[4, 5]]);
assert.throws(() => matrixProduct([[1, 2]], [[1, 2]]));
assert.equal(sigmoid(0), 0.5);
close(sigmoid(5) + sigmoid(-5), 1);
close(geluApprox(2) - geluApprox(-2), 2);
assert.ok(geluApprox(-1) < 0 && geluApprox(3) > 2.99);
close(huber(0.5), 0.125); close(huber(2), 1.5); close(huber(-2), 1.5);
close((huber(1 + 1e-6) - huber(1 - 1e-6)) / 2e-6, 1, 1e-6);
close((3.000001 ** 2 - 2.999999 ** 2) / 0.000002, 6, 1e-6);
close(3.1 ** 2 - 3 ** 2, 0.61);
close(normalDensity(0), 0.3989422804);
close(normalDensity(0, 0, 2), normalDensity(0) / 2);
close(normalDensity(2, 2, 1), normalDensity(0));
assert.throws(() => normalDensity(0, 0, 0));
for (const [mean, std] of [[0, 1], [0, 2], [2, 1]]) {
  let area = 0;
  for (let i = 0; i < 4000; i++) area += normalDensity(-20 + (i + 0.5) * 0.01, mean, std) * 0.01;
  close(area, 1, 1e-6);
}

const clipped = clipNorm([6, 8], 5);
assert.deepEqual(clipped, [3, 4]); close(Math.hypot(...clipped), 5);
close(clipped[0] * 8 - clipped[1] * 6, 0); // Collinearity with the original gradient.
assert.deepEqual(clipNorm([0.3, 0.4], 1), [0.3, 0.4]);
assert.deepEqual(clipNorm([0, 0], 1), [0, 0]);
assert.throws(() => clipNorm([1, 2], -1));
close(warmupCosine(0), 0); close(warmupCosine(0.1), 1); close(warmupCosine(1), 0.01);
for (let i = 11; i <= 100; i++) assert.ok(warmupCosine(i / 100) < warmupCosine((i - 1) / 100));

// Rotating both vectors together preserves their dot product, for arbitrary directions too.
const dot = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0);
for (const shift of [-2, -0.3, 0, 0.4, 3]) {
  close(dot(rotatePair([0.3, -0.7], shift), rotatePair([-0.4, 0.8], shift)), dot([0.3, -0.7], [-0.4, 0.8]));
}
for (const [m, n] of [[1, 3], [3, 5]]) close(dot(rotatePair([1, 0], m * Math.PI / 6), rotatePair([1, 0], n * Math.PI / 6)), 0.5);
for (const causal of [false, true]) {
  const counts = [0, 1, 2, 3].map(q => [0, 1, 2, 3, 4].filter(k => maskAllows(q, k, causal)).length);
  assert.deepEqual(counts, causal ? [1, 2, 3, 4] : [4, 4, 4, 4]);
  assert.ok([0, 1, 2, 3].every(q => !maskAllows(q, 4, causal)));
}
const probabilities = softmaxAtTemperature([2, 1, 0], 1);
probabilities.forEach((p, i) => close(p, [0.6652409558, 0.2447284711, 0.0900305732][i]));
softmaxAtTemperature([1002, 1001, 1000], 1).forEach((p, i) => close(p, probabilities[i]));
for (const t of [0.5, 1, 2]) close(softmaxAtTemperature([2, 1, 0], t).reduce((a, b) => a + b, 0), 1);
assert.ok(softmaxAtTemperature([2, 1, 0], 0.5)[0] > probabilities[0]);
assert.ok(softmaxAtTemperature([2, 1, 0], 2)[0] < probabilities[0]);
assert.throws(() => softmaxAtTemperature([2, 1, 0], 0));
close(lstmExample.cell, 1.8); close(lstmExample.hidden, 0.8521254115616415);
assert.deepEqual(thresholdCounts(0.4), { tp: 3, fp: 2, fn: 1, tn: 2 });
assert.deepEqual(thresholdCounts(0.7), { tp: 2, fp: 0, fn: 2, tn: 4 });

const topics = mlParts.flatMap(p => p.topics);
const used = new Set<string>();
let affected = 0;
for (const topic of topics) {
  const source = fs.readFileSync(path.join(process.cwd(), "src/content/ml-lessons", `${topic.id}.md`), "utf8");
  assert.ok(!source.includes("genui"), `${topic.id}: unresolved visual placeholder`);
  const visuals = getLessonBlocks(topic.id).filter(b => b.type === "dl-visual");
  if (visuals.length) affected++;
  for (const visual of visuals) {
    const id = visual.text.trim();
    assert.ok(isDlVisualId(id), `${topic.id}: unknown visual ${id}`);
    assert.ok(!used.has(id), `${topic.id}: figure repeated without a separate teaching purpose`);
    used.add(id);
    if (process.argv.includes("--export")) {
      const html = fs.readFileSync(path.join(process.cwd(), "out/mldomain/deeplearning", `${topic.id}.html`), "utf8");
      assert.ok(html.includes(`data-dl-visual="${id}"`), `${topic.id}: missing exported figure`);
      if (id === "convolution") {
        assert.ok(html.includes('aria-label="Choose kernel"') && html.includes('aria-label="Select an output cell"') && html.includes('aria-live="polite"'), `${topic.id}: missing accessible walkthrough controls`);
      } else {
        assert.ok(html.includes('role="img"'), `${topic.id}: missing accessible graphic`);
      }
    }
  }
}
assert.deepEqual([...used].sort(), [...dlVisualIds].sort(), "Missing or orphaned Deep Learning figures");
for (const spec of Object.values(dlVisuals) as DlVisualSpec[]) {
  assert.ok(spec.title && spec.caption && spec.alt);
  if (spec.shared) assert.ok(isCvVisualId(spec.shared));
}
assert.equal(parseLesson("# Title\n\n```dl-visual\nrope\n```")[0].type, "dl-visual");
assert.equal(parseLesson("# Title\n\n```cv-visual\nconvolution\n```")[0].type, "visual");
assert.equal(parseLesson("# Title\n\n```text\na → b\n```")[0].type, "diagram");
assert.equal(parseLesson("# Title\n\n```python\nx = 1\n```")[0].type, "code");
console.log(`Deep Learning visuals validated: ${topics.length} chapters audited; ${used.size} figures in ${affected} chapters; numerical examples, masks, rotations, and parser compatibility verified${process.argv.includes("--export") ? "; static export verified" : ""}.`);
