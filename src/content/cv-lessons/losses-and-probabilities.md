# 3.3 Predictions, probabilities, and training objectives

## 1. Prediction, loss, metric

- **Prediction:** model output.
- **Loss:** differentiable training objective.
- **Metric:** measure of success.

Example: train a detector using classification/box losses; evaluate box AP.

A falling loss is useful only if the target outcome improves.

## 2. Logits and probabilities

**Logits** are unrestricted scores.

Exclusive classes use softmax:

\[
p_k=\frac{e^{z_k}}{\sum_j e^{z_j}}
\]

Example: [0,0] → [0.5,0.5]. Adding the same constant changes nothing; stable implementations subtract the maximum.

Binary/coexisting labels use sigmoid:

\[
p=\frac{1}{1+e^{-z}}
\]

“Cat” and “outdoors” can both be true. Separate sigmoid outputs do not imply real labels are independent.

## 3. Cross-entropy

For true class y:

\[
L=-\log p_y
\]

Example:
- Correct-class probability 0.8 → loss about 0.223.
- Probability 0.1 → loss about 2.303.

For binary y:

\[
L=-y\log p-(1-y)\log(1-p)
\]

This maximizes probability assigned to observed targets. Sum/mean reduction changes gradient scale; weighting can change calibration.

## 4. Stable APIs

```python
loss = torch.nn.functional.cross_entropy(logits, class_ids)
binary_loss = torch.nn.functional.binary_cross_entropy_with_logits(z, labels)
```

- Multiclass: [B,K] logits, [B] integer targets.
- Binary: matching logit/float-target shapes.
- Pass raw logits; do not softmax first.

## 5. Regression losses

For residual r = prediction − target:

| Loss | Behavior | Example |
|---|---|---|
| Squared error | Quadratic | r=2 → 4; r=10 → 100 |
| Absolute error | Linear | r=2 → 2; r=10 → 10 |
| Huber | Quadratic near zero, linear farther out | Threshold controls transition |

Huber threshold delta uses \(\tfrac12r^2\) near zero and \(\delta(|r|-\tfrac12\delta)\) outside.

Target units determine what “large error” means.

## 6. Combine objectives

\[
L=\lambda_cL_{\mathrm{class}}+\lambda_rL_{\mathrm{reg}}
\]

Coefficients balance classification and regression. Equal coefficients do not mean equal gradient influence.

Inspect each branch and task metric.

## 7. Interview reasoning

**Question:** Why not optimize accuracy directly?

**Answer:** Accuracy changes discretely and provides little local gradient signal. Cross-entropy gives a useful slope; still choose thresholds and evaluate the actual decision metric independently.
