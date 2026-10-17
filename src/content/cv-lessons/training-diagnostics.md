# 7.3 Training diagnostics, experiments, and model selection

## 1. Find the limiting component

**Training diagnostics** are checks that locate why a model is not learning or transferring as intended.

Low quality can come from capture, labels, wiring, optimization, generalization, or serving.

State a hypothesis and run the smallest experiment that can distinguish it. A larger model only addresses some causes.

## 2. Trace one example

Inspect input, transformed target, output shape, loss arguments, gradients, and restored prediction.

**Loss reduction** combines per-example/pixel errors into a scalar, usually a sum or mean; it affects gradient scale. Check it alongside ranges, class IDs, box conventions, and valid mask pixels.

A decreasing loss can still optimize the wrong targets.

## 3. Overfit a tiny clean subset

The **tiny-subset overfit check** asks whether the pipeline can fit a few trusted training examples almost perfectly. Disable unnecessary randomness and test those examples.

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

A **controlled ablation** compares systems differing in one conceptual component, such as removing augmentation. Keep the split and evaluation fixed.

For example, compare frozen versus fine-tuned backbones with the same resolution and labels. Changing backbone, resolution, and augmentation together hides the cause of improvement.

A **random seed** initializes pseudorandom choices such as parameter initialization and sample order. Use multiple seeds when run-to-run variation matters. Estimate uncertainty at the independent source unit. Keep final test data out of selection.

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
