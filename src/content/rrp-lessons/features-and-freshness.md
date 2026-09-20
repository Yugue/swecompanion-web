## Features, freshness, and skew

**Ranking features arrive on three different clocks, and the most valuable ones are on the fastest.**

```text
batch          hourly or nightly     long-run user interests, item popularity
near-real-time seconds to minutes    "clicks in the last 10 minutes", live counts
request-time   now                   device, hour, query, page, position
```

### 1. Recency is where the value is

```text
"this user's category affinity over 90 days"      useful
"what this user clicked 4 minutes ago"            far more predictive
```

The catch is that the second is much harder to build. It needs a streaming pipeline, it must survive bursts, and it has to be correct within seconds. A "recent behavior" feature computed by a nightly job is not a recent-behavior feature - it is the most common way the sequence modelling from Chapter 4 quietly fails to deliver.

---

### 2. Train/serve skew is the expensive bug

**The same feature computed two different ways** in training and serving.

```text
training pipeline   SQL over the warehouse, "clicks in the last 7 days"
serving path        a counter service, "clicks in the last 7 days"
                    ↓
            subtly different: timezone, late-arriving events,
            deduplication, what counts as a click
                    ↓
            model receives inputs unlike the ones it learned on
                    ↓
            NOTHING ERRORS. Performance is just quietly worse.
```

### Rule of thumb

> If a feature is defined twice, it is defined differently. The only question is by how much.

---

### 3. The defences, in order of effectiveness

```text
1. log features AS SERVED, and train on those logs        ← the real fix
2. one implementation, shared or owned by a feature store
3. shadow-compare: recompute offline, diff against the logged values
4. contract tests on a fixed sample, asserting equality
```

Option 1 makes skew structurally impossible for anything the model actually used, because the training data *is* the serving data. It costs storage and it is worth it.

---

### 4. Point-in-time correctness

Even with one implementation, the training pipeline has to reconstruct what was true **at the moment of the impression**, not what is true now.

```text
impression at 14:00, user's click count then    = 12
same feature computed today                     = 47    ← includes the future
```

Training on the second teaches the model to use information it will never have. It is leakage, and it is easy to introduce with an innocent-looking join. Logging as served avoids it entirely.

---

### 5. What to monitor

```text
per feature:  null rate, mean, and distribution shift vs training
              staleness - when was this last updated?
              coverage - what fraction of requests have it at all?
system:       fallback rate per feature, and timeouts
```

A feature that silently starts arriving null for 30% of requests will degrade the model with no error anywhere. Null rate and staleness per feature catch more real incidents than any statistical drift test.

---

## What matters most

- **Features arrive on three clocks,** and the fast ones carry the most signal and cost the most to build.
- **A "recent behavior" feature updated nightly is not one,** and this is how sequence models quietly fail in production.
- **Train/serve skew is the expensive bug** - the same feature computed two ways, with no error raised.
- **Logging features as served and training on those logs** makes skew structurally impossible and fixes point-in-time correctness at the same time.
- **Monitor null rate, staleness, and coverage per feature** - they catch more incidents than drift statistics.

Next topic is **Building the training data**.
