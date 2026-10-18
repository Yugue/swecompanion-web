## Boosting and gradient-boosted trees

## 1. Correct the current ensemble

**Boosting** builds an ensemble sequentially. **Gradient boosting** fits each new model to loss-reducing corrections for the current prediction.

> Each edit responds to the draft currently on the page.

## 2. Work one correction

Start squared-error regression at the training mean, 250:

| Case | Actual / current | Residual / tree correction |
|---|---|---|
| A | 300 / 250 | +50 / +40 |
| B | 200 / 250 | −50 / −40 |
| C | 250 / 250 | 0 / 0 |

With learning rate 0.1, A becomes 254 and B becomes 246. Their remaining residuals are +46 and −46. The correction tree approximates the residuals; it need not match each one exactly.

## 3. Explain the gradient

For loss \(\ell(y,F)\), iteration \(m\) uses targets:

\[
r_i^{(m)}=-\left.\frac{\partial\ell(y_i,F)}{\partial F}\right|_{F=F_{m-1}(x_i)}
\]

\(x_i,y_i\) are one input and target; \(F_{m-1}\) is the current ensemble. These **negative gradients** point toward lower loss. For half-squared error, they equal residuals.

## 4. Add a small fitted step

\[
F_m(x)=F_{m-1}(x)+\eta h_m(x)
\]

\(h_m\) is the new correction model; \(\eta>0\) shrinks its contribution. Smaller steps usually require more trees.

Later trees depend on earlier fits, unlike bagging. The ensemble diagram in the forest lesson contrasts these flows.

## 5. Control useful complexity

Tune learning rate, tree size, and tree count together. Early stopping chooses the count from validation behavior; too many corrections can fit noise.

Boosted trees are strong tabular candidates, but compare measured benefit and serving cost. Their additive predictions can exceed observed target ranges, yet they generally do not extrapolate trends naturally.

## 6. Interview reasoning

**Question:** Does every boosting tree predict the original target?

**Answer:** No. It predicts a correction derived from the current ensemble's loss. Residual fitting is the squared-error special case.
