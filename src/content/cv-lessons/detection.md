# 5.2 Object detection: localization and prediction pipelines

## 1. Predict a set of objects

**Object detection** locates and classifies individual objects in an image. Each detection usually contains a class label, confidence score, and bounding box.

```text
image → multiscale features → candidates → classes/boxes → duplicate handling
```

Example: two people need two predictions, even though their class is identical.

## 2. Boxes and overlap

**Intersection over Union (IoU)** measures overlap between two regions A and B: intersection area divided by union area.

State corner versus center/size box format, pixel versus normalized units, and endpoint conventions.

\[
\mathrm{IoU}(A,B)=\frac{|A\cap B|}{|A\cup B|}
\]

Example: two area-100 boxes overlap by 40 → union 160 → **IoU=0.25**.

IoU is 0 for disjoint boxes, 1 for identical ones. A fixed pixel shift hurts small boxes more.

```cv-visual
box-overlap
```

## 3. One-stage versus two-stage

- **One-stage:** directly predict candidates from features.
- **Two-stage:** propose regions, then refine/classify them.

**YOLO (You Only Look Once)** names a family of one-stage detectors predicting boxes/classes from image features. **Faster R-CNN (Region-based Convolutional Neural Network)** is a two-stage detector: a learned **region proposal network** suggests candidate boxes, then a head classifies/refines them.

A **region of interest (RoI)** is a proposed image region. **RoIAlign** extracts a fixed-size feature grid for it using interpolation, avoiding coarse coordinate rounding. Actual speed/quality depends on implementation and budget.

## 4. Anchors versus anchor-free

**Anchors:** reference boxes with chosen sizes/aspect ratios; predict offsets.

**Anchor-free:** centers, points, or direct geometry without those reference shapes.

Example: an anchor-based head adjusts a 20 × 20 reference to fit the object.

This is a separate design axis from one-/two-stage. Assignment and duplicate handling remain necessary.

## 5. Small objects and scales

Fine maps preserve detail; coarse maps provide context. Feature pyramids combine them.

A four-pixel object may disappear during resizing. Test capture, input resolution, tiling, output stride, and labels before simply adding depth.

## 6. Non-maximum suppression

**Non-Maximum Suppression (NMS)** is a postprocessing algorithm that removes duplicate detections: keep a high-score box, then suppress sufficiently overlapping lower-score boxes, usually within the same class.

Here suppression compares boxes; Canny's similarly named thinning compares neighboring gradient responses.

Example: scores 0.9/0.8, IoU 0.85, suppression cutoff 0.5 → keep the first.

Crowded real objects can also overlap. **Soft-NMS** is a suppression variant that reduces overlapping boxes' scores instead of immediately deleting them.

Keep **score, NMS-overlap, and evaluation-overlap thresholds** distinct.

## 7. Set prediction and constraints

**Set prediction** treats detected objects as an unordered collection. Some detectors use learned **object slots**, output vectors that each propose one object, and **one-to-one matching**, assigning each labeled object to at most one slot. This reduces traditional NMS dependence.

Choose using object sizes, crowding, labels, metrics, and full-pipeline latency.

## 8. Interview reasoning

**Question:** Which detector for crowded scenes under a deadline?

**Answer:** Measure a practical baseline’s crowded/small-object recall, localization, duplicates, and latency. Compare assignment/suppression failures before choosing another family.
