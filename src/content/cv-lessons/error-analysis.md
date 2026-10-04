# 7.4 Error analysis, calibration, and reliable evaluation

## 1. Turn errors into hypotheses

An aggregate score says how well the system performs under one summary. Error examples suggest what to fix.

Inspect missed positives, false alarms, confident mistakes, and geometry or identity failures.

## 2. Slice by plausible causes

```text
errors → size / lighting / camera / source / class / occlusion
                              ↓
                    likely cause → experiment
```

Useful slices include tiny objects, faint defects, crowded people, unusual fonts, and crossing tracks.

Check sample counts. Searching many tiny slices can produce differences from noise.

## 3. Separate pipeline stages

- Detection: discovery, class, localization, duplicates.
- OCR: region, recognition, reading order, field assignment.
- Retrieval: embedding versus ANN misses.

Test OCR on trusted crops, tracking with trusted detections, or retrieval with exact search.

These isolate components; retain end-to-end evaluation.

## 4. Calibration means reliable confidence

Among 100 predictions near 0.8 confidence, roughly 80 should be correct if calibrated on that distribution.

Reliability diagrams compare confidence bins with observed accuracy. Good ranking does not guarantee calibrated probabilities.

**Temperature scaling** divides logits by a positive validation-fitted temperature. It preserves multiclass argmax while adjusting confidence. Check it again under shift.

Detection confidence needs a definition tied to class and matching correctness.

## 5. Choose an operating point

\[
C=C_{FP}\,FP+C_{FN}\,FN
\]

If 100 false alarms cost 1 each and five misses cost 100 each, total cost is \(100+500=600\).

Include review and abstention costs when relevant. Select thresholds under realistic prevalence: rare positives can produce many false alerts even with a small false-positive rate.

## 6. Respect uncertainty

Compare models on the same held-out examples when possible.

Bootstrap independent videos, subjects, or sessions—not adjacent frames. Ten thousand frames from two videos are not ten thousand independent sources.

Rare critical cases need enough positives for credible recall estimates. Report limited evidence when counts are small.

## 7. Test explanations through behavior

Saliency can suggest a watermark or background shortcut. It does not establish causality.

Remove the watermark, change the background, or test another camera while preserving relevant evidence. See whether predictions change as hypothesized.

## 8. Interview reasoning

**Question:** Overall AP improves but nighttime performance worsens. Would you ship?

**Answer:** Check nighttime evidence, uncertainty, severity, prevalence, and slice requirements. Isolate the failing stage. A critical slice regression needs a targeted repair and controlled reevaluation before rollout.
