# 7.5 Domain shift, robustness, and the improvement loop

## 1. Performance depends on the distribution

**Domain shift** means the data-generating conditions at use time differ from training/evaluation conditions. **Robustness** is the ability to retain useful behavior under specified variations.

New cameras, lighting, populations, classes, or acceptance rules can invalidate earlier evidence.

First check pipeline correctness. A BGR/RGB mismatch needs a transform fix.

## 2. Distinguish changes

X denotes input images and Y their target labels. These names describe different changes in their probability distributions:

| Change | Description | Example |
|---|---|---|
| Input/covariate shift | \(P(X)\) changes; pure covariate shift assumes \(P(Y\mid X)\) stays fixed | New lighting/camera |
| Label-prior shift | Class prevalence \(P(Y)\) changes | Defects become more common |
| Concept/target shift | The input-to-target relationship \(P(Y\mid X)\) changes | Revised acceptance criteria |
| Open-set change | Inputs include categories outside the known label set | Unseen defect type |

Changes can coexist. Label-prior correction needs assumptions about class-conditional inputs; unlabeled data alone may not identify prevalence reliably.

## 3. Test intended variation

Hold out cameras, sites, or time periods. Stress-test plausible blur, compression, resolution, illumination, and occlusion.

Synthetic Gaussian blur is a diagnostic, not proof of nighttime robustness.

Evaluate important slices and the chosen operating threshold.

## 4. Match the fix to the cause

```text
failure → check pipeline → review new-domain labels → identify cause
                                                       ↓
                 capture / collect / relabel / recalibrate / fine-tune
```

- Missing visual evidence: improve capture.
- Confidence or prior change: test recalibration.
- Appearance mismatch: collect representative data and test fine-tuning.
- Changed target meaning: revise annotation.

**Domain adaptation** adjusts a system to target-domain data, potentially without labels. Unlabeled adaptation can reinforce errors. Keep an independent labeled holdout.

## 5. Monitor actionable signals

Track input properties, camera metadata, score distributions, abstention, latency, and reviewed outcomes.

An embedding shift is a reason to investigate, not proof of accuracy loss. Stable averages can hide a rare failure.

Assign an owner and response to each alert.

## 6. Collect useful new examples

**Active learning** selects which unlabeled examples to annotate next, aiming to improve learning per label. Selection can use uncertainty, model disagreement, diversity, or important failure slices.

Uncertainty alone can select unreadable images repeatedly. Diversity reduces near-duplicate labeling.

Keep representative evaluation independent. Hard-example collections do not estimate production prevalence directly. Review model-assisted labels.

## 7. Retrain and roll out

Version data, label policy, preprocessing, weights, thresholds, and indexes together.

Compare stable and recent holdouts, including old domains still in use. **Shadow evaluation** runs a candidate beside production without using its predictions for product decisions. **Limited rollout** exposes a small portion of real traffic; **rollback** restores the previous version when specified regressions occur. Define these criteria before release.

Check selection effects: reviewing only flagged images hides unflagged misses.

## 8. Interview reasoning

**Question:** A factory changes cameras and false alarms increase. What next?

**Answer:** Verify color, resolution, orientation, exposure, and calibration. Compare reviewed old/new-camera examples, identify the changed evidence or policy, and test a targeted fix on independent data before rollout.
