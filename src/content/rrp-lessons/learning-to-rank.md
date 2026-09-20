## Learning to rank

**There are three ways to train a model on a ranked list, and they differ in how much of the list the loss function can see.**

```text
pointwise   score each item alone                  "is this item good?"
pairwise    compare two items in the same list     "is A better than B?"
listwise    score the whole ordering at once       "is this list good?"
```

---

## 1. Pointwise

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

## 2. Pairwise

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

## 3. Listwise

Optimize a whole-list metric - NDCG from Chapter 1 - directly.

### Common issue

The obstacle is that ranking metrics are not differentiable: sorting is a step function, so nudging a score a little usually changes the metric by exactly nothing, and occasionally by a jump. Listwise methods work around this with smooth approximations or by weighting gradients by the metric change a swap would cause.

- **Most faithful to the objective.**
- **Most complex to implement and tune,** and in practice the gains over a well-built pairwise model are often modest.

---

## 4. The same list, scored three ways

One query, four candidates. ✓ marks what the user actually clicked.

```text
            true      pointwise      pairwise
            label     predicts       learns
  item A      ✓         0.82          A > B, A > C, A > D
  item B      ✗         0.79          D > B,  D > C
  item C      ✗         0.31
  item D      ✓         0.64
```

**Pointwise** spends effort on the values. It is penalized for predicting 0.82 instead of 1.0 for item A - even though the ordering is already correct and nothing downstream would change.

**Pairwise** only sees the comparisons. It is penalized only where the order is wrong - here, that B (0.79) outranks D (0.64) when D was the click. It does not care that A scored 0.82 rather than 0.95.

That difference matters most when the list is long:

```text
pointwise   spends as much effort on items 40 and 41 as on items 1 and 2
listwise    weights each pair by how much swapping them would move NDCG
            → items 1 and 2 matter enormously, 40 and 41 barely at all
```

### Core intuition

Which is the case for listwise: it is the only one of the three whose loss knows that the top of the list is where the value is.

---

## 5. So why is pointwise still everywhere?

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

## 6. Choosing

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
