## Building the training data

**Turning raw logs into training rows involves several choices, and each one silently decides what the model can learn.**

```text
impression log  +  outcome log  →  joined on (user, item, time)  →  training rows
                                          ↑
                        every decision about this join is a modelling decision
```

---

## 1. The join, and its window

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

## 2. Down-sampling negatives

```text
1% click rate → 99 negatives per positive
keep 1 in 10 negatives → manageable data, distorted base rate
```

This is near-universal and almost free, provided you remember two things: the predicted rate must be corrected afterwards (Chapter 4), and the sampling must not be correlated with anything the model uses - sampling negatives only from certain hours or surfaces builds that bias straight in.

### Rule of thumb

> Down-sample negatives randomly, record the rate, and correct the output. Two of those three get forgotten.

---

## 3. Label delay bounds everything

```text
click      seconds     → can retrain hourly
purchase   hours       → retrain daily
return     14-30 days  → your freshest complete label is a month old
```

### Common issue

Systems with slow labels usually train on a fast proxy and correct with the slow one later, or accept that the slow objective responds slowly. Either way it belongs in the design discussion, because it caps how quickly the system can react to anything.

---

## 4. What a row should carry

```text
identifiers      user, item, request, session, timestamp
features         AS SERVED (Chapter 6) - not recomputed
position         the slot it was shown in (Chapter 5)
propensity       the probability it was selected (Chapter 5)
outcome          click, dwell, purchase, complaint - several labels, not one
provenance       which retrieval source, which model version
```

### Rule of thumb

The last three are the ones people omit and then cannot add retrospectively. Logging propensity and position costs almost nothing today and is the difference between being able to correct for bias next quarter and not.

---

## 5. The pipeline as a product

```text
raw logs → dedupe → join impressions to outcomes → attribute
        → sample negatives → assemble features-as-served
        → validate → partition by time → train
```

Put data validation in the middle: row counts, label rates, null rates, and feature distributions against the previous run. An upstream change that halves your click rate should stop the pipeline, not silently produce a model that ships.

---

## What matters most

- **A training row is an impression joined to what happened next,** and the attribution window is a real modelling choice.
- **Down-sample negatives randomly, record the rate, and correct the predictions.**
- **Label delay bounds how fast the system can react,** whatever else you build.
- **Log position, propensity, and features-as-served** - they cost nothing now and cannot be reconstructed later.
- **Validate the pipeline against the previous run,** so an upstream break stops the build instead of shipping a model.

Next topic is **Retraining and drift**.
