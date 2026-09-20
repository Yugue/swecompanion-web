## Error analysis and slice-based evaluation

Aggregate metrics tell you *how much* the model is wrong. Error analysis tells you *what is wrong*, which is the only thing you can act on. It is also the answer interviewers hope for when they ask "the model is 90% accurate - what now?"

### 1. Read the errors

Before touching the model, take a sample - 50 to 100 - of false positives and false negatives and read them by hand.

```python
errors = df[df.pred_label != df.label].sample(100, random_state=0)
```

This is unglamorous and it consistently beats architecture shopping. It is also the one thing candidates rarely propose, which makes proposing it a differentiator.

---

### 2. Sort every mistake into a bucket

Each error belongs to one of a small number of causes, and each cause has a different fix:

| Bucket | Example | Fix |
|---|---|---|
| Label error | The "fraud" was a legitimate purchase | Clean the labels; re-measure the ceiling |
| Missing coverage | No training examples of this merchant category | Collect or augment data |
| Missing feature | The signal is not in x at all | Feature engineering |
| Preprocessing bug | A currency field parsed as a string | Fix the pipeline |
| Genuine ambiguity | Two humans would disagree | Irreducible - stop optimizing |
| Real model limitation | The pattern is learnable and the model missed it | More capacity, better model |

The honest finding is often that a large share of "model errors" are label errors - which caps what any model can achieve and redirects the work to data.

---

### 3. Slice the metrics

An 88% average can hide a 60% on a segment that generates most of the revenue.

```python
df.groupby("segment").apply(lambda g: recall_score(g.label, g.pred_label))
```

Slice by whatever the business cares about:

- customer segment, tier, tenure, geography, language,
- device, platform, browser,
- time - hour, day of week, and especially **recent vs older data**,
- input properties - text length, image quality, number of missing features,
- the model's own confidence band.

### Rule of thumb

> Report the worst slice next to the average. The average is what you built; the worst slice is what someone experiences.

---

### 4. Confidence-band analysis

Group predictions by score band and inspect each:

```text
score band   n      precision   what it means
0.9-1.0     420       0.94      trustworthy - could auto-action
0.7-0.9    1,850      0.71      good enough for human review
0.5-0.7    3,100      0.38      barely better than a coin flip
```

This often reshapes the product rather than the model: auto-approve the top band, route the middle to review, ignore the bottom. That is a better outcome than a 1% metric gain.

---

### 5. Prioritize like an engineer

For each error bucket estimate:

\[
\text{priority} = \text{frequency} \times \text{fixability} \times \text{business impact}
\]

A cause covering 30% of errors that needs one parsing fix beats a cause covering 5% that needs a new data source. Rank the work; do not chase the most intellectually interesting failure.

---

### 6. Fairness is a slice too

Check performance across groups where a systematic gap would be a problem - and know that "we did not use that attribute as a feature" is not a defense, because correlated features reproduce it anyway.

Useful framings:

- equal performance: is recall similar across groups?
- equal treatment: does the same score lead to the same action?
- who bears the cost of the errors, and is that acceptable?

Naming the trade-off - you generally cannot satisfy every fairness definition at once - is a mature answer.

---

### 7. Make it a habit, not an event

- keep a fixed **error set** that you re-check after every change,
- track per-slice metrics in the same dashboard as the aggregate,
- alert on slice regressions, not just on the average,
- re-run the analysis after each retrain: the failure modes move.

---

## Interview mental model

This is the answer to "the model is 90% accurate - what now?" Read 50-100 errors by hand and sort each into a bucket, because each bucket has a different fix:

```text
label error        → clean labels, re-measure the ceiling
missing coverage   → collect or augment data
missing feature    → feature engineering
preprocessing bug  → fix the pipeline
genuine ambiguity  → irreducible, stop optimizing
model limitation   → more capacity
```

Then slice the metrics: an 88% average can hide 60% on the segment that earns the revenue.

**Report the worst slice next to the average.** The average is what you built; the worst slice is what someone experiences.

Prioritize by frequency × fixability × business impact rather than by what's interesting. And treat confidence bands as a product lever: auto-action the top band, route the middle to review, ignore the bottom - often worth more than a 1% metric gain.

That completes **Chapter 5 — Evaluation in depth**. Next topic is **k-Means clustering**.
