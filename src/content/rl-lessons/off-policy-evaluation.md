# 5.4 Evaluating a policy before online deployment

## 1. The training critic is not an independent verdict

**Off-policy evaluation (OPE)** estimates a target policy’s performance from other policies’ logged experience.

It asks what would happen under different choices. Fitting outcomes from observed choices does not automatically identify that counterfactual.

## 2. State the identification assumptions

Importance-based OPE needs behavior probabilities, target support, and logged information sufficient to explain behavior selection and relevant dynamics.

**Confounding** occurs when an unrecorded variable affects both action selection and outcomes. If operators use a hidden fault signal, naive logged comparisons can misattribute its effect to actions.

Preserve action availability, policy versions, boundaries, and initial conditions. Evaluate the intended deployment population.

## 3. Importance sampling reweights complete trajectories

Reuse the trajectory importance ratios introduced earlier:

\[
\widehat J_{\mathrm{IS}}=\frac1N\sum_{i=1}^N w_iG_0^{(i)},\qquad
w_i=\prod_t\frac{\pi(a_t^{(i)}\mid s_t^{(i)})}{b(a_t^{(i)}\mid s_t^{(i)})}
\]

N counts independent trajectories; G₀⁽ⁱ⁾ is trajectory i’s matching-objective return; π target; b behavior; wᵢ its weight.

**Per-decision importance sampling** uses reward-specific prefix ratios. It can reduce unnecessary variance. Long horizons and weak overlap still cause concentrated weights; clipping trades bias for stability.

## 4. A one-step numerical example

Behavior picks left/right with probability 0.5 each; target always picks left. Logged (left,4) and (right,0) get weights 2 and 0: estimate=(8+0)/2=4.

This is a tiny-sample calculation, not proof of true value 4. Positive population support does not ensure a finite dataset contains enough target actions.

## 5. Fitted Q Evaluation learns the target policy's value

**Fitted Q evaluation (FQE)** repeatedly fits a value model to a fixed target policy’s Bellman backups:

\[
y=r+\gamma(1-d)\mathbb E_{a'\sim\pi(\cdot\mid s')}[\widehat Q_{k-1}(s',a')]
\]

k counts fitting iterations; d marks termination; r reward; γ discount. Average next actions under π rather than maximizing them.

Average initial-state values under π for performance. FQE avoids long ratio products but depends on model accuracy and relevant state-action coverage.

## 6. Doubly robust evaluation combines both signals

A **doubly robust (DR)** estimator combines a model prediction with an importance-weighted residual. For one decision:

\[
\widehat V(s)+\rho\left[r-\widehat Q(s,a)\right],\qquad
\widehat V(s)=\sum_a\pi(a\mid s)\widehat Q(s,a)
\]

Q̂ predicts action reward, V̂ averages it under π, and ρ=π(a given s)/b(a given s). The residual corrects model errors observed in the logs.

Sequential DR uses a corrected successor value in the residual. Under support and identification assumptions, correct ratios or a compatible correct value model can protect against error in the other component; two wrong components need not cancel.

## 7. Keep estimation honest

**Cross-fitting** evaluates each partition using models fitted on other partitions. Resample complete episodes or other independent units, rather than correlated transitions.

Report weight concentration, overlap, clipping sensitivity, and estimator disagreement. Narrow intervals do not include every possible extrapolation or missing-variable error.

## 8. Compare practical options

| Estimator | Main strength | Main concern |
|---|---|---|
| Importance sampling | Direct probability correction | Large or unstable weights |
| FQE | Avoids full trajectory products | Model error and coverage |
| Doubly robust | Uses predictions plus residual evidence | Both components can be wrong |

Absent logging support cannot be repaired by importance weights. Predicting those outcomes with a model adds assumptions beyond observed action overlap.
