# 5.3 Detection training and evaluation

## 1. Assign training responsibility

**Assignment** decides which predictions learn from each object, background, or ignored region.

Rules can use overlap, centers, predicted quality, or one-to-one matching.

Example: one labeled car may supervise selected nearby candidates, not every location equally.

## 2. Background imbalance

Thousands of easy background candidates can dominate a few objects.

- Balance sampling.
- Reduce easy-example influence.
- Audit missing annotations.

A missing car label can teach a real car as background.

## 3. Focal loss

\[
L_{\mathrm{focal}}=-\alpha_t(1-p_t)^\gamma\log p_t
\]

\(p_t\): correct-outcome probability; alpha: class weight; gamma: easy-example suppression.

At gamma=2:
- p=0.99 → multiplier 0.0001.
- p=0.5 → multiplier 0.25.

Gamma=0 recovers weighted cross-entropy. Difficult mislabeled examples also receive emphasis.

## 4. Box losses

| Loss | Measures |
|---|---|
| L1 / smooth L1 | Coordinate differences |
| IoU-based | Geometric overlap |
| Generalized IoU | Also enclosing-region penalty |

Plain IoU gives no overlap-based gradient for disjoint boxes.

```text
assignment → class/objectness loss + box loss + optional mask/keypoint loss
```

Reduction, parameterization, and weights control each branch’s influence.

## 5. Evaluation matching

For a chosen class/IoU threshold:

- Rank by confidence.
- Match eligible predictions to ground truth.
- Normally claim each object once.
- Count unmatched predictions as FP and objects as FN.

Example: two boxes around one car → one TP, one duplicate FP.

Use benchmark ignore/crowd, area, and detection-limit rules.

## 6. AP and mAP

AP summarizes ranked precision/recall under stated interpolation.

Two objects, ranked predictions TP,FP,TP:

| Rank | Recall | Precision |
|---|---|---|
| 1 | 0.5 | 1 |
| 2 | 0.5 | 0.5 |
| 3 | 1 | 2/3 |

Simple all-points precision-envelope AP ≈ **0.833**; benchmark sampling may differ.

mAP averages stated classes/thresholds. COCO-style AP averages IoUs 0.50–0.95. AP50/AP75 are overlap criteria, not confidence cutoffs.

## 7. Diagnose errors

- Strong AP50, weak AP75 → localization.
- Tiny-object misses → resolution/features/assignment.
- Duplicate alerts → suppression or set behavior.
- Correct box, wrong category → class confusion.

Inspect examples before choosing a repair.

## 8. Interview reasoning

**Question:** Good AP50, poor AP75—what first?

**Answer:** Check box conventions, inverse resizing, annotation precision, and size-specific localization. Then compare regression, assignment, or feature-resolution changes.
