## Loss functions for classical models

A **loss function** assigns a cost to a prediction. Training minimizes an aggregate of those costs, often with a complexity penalty. An **evaluation metric** measures the behavior you care about after fitting.

## 1. The loss defines the target of learning

For prediction error \(e=\hat y-y\):

```aml-visual
regression-losses
```

| Loss | Per-example behavior | Ideal population target |
|---|---|---|
| Squared error | \(e^2\) | Conditional mean |
| Absolute error | \(\lvert e\rvert\) | Conditional median |
| Huber | Quadratic near zero, linear outside a chosen boundary | A compromise sensitive to its boundary |
| Quantile | Different slopes for under- and overprediction | Chosen conditional percentile |

“Conditional” means among outcomes with the same available inputs. A restricted fitted model may only approximate these ideal targets.

For outcomes [1, 1, 10], the mean is 4 and the median is 1. Those are different best constant predictions because the losses ask different questions.

## 2. Classification losses

**Log loss** scores predicted class probabilities. For a positive example, loss is \(-\log p\): a confident mistake such as \(p=0.01\) costs about 4.605.

**Hinge loss**, commonly used by support vector machines, is \(\max(0,1-yf(x))\) for labels \(y\in\{-1,1\}\). It becomes zero when the signed score reaches the required margin.

Log loss encourages probability accuracy; hinge loss encourages separation. Neither guarantees a good model when inputs or model assumptions are inadequate.

## 3. Quantile loss expresses asymmetry

For residual \(r=y-\hat y\) and quantile \(q\):

\[
\ell_q(r)=\begin{cases}qr,&r\ge0\\(q-1)r,&r<0\end{cases}
\]

At \(q=0.8\), underpredicting by 10 costs 8; overpredicting by 10 costs 2. Under ideal conditions, minimizing expected loss targets the 80th percentile.

For linear per-unit costs, the appropriate quantile is underprediction cost divided by the sum of under- and overprediction costs. Choose it from the decision rather than because 0.8 sounds cautious.

## 4. Loss, weights, and thresholds have different roles

**Class weights** multiply selected examples' losses, changing what fitting emphasizes. They may improve the desired operating performance and can change probability calibration.

A **threshold** changes actions after scores are fitted. Start by evaluating thresholds under the actual costs or review budget; changing training weights is a separate experiment.

Accuracy and F1 are discontinuous in thresholded predictions and usually supply no useful local gradient. Train with an appropriate surrogate such as log loss, then choose the threshold on validation data. Not every training algorithm requires a smooth loss: trees and specialized optimizers can handle other objectives.
