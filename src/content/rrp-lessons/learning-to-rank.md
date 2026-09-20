## Learning to rank

**There are three ways to train a model on a ranked list, and they differ in how much of the list the loss function can see.**

```text
pointwise   score each item alone                  "is this item good?"
pairwise    compare two items in the same list     "is A better than B?"
listwise    score the whole ordering at once       "is this list good?"
```

### 1. Pointwise

Train an ordinary classifier or regressor on each item independently, then sort by the score.

```text
(user, item₁) → 0.82
(user, item₂) → 0.31    → sort → item₁, item₃, item₂
(user, item₃) → 0.64
```

- **Simple** - it is just click prediction, reusing everything from the last lesson.
- **Produces a meaningful number** - which auctions and blending need.
- **Ignores that only order matters.** It spends effort getting 0.82 exactly right when all that mattered was that it exceeded 0.64.

---

### 2. Pairwise

Train on comparisons drawn from within the same list.

```text
in this impression: item₁ was clicked, item₂ was not
objective:          score(item₁) > score(item₂)
```

\[
\text{loss} = -\log \sigma\big(s_i - s_j\big)
\]

- **Matches the task** far better, because it optimizes relative order directly.
- **Comparisons come from within one list,** which cancels out anything common to that impression - the query, the page, the user's mood that day.
- **Weights every pair equally,** including a pair at positions 40 and 41 that nobody will see. Refinements weight pairs by how much swapping them would change the metric.

---

### 3. Listwise

Optimize a whole-list metric - NDCG from Chapter 1 - directly.

The obstacle is that ranking metrics are not differentiable: sorting is a step function, so nudging a score a little usually changes the metric by exactly nothing, and occasionally by a jump. Listwise methods work around this with smooth approximations or by weighting gradients by the metric change a swap would cause.

- **Most faithful to the objective.**
- **Most complex to implement and tune,** and in practice the gains over a well-built pairwise model are often modest.

---

### 4. So why is pointwise still everywhere?

```text
the score is consumed by something else
        ↓
ads:      expected value = predicted rate × bid       → needs a true probability
blending: w₁·P(click) + w₂·E[watch] + ...             → needs comparable scales
business: "show anything above 0.6"                   → needs a stable meaning
```

A pairwise model's scores are only meaningful *relative to each other within one list*. The moment anything downstream multiplies, thresholds, or blends the number, you need the pointwise version.

### Rule of thumb

> If the score leaves the ranker and meets money, a threshold, or another model, it must be pointwise and calibrated.

---

### 5. Choosing

| Situation | Approach |
|---|---|
| Ads, auctions, anything multiplied by a bid | pointwise, calibrated |
| Several objectives blended together | pointwise, calibrated |
| Pure ordering, one objective, fixed slate | pairwise |
| Search relevance with graded labels | pairwise or listwise |
| First system | pointwise - it is simpler and reuses your click model |

---

## What matters most

- **The three approaches differ in how much of the list the loss can see** - one item, two, or all of them.
- **Pointwise is simplest and produces a meaningful number;** it wastes effort on score values that do not matter.
- **Pairwise matches the task** and cancels out everything common to an impression, since comparisons come from within one list.
- **Listwise is the most faithful and the most complex,** because ranking metrics are not differentiable.
- **Pointwise dominates production** because downstream systems multiply, threshold, and blend the score - and only a calibrated number survives that.

Next topic is **Features for ranking**.
