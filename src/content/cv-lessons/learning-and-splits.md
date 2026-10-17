# 3.1 Learning problems, baselines, and valid data splits

## 1. Define one prediction

The **prediction unit** is what one answer describes: an image, object, pixel, or video clip.

Examples:
- **Image classification:** assign category labels to an image.
- **Object detection:** locate objects with rectangles (**bounding boxes**) and category labels.
- Video: a label per clip or identity per object.

**Inference** means using a trained model to make predictions. Use only information available when the deployed application makes its prediction.

## 2. Choose the learning signal

| Learning | Signal | Example |
|---|---|---|
| Supervised: learn from provided input–target pairs | Human or measured labels | Defect/no defect |
| Unsupervised: discover patterns without task labels | Data structure | Group similar feature vectors into clusters |
| Self-supervised: construct targets from the input data | Relationships or hidden content | Predict missing image patches |

Self-supervised learning still has an objective.

**Parameters** are learned weights. **Hyperparameters** configure learning: rate, batch size, resolution.

## 3. Establish a baseline

A **baseline** is a simple comparison system. Start with a cheap credible solution:
- **Majority-class predictor:** always choose the most common category.
- Threshold/morphology.
- **Pretrained classifier:** reuse a model already trained on other data.
- **Nearest-neighbor prediction:** compare image feature vectors and use the closest labeled examples.

**Prevalence** is the fraction of true positives in the population. **Accuracy** is the fraction of all predictions correct; **recall** is the fraction of actual positives found.

At 1% defect prevalence, “always good” gives **99% accuracy, zero defect recall**.

Measure whether complexity improves the relevant outcome.

## 4. Train, validation, test

```text
train      → fit weights
validation → select settings / thresholds / checkpoints
test       → evaluate the selected system
```

A **checkpoint** is a saved set of model weights at a training step. Repeated test tuning makes the test set another validation set. Fit preprocessing statistics on training data.

## 5. Split independent sources

**Data leakage** occurs when information unavailable for genuinely new predictions enters training or selection, making evaluation too optimistic.

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

A **holdout** is a group of examples excluded from fitting. Use separate holdouts for new cameras or future time periods; state what each tests.

## 7. Count independent evidence

Ten thousand frames from ten videos are not ten thousand independent scenes.

Estimate uncertainty at the video/session level. Keep stable holdouts for comparison and recent evaluations for evolving conditions.

> More observations are useful when they add independent, relevant evidence.

## 8. Interview reasoning

**Question:** Great random-frame accuracy, poor new-video performance—why?

**Answer:** Check source leakage and background shortcuts. Hold out whole videos/sessions, evaluate deployment conditions, and compare a simple baseline before changing architecture.
