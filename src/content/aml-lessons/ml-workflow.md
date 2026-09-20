## The applied ML workflow

An applied ML project is a loop, not a pipeline. Knowing the order - and which steps people skip - is what separates an answer that sounds like a textbook from one that sounds like experience.

---

## 1. The loop

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

## 2. Frame the problem

Nothing else can be decided until these five are answered, and a project that cannot answer them is not ready for a model.

```text
what DECISION does this change?       who acts on it, how often, with what alternative
what is the UNIT of prediction?       per user? per session? per item pair?
what is the LABEL, operationally?     the event, the window, the exclusions
when does the label become KNOWN?     seconds, days, or a month
what does a MISTAKE cost, each way?   a false alarm vs. a miss, in money or harm
```

**Worked example - a churn project.** The vague version is "predict which customers will churn". The framed version:

```text
decision   the retention team calls 500 customers a week
unit       one subscriber, scored every Monday
label      y = 1 if zero sessions in the 30 days after the scoring date,
           excluding involuntary cancellations from failed billing
known      30 days later, so the freshest usable training data is a month old
cost       a wasted call is ~$4; a churned customer is ~$180 of lifetime value
```

Look at what that already settles. The team can only call 500 people, so this is a **ranking** problem and the metric is recall@500 - not accuracy. The 45:1 cost ratio sets the threshold. The 30-day label delay means the model cannot react to anything that happened this month. None of that required choosing an algorithm.

This is also the point at which you decide whether ML is warranted at all.

---

## 3. Data and split, before modelling

The split comes **before** you explore, and the ordering is not pedantry. If you look at the whole dataset first - plotting distributions, noticing outliers, picking features - your choices have already been informed by the test set, and its score is no longer honest.

```text
✓  load → split → explore the TRAINING split → build
✗  load → explore everything → split → build      ← the test set has leaked into your head
```

Then make the split mimic deployment, using the rules from **train, validation, and test splits**:

```text
repeated entities?   group by user / patient / account
time involved?       split chronologically, with a gap for label maturation
rare positives?      stratify
```

For the churn example: chronological, with a 30-day gap, because the model will always be predicting forward in time.

---

## 4. Baseline

Two baselines, both cheap, both mandatory:

```text
trivial      always predict the majority class, or the global mean
             → tells you what the metric NUMBER means

existing     the current rules, the analyst's spreadsheet, "sort by recency"
             → this is what you must beat to justify the project at all
```

Then a simple model - logistic regression, or gradient-boosted trees on defaults. Very often this is also the final model.

```text
trivial (always "no churn")     recall@500 = 0.04
current rules                   recall@500 = 0.19
logistic regression             recall@500 = 0.31   ← most of the value is here
tuned gradient boosting         recall@500 = 0.34
```

That ladder is the actual finding of the project. Most of the value arrives with the first honest model, and everything after it is a trade against latency, explainability, and maintenance.

---

## 5. Iterate with evidence

The next change comes from reading the errors, not from a list of algorithms. In practice the highest-yield moves are, in order:

```text
1. fix data and label problems        ← usually the biggest single win
2. add a feature carrying NEW information
3. tune the model
4. change the model family
```

Most candidates propose them in exactly the reverse order. The reason this order holds is that a label error caps what *any* model can achieve, while a model change only redistributes the errors you already have.

Read a hundred mistakes by hand before deciding. Error analysis has its own lesson, and it is the difference between "let me try XGBoost" and "38% of our false positives are annual subscribers whose billing date moved, and the label is wrong for all of them."

---

## 6. Evaluate for the decision, not for the leaderboard

```text
slice the metrics          segment, geography, device, tenure, and especially RECENT data
pick the threshold         from the cost ratio, not from 0.5
check calibration          only if a probability is consumed downstream
compare with a spread      mean ± fold-to-fold std, not a single number
quote the baseline         every time
```

For churn: recall@500 by customer tier, because a model that works well on monthly subscribers and badly on annual ones is a model that will be switched off by whoever owns annual renewals.

---

## 7. Deploy and close the loop

Shipping is the start of the second half, not the end of the first.

```text
serve it            batch or online, with the SAME feature computation as training
version together    model + preprocessing + feature definitions + schema
roll out gradually  shadow → 5% → 50% → full, with a rollback that is a config change
monitor             inputs and predictions today; quality when labels mature
define the trigger  what event or threshold causes a retrain - decided BEFORE launch
```

The last line is the one teams skip and then regret. A retraining policy invented during an incident is invented badly.

---

## 8. What to postpone deliberately

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
