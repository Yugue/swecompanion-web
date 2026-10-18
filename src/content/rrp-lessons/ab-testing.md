## Online testing

## 1. Randomize the policy being used

An **A/B test** randomly assigns experimental units to control and candidate policies, then compares outcomes.

It measures deployed effects under the experiment's conditions.

## 2. Choose a unit matching the effect

Use persistent user assignment when recommendations influence later sessions. Request assignment can work for short-lived effects with negligible carryover.

**Carryover** means an earlier treatment affects later observations. **Interference** means one unit's treatment affects another, as with shared stock or creator responses.

## 3. Handle shared environments deliberately

Cluster assignment groups related units. A **switchback test** alternates treatment across time blocks.

These designs can address some interference settings, but need controls for time trends and carryover. Count independent assignment units, not just impressions.

## 4. Plan the decision in advance

Define the primary outcome, denominator, guardrails, population, exclusions, and outcome window.

**Minimum detectable effect** is the effect size the design aims to detect. **Power** is the probability of detecting it under the planned assumptions.

Duration depends on traffic, variability, usage cycles, and label maturity.

## 5. Use a valid stopping rule

Choose a fixed analysis horizon or a suitable sequential procedure.

Repeated ordinary significance checks followed by opportunistic stopping increase false positives. An early promising number is not a stopping rule.

## 6. Read effects and diagnostics

CTR moving from 4.0% to 4.2% is **0.2 percentage points**, or **5% relative**. Read uncertainty and practical value alongside the estimate.

**Sample ratio mismatch** is an unexpected departure from planned assignment proportions. Investigate routing, missing outcomes, and exclusions before trusting results.

## 7. Know what interleaving answers

**Interleaving** mixes two rankers' outputs into one list and attributes feedback under a mixing rule. It compares ranking preferences, not the full retention or revenue effect of deploying either policy.

## 8. Interview reasoning

**Question:** Why might request randomization mismeasure a habit-changing feed?

**Answer:** Earlier recommendations can influence later requests assigned to the other policy. Persistent assignment or another justified design must account for that carryover.
