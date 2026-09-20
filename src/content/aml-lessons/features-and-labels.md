## Features, labels, and a training example

Training data is a table.

> **Each row is one thing you are predicting about, the columns are what you knew at the time, and one extra column is what actually happened.**

```text
        features - what we knew at the time        label - what happened
 ┌──────────────────────────────────────────┐    ┌──────────────┐
 │ distance   prep_time   hour   couriers   │    │ delivery_min │
 │   2.4 km     11 min     19        6      │ →  │      34      │   ← one row
 │   5.1 km     26 min     12        2      │ →  │      58      │   ← another
 └──────────────────────────────────────────┘    └──────────────┘
```

Features are written **x**, the label **y**.

---

## 1. The shapes

\[
X \in \mathbb{R}^{n \times d}, \quad y \in \mathbb{R}^{n}
\]

- a **row** is one example — one user, one session, one transaction, one user-item pair,
- a **column** is one feature,
- \(y_i\) is the outcome for row \(i\).

### Rule of thumb

> Always state the unit of a row out loud. "Per user" and "per session" lead to completely different systems.

---

## 2. The timeline is the whole game

Every row has an implicit prediction time \(t\):

```text
        ← features computed from here        label observed here →
────────┬───────────────────────────┬────────────────────────────→ time
     history                   prediction t                 outcome
```

### Core intuition

> A feature may only use information available strictly **before** \(t\). A label is only observable strictly **after** it.

### Common issue

Breaking that rule is called **leakage** — the model is shown something it could not possibly know yet, so it looks brilliant offline and is worthless in production. It is the single most common serious bug in applied ML, and it gets a full lesson in Chapter 2.

---

## 3. Defining a label two people would build the same way

"Churned" is not a label. This is:

> y = 1 if the account had zero sessions in the 30 days following the prediction date, and was not cancelled for a billing failure.

A usable definition names four things:

```text
event        zero sessions
window       30 days after t
exclusions   billing failures are a different problem
observable   30 days later → your freshest training data is always 30 days stale
```

### Rule of thumb

> If two engineers can build the label table and get different rows, the label is not defined yet.

---

## 4. Where labels come from

| Source | Cost | Noise | Delay |
|---|---|---|---|
| Human annotation | high | moderate, measurable | days |
| Implicit signal (click, purchase) | free | biased by what was shown | minutes |
| Downstream outcome (chargeback, return) | free | low | weeks to months |
| Programmatic rule | free | high, systematic | instant |

### Common issue

Implicit labels carry **exposure bias** — you only observe outcomes for items the current system chose to show. A recommender trained on its own clicks slowly learns to agree with itself.

---

## 5. A worked example: delivery ETA

```text
unit        one order, at the moment it is placed
x           restaurant's median prep time last 7 days, open orders right now,
            distance, hour, weather, courier supply in the area
y           minutes between order placement and handover
observable  ~40 minutes later
```

Now test each candidate against the timeline:

```text
"courier who accepted the order"      ← chosen AFTER t.  Leakage.
"restaurant prep time last 7 days"    ← available at t.  Fine.
"actual prep time for this order"     ← part of the label. Leakage.
```

### Intuition

Two of the three most predictive-looking features are illegal. That is typical, not unlucky.

---

## 6. Features are contracts with the serving system

A feature that exists in your warehouse but cannot be computed in 20ms at request time is not a feature — it is a research artifact.

For each one ask:

```text
can it be computed AT ALL at prediction time?
can it be computed FAST ENOUGH?
will it be computed IDENTICALLY offline and online?
```

### Common issue

The third question is the expensive one. Two implementations of "the same" feature produce a model receiving inputs unlike the ones it learned on — and nothing errors.

---

## Interview mental model

Open any prediction problem by saying four things out loud, in this order:

```text
1. unit      what is one row?                     (per user? per session? per order?)
2. time t    when is the prediction made?
3. features  only what is known strictly before t   ← anything later is leakage
4. label     event + window + exclusions, and when it becomes observable
```

Then test every candidate feature against the timeline, and ask whether it can be computed fast enough, and identically, at serving time. The features that look most predictive are often the ones that break rule 3.

Next topic is **Regression, classification, ranking, and clustering**.
