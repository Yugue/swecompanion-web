# 5.2 Object detection: localization and prediction pipelines

## 1. Predict a set of objects

Each detection usually contains **class, confidence, and box**.

```text
image → multiscale features → candidates → classes/boxes → duplicate handling
```

Example: two people need two predictions, even though their class is identical.

## 2. Boxes and overlap

State corner versus center/size format, pixel versus normalized units, and endpoint conventions.

\[
\mathrm{IoU}(A,B)=\frac{|A\cap B|}{|A\cup B|}
\]

Example: two area-100 boxes overlap by 40 → union 160 → **IoU=0.25**.

IoU is 0 for disjoint boxes, 1 for identical ones. A fixed pixel shift hurts small boxes more.

## 3. One-stage versus two-stage

- **One-stage:** directly predict candidates from features.
- **Two-stage:** propose regions, then refine/classify them.

YOLO-style and Faster R-CNN-style models illustrate these ideas.

Region alignment samples features for a proposed box; precise interpolation avoids coarse rounding. Actual speed/quality depends on implementation and budget.

## 4. Anchors versus anchor-free

**Anchors:** reference boxes with chosen sizes/aspect ratios; predict offsets.

**Anchor-free:** centers, points, or direct geometry without those reference shapes.

Example: an anchor-based head adjusts a 20 × 20 reference to fit the object.

This is a separate design axis from one-/two-stage. Assignment and duplicate handling remain necessary.

## 5. Small objects and scales

Fine maps preserve detail; coarse maps provide context. Feature pyramids combine them.

A four-pixel object may disappear during resizing. Test capture, input resolution, tiling, output stride, and labels before simply adding depth.

## 6. Non-maximum suppression

NMS keeps a high-score box and suppresses overlapping candidates, usually within class.

Example: scores 0.9/0.8, IoU 0.85, suppression cutoff 0.5 → keep the first.

Crowded real objects can also overlap. Soft-NMS lowers scores instead of immediately deleting boxes.

Keep **score, NMS-overlap, and evaluation-overlap thresholds** distinct.

## 7. Set prediction and constraints

Some detectors jointly predict output slots using one-to-one matching, reducing traditional NMS dependence.

Choose using object sizes, crowding, labels, metrics, and full-pipeline latency.

## 8. Interview reasoning

**Question:** Which detector for crowded scenes under a deadline?

**Answer:** Measure a practical baseline’s crowded/small-object recall, localization, duplicates, and latency. Compare assignment/suppression failures before choosing another family.
