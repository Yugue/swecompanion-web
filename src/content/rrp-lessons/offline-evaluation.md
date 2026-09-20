## Offline evaluation and its limits

**You are measuring a new system using logs produced by the old one.** That single fact bounds everything offline evaluation can tell you.

```text
logs contain:  what the OLD ranker chose to show, and what happened
you want:      what the NEW ranker would have shown, and what would have happened
                                    ↑
                              never observed
```

### 1. Split by time, never at random

```text
random split   ✗   training rows from Thursday, test rows from Tuesday
                   → the model learns from the future it will not have
                   → and from items that did not exist yet

time split     ✓   train on weeks 1-3, test on week 4
```

Random splits inflate every number, badly, and are the most common reason an offline result does not survive contact with a live test. Leave a gap when labels are slow to mature, so the training window cannot contain outcomes you could not have known.

---

### 2. The ceiling: you can only score what was shown

```text
your new model would have surfaced item X at position 1
        ↓
item X was never shown to this user by the old system
        ↓
there is no label for it
        ↓
it counts as "not relevant"
```

So a model that surfaces genuinely better items gets **penalized** offline for doing so. Offline evaluation systematically favours models that agree with the old ranker.

### Rule of thumb

> Offline evaluation rewards agreement with the system you are trying to replace. Treat a win as a hypothesis, not a result.

---

### 3. What the numbers are still good for

They are not useless. Used honestly, offline evaluation:

```text
✓  catches regressions before anyone sees them
✓  compares two models cheaply and fast
✓  rules out obviously bad ideas without spending traffic
✓  is the only option when you cannot A/B test everything
```

It is a filter, not a verdict. Most changes should pass offline before earning a slot in the online testing queue.

---

### 4. Explaining offline-up, online-flat

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

### 5. Practical protocol

```text
1. split chronologically, with a gap for label maturation
2. evaluate list metrics at the real k (Chapter 1)
3. quote the popularity baseline alongside every number
4. slice by segment - new users, new items, heavy users, each surface
5. check the slices you expect to regress, not just the average
6. treat the result as a candidate for an online test
```

Step 4 matters more here than in most domains, because a model that improves the average while collapsing on new items is a model that will quietly shrink your catalogue.

---

## What matters most

- **Offline logs record the old system's choices,** which caps what any offline number can prove.
- **Split by time, with a gap for slow labels.** Random splits inflate everything.
- **Items that were never shown have no labels,** so a model that finds genuinely better items is penalized for it.
- **Offline evaluation is a filter, not a verdict** - it catches regressions cheaply and settles nothing.
- **Slice the results,** especially by new users and new items, where a good average can hide a collapse.

Next topic is **Position bias**.
