## Feature engineering

Feature engineering is where domain knowledge enters the model. On tabular problems it is usually worth more than swapping model families, and it is the part of applied ML that generalizes least from a textbook - which is why interviewers ask for concrete examples.

---

## 1. The four moves that cover most cases

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

## 2. One raw column, five features

The raw log has a `login_attempts` column. On its own it is nearly useless - it conflates a busy user with a suspicious one. Derived properly it becomes several genuinely different signals:

```text
raw                       what it confuses
  failed_logins = 50      a busy user vs. an attack

derived                                              separates
  failure_rate = 50/(52+1)      = 0.94    ← almost every attempt failed
  failure_rate = 50/(5000+1)    = 0.01    ← normal user, high volume
  attempts_1h / attempts_30d÷30 = 18×     ← a burst, relative to their own habit
  distinct_ips_1h               = 14      ← spread, not just volume
  hours_since_last_success      = 72      ← recency
```

### Intuition

The same underlying event, five questions. Note that the ratio works for a user the model has never seen, because it is scaled by that user's own history rather than by an absolute count - which is the transferability point above, made concrete.

---

## 3. Time windows

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

### Common issue

Every window must end **before** the prediction time. A window that straddles it is leakage (see the **data leakage** lesson).

---

## 4. Cyclic time features

Hour of day and day of week are circular. Encoded as integers, the model is told that hour 23 and hour 0 are 23 apart.

\[
x_{\sin} = \sin\!\left(\frac{2\pi h}{24}\right), \quad x_{\cos} = \cos\!\left(\frac{2\pi h}{24}\right)
\]

```python
df["hour_sin"] = np.sin(2 * np.pi * df.hour / 24)
df["hour_cos"] = np.cos(2 * np.pi * df.hour / 24)
```

### Intuition

Two columns, and now midnight is adjacent to 11pm. (Trees can learn this from the raw integer with enough splits; linear models cannot.)

---

## 5. Skewed numerics

Money, counts, durations, and page views are usually long-tailed. A log transform:

\[
x' = \log(1 + x)
\]

compresses the tail, makes the relationship closer to linear, and stops a handful of whales from dominating a squared-error loss. Use `log1p` so zeros survive.

### Rule of thumb

Binning is the blunt alternative: it buys robustness to outliers and non-monotone shapes, and pays with resolution. Prefer it when the relationship genuinely has thresholds ("under 18 / 18-65 / over 65").

---

## 6. Interactions

A linear model cannot learn "risky only when the account is new **and** the amount is large" unless you hand it the product:

```python
df["new_x_large"] = (df.account_age_days < 7) * np.log1p(df.amount)
```

### Intuition

Trees discover interactions automatically by nesting splits, which is a large part of why gradient boosting is so strong on tabular data. This gives a clean framing:

> Feature engineering is how you give a simple model the nonlinearity a complex model would have found by itself.

---

## 7. Generalize vs. memorize

| Generalizing | Memorizing |
|---|---|
| rates, ratios, aggregates, embeddings | raw IDs, exact categories |
| works on a brand-new user | only works on entities seen in training |
| fewer parameters, more robust | needs a lot of data, drifts fast |

### Rule of thumb

Large-scale systems deliberately use both - the "wide and deep" pattern - but for a small tabular dataset, memorizing features are mostly a route to overfitting.

---

## 8. Stop when it stops paying

### Common issue

Adding features is not free: each one is a serving dependency, a possible source of skew, and another thing to monitor. Judge each candidate by:

- measured lift on validation, not plausibility,
- whether it is computable at prediction time, within the latency budget,
- whether it will still mean the same thing in six months.

---

## What matters most

- **Prefer rates and ratios to raw counts;** they transfer to users and items the model has never seen.
- **The window length is the feature,** and every window must end before the prediction time.
- **Feature engineering hands a simple model the nonlinearity a complex one would find itself** - interactions, log transforms, and sin/cos for cyclic time.
- **Generalizing features (rates, aggregates) beat memorizing ones (raw IDs)** on small tabular data, where memorizing mostly invites overfitting.
- **Every feature is a serving dependency,** so keep it only if it shows measured lift, is computable within the latency budget, and will still mean the same thing in six months.

Next topic is **Data leakage**.
