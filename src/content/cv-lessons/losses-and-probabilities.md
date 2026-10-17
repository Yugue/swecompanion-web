# 3.3 Predictions, probabilities, and training objectives

## 1. Prediction, loss, metric

- **Prediction:** model output.
- **Loss:** differentiable training objective.
- **Metric:** measure of success.

Example: train a detector using classification/box losses; evaluate **average precision (AP)**, a ranked precision–recall summary. Precision is the fraction of predicted positives that are correct; recall is the fraction of actual positives found.

A falling loss is useful only if the target outcome improves.

## 2. Logits and probabilities

**Logits** are unrestricted scores.

**Softmax** turns a list of logits into positive class probabilities summing to one. Use it for mutually exclusive classes:

\[
p_k=\frac{e^{z_k}}{\sum_j e^{z_j}}
\]

Example: [0,0] → [0.5,0.5]. Adding the same constant changes nothing; stable implementations subtract the maximum.

**Sigmoid** maps one logit to a probability between zero and one. Apply it to a binary decision or separately to coexisting labels:

\[
p=\frac{1}{1+e^{-z}}
\]

“Cat” and “outdoors” can both be true. Separate sigmoid outputs do not imply real labels are independent.

## 3. Cross-entropy

**Cross-entropy** measures disagreement between a target distribution and predicted probabilities. For a single true class y, it is the negative log probability assigned to that class:

\[
L=-\log p_y
\]

Example:
- Correct-class probability 0.8 → loss about 0.223.
- Probability 0.1 → loss about 2.303.

**Binary cross-entropy (BCE)** handles a target y of 0 or 1:

\[
L=-y\log p-(1-y)\log(1-p)
\]

This maximizes probability assigned to observed targets. Sum/mean reduction changes gradient scale; weighting can change **calibration**, whether predicted probabilities match observed outcome frequencies.

## 4. Stable APIs

```python
loss = torch.nn.functional.cross_entropy(logits, class_ids)
binary_loss = torch.nn.functional.binary_cross_entropy_with_logits(z, labels)
```

- Multiclass: [B,K] logits, [B] integer targets.
- Binary: matching logit/float-target shapes.
- Pass raw logits; do not softmax first.

## 5. Regression losses

**Regression** predicts continuous values, such as a coordinate or depth. Its **residual** is r = prediction − target:

| Loss | Behavior | Example |
|---|---|---|
| Squared error (L2 loss): square the residual | Quadratic | r=2 → 4; r=10 → 100 |
| Absolute error (L1 loss): take residual magnitude | Linear | r=2 → 2; r=10 → 10 |
| Huber loss: join squared and absolute-style penalties | Quadratic near zero, linear farther out | Threshold controls transition |

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
