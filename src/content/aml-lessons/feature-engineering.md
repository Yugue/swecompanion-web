## Feature engineering

## 1. Expose a useful relationship

**Feature engineering** constructs model inputs from raw observations. A good feature makes a relevant relationship easier to learn.

| Feature | Question answered |
|---|---|
| Seven-day order count | How active recently? |
| Failures / attempts | How often does an attempt fail? |
| Hours since login | How stale is activity? |
| New-account indicator × amount | Does amount behave differently for new accounts? |

The last is an **interaction**: one feature changes another's effect.

## 2. Keep rate denominators

Fifty failures out of 52 attempts differs from fifty out of 5,000. Keep the attempt count: 1/2 and 1,000/2,000 have different reliability.

**Smoothing** pulls a noisy estimate toward a reference. Target encoding develops the weighted-average mechanism; the same idea can stabilize low-count rates.

## 3. Align time windows and units

```text
orders_1d        = recent daily activity
orders_30d / 30  = longer-window daily average
```

Their ratio can reveal a burst. Define behavior for zero or tiny denominators, and include only events available at prediction time.

## 4. Put cycles on a circle

```aml-visual
cyclic-features
```

For hour \(h\in\{0,\ldots,23\}\):

\[
x_{\sin}=\sin(2\pi h/24),\qquad x_{\cos}=\cos(2\pi h/24)
\]

These two features locate the hour on a daily cycle. Both coordinates distinguish positions; hours 23 and 0 become neighbors. More complex patterns may need additional frequencies or bins.

## 5. Match the representation to the model

For nonnegative amount \(a\), \(\log(1+a)\) compresses large values. It changes the input, not the target loss.

A linear model needs an explicit product feature to express that interaction. A tree can express one through nested tests. Keep features that improve validation enough to justify their live data dependencies.

## 6. Interview reasoning

**Question:** Why might integer hour 0–23 be a poor distance feature?

**Answer:** It separates adjacent hours 23 and 0. Sine and cosine preserve their cyclic neighborhood while allowing a smooth daily pattern.
