## Boosting and gradient-boosted trees

**Gradient boosting** builds an additive model one correction at a time. Each new tree is trained to improve the loss of the current ensemble.

## 1. Start with a constant, then correct it

For squared-error regression, begin with the training target mean. The **residual** is actual minus current prediction.

| Example | Actual | Initial prediction | Residual | New tree prediction |
|---|---|---|---|---|
| A | 300 | 250 | +50 | +40 |
| B | 200 | 250 | −50 | −40 |
| C | 250 | 250 | 0 | 0 |

With learning rate \(\eta=0.1\), add one tenth of the tree's correction:

```text
A: 250 + 0.1 × 40  = 254  → residual +46
B: 250 + 0.1 × −40 = 246  → residual −46
C: 250 + 0.1 × 0   = 250  → residual 0
```

The next tree fits what remains wrong about the sum so far. It does not independently fit the original targets like a bagged tree.

## 2. Why “gradient”?

For loss \(L(y,F)\), form targets from its negative derivative with respect to the current prediction:

\[
r_i^{(m)}=-\left.\frac{\partial L(y_i,F)}{\partial F}\right|_{F=F_{m-1}(x_i)},
\qquad F_m(x)=F_{m-1}(x)+\eta h_m(x)
\]

For \(\tfrac12(y-F)^2\), that derivative gives the residual. Other losses give other correction targets. This lets boosting address classification, robust regression, and asymmetric costs. Some implementations also use curvature when estimating updates.

## 3. Tune the correction size and complexity

- **Learning rate:** shrinks each correction.
- **Tree depth or leaf count:** controls which interactions each correction can express.
- **Tree count:** controls how many corrections are added.
- **Early stopping:** selects a stopping point using validation performance.

Smaller steps usually require more trees; neither more trees nor smaller steps guarantees better generalization. Trees are often shallow for regularization, but boosting does not mathematically require a specific depth.

Later corrections can fit noise. Validation must reflect groups and time where relevant, including the data used for early stopping.

## 4. When to try it

Boosted trees are a strong candidate for many tabular datasets with nonlinear relationships. Compare them with a simple baseline and measure serving cost. Named implementations include XGBoost, LightGBM, and CatBoost; their category handling, missing-value support, and regularization differ.

Unlike an ordinary regression tree or a forest of leaf means, an additive boosted model is not universally bounded by the observed target range. It still generally lacks the natural trend extrapolation of a suitable linear model.

> **Mental image:** revise a draft through small edits. Every edit responds to the draft currently on the page.
