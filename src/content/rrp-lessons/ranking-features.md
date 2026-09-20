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

Note that none of these can exist in the two-tower retrieval model from Chapter 3, because each needs the user and the item together. That is precisely why ranking is a separate stage with a different model.

### Rule of thumb

> If a feature does not mention both the user and the item, it is not doing personalization work.

---

## 3. Ranking the feature families by what they buy

Add one family at a time and watch the metric:

```text
features in the model                          NDCG@10
item only        (category, age, quality)       0.31     ← a popularity model
+ user           (country, tenure, interests)   0.34     ← who they are
+ context        (device, hour, surface)        0.36     ← the moment
+ CROSS          (user × creator, user × cat)   0.44     ← the big jump
+ session        (last 50 interactions)         0.49     ← what they want NOW
```

The two large jumps are both relationship features. Item, user, and context features together are worth +0.05; the cross and session features are worth +0.13 between them.

The reason is that the first three can only ever express "this item is generally good" and "this user generally likes things like this" as *separate* statements. Only a cross feature can say "this user, specifically, watches this creator" - and that is what personalization actually is.

---

## 4. Counters over several windows

Most behavioral features are a count or a rate over a time window, and the window length is part of the feature:

```text
clicks on this category, last 1 hour     → what they are doing right now
clicks on this category, last 7 days     → current interest
clicks on this category, last 90 days    → durable taste
```

### Intuition

Including several lets the model compare them, which is how "this is unusual for this user" becomes learnable. Prefer rates to raw counts - a heavy user clicks more of everything, so raw counts mostly encode how active they are.

---

## 5. Position is a feature, and a trap

The position an item was shown in strongly predicts whether it was clicked. Including it as a training feature is standard, and serving it is impossible - you do not know the position until after you rank.

```text
training:  include position, so the model can separate "clicked because good"
           from "clicked because it was at the top"
serving:   set it to a constant (say, position 1) for every candidate
```

This is one standard way of handling position bias; Chapter 5 covers the idea properly.

---

## 6. Every feature is a production commitment

```text
can it be computed at request time, within budget?
is it computed IDENTICALLY offline and online?
what happens when the service providing it is slow or down?
will it still mean the same thing in six months?
```

### Common issue

The second question is the expensive one. A feature computed one way in the training pipeline and another way at serving time produces a model that quietly receives inputs unlike the ones it learned on - and nothing errors. Chapter 6 covers the defence, which is to log features exactly as served and train on those logs.

---

## What matters most

- **Four families: user, item, context, and cross** - and the cross features are where personalization actually lives.
- **Cross features cannot exist in the retrieval model,** which is the concrete reason ranking is a separate stage.
- **Use rates over several time windows,** so the model can see both a durable habit and a sudden change.
- **Position is included in training and faked at serving,** because you cannot know it before you rank.
- **Every feature is a serving dependency** that must be fast, available, and computed identically offline and online.

Next topic is **Deep ranking models**.
