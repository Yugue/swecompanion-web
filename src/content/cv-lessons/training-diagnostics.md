# 7.3 Training diagnostics, experiments, and model selection

## 1. Find the limiting component

Low quality can come from capture, labels, wiring, optimization, generalization, or serving.

State a hypothesis and run the smallest experiment that can distinguish it. A larger model only addresses some causes.

## 2. Trace one example

Inspect input, transformed target, output shape, loss arguments, gradients, and restored prediction.

Check ranges, class IDs, box conventions, valid mask pixels, and loss reduction.

A decreasing loss can still optimize the wrong targets.

## 3. Overfit a tiny clean subset

Disable unnecessary randomness and fit a few trusted examples.

```text
cannot fit → inspect pipeline, objective, gradients, learning rate
can fit    → inspect held-out coverage, generalization, shift
```

Success demonstrates limited learnability, not deployment quality.

## 4. Monitor useful quantities

Track train/validation losses, task metrics, learning rate, gradient norms, and predictions. Inspect separate classification, box, or mask losses.

| Observation | First checks |
|---|---|
| NaNs | Input range, loss stability, rate, precision |
| Missing gradients | Detached/frozen parameters; optimizer membership |
| Flat classification | Labels, output width, loss/target mismatch |
| Poor localization | Geometry, assignment, target coordinates, resolution |

Curves suggest hypotheses; they do not prove causes.

## 5. Run controlled ablations

Change one conceptual variable under the same split and evaluation.

For example, compare frozen versus fine-tuned backbones with the same resolution and labels. Changing backbone, resolution, and augmentation together hides the cause of improvement.

Use repeated seeds when variation matters. Estimate uncertainty at the independent source unit. Keep final test data out of selection.

## 6. Tune likely causes first

1. Fix pipeline and label errors.
2. Establish a sensible learning rate and duration.
3. Test coverage, augmentation, and resolution.
4. Test capacity and task-specific objectives.

Tiny defects may need more pixels. Rare defects may need better labels and positives. Use each pretrained model's intended preprocessing.

## 7. Select within constraints

Compare quality, important slices, latency, memory, and maintenance.

| Candidate | Aggregate score | Critical recall | Latency |
|---|---|---|---|
| A | Higher | Fails requirement | Fits |
| B | Slightly lower | Meets requirement | Fits |

Under that requirement, choose B.

Use validation for selection, then independent evaluation. Record hypothesis, configuration, data version, outcome, and decision.

## 8. Interview reasoning

**Question:** A detector cannot beat the baseline. What before a larger backbone?

**Answer:** Audit targets, overfit trusted examples, inspect losses and gradients, then slice failures by size and capture. Test the best-supported geometry, resolution, data, or capacity hypothesis.
