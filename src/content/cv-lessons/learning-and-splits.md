# 3.1 Learning problems, baselines, and valid data splits

## 1. Define one prediction

Choose the **prediction unit** before the model.

Examples:
- Classification: one class per image.
- Detection: a set of boxes per image.
- Video: a label per clip or identity per object.

Use only inputs available at inference.

## 2. Choose the learning signal

| Learning | Signal | Example |
|---|---|---|
| Supervised | Task labels | Defect/no defect |
| Unsupervised | Structure | Feature clustering |
| Self-supervised | Targets from observations | Predict missing patches |

Self-supervised learning still has an objective.

**Parameters** are learned weights. **Hyperparameters** configure learning: rate, batch size, resolution.

## 3. Establish a baseline

Start with a cheap credible solution:
- Majority class.
- Threshold/morphology.
- Pretrained classifier.
- Nearest-neighbor features.

Example: at 1% defect prevalence, “always good” gives **99% accuracy, zero defect recall**.

Measure whether complexity improves the relevant outcome.

## 4. Train, validation, test

```text
train      → fit weights
validation → select settings / thresholds / checkpoints
test       → evaluate the selected system
```

Repeated test tuning makes it another validation set. Fit preprocessing statistics on training data.

## 5. Split independent sources

Example: neighboring frames from one video appear nearly identical. A random frame split can leak the same scene into both sets.

Group by:
- Video/session.
- Subject/product.
- Source photograph.
- Site/camera/time.

Deduplicate first and keep related variants together.

## 6. Match deployment conditions

A useful test includes realistic lighting, object size, and class prevalence.

Example: a balanced benchmark helps compare classes but may not predict factory alert volume.

Use separate holdouts for new cameras or future time periods; state what each tests.

## 7. Count independent evidence

Ten thousand frames from ten videos are not ten thousand independent scenes.

Estimate uncertainty at the video/session level. Keep stable holdouts for comparison and recent evaluations for evolving conditions.

> More observations are useful when they add independent, relevant evidence.

## 8. Interview reasoning

**Question:** Great random-frame accuracy, poor new-video performance—why?

**Answer:** Check source leakage and background shortcuts. Hold out whole videos/sessions, evaluate deployment conditions, and compare a simple baseline before changing architecture.
