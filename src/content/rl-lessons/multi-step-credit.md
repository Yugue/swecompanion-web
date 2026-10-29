# 2.3 Multi-step returns, eligibility traces, and temporal credit

## 1. Choose how much future to observe

One-step Temporal-Difference (TD) learning can propagate a distant reward slowly. Monte Carlo prediction waits for a complete trajectory and includes all its randomness. Multi-step prediction fills the space between them.

The shared mechanism is to observe several actual rewards, then bootstrap once from the final observed state.

## 2. The n-step return

\[
G_t^{(n)}=\sum_{k=0}^{n-1}\gamma^k R_{t+k+1}
+\gamma^n V(S_{t+n})
\]

N is the backup length, gamma the discount, and V the continuation estimate. If the episode truly ends before n steps, use rewards only through termination and omit the terminal continuation.

The value update is the same target-minus-prediction update as in 2.2, with this n-step target substituted. For an external rollout boundary, a valid final value can supply the continuation.

## 3. A short numerical comparison

Suppose observed rewards are 1 and 2, gamma=0.9, V(S1)=4, and V(S2)=5. A one-step target at S0 is 1+0.9×4=4.6. A two-step target is 1+0.9×2+0.81×5=6.85.

The longer target incorporates one more real outcome and relies less directly on the first continuation prediction. It does not automatically become more accurate on every sampled trajectory.

## 4. Lambda mixes backup lengths

For an ongoing discounted sequence, the **lambda return** is:

\[
G_t^\lambda=(1-\lambda)\sum_{n=1}^{\infty}\lambda^{n-1}G_t^{(n)},\qquad 0\le\lambda<1
\]

Lambda weights backup lengths. At zero it gives the one-step target. As lambda approaches one in a finite episode, the appropriately truncated mixture approaches the complete return; the finite mixture assigns the remaining weight to the terminal return.

Gamma discounts rewards in the task objective. Lambda chooses an estimator's temporal mixture. They solve different problems and should not be described as interchangeable horizons.

## 5. Traces carry credit backward

An **eligibility trace** records which earlier states remain eligible for a current TD error. For tabular accumulating traces:

\[
e_t(s)=\gamma\lambda e_{t-1}(s)+\mathbf1\{S_t=s\},\qquad
V(s)\leftarrow V(s)+\alpha\delta_t e_t(s)
\]

E is the trace weight for state s; the indicator adds one when that state is visited. Earlier traces decay by gamma lambda, so one new error can update several earlier states.

```text
new reward → current TD error
                    ↓
    recent states ← decaying trace weights → older states
```

Forward-view lambda returns and backward-view traces express the same credit idea. Exact equivalence depends on the update formulation and whether predictions change online; ordinary accumulating traces should not be advertised as universally identical to every online forward view.

## 6. The practical tradeoff

| Change | Benefit to seek | Cost to check |
|---|---|---|
| Larger n | Faster use of distant observed rewards | More sample noise and buffering |
| Larger lambda | Less reliance on immediate bootstraps | More variance and longer influence |
| Smaller n or lambda | Shorter, often quieter targets | More sensitivity to critic errors |

Longer backups are especially useful when rewards arrive late and the continuation estimate is weak. They cannot supply information about rewards the agent never encounters.

## 7. Boundaries and off-policy data matter

Reset traces at genuine episode boundaries. At a rollout truncation, bootstrap correctly but do not let a recursion flow into an unrelated reset trajectory.

A multi-step target observed under a different behavior policy also includes that policy's intervening actions. Unlike a single optimality backup, it may require off-policy correction or an appropriate specialized target. Increasing backup length can therefore worsen policy mismatch as well as variance.
