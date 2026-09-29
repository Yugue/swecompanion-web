## Features for ranking

**A ranker's strength comes mostly from its features, and the ones that matter most describe the *relationship* between this user and this item.**

---

## 1. The four families

```text
USER      who they are            age of account, country, long-run interests
ITEM      what it is              category, creator, price, age, quality
CONTEXT   the moment              device, hour, day, query, page, position
CROSS     user × item             ← this is where personalization lives
```

### Core intuition

The first three are easy and everyone has them. The fourth is what separates a personalized system from a popularity chart.

---

## 2. Cross features, concretely

```text
how many videos by THIS creator has THIS user watched?          → 14
what fraction of THIS user's purchases are in THIS category?    → 31%
is THIS item's price within THIS user's usual band?             → yes
days since THIS user last engaged with THIS category            → 2
```

These explicit lookup features need user and item together, so they do not fit the independently computed inputs of a **two-tower retrieval model**. Separate towers can still learn compatibility from user and item attributes; ranking adds unrestricted joint features.

### Rule of thumb

> Cross features provide explicit relationship evidence. User and item features can also personalize through learned interactions.

---

## 3. Ranking the feature families by what they buy

Add one family at a time and watch the metric:

```text
features in the model                          normalized discounted cumulative gain at 10 (NDCG@10)
item only        (category, age, quality)       0.31     ← a popularity model
+ user           (country, tenure, interests)   0.34     ← who they are
+ context        (device, hour, surface)        0.36     ← the moment
+ CROSS          (user × creator, user × cat)   0.44     ← the big jump
+ session        (last 50 interactions)         0.49     ← what they want NOW
```

The two large jumps are both relationship features. Item, user, and context features together are worth +0.05; the cross and session features are worth +0.13 between them.

The reason is that the first three can only ever express "this item is generally good" and "this user generally likes things like this" as *separate* statements. Only a cross feature can say "this user, specifically, watches this creator" - and that is what personalization actually is.

---

## 4. Smooth rates with little evidence

One click from one impression gives an observed click rate of 100%, but very little confidence. A **smoothed rate** blends this evidence with a prior, such as `(clicks + α × baseline_rate) / (impressions + α)`.

With baseline rate 5% and α=20, one click from one impression gives `(1+1)/21 ≈ 9.5%`, not 100%. Include observation counts as well so the model can distinguish established affinity from a lucky first event.

---

## 5. Counters over several windows

Most behavioral features are a count or a rate over a time window, and the window length is part of the feature:

```text
clicks on this category, last 1 hour     → what they are doing right now
clicks on this category, last 7 days     → current interest
clicks on this category, last 90 days    → durable taste
```

### Intuition

Including several lets the model compare them, which is how "this is unusual for this user" becomes learnable. Prefer rates to raw counts - a heavy user clicks more of everything, so raw counts mostly encode how active they are.

---

## 6. Position is a feature, and a trap

Observed display position strongly predicts clicks, but the final position is not known before ranking. One approach trains a click model with observed position, then holds that input constant for all candidates when estimating comparable scores.

This relies on modeling assumptions; it does not automatically disentangle relevance from visibility. Never feed the old model's output position as though it were an intrinsic item attribute. Validate using suitable intervention or visibility evidence, and use a bias-aware objective when justified.

---

## 7. Every feature is a production commitment

```text
can it be computed at request time, within budget?
is it computed IDENTICALLY offline and online?
what happens when the service providing it is slow or down?
will it still mean the same thing in six months?
```

### Common issue

The second question is the expensive one. A feature computed differently during training and serving creates **training-serving skew**: the model quietly receives inputs unlike the ones it learned from. The main defence is to log features exactly as served and train on those logged values.

---

## 8. Measure value with feature ablations

Train comparable models with and without one feature family. Evaluate quality by slice, feature-fetch latency, missing-value behavior, and freshness requirements.

The example gains above illustrate a possible pattern, not a promise that cross features always provide the biggest lift. Keep a costly feature only when it adds repeatable value over a simpler alternative.

---

## What matters most

- **Four families: user, item, context, and cross** - and the cross features are where personalization actually lives.
- **Explicit candidate-specific cross inputs do not fit independently computed towers.** Ranking can use richer joint features; retrieval still learns compatibility.
- **Use rates over several time windows,** so the model can see both a durable habit and a sudden change.
- **Position needs an explicit treatment,** because visibility affects clicks and the final display position is unknown before ranking.
- **Every feature is a serving dependency** that must be fast, available, and computed identically offline and online.

Next topic is **Deep ranking models**.
