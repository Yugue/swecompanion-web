## Serving a model: batch, online, and train/serve skew

**"Serving" is everything that happens after training: getting a real prediction to a real user.**

```text
batch   → compute every prediction overnight, look the answer up instantly
online  → compute the prediction on demand, while the user waits
```

Which one you pick decides your latency budget, where features come from, and how fresh the answer can be. It is also where the most expensive production bug lives.

### 1. The three serving modes

```text
BATCH     nightly job scores every user  → write to a table → product reads it
ONLINE    request arrives → fetch features → model → response (ms)
STREAMING event arrives → score continuously → push downstream
```

| | Batch | Online |
|---|---|---|
| Latency at request time | none (a table lookup) | the model is in the critical path |
| Freshness | as stale as the last run | current |
| Cost | cheap, amortized, easy to retry | a service to run, scale, and page on |
| Inputs | anything in the warehouse | only what is fetchable in budget |
| Failure mode | stale predictions | an outage the user sees |

### Rule of thumb

> Use batch unless the prediction depends on something that happened in the last few minutes. Most "we need real-time" requirements do not.

A weekly churn score does not need an online model. A fraud decision at checkout does.

---

### 2. The hybrid that most large systems use

```text
offline (batch)                 online (per request)
──────────────────              ─────────────────────
user/item embeddings    ──────→ dot product + light re-rank
expensive aggregates    ──────→ combined with 2-3 live features
```

Precompute the expensive part, do something cheap at request time. This is how recommendation systems answer in tens of milliseconds over millions of items.

---

### 3. Train/serve skew

The classic production bug: the same feature, computed two different ways.

```text
training  : "avg order value, 30d"  computed in SQL, UTC days, nulls → 0
serving   : "avg order value, 30d"  computed in Java, local time, nulls → skipped
```

Nothing errors. The model simply receives inputs that are systematically different from those it learned on, and performance quietly degrades.

Common sources:

- two implementations of one definition (the big one),
- different null and default handling,
- timezone or rounding differences,
- a scaler or encoder refitted on live data instead of loading the stored parameters,
- training on backfilled, corrected data that was not available live,
- different library versions changing a transform's behavior.

Defenses:

1. **one implementation** - share the transformation code between training and serving, or use a feature store that owns the definition,
2. **log the features as served**, and train on those logs rather than on a warehouse reconstruction,
3. **shadow-compare**: score the same requests offline and online and diff the feature vectors,
4. **contract tests**: assert offline and online produce identical values on a fixed sample.

\[
\text{train\_feature}(x) \stackrel{!}{=} \text{serve\_feature}(x)
\]

---

### 4. Version everything together

A deployment is not just model weights. It is the model, the preprocessing, the feature definitions, and the schema. If they can drift apart, they eventually will.

```text
model_v7 ── preprocessing_v7 ── feature_defs_v7 ── schema_v7
```

Keep the previous version loadable, so rollback is a config change rather than a retrain.

---

### 5. Rolling out safely

```text
shadow      → model scores live traffic, output is logged, not used
canary      → 1-5% of traffic, watch quality and latency
progressive → 25% → 50% → 100%
rollback    → one flag, no retraining
```

Shadow mode is the step that catches skew before any user is affected: you can diff online features and predictions against the offline pipeline on real traffic, at zero risk.

---

### 6. Degrade gracefully

Every online feature is a dependency that can be slow or missing. Decide, in advance, per feature:

- serve without it (the model must tolerate missing values),
- use a stale cached value, with a maximum age,
- fall back to a simpler model or the previous rule,
- fail closed (block) or fail open (allow) - a business decision, not an engineering one.

A model that returns a 500 when the feature store times out is worse than a rule that always answers.

---

## What matters most

- **Default to batch.** Use online only when the prediction depends on something that happened in the last few minutes; most "we need real-time" requirements do not.
- **Train/serve skew is the expensive bug:** the same feature computed two different ways. Nothing errors - the model just quietly receives inputs unlike the ones it learned on.
- **The fix is one implementation,** shared between training and serving or owned by a feature store, plus logging features as served and training on those logs.
- **A deployment is model *plus* preprocessing, feature definitions, and schema.** Version them together, and keep the previous version loadable so rollback is a config change.
- **Shadow mode catches skew at zero risk** by scoring real traffic without acting on it.
- **Decide the fallback per feature in advance,** because every online feature is a dependency that can be slow or missing.

Next topic is **Monitoring, drift, and retraining**.
