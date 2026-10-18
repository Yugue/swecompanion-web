## Retraining and drift

## 1. Match the response to the cause

**Retraining** fits updated model parameters. **Drift** is a change in data or the input–outcome relationship.

Feature refresh and index publication update different components; neither necessarily requires new parameters.

## 2. Diagnose which component aged

| Change | Candidate response |
|---|---|
| New feature-supported item | Encode and insert into compatible index |
| New session action | Refresh history |
| Changed behavior | Evaluate newer training evidence |
| Changed score scale | Recheck calibration and selection |
| Frozen feature counter | Repair the data path |

## 3. Rule out an incident

Check feature ages, nulls, joins, source timeouts, fallback traffic, and index versions.

A broken pipeline can resemble changed interests. Retraining on corrupted inputs does not fix the broken dependency.

## 4. Check whether drift affects the task

A different traffic mix need not reduce quality. A changed relationship between inputs and outcomes may require new labels.

Compare serving health separately from later engagement or satisfaction evidence. Repeatedly fitting unchanged old data cannot teach a newly changed relationship.

## 5. Choose the training window

Short windows adapt quickly but lose evidence for rare users and items. Long windows stabilize estimates but retain obsolete behavior.

Compare windows and recency weights on later requests and cold slices. Include label maturity, compute, and rollout delay in the cadence.

## 6. Promote a complete compatible update

Check encoders, item vectors, preprocessing, index, calibration, and decision rules together.

A **rollout gate** is a predeclared requirement an update must pass before receiving more traffic. Retain the previous compatible bundle for rollback.

There is no universal daily retraining rule.

## 7. Interview reasoning

**Question:** Input distributions changed but later-period quality is stable. Retrain immediately?

**Answer:** A distribution shift alone does not establish damage. Check serving health and outcome evidence, then compare a candidate update against the current model.
