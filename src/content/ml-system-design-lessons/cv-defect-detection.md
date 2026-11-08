# Few-shot manufacturing defect and anomaly detection

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Detect scratches, cracks, dents, missing components and other anomalies in images of manufactured parts. Most training examples are normal because genuine defects are rare and continually changing. Deploy near production lines with strict latency and false-alarm costs.

# 2. Interviewer–candidate clarification Q&A

**Candidate:** Are defects fixed classes, or do we need to detect unknown defects?  
**Interviewer:** Both known defects and previously unseen anomalies; prioritize unknown-defect detection.

**Candidate:** How many defect labels versus normal images?  
**Interviewer:** Millions of accepted-part images and only hundreds of labeled defects across many types.

**Candidate:** Image-level pass/fail, or location of the defect?  
**Interviewer:** Pass/fail with an anomaly heatmap for inspection.

**Candidate:** Does equipment, material or camera placement change?  
**Interviewer:** Yes; lighting, sensors and production batches drift.

**Candidate:** What's throughput and latency?  
**Interviewer:** 20 items/s per line, inference budget under 50 ms per item.

**Candidate:** Which errors cost more?  
**Interviewer:** Missing a safety-critical defect is expensive, but too many false alarms shut the line down.

# 3. Requirements

**Functional:** Identify suspicious parts; anomaly scores and visual localization; known defect classification if possible; review/defect confirmation; per-machine configuration; rapid adaptation after line/camera change.  
**Non-functional:** Very low latency at edge, robust unseen-defect recall, bounded false-positive rate and human-review volume, auditability of model versions and camera calibration.

# 4. ML objectives

- **Image-level anomaly detection:** AUROC/PR-AUC, recall at fixed false-positive rate (FPR), false alarms per 10K units.
- **Localization:** Pixel-level AUROC, anomaly-region IoU/PRO (per-region overlap), depending annotation availability.
- **Operations:** Escape rate (defective items wrongly passed), review queue volume, throughput, tail latency.
- AUROC can look good despite poor precision for extremely rare defects. Emphasize **PR curves and recall at the real operating FPR**.

# 5. Data

**Labeling approach:** The cheapest reliable supervision is accepted-production normal images plus a small expert-confirmed defect gold set. Frozen patch features and normality modeling avoid bulk defect labels. A multimodal teacher can propose defect descriptions or triage pseudo-labels; it cannot certify a part as safe.

**Quality and escalation:** Use separate production-batch/camera validation and locked real-defect tests. Tune teacher prompts for triage first; adapters are optional only for recurring known defects. Fund expert defect/mask correction only when escape costs and resources justify it; synthetic defects never replace real QA outcomes.

**Feature engineering:** Use registered patch embeddings, distance to a normal coreset, camera/product IDs and local anomaly heatmaps; calibrate per production line.

- Large “normal” image set per product/line; few verified defective parts with pixel masks when feasible.
- Capture real variation in material texture, batch, lighting, focal distance and acceptable cosmetic differences.
- Labels: `normal`, known defect class where available, bounding/pixel defect masks and severity; clarify borderline tolerance with domain experts.
- Train/validation/test split by **production batch, date and camera**; random near-duplicate normal images will mislead.
- Build an **independent defect holdout** including rare anomalies that the model was not trained on; do not tune every unknown-defect example into known training classes.
- Augment illumination/geometric variation; synthetic defect overlays can assist but are not reliable substitutes for real defects.

# 6. Modeling strategy

**Strong baseline: PatchCore-style patch anomaly detection**

1. Use a pretrained CNN/ViT to extract patch features from abundant verified normal images.
2. Store a representative memory bank/coreset of normal patch embeddings.
3. For each new image patch, compute distance to nearest normal patch features; larger distance = more anomalous.
4. Aggregate the patch scores into an image score and spatial heatmap; calibrate threshold on acceptable-production and defect validation data.

Alternatives:

- **PaDiM:** model per-location distributions of normal features; efficient if parts are aligned.
- **Autoencoder/reconstruction models:** high reconstruction error as anomaly proxy, but capable models may also reconstruct defects too well.
- **Few-shot supervised classifier:** helpful for recurrent known defects but not a complete solution for novel ones.

A self-supervised backbone may improve transfer; if positioning is highly repeatable, use image registration and location-aware normality modeling. Avoid treating cosmetic normal variations as anomalies without tolerance definitions.

## Training and inference cost estimate

**Assumptions:** 100 production lines × 20 parts/s per line. Baseline device compute is 20 milliseconds/part; an optional classifier adds 2 milliseconds/part. The normal feature bank contains 1M images. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Frozen normality baseline | No training; bank build: 1M images/build ÷ (1K images/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$1.11/build** | 20 parts/s/line × 20 ms/part = **400 ms compute/s/line**; 100 lines × 1 device/line = **100 devices** |
| Optional known-defect head | 10K images × 10 passes ÷ (200 images/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$0.56/run** | 20 parts/s/line × 22 ms/part = **440 ms compute/s/line** |

# 7. Serving and update strategy

- On-device preprocessing and inference avoids network round trip. Quantize or distill encoder if memory/latency pressure requires.
- Keep per-product/per-camera threshold calibration; a single global threshold will often fail under lighting shifts.
- Change management: new camera/production recipe triggers calibration tests and possibly a fresh normal-feature bank, not blind threshold reuse.
- Online monitoring includes shift in feature distributions, review rates, known-good sample scores and validated escape rates.
- Operating point example: if defect prevalence is 0.1% and FPR is 1%, most alerts can be false even with high recall—hence extremely low FPR may be necessary.

# 8. Architecture

<!-- system-design-diagram -->

A known-defect classifier can run alongside anomaly detection for defect taxonomy; keep its decision separate from detecting genuinely unseen anomalies.

# 9. Evaluation and failure modes

**Offline:** Rare-defect PR-AUC, recall at fixed FPR, pixel localization PRO/IoU, unseen-defect holdout, per-batch/site results.  
**Production:** Escape rate estimated from destructive/sample QA, false rejects per 10K items, reviewer time, P95 latency, equipment-change drift.  
**Failures:** New camera geometry, unrepresentative normal set, subtle defects resembling normal texture, compressed small defect, overly sensitive normality model, rare defect evaluation uncertainty.

**L5 decision:** With scarce defect labels, begin **normality modeling + pretrained features**, not a large supervised multiclass detector. Evaluate under the actual low-prevalence operating point.

# 10. One-minute interview summary

> “With mostly normal data, I’d start from pretrained patch features and normality detection, calibrate recall at very low false-positive rates, and adapt per production line with reviewer feedback.”
