## Offline evaluation and its limits

**You are measuring a new system using logs produced by the old one.** That single fact bounds everything offline evaluation can tell you.

A **ranking metric** scores how well relevant items are ordered, but logged data contains only items the previous system exposed. This chapter asks whether that evaluation is trustworthy: exposure bias, counterfactual correction, online experiments, non-accuracy outcomes, and feedback created by the serving policy.

### Chapter goal

By the end of Chapter 5, you should be able to interpret offline metrics under biased exposure, use propensity reasoning where appropriate, design a randomized A/B test comparing a control with a candidate, monitor beyond-accuracy outcomes, and recognize feedback loops that evaluation itself can miss.

```text
logs contain:  what the OLD ranker chose to show, and what happened
you want:      what the NEW ranker would have shown, and what would have happened
                                    ↑
                              never observed
```

---

## 1. Use a time split for future recommendations

```text
random split   ✗   training rows from Thursday, test rows from Tuesday
                   → the model learns from the future it will not have
                   → and from items that did not exist yet

time split     ✓   train on weeks 1-3, test on week 4
```

### Common issue

For a future-serving claim, a random split can leak later interactions and inventory into training. Other study designs may use different splits, but they must match the intended generalization claim. Leave a gap when labels are slow to mature, so the training window cannot contain outcomes you could not have known.

---

## 2. Missing labels can penalize useful discoveries

An item the old policy never showed has no observed outcome for that user. Treating that missing label as irrelevance rewards agreement with the old policy, not necessarily better recommendations.

The old ranker showed a user five items. They clicked item C.

```text
OLD RANKER's list           your NEW ranker would have shown
  1. item A                   1. item Z     ← never shown, so NO LABEL
  2. item B                   2. item C     ← clicked, label = 1
  3. item C   ← clicked       3. item A
  4. item D                   4. item B
  5. item E                   5. item D
```

Score the new ranker offline. Item C moved from position 3 to position 2, so it gets a small credit. A naive evaluator scores item Z—the new model's best idea—as **irrelevant** because there is no label for it. Nobody ever showed it, so nobody ever clicked it.

```text
new ranker's offline normalized discounted cumulative gain (NDCG): slightly better (C moved up)
new ranker's offline score for its own best idea:  zero
```

If item Z really was the best recommendation, the new model is being penalized precisely for its improvement. And a model that reshuffles the old ranker's five items without introducing anything new will score better offline than one that finds something genuinely superior.

### Core intuition

That is the structural bias, and it is why an offline win is a hypothesis: **offline evaluation rewards agreement with the system that produced the logs.**

---

## 3. What the numbers are still good for

They are not useless. Used honestly, offline evaluation:

```text
✓  catches regressions before anyone sees them
✓  compares two models cheaply and fast
✓  rules out obviously bad ideas without spending traffic
✓  is the only option when you cannot A/B test everything
```

### Rule of thumb

It is a filter, not a verdict. Most changes should pass offline before earning a slot in the online testing queue.

---

## 4. Explaining offline-up, online-flat

This is a standard interview question, and there are several correct answers:

| Cause | Why the numbers disagree |
|---|---|
| Exposure bias | the new model's better items were never shown, so never credited |
| Position bias | offline labels reward reproducing the old placement |
| Distribution shift | the test window is not the live traffic mix |
| Metric mismatch | NDCG improved, the business metric is retention |
| The gain is real but small | it was inside the noise of the live test |
| Train/serve skew | the live model sees different features than the offline one |

Naming three of these, rather than one, is what a strong answer looks like.

---

## 5. Practical protocol

```text
1. split chronologically, with a gap for label maturation
2. evaluate list metrics at the real list length, **k**
3. quote the popularity baseline alongside every number
4. slice by segment - new users, new items, heavy users, each surface
5. check the slices you expect to regress, not just the average
6. treat the result as a candidate for an online test
```

### Common issue

Step 4 matters more here than in most domains, because a model that improves the average while collapsing on new items is a model that will quietly shrink your catalogue.

---

## 6. Specify the candidate pool

Ranking a fixed set of candidates tests ordering; retrieving from the full eligible catalogue tests candidate discovery. Report which task the evaluation actually performs.

Sampling easy negatives can inflate a top-k score. Keep candidate construction identical across models and include full-catalogue or realistic retrieval tests before interpreting the number as production quality.

---

## 7. Report uncertainty as well as an average

Compare models on the same requests and examine per-user differences. **Bootstrapping** repeatedly resamples users to estimate how variable the measured gain is; resample users rather than independent rows when their requests are correlated.

A small mean gain with wide uncertainty is weak evidence. Include slice counts and guardrail regressions, not just the best aggregate metric.

---

## What matters most

- **Offline logs record the old system's choices,** which caps what any offline number can prove.
- **Split by time, with a gap for slow labels.** Match the split to the future-serving question and avoid future information.
- **Items that were never shown have no labels,** so a model that finds genuinely better items is penalized for it.
- **Offline evaluation is a filter, not a verdict** - it catches regressions cheaply and settles nothing.
- **Slice the results,** especially by new users and new items, where a good average can hide a collapse.

Next topic is **Position bias**.
