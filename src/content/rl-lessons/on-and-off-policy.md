# 2.5 On-policy and off-policy learning: whose experience is usable?

## 1. Separate behavior from the target

The **behavior policy** b generated data; the **target policy** π is evaluated or improved.

**On-policy** learning uses matching behavior. **Off-policy** learning uses different behavior. These terms describe the update-data relationship, not deterministic versus stochastic behavior.

## 2. Why data reuse is attractive

Reusing stored experience can reduce expensive collection. A **replay buffer** stores transitions for later updates.

```text
on-policy: current policy → recent trajectories → update policy → collect again
off-policy: behavior policies → stored experience → target learner
```

**Online** learning continues interacting; **offline** learning uses fixed data. An online method can be off-policy. Off-policy capability alone does not ensure reliable offline learning.

## 3. Importance sampling changes an action average

**Importance sampling** reweights behavior samples to estimate a target average:

\[
\mathbb E_{a\sim\pi}[f(a)]
=\mathbb E_{a\sim b}\left[\frac{\pi(a)}{b(a)}f(a)\right]
\]

f is the averaged quantity; π(a)/b(a) is the **importance ratio**. Require b(a)>0 wherever target contributions occur. For policies, condition both probabilities on the same state.

If b(left)=0.25 and π(left)=0.5, sampled left actions get weight 2. Reweighting cannot create an unobserved action outcome.

## 4. Trajectory ratios multiply

For a trajectory τ with T decisions, multiply action ratios:

\[
w(\tau)=\prod_{t=0}^{T-1}\frac{\pi(A_t\mid S_t)}{b(A_t\mid S_t)}
\]

w is trajectory weight. Initial-state and transition factors cancel when both policies share them. Weighting each return by w estimates target performance under the support assumptions.

Ratios 2 across ten decisions yield weight 1024. Rare trajectories can dominate, making a correct estimator impractically noisy.

## 5. Support is an information requirement

**Support** means behavior can produce every relevant target action at relevant states. Missing support prevents ordinary importance sampling from identifying those outcomes.

Log **propensities**, the probabilities actually used to select actions. Probability one for the observed action is valid only if selection really was deterministic.

Unrecorded behavior inputs that also predict outcomes can invalidate comparisons.

## 6. Variance control changes tradeoffs

Ratio clipping limits large weights but generally introduces bias. **Self-normalized importance sampling** divides the weighted sum by total weight, often improving stability with finite-sample bias.

**Effective sample size**, (Σw)²/Σw², summarizes weight concentration. A thousand trajectories can contribute only a few effectively weighted observations.

## 7. Not every off-policy update needs the same correction

| Operation | Key mismatch |
|---|---|
| Return evaluation | Whole behavior trajectory differs |
| One-step action-value backup | Next-action target differs from behavior |
| Policy gradient over replay states | Action and state distributions can differ |

One-step tabular Q-learning conditions on the observed state-action transition and chooses a greedy continuation; it needs no explicit behavior-action ratio in that update.

This does not make arbitrary replay-state policy gradients unbiased for the target’s full performance objective. State-distribution mismatch can remain.
