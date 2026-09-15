## Class imbalance

Most production ML problems that show up in system design interviews - fraud, churn, rare disease detection, ad clicks - are heavily imbalanced. The naive approach of just training on the raw data quietly fails, and interviewers use this topic specifically to check whether you notice.

### Why accuracy lies to you here

A model can hit 99.9% accuracy on a dataset where only 0.1% of examples are positive, simply by always predicting the majority class. That model is useless - it catches zero fraud - but "99.9% accurate" sounds like a headline win if you don't know to distrust it.

\[
\text{accuracy} = \frac{\text{correct predictions}}{\text{total predictions}} \quad \text{is dominated by the majority class when imbalance is severe}
\]

This is why the offline evaluation lesson in this chapter emphasizes precision, recall, F1, and PR-AUC instead of accuracy for imbalanced problems - but before you even get to evaluation, class imbalance shapes how you should train the model in the first place.

### Resampling

Two directions, both changing what the model sees during training:

- **Oversampling** the minority class (including synthetic oversampling like SMOTE, which interpolates between existing minority examples) increases how often the model encounters positive examples.
- **Undersampling** the majority class discards some negative examples so the classes are closer to balanced.

Both work by changing the *effective* class distribution the model trains on - which means the model's raw output probabilities no longer reflect the true, real-world class distribution. If you oversampled the positive class 50x, the model's "0.5 probability" no longer means "50% chance of fraud in the real world" - it means "50% chance under the artificially rebalanced training distribution."

> Whatever resampling you do at training time, always evaluate on the original, untouched class distribution. Resampling is a training-time trick to help the model learn the minority class pattern - it is not a change to reality, and pretending otherwise corrupts your evaluation.

### Class-weighted loss

Instead of duplicating or discarding data, a class-weighted (or focal) loss penalizes mistakes on the minority class more heavily during optimization, without changing the actual data distribution the model observes. This avoids some downsides of resampling (oversampling can encourage overfitting on duplicated minority examples; undersampling throws away potentially useful majority-class information) while still pushing the model to pay attention to the rare class.

\[
L_{\text{weighted}} = -\sum_i w_{y_i} \left[ y_i \log(\hat y_i) + (1 - y_i)\log(1-\hat y_i) \right]
\]

where \(w_{y_i}\) is larger for the minority class. Focal loss goes further, dynamically down-weighting easy, already-well-classified examples so training effort concentrates on hard and minority-class examples.

### Recalibrating after resampling

If you did resample and need genuine probabilities back (not just a ranking), you can recalibrate the model's output after training - for example with Platt scaling or isotonic regression fit on a held-out, non-resampled validation set. This maps the distorted probabilities back to something that reflects real-world frequency, which matters whenever the downstream system consumes the probability directly (e.g. to compute expected monetary loss) rather than just thresholding it.

### Putting it together

A complete answer on this topic in an interview does three things:

1. **Names the trap**: accuracy is misleading under imbalance, and says what you'd use instead (PR-AUC, recall at a fixed precision, F1).
2. **Picks a training-time strategy**: class-weighted loss is usually the safer default; resampling can help but requires care about what it does to output calibration.
3. **Confirms the evaluation is honest**: whatever was done to the training distribution, evaluation happens on the real, original distribution - and if calibrated probabilities are needed downstream, they're recalibrated after training.
