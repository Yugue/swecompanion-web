## Bias-variance tradeoff

**Bias** is the systematic difference between an average fitted prediction and the true relationship. **Variance** is how much that prediction changes when training data is resampled.

They describe behavior across hypothetical training sets, not two quantities you can read exactly from one train/validation score pair.

## 1. A picture of repeated fitting

```aml-visual
bias-variance
```

A rigid model may repeatedly miss the same curve: high bias, low variance. A flexible model may fit different small wiggles in each sample: higher variance. Flexibility, regularization, and sample size all affect the result.

## 2. Where squared prediction error comes from

For \(y=f(x)+\epsilon\), with zero-mean noise and variance \(\sigma^2\), expected squared error at a fixed input is:

\[
\mathbb E[(y-\hat f(x))^2]
=\operatorname{Bias}(\hat f(x))^2
+\operatorname{Var}(\hat f(x))+\sigma^2
\]

The expectation includes repeated training samples and a new outcome. **Irreducible noise** is uncertainty remaining given the available inputs. Better measurements or additional informative inputs can change that noise floor.

This exact decomposition is for squared error; classification accuracy does not split into these same three additive terms.

## 3. Use train and validation as clues

| Pattern | Possible explanation | Next check |
|---|---|---|
| Both errors high | Underfitting, weak features, noise, or failed optimization | Compare baselines and check fitting |
| Training error low, validation much higher | Overfitting or a mismatch between datasets | Check the split and data pipeline |
| Validation improves as training size grows | More representative data may help | Extend the learning curve |

A depth-2 tree scoring 71% on train and 70% on validation may lack useful flexibility. A depth-30 tree scoring 100% and 72% may be fitting sample-specific detail. Those diagnoses still need context: leakage, shift, and measurement noise can mimic them.

## 4. Choose an intervention from evidence

- **Too rigid:** add relevant features, increase useful capacity, or reduce an excessive penalty.
- **Too sensitive to samples:** try regularization, averaging, or more representative data.
- **Noisy or missing signal:** improve measurement and labels; model complexity alone cannot supply absent information.

More data often reduces estimation variance, but its benefit is not confined to one idealized term. It can change tuning choices and coverage too. A large model can generalize well when data and regularization support it.

> **Mental image:** bias is missing the same bend repeatedly; variance is redrawing a different bend every time the sample changes.
