## Comparing models honestly

**Model comparison** asks whether one complete learning procedure performs better than another under the same intended use. A measured score is an estimate from finite data, not an exact property of a model.

## 1. Compare paired outcomes

Evaluate candidates on the same held-out examples or folds, using the same metric and constraints. Each model may need its own appropriate preprocessing, fitted within training data.

| Fold | Model A | Model B | B − A |
|---|---|---|---|
| 1 | 0.84 | 0.85 | +0.01 |
| 2 | 0.88 | 0.89 | +0.01 |
| 3 | 0.80 | 0.81 | +0.01 |

Fold difficulty makes both scores move, but the paired differences are consistent. Comparing only each model's separate standard deviation misses that relationship.

Fold scores share training data and are not independent observations. Their standard deviation is not automatically a confidence interval, nor a universal cutoff for declaring a difference real.

## 2. Quantify uncertainty at the right unit

A **paired bootstrap** resamples evaluation units with replacement, keeping both models' predictions together, then recomputes their metric difference.

If independent units are patients, resample patients rather than individual scans. For time-dependent observations, use an appropriate block or temporal method. A row-wise bootstrap assumes independence that may not exist.

An interval including zero indicates uncertainty about the direction of improvement under that method. An interval excluding zero still says nothing by itself about practical value.

Training randomness and dataset sampling are separate sources of variation. Repeat fits when training variability matters.

## 3. Account for selection

Trying many variants and keeping the highest validation score selects partly for favorable noise. Use a fresh final holdout or nested cross-validation to assess the chosen procedure.

Freeze the primary metric and important slices before final evaluation. If you keep changing the candidate after examining test results, that set has become development data.

## 4. Measure product value and cost

Compare latency, memory, training cost, slice performance, reliability, and maintenance alongside prediction quality. A small quality gain can be worthwhile at huge scale; a larger one can still miss the product's constraints.

Offline data measures prediction quality under the recorded process. An **A/B test** randomly assigns an eligible experimental unit to a current or candidate policy and measures outcomes. Use a randomization unit and guardrails appropriate to the product; request-level randomization can be valid for some settings and invalid for others.

> **Mental image:** run two tools on the same jobs, compare the paired results, then ask whether the difference matters enough to change the workflow.
