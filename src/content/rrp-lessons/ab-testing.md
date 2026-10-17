## Online testing

An **A/B test** randomly assigns experimental units to a control policy and a candidate policy, then compares outcomes. It tests the effect of using those policies under the experiment's conditions.

The randomization and measurement design matter as much as the ranker being compared.

## 1. Choose a unit that fits the effect

Sticky user assignment is often useful when recommendations influence later sessions or habits. Request assignment can suit short-lived effects when carryover and interference are negligible; it is not universally invalid.

Shared stock, creator responses, or marketplace congestion can make one unit's treatment affect others. Cluster assignment or time-block **switchback tests** can address some settings, but need their own controls for time and carryover.

Analyze uncertainty at a level compatible with the assignment and outcome dependence. Millions of impressions do not mean millions of independent users.

## 2. Define the decision before reading results

Specify a primary outcome, guardrails, target population, denominator, measurement window, and exclusions.

**Minimum detectable effect** is the effect size the experiment is designed to detect. **Power** is its probability of detecting that effect under the planned assumptions. Required duration also depends on traffic, variance, usage cycles, and outcome maturity.

Choose a fixed analysis horizon or a valid sequential procedure. Repeated ordinary significance tests with opportunistic stopping inflate false positives.

## 3. Interpret effects and diagnostics

If control CTR is 4.0% and treatment is 4.2%, the increase is 0.2 percentage points or 5% relative.

Read the interval and practical value alongside that estimate. An interval spanning a meaningful loss and gain is inconclusive. Check critical slices without selecting only favorable ones.

**Sample ratio mismatch** means observed assignment counts differ unexpectedly from the intended allocation. Investigate routing, exclusions, instrumentation, and missing outcomes before interpreting the treatment effect.

Novelty or learning effects can change results over time. They are hypotheses to investigate, not an automatic explanation for every early lift.

## 4. Know what other experiments answer

**Interleaving** combines two rankers' outputs into one displayed list under a defined mixing rule and attributes feedback to the contributors. It can efficiently compare ranking preferences, but does not directly estimate the retention or revenue effect of deploying either whole policy.

Longer holdouts may address cumulative effects when the product question requires them. Neither a fixed number of weeks nor an offline metric establishes that duration is sufficient.
