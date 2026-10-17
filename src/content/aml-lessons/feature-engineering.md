## Feature engineering

**Feature engineering** creates useful model inputs from raw observations and domain knowledge. It makes a relationship easier for the chosen model to express.

## 1. Ask a more informative question of the data

| Operation | Example | What it reveals |
|---|---|---|
| Aggregate | Orders in the past seven days | Recent activity |
| Rate | Failed logins / attempts | Failure intensity |
| Difference | Price minus category median | Relative position |
| Recency | Hours since last successful login | Time since an event |
| Interaction | New-account indicator × amount | A combined condition |

Fifty failed logins out of 52 attempts differs from fifty out of 5,000. Keep the attempt count too: a rate based on two observations is less reliable than one based on two thousand.

**Smoothing** pulls unreliable rates toward a reference value. For example, with global failure rate \(p_0\) and strength \(\alpha\):

\[
\text{smoothed rate}=\frac{\text{failures}+\alpha p_0}{\text{attempts}+\alpha}
\]

## 2. Make time windows comparable

Use windows ending at the prediction time, with only events already available then:

```text
purchases_1d          recent activity
purchases_30d / 30    typical daily activity over a longer window
```

Their ratio can indicate a burst, but handle a zero or tiny denominator explicitly. Compare rates in matching units: an hourly count divided by a daily count is not a meaningful “18× hourly burst” without conversion.

## 3. Represent cycles as cycles

Hour 23 and hour 0 are adjacent in a day, despite being far apart as integers.

```aml-visual
cyclic-features
```

\[
x_{\sin}=\sin(2\pi h/24),\qquad x_{\cos}=\cos(2\pi h/24)
\]

Together, these two coordinates locate the hour on a circle. A linear model can use them to express a smooth daily cycle. More complex daily patterns may need additional frequencies, bins, or another model.

## 4. Match transforms to the model

For nonnegative amounts, \(\log(1+x)\) compresses large values. Transforming an input does not automatically make the target loss robust; those are separate choices.

A linear model using only age and amount cannot express their interaction. Adding their product makes that interaction available while remaining linear in the fitted coefficients. Trees can express interactions through nested splits.

Evaluate each added feature on validation data. It also creates a dependency: it must be reproducible, available, and affordable at serving time.

> **Mental image:** features are different lenses on the same events. Keep a lens when it exposes useful structure, rather than merely creating another column.
