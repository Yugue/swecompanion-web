## Probability calibration

A model is **calibrated** when its 0.7 means the event happens 70% of the time. Ranking quality and calibration are independent properties, and confusing them is a common interview stumble.

### 1. The definition

\[
P\big(y = 1 \mid \hat p = q\big) = q \quad \text{for every } q
\]

Take every case the model scored 0.30. If about 30% of them are positive, the model is calibrated at that score.

A model can rank **perfectly** and be badly calibrated: multiply every score by 0.5 and the ordering - and therefore the AUC - is unchanged, while every probability is now wrong.

---

### 2. When it matters, and when it does not

| Output is used for | Calibration needed? |
|---|---|
| Sorting candidates for a review queue | No - only order matters |
| A recommendation ranking | No |
| A fixed threshold, tuned on the same distribution | Not strictly - the threshold absorbs the distortion |
| Expected value: \(p \times \text{amount}\) | **Yes** |
| Combining several models' probabilities | **Yes** |
| Showing a number to a user or an analyst | **Yes** |
| Comparing risk across segments or over time | **Yes** |

### Rule of thumb

> The moment a probability is multiplied by anything - a dollar value, another probability, a cost - it has to be calibrated.

---

### 3. Diagnosing: the reliability diagram

Bin the predictions, and plot the mean predicted probability against the observed frequency in each bin:

```text
observed │        ╱ perfect calibration
frequency│      ╱
         │    ╱  ●──●         ← below the line: over-confident
         │  ╱ ●
         │╱●
         └──────────────── predicted probability
```

Summaries:

\[
\text{Brier} = \frac{1}{n}\sum_i (\hat p_i - y_i)^2
\]

Brier score combines calibration and discrimination in one number (lower is better). **Expected calibration error (ECE)** is the average gap between the two axes across bins and isolates calibration alone. Log loss also rewards calibration, since it punishes confident mistakes.

---

### 4. Who is miscalibrated, and in which direction

| Model | Typical behavior |
|---|---|
| Logistic regression | Well calibrated by construction (it maximizes Bernoulli likelihood) |
| Naive Bayes | Badly over-confident - the independence assumption multiplies correlated evidence |
| SVM | Outputs a distance, not a probability at all |
| Random forest | Under-confident at the extremes - averaging votes pulls scores toward the middle |
| Boosted trees | Often over-confident, especially with many trees |
| Any model after resampling or class weighting | Shifted away from the true base rate |

---

### 5. Fixing it

Both methods fit a small mapping from raw score to probability, on **held-out** data:

**Platt scaling** - fit a one-dimensional logistic regression on the scores:

\[
p = \sigma(a\,s + b)
\]

Two parameters, works with little data, assumes a sigmoidal distortion.

**Isotonic regression** - fit any monotone step function. More flexible, corrects arbitrary distortions, needs more data (roughly a thousand held-out examples) or it overfits.

```python
CalibratedClassifierCV(base_model, method="isotonic", cv=5)
```

The calibrator must never be fitted on the training data the model already saw - it would learn the model's training-set over-confidence, not its real-world behavior.

---

### 6. Calibration after resampling

This is the connection interviewers probe most often. If you oversampled the positive class 50×, the model has learned a training distribution with a 50× inflated base rate. Its 0.5 corresponds to a much smaller real-world probability.

Either correct analytically for the known sampling ratio, or - simpler and more robust - fit a calibrator on a **held-out set with the original, untouched class distribution**.

---

### 7. Calibration drifts

Calibration is a property of the model *and* the data distribution. When the base rate moves - a seasonal fraud spike, a new market - a previously calibrated model becomes systematically wrong even though its ranking is intact.

So: monitor the mean predicted probability against the realized positive rate, and recalibrate on recent data. Recalibration is cheap - it is a two-parameter fit - and it is often the right response to drift when a full retrain is not yet justified.

---

## What you should say in an interview

For "the output is multiplied by transaction value to estimate expected loss":

> Then calibration matters more than AUC. AUC only tells me the ordering is right; expected loss is p times the amount, so if every probability is inflated by 40% the ranking is fine and every downstream dollar figure is wrong. I would check a reliability diagram and the Brier score, and if the model is off I would fit Platt scaling or isotonic regression on a held-out set with the real class distribution - not the resampled one. I would also monitor predicted versus observed positive rates in production, because calibration drifts with the base rate even when discrimination does not.

Next topic is **Class imbalance**.
