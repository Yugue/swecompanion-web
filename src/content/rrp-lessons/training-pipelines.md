## Building the training data

**Turning raw logs into training rows involves several choices, and each one silently decides what the model can learn.**

```text
impression log  +  outcome log  →  joined by impression/event keys  →  training rows
                                          ↑
                        every decision about this join is a modelling decision
```

---

## 1. Join with stable event keys and deduplicate

Use an impression ID or request ID plus slot to attach outcomes to the exact display. Joining only on user, item, and an approximate timestamp can merge repeated impressions or assign a click to the wrong exposure.

Deduplicate retried events using event IDs and define attribution when one outcome follows several exposures. Check row counts and join multiplicity before training.

---

## 2. The join, and its window

```text
impression at 14:00
        │
        ├─ click at 14:00:03      ✓ obviously this impression
        ├─ purchase at 16:30      ? was it this impression, or the search at 16:00?
        └─ purchase in 6 days     ? attribute to the impression at all?
```

The **attribution window** is a real choice with real consequences:

```text
too short   → slow conversions are labelled negative → model learns to chase fast clicks
too long    → credit goes to impressions that had nothing to do with it
```

### Core intuition

There is no correct answer. There is a decision, and it should be stated in the design rather than inherited from whoever wrote the pipeline first.

---

## 3. Down-sampling negatives

```text
1% click rate → 99 negatives per positive
keep 1 in 10 negatives → manageable data, distorted base rate
```

This is near-universal and almost free, provided you remember two things: the predicted probability must be recalibrated to the original class rate, and sampling must not be correlated with anything the model uses. Sampling negatives only from certain hours or surfaces builds that bias straight in.

### Rule of thumb

> Down-sample negatives randomly, record the rate, and correct the output. Two of those three get forgotten.

---

## 4. Wait for label maturity and handle late events

Define an observation window for every label and a cutoff for accepting late arrivals. A purchase not yet observed is an unfinished example, not necessarily a negative.

For delayed targets, train on mature cohorts or use an explicit delay-aware method. Track label-completion rates so ingestion problems do not look like a sudden drop in user engagement.

---

## 5. What a row should carry

```text
identifiers      user, item, request, session, timestamp
features         AS SERVED - log the exact values seen by the model
position         the slot in which the item was shown
propensity       the probability that the serving policy selected it
outcome          click, dwell, purchase, complaint - several labels, not one
provenance       which retrieval source, which model version
```

### Rule of thumb

The last three are the ones people omit and then cannot add retrospectively. Position is straightforward to log; an exact selection propensity requires a policy whose action probabilities are known. A deterministic score is not a selection probability. Capture these fields deliberately if you intend to use bias-aware evaluation.

---

## 6. Reconstruct only features available at the impression

For an impression at 14:00, a purchase at 14:20 can become the label, but it cannot become an input feature. Likewise, an end-of-day item click rate includes events the live model could not know at 14:00.

Use logged serving values or a **point-in-time join**, which retrieves the most recent feature version available before the decision. Check both event time and availability time: a historical event arriving later was still unavailable to the original request.

---

## 7. Version the dataset so a result can be reproduced

Record the extraction period, feature definitions, eligibility rules, sampling rates, label windows, code version, and train/validation/test boundaries. Keep evaluation data fixed while comparing model variants.

---

## 8. Validate data before fitting a model

Check future-feature leakage, duplicate rows across splits, join multiplicity, unexpected class rates, and missing user/item slices. Compare row counts and feature distributions with the previous run.

If click labels suddenly halve, investigate outcome ingestion and attribution before accepting that behavior changed. Block training or promotion when a critical check fails; a successful job can still produce an invalid dataset.

---

## 9. The pipeline as a product

```text
raw logs → dedupe → join impressions to outcomes → attribute
        → sample negatives → assemble features-as-served
        → validate → partition by time → train
```

Assign ownership and alerting to each transition, and retain the dataset version used by every deployed model. A reproducible pipeline lets you trace a quality regression back to a specific data or attribution change.

---

## What matters most

- **A training row is an impression joined to what happened next,** and the attribution window is a real modelling choice.
- **Down-sample negatives randomly, record the rate, and correct the predictions.**
- **Label delay bounds how fast the system can react,** whatever else you build.
- **Log position, known action propensities, and features-as-served deliberately.** Missing action probabilities may not be recoverable later.
- **Validate the pipeline against the previous run,** so an upstream break stops the build instead of shipping a model.

Next topic is **Retraining and drift**.
