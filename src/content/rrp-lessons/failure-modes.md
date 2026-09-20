## Characteristic failure modes

**These systems fail in a small number of recognizable ways.** Naming the pattern turns a vague product complaint into a diagnosis.

### 1. Popularity collapse

```text
symptom   the same few items everywhere, on every page, for everyone
cause     unnormalized similarity (Ch.2), no diversity term,
          or a feedback loop that has been running for months
check     what share of impressions goes to the top 100 items?
fix       normalize similarity, exposure caps, diversity in re-ranking
```

---

### 2. Filter bubble

```text
symptom   a user's feed narrows over time; sessions slowly shorten
cause     the per-user version of the feedback loop (Ch.5)
check     intra-list diversity and category entropy, per user, over WEEKS
fix       diversity constraints, novelty features, exploration
```

The reason this one is missed is that every individual step looks like the model getting better.

---

### 3. Stale or invisible inventory

```text
symptom   new items get almost no impressions; sellers complain
cause     no embedding until retrain, no index entry until rebuild (Ch.6),
          and no exploration budget to give them a chance
check     new-item impression share, and time from upload to first impression
fix       content features in the item tower, a fresh index for new items,
          reserved exploration slots
```

This is the failure with the clearest business consequence: supply leaves.

---

### 4. Offline-online divergence

```text
symptom   consistent offline gains that never appear in A/B tests
cause     exposure bias, position bias, a random rather than time split,
          train/serve skew, or a metric that does not match the business
check     re-run the offline evaluation with a chronological split;
          compare logged serving features against the training set
fix       position-bias correction, propensity logging, features-as-served
```

---

### 5. The quiet ones

```text
train/serve skew        performance decays with no code change (Ch.6)
stale features          a counter service silently stops updating
cache poisoning         a bad slate cached and served for hours
retrieval regression    a source fails; recall drops; the ranker looks fine
position feature leak   position included at serving, not just training
```

The retrieval regression is worth calling out: every ranking metric stays healthy, because the ranker is still doing a good job on the candidates it receives. Only a retrieval-specific recall metric (Chapter 3) catches it.

### Rule of thumb

> When quality drops with no model change, check the inputs before the model: feature freshness, retrieval recall, and fallback rates.

---

### 6. The diagnostic order

```text
1. is it infrastructure?   fallback rates, timeouts, null features, staleness
2. is it retrieval?        recall@k - was the right item even a candidate?
3. is it ranking?          metrics on the candidates actually retrieved
4. is it the list?         diversity, duplication, policy filtering
5. is it the objective?    the model is doing what you asked, and you asked wrong
```

Working it in that order - cheapest and most common first - is the answer to "the feed feels worse", and it is what an interviewer is listening for.

---

## What matters most

- **Popularity collapse** comes from unnormalized similarity or an old feedback loop; check the impression share of the top 100 items.
- **Filter bubbles narrow one user at a time,** and every step looks like an improvement - so track diversity as a trend.
- **Invisible new inventory has the clearest business cost,** since supply leaves; measure time from upload to first impression.
- **Offline-online divergence usually means bias in the logs** or a non-chronological split.
- **A retrieval regression leaves every ranking metric healthy,** so it needs its own recall metric to catch.
- **Diagnose in order: infrastructure, retrieval, ranking, list, objective.**

Next topic is **A ranking system design answer**.
