## Feature engineering

Feature engineering is where domain knowledge enters the model. On tabular problems it is usually worth more than swapping model families, and it is the part of applied ML that generalizes least from a textbook - which is why interviewers ask for concrete examples.

### 1. The four moves that cover most cases

```text
aggregate  → counts, sums, means over a window   ("orders in the last 30 days")
ratio      → normalize one quantity by another   ("spend per order")
difference → compare to a reference              ("price vs category median")
transform  → reshape a distribution              ("log(amount)")
```

Raw counts are weak features because they conflate activity with intensity. A user with 50 failed logins is alarming if they made 52 attempts and unremarkable if they made 5,000.

\[
\text{failure\_rate} = \frac{\text{failed\_logins}}{\text{total\_attempts} + 1}
\]

The `+1` avoids dividing by zero and shrinks the rate for users with almost no history - the same smoothing idea as in target encoding.

### Rule of thumb

> Prefer rates and ratios over raw counts. They transfer to users and items the model has never seen.

---

### 2. Time windows

Most behavioral features are an aggregate over a window, and the window length *is* the feature:

```text
purchases_1d   → reacts instantly, very noisy
purchases_7d   → weekly rhythm, decent signal
purchases_90d  → stable habit, slow to react
```

Including several windows lets the model compare them, which is how "this week is unusual for this user" becomes learnable:

\[
\text{burst} = \frac{\text{purchases\_1d}}{\text{purchases\_30d}/30 + \epsilon}
\]

Every window must end **before** the prediction time. A window that straddles it is leakage (see the **data leakage** lesson).

---

### 3. Cyclic time features

Hour of day and day of week are circular. Encoded as integers, the model is told that hour 23 and hour 0 are 23 apart.

\[
x_{\sin} = \sin\!\left(\frac{2\pi h}{24}\right), \quad x_{\cos} = \cos\!\left(\frac{2\pi h}{24}\right)
\]

```python
df["hour_sin"] = np.sin(2 * np.pi * df.hour / 24)
df["hour_cos"] = np.cos(2 * np.pi * df.hour / 24)
```

Two columns, and now midnight is adjacent to 11pm. (Trees can learn this from the raw integer with enough splits; linear models cannot.)

---

### 4. Skewed numerics

Money, counts, durations, and page views are usually long-tailed. A log transform:

\[
x' = \log(1 + x)
\]

compresses the tail, makes the relationship closer to linear, and stops a handful of whales from dominating a squared-error loss. Use `log1p` so zeros survive.

Binning is the blunt alternative: it buys robustness to outliers and non-monotone shapes, and pays with resolution. Prefer it when the relationship genuinely has thresholds ("under 18 / 18-65 / over 65").

---

### 5. Interactions

A linear model cannot learn "risky only when the account is new **and** the amount is large" unless you hand it the product:

```python
df["new_x_large"] = (df.account_age_days < 7) * np.log1p(df.amount)
```

Trees discover interactions automatically by nesting splits, which is a large part of why gradient boosting is so strong on tabular data. This gives a clean framing:

> Feature engineering is how you give a simple model the nonlinearity a complex model would have found by itself.

---

### 6. Generalize vs. memorize

| Generalizing | Memorizing |
|---|---|
| rates, ratios, aggregates, embeddings | raw IDs, exact categories |
| works on a brand-new user | only works on entities seen in training |
| fewer parameters, more robust | needs a lot of data, drifts fast |

Large-scale systems deliberately use both - the "wide and deep" pattern - but for a small tabular dataset, memorizing features are mostly a route to overfitting.

---

### 7. Stop when it stops paying

Adding features is not free: each one is a serving dependency, a possible source of skew, and another thing to monitor. Judge each candidate by:

- measured lift on validation, not plausibility,
- whether it is computable at prediction time, within the latency budget,
- whether it will still mean the same thing in six months.

---

## What you should say in an interview

Asked for three features for a ride-hailing ETA model:

> First, a ratio: the driver's recent average speed on similar road types, rather than a raw distance, because distance alone ignores traffic. Second, a rolling aggregate: median trip duration on this route in the last 30 minutes, which captures live congestion - that one is a real-time feature and needs a streaming path at serving. Third, cyclic encodings of hour-of-day and day-of-week, so rush hour is learnable by a linear model. A gradient-boosted tree would find the third by itself, so I would prioritize the first two, and I would check each one's lift on validation before committing to the serving cost.

Next topic is **Dimensionality reduction and PCA**.
