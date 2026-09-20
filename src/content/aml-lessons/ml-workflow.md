## The applied ML workflow

An applied ML project is a loop, not a pipeline. Knowing the order - and which steps people skip - is what separates an answer that sounds like a textbook from one that sounds like experience.

### 1. The loop

```text
     ┌──────────────────────────────────────────────┐
     ↓                                              │
  frame → data → split → baseline → model → evaluate → deploy → monitor
     ↑                                    │                        │
     └──────────── error analysis ────────┘                        │
     └────────────────── drift / retraining ───────────────────────┘
```

Every arrow back is normal. Most real projects spend far more time between *data* and *evaluate* than on modelling.

---

### 2. Frame the problem

Before anything else, answer:

- what **decision** does this change, who makes it, how often?
- what is the **unit of prediction** - per user, per session, per item pair?
- what is the **label**, operationally, and when does it become observable?
- what does a mistake cost in each direction?
- what would "good enough to ship" be?

If those cannot be answered, no model will help. This is also where you decide whether ML is warranted at all.

---

### 3. Data and split, before modelling

```text
1. assemble the data at the right unit and point in time
2. audit every feature against the prediction timestamp (leakage)
3. split - chronological if time exists, grouped if entities repeat
4. THEN start looking at the training data
```

The split comes early on purpose. Exploring the full dataset first, then splitting, means your choices have already been informed by the test set.

---

### 4. Baseline

Two baselines, both cheap:

- the **trivial** one - majority class, global mean, last value - which tells you what the metric means,
- the **existing system** - the current rules or the manual process - which is what you must beat to justify the project.

Then a simple model: logistic regression or gradient-boosted trees with defaults. This is often the last model too.

---

### 5. Iterate with evidence

```text
train → evaluate on validation → error analysis → decide the next change
```

The order matters: the next change comes from reading the errors, not from a list of algorithms. In practice the highest-yield moves are usually, in order:

1. fix data and label problems,
2. add a feature that carries new information,
3. tune the model,
4. change the model family.

Most candidates propose them in reverse.

### Rule of thumb

> If two consecutive experiments moved the metric less than the fold-to-fold noise, stop tuning and go read the errors.

---

### 6. Evaluate for the decision, not for the leaderboard

- slice the metrics (segment, geography, time, confidence),
- pick the threshold from the cost of each error, not from 0.5,
- check calibration if the probability is consumed downstream,
- compare against the baseline with a spread, not a single number.

---

### 7. Deploy and close the loop

Shipping is the start of the second half:

- serve it (batch, online, or hybrid) with the same feature computation as training,
- version the model, features, and preprocessing together, and keep a rollback,
- roll out gradually: shadow → small percentage → full,
- monitor inputs, predictions, latency, and eventually quality,
- define the retraining trigger *before* launch, not after the first incident.

---

### 8. What to postpone deliberately

Saying what you would *not* do first is a strong signal:

- deep learning on a 50k-row tabular problem,
- a feature store before there are features worth sharing,
- hyperparameter search before the baseline exists,
- distributed training before a single machine is exhausted,
- a real-time serving path when a nightly batch would meet the need.

---

## Interview mental model

Walk the loop in order, and name the steps people skip:

```text
frame the decision → split the data → baseline → iterate on evidence
        ↑                                              │
        └────────── evaluate for the decision ─────────┘
                              ↓
              deploy → monitor → retraining trigger
```

- **Framing comes first and decides everything else:** the decision, the unit of prediction, the operational label, the cost of each error, and what "good enough to ship" means.
- **Split before exploring,** or your choices have already seen the test set.
- **Two baselines:** the trivial one tells you what the metric means, the existing system is what you must beat to justify the project.
- **Improvements come in a reliable order** - data and label fixes, then a new feature, then tuning, then a different model family. Most candidates propose that list backwards.
- **Shipping is the start of the second half.** Define the retraining trigger before launch, not after the first incident.

Next topic is **Choosing a model under real constraints**.
