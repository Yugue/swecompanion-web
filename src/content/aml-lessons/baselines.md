## Baselines and when not to use ML

A **baseline** is a reference method evaluated under the same conditions as a candidate model. It tells you whether the model adds useful value.

“99.2% accurate” sounds strong until the positive rate is 0.8%: predicting every case negative also achieves 99.2% accuracy.

## 1. Use three reference points

| Baseline | Example | What it tests |
|---|---|---|
| Trivial predictor | Majority class; training mean or median | Does the model beat a minimal reference? |
| Current system | Fraud rules; analyst queue; vendor score | Does it improve what people already use? |
| Simple fitted model | Regularized linear or logistic model | Is added complexity worthwhile? |

For squared error, a constant training mean is a natural reference; for absolute error, use the training median. A time forecast should also face a last-value or seasonal reference.

Learn baseline values using training data. Compare candidates on the same validation examples and metrics.

## 2. A worked comparison

Suppose a review team handles 100 cases daily:

| Method | Actual frauds found among 100 reviews |
|---|---|
| Existing rules | 24 |
| Logistic model | 37 |
| Boosted trees | 39 |

The logistic model finds 13 more frauds at the same review budget. The extra two from boosting may be useful, but check uncertainty, fraud value, latency, and maintenance cost before deciding.

A small score difference is not automatically noise. Its reliability depends on sample size, dependence, and how the comparison was selected.

## 3. When a rule may be enough

If the requirement is exactly “flag transactions above $10,000 from accounts less than one day old,” implement and measure that rule. A model is useful only if another learnable pattern improves the outcome.

Other reasons to postpone ML include unavailable labels, no credible evaluation, or operating costs that exceed the expected benefit. A rule also needs monitoring: its assumptions can become stale as the world changes.

## 4. Keep the baseline available

A reference can expose regressions after a pipeline change and provide a fallback when a model cannot serve. It need not be the simplest possible method; the existing strong system is often the most important comparison.

Failing to beat a trivial baseline is a reason to investigate labels, signal, fitting, and evaluation. It does not prove a bug: the available features may contain little predictive information.

> **Mental image:** a model's score is a height measurement. The baseline supplies the ground it stands on.
