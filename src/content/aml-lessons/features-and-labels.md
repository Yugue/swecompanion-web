## Features, labels, and a training example

Training data is a table. **Each row is one thing you are predicting about, the columns are what you knew at the time, and one extra column is what actually happened.**

```text
        features - what we knew at the time        label - what happened
 ┌──────────────────────────────────────────┐    ┌──────────────┐
 │ distance   prep_time   hour   couriers   │    │ delivery_min │
 │   2.4 km     11 min     19        6      │ →  │      34      │   ← one row
 │   5.1 km     26 min     12        2      │ →  │      58      │   ← another
 └──────────────────────────────────────────┘    └──────────────┘
```

The features are written **x**, the label **y**. Said carefully: a row is a snapshot of everything the model will know at prediction time, paired with what actually happened afterwards. Getting that sentence right prevents most of the failures in this domain.

### 1. The shapes

\[
X \in \mathbb{R}^{n \times d}, \quad y \in \mathbb{R}^{n}
\]

```text
X.shape == (n_samples, n_features)
y.shape == (n_samples,)
```

- a **row** is one example (one user, one session, one transaction, one user-item pair),
- a **column** is one feature,
- \(y_i\) is the outcome for row \(i\).

Always state the unit of a row out loud. "Per user" and "per session" lead to completely different systems, and the interviewer is listening for whether you noticed.

---

### 2. The timeline is the whole game

Every row has an implicit prediction time \(t\):

```text
        ← features computed from here        label observed here →
────────┬───────────────────────────┬────────────────────────────→ time
     history                   prediction t                 outcome
```

The rule:

> A feature may only use information available strictly before \(t\). A label is only observable strictly after it.

Breaking this rule is called **leakage** - the model gets shown something it could not possibly know yet, so it looks brilliant offline and is worthless in production. It is the single most common serious bug in applied ML, and it gets a full lesson in Chapter 2.

---

### 3. Defining a label operationally

"Churned" is not a label. This is a label:

> y = 1 if the account had zero sessions in the 30 days following the prediction date, and was not cancelled for a billing failure.

A usable definition names:

- the **event** (zero sessions),
- the **window** (30 days after t),
- the **exclusions** (billing failures are a different problem),
- and **when it becomes observable** (30 days later - so your freshest training data is always 30 days stale).

### Rule of thumb

> If two engineers can build the label table and get different rows, the label is not defined yet.

---

### 4. Where labels come from

| Source | Cost | Noise | Delay |
|---|---|---|---|
| Human annotation | high | moderate, measurable | days |
| Implicit signal (click, purchase) | free | biased by what was shown | minutes |
| Downstream outcome (chargeback, return) | free | low | weeks to months |
| Programmatic rule | free | high, systematic | instant |

Implicit labels carry **exposure bias**: you only observe outcomes for items the current system chose to show. A recommender trained only on its own clicks slowly learns to agree with itself.

---

### 5. A worked example: delivery ETA

- **Unit**: one order, at the moment the order is placed.
- **x**: restaurant's median prep time over the last 7 days, current open orders at that restaurant, distance, hour-of-day, weather, courier supply in that area *right now*.
- **y**: minutes between order placement and handover.
- **Observable**: ~40 minutes later.

Now test each feature against the timeline:

```text
"courier who accepted the order"      ← chosen AFTER t. Leakage.
"restaurant prep time last 7 days"    ← available at t. Fine.
"actual prep time for this order"     ← that is part of the label. Leakage.
```

Two of the three most predictive-looking features are illegal. That is typical.

---

### 6. Features are contracts with the serving system

A feature that exists in your training warehouse but cannot be computed in 20ms at request time is not a feature - it is a research artifact.

For each feature ask:

- can it be computed **at all** at prediction time?
- can it be computed **fast enough**?
- will it be computed **identically** offline and online? (train/serve skew - see the **deployment** lesson.)

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
