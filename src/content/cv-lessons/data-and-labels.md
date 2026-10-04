# 7.1 Data collection, annotation, and label quality

## 1. Labels define the decision

A faint scratch might be a defect, acceptable wear, or an uncertain case. Decide which before collecting labels.

Define the positive/negative policy and annotation unit: image, box, mask, text, or keypoint.

More images help when they add relevant, independent evidence.

## 2. Write an annotation policy

```text
product decision → policy → pilot labels → disagreement review
                     ↑                           ↓
                     └──────── revise ───────────┘
```

Specify classes, occlusion, truncation, minimum size, overlap, and ignored regions.

- Boxes: visible or estimated full extent?
- Masks: which boundary and instance?
- OCR: normalize text how? What counts as unreadable?
- Pose: label occluded joints or ignore them?

Use concrete examples for borderline cases.

## 3. Audit quality

Double-label a representative pilot and adjudicate disagreements. Look for missing annotations as well as wrong ones.

| Error | What the model learns | Repair |
|---|---|---|
| Missing box | Real object is background | Completeness audit |
| Inconsistent boundary | Noisy geometry | Boundary examples |
| Ambiguous class | Conflicting targets | Clarify or mark uncertain |
| Annotator bias | Systematic mistakes | Independent slice review |

Inspect agreement by class, size, lighting, and source.

## 4. Collect deployment coverage

Inventory cameras, sites, lighting, seasons, orientations, sizes, and prevalence.

A thousand adjacent frames can add less diversity than ten independent sessions.

Split by the intended source/group unit. Balanced training data and representative evaluation data can have different purposes; document both.

## 5. Handle rare cases

Sampling, weighting, augmentation, and targeted collection solve different shortages.

Oversampling five defects repeatedly may teach memorization. Synthetic defects may miss real artifacts.

Collect hard negatives, such as reflections mistaken for scratches, and enough real positives to evaluate recall. Define novel-but-normal cases for anomaly tasks.

## 6. Buy the needed supervision

Image labels are often cheaper than boxes, and boxes cheaper than masks. Measure actual workflow cost.

Counting may need boxes. Measuring damaged area may need masks. Weak supervision must still demonstrate the required output.

Assisted labeling cost includes correction and review.

## 7. Keep traceability

Version datasets, provenance, ontology, and annotation policies.

For each failure, ask: missing coverage, ambiguous target, wrong annotation, or model limitation?

Collect or relabel to test a specific hypothesis.

## 8. Interview reasoning

**Question:** Annotators disagree about faint defects. What do you do?

**Answer:** Clarify the acceptance decision, create borderline examples and an uncertainty policy, then repeat a pilot with adjudication. Evaluate those cases separately before changing model capacity.
