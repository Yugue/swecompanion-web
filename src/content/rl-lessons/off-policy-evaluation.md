# 5.4 Evaluating a policy before online deployment

## 1. The training critic is not an independent verdict

A policy trained on logged data needs evaluation before deployment. **Off-Policy Evaluation (OPE)** estimates its performance using trajectories collected by other behavior.

The central question is causal: what outcomes would occur if this target policy acted? A good fit to factual logged outcomes is helpful but does not automatically answer that counterfactual.

## 2. State the identification assumptions

Importance-based sequential evaluation usually needs known or consistently estimated behavior probabilities, target-policy support within behavior coverage, and logged information sufficient to account for behavior selection and relevant dynamics.

If operators chose actions using an unrecorded fault signal that also predicts failure, the observed comparisons can be confounded. A sophisticated estimator cannot validate away a missing variable from the same incomplete logs.

Preserve action availability, reset semantics, policy versions, and initial-condition distributions. Evaluate the intended deployment population, not an accidental subset with complete records.

## 3. Importance sampling reweights complete trajectories

\[
\widehat J_{\mathrm{IS}}=\frac1N\sum_{i=1}^N w_iG_0^{(i)},\qquad
w_i=\prod_t\frac{\pi(a_t^{(i)}\mid s_t^{(i)})}{b(a_t^{(i)}\mid s_t^{(i)})}
\]

N is the number of independent logged trajectories, G their matching-objective returns, pi the target, and b the behavior policy. The ratios account for how often each trajectory would appear under the target.

Weights can explode with horizon or policy mismatch. Per-decision estimators attach shorter prefix ratios to individual rewards, often reducing unnecessary variance. Weight clipping and self-normalization alter bias–variance tradeoffs as discussed in 2.5.

## 4. A one-step numerical example

Suppose behavior chooses left and right with probability 0.5 each; the target always chooses left. Two logged examples contain left reward 4 and right reward 0. Their weights are 2 and 0, giving importance estimate (2×4+0×0)/2=4.

This computation does not prove a true expected reward of 4. It shows reweighting on a tiny random sample. If left was never sampled in the dataset, finite-data evidence would be inadequate despite positive population support.

## 5. Fitted Q Evaluation learns the target policy's value

**Fitted Q Evaluation (FQE)** repeatedly regresses a value model onto fixed-policy Bellman targets:

\[
y=r+\gamma(1-d)\mathbb E_{a'\sim\pi(\cdot\mid s')}[\widehat Q_{k-1}(s',a')]
\]

K counts fitting iterations and d marks genuine termination. Unlike Q-learning control, the next-action average follows the fixed policy being evaluated, without a greedy maximization.

Estimate performance by averaging its initial-state action values under the target policy. FQE avoids multiplying long likelihood ratios but depends on value-model accuracy and enough data for the target's relevant states and actions.

## 6. Doubly robust evaluation combines both signals

For one decision, a **Doubly Robust (DR)** estimate has contribution:

\[
\widehat V(s)+\rho\left[r-\widehat Q(s,a)\right],\qquad
\widehat V(s)=\sum_a\pi(a\mid s)\widehat Q(s,a)
\]

Rho is pi(a given s)/b(a given s). The model predicts the policy average, while a weighted residual corrects observed model errors.

A sequential version replaces the residual with r+gamma times a recursively corrected successor value minus Q hat, with appropriate terminal handling. Under support and identification conditions, correct importance ratios or a correct compatible value model can protect against the other component's error. Arbitrarily wrong models and ratios do not cancel each other by default.

## 7. Keep estimation honest

Fit nuisance models separately or use cross-fitting, where each held-out partition is evaluated with models fitted on other partitions. Resample complete episodes or other independent units when estimating uncertainty; individual correlated transitions are not interchangeable independent samples.

Report weight concentration, overlap, sensitivity to clipping, and disagreement among estimators. A narrow model-based interval can omit extrapolation bias. Unsupported decisions remain an assumption-driven prediction rather than strong empirical validation.

## 8. Compare practical options

| Estimator | Main strength | Main concern |
|---|---|---|
| Importance sampling | Direct probability correction | Large or unstable weights |
| FQE | Avoids full trajectory products | Model error and coverage |
| Doubly robust | Uses predictions plus residual evidence | Both components can be wrong |
