## Loss functions for classical models

## 1. Specify what fitting should prefer

A **loss function** assigns cost to a prediction. Training minimizes an aggregate of these costs; an **evaluation metric** judges the resulting behavior.

An **objective** is the full expression optimized, which may also include regularization.

## 2. Compare numeric losses

```aml-visual
regression-losses
```

For error \(e=\hat y-y\), predicted minus actual:

| Loss | Shape | Ideal target |
|---|---|---|
| Squared, \(e^2\) | Large misses grow rapidly | Conditional mean |
| Absolute, \(\lvert e\rvert\) | Constant slope on each side | Conditional median |
| Huber | Quadratic near zero, linear beyond a boundary | Boundary-dependent compromise |
| Quantile | Different slopes on each side | Chosen conditional percentile |

**Conditional** means among outcomes with the same inputs. A restricted model may only approximate these targets.

## 3. See why the target changes

For outcomes [1, 1, 10], the best squared-error constant is the mean, 4. The best absolute-error constant is the median, 1.

The losses answer different questions about the same data.

## 4. Express asymmetric costs

**Quantile loss** targets percentile \(q\in(0,1)\). For residual \(r=y-\hat y\):

\[
\ell_q(r)=\begin{cases}qr,&r\ge0\\(q-1)r,&r<0\end{cases}
\]

At \(q=0.8\), underpredicting by 10 costs 8; overpredicting by 10 costs 2. With constant per-unit costs, choose \(q\) as underprediction cost divided by total under- and overprediction costs.

## 5. Separate fitting from decisions

Logistic regression develops log loss for probabilities; SVMs develop hinge loss for margins.

**Class weights** multiply selected training losses. A threshold instead changes actions after fitting. Accuracy and F1 are discontinuous in thresholded outputs, so gradient methods commonly train a useful **surrogate**, or substitute objective, then tune decisions separately.

## 6. Interview reasoning

**Question:** Why can a model with lower squared loss overpredict the typical outcome?

**Answer:** Squared loss targets a mean pulled upward by rare large values. If the decision needs a typical central outcome, compare a median or another appropriate percentile.
