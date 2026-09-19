## Features, labels, and a training example

One row of training data is a **snapshot of everything the model will know at prediction time**, paired with what actually happened afterwards. Getting that sentence right prevents most of the failures in this domain.

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

Breaking this is leakage, and it produces a model that looks brilliant offline and is worthless in production. It is the single most common serious bug in applied ML.

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

## What you should say in an interview

When handed any prediction problem, open with the row:

> Let me define one training example first. The unit is one order at placement time. The features are what we know at that instant - restaurant history, distance, current load, time of day. The label is the realized delivery time, which we see about 40 minutes later. That delay matters, because it caps how fresh my training data can be and it rules out any feature computed from the courier assignment, which happens after the prediction.

That answer covers unit, features, label, timing, and leakage in four sentences.

Next topic is **Parameters, hyperparameters, and capacity**.
