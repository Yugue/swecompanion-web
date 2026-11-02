# 2.2 Learning predictions: Monte Carlo and Temporal-Difference methods

## 1. Replace a model expectation with observed experience

With unknown dynamics, estimate a fixed policy’s value from observed rewards. Either wait for its realized return or predict the unobserved continuation.

## 2. Monte Carlo uses the observed return

**Monte Carlo (MC) prediction** moves value toward a sampled complete return:

\[
V(S_t)\leftarrow V(S_t)+\alpha\left[G_t-V(S_t)\right]
\]

Gₜ is observed return, V(Sₜ) the current estimate, and α the step size. Under a fixed policy, complete correctly discounted returns are unbiased samples of conditional value.

**First-visit MC** uses a state’s first occurrence per episode; **every-visit MC** uses all occurrences. Within-episode samples can be correlated. Both need the relevant future rewards.

## 3. TD fills in a continuation estimate

**Temporal-difference (TD) prediction** combines one observed reward with a predicted continuation:

\[
\delta_t=R_{t+1}+\gamma V(S_{t+1})-V(S_t),\qquad
V(S_t)\leftarrow V(S_t)+\alpha\delta_t
\]

δₜ is **TD error**, target minus prediction. Rₜ₊₁ is reward; γ discounts next value V(Sₜ₊₁); α controls the update. At genuine termination, continuation is zero.

TD updates after one transition, including in continuing tasks. Its target inherits errors from current predictions.

## 4. A shared transition, different evidence

With V(s)=4, reward 1, successor estimate 6, γ=0.9, and α=0.2: TD target=6.4, error=2.4, new value=4.48.

If the eventual return is 8, MC updates the same original value to 4.8. They use different evidence: predicted continuation versus this realized future.

```text
MC: state → observed rewards all the way to episode end → return target
TD: state → one observed reward → predicted continuation → target
```

## 5. Bias, variance, and propagation

| Property | Complete-return MC | One-step TD |
|---|---|---|
| Bootstrap | No | Yes |
| Wait for episode completion | Usually yes | No |
| Target depends on current values | No | Yes |
| Exposure to future outcome randomness | Entire remaining trajectory | One step plus prediction |

Long-horizon MC returns can be noisy. TD often lowers target variance but depends on imperfect values; neither is uniformly more accurate.

One-step TD initially changes values near a new reward. Repeated backups propagate its effect backward.

## 6. Learning rates and convergence assumptions

For a fixed mean, α=1/N averages N samples. Constant α tracks changing targets but leaves persistent noise.

Tabular on-policy TD needs adequate visitation, appropriate diminishing step sizes, and suitable discounted/episodic assumptions. These guarantees do not automatically cover neural networks or changing policies.

## 7. What a TD error does and does not tell you

Large TD error may signal surprise, wrong values, or changed behavior. Small error establishes neither good behavior nor a useful reward.

```python
target = reward + gamma * continuation_value
td_error = target - value
value += learning_rate * td_error
```

The snippet is tabular; continuation_value must already handle the boundary. Neural updates instead fit shared parameters.
