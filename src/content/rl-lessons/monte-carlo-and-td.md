# 2.2 Learning predictions: Monte Carlo and Temporal-Difference methods

## 1. Replace a model expectation with observed experience

The Bellman equation describes the correct value but does not give unknown transition probabilities. Suppose the robot repeatedly follows one fixed policy. It can estimate the value of a visited state from actual rewards instead of enumerating all possible futures.

Two choices matter: wait for the observed return, or fill in the unobserved future with a current value prediction.

## 2. Monte Carlo uses the observed return

\[
V(S_t)\leftarrow V(S_t)+\alpha\left[G_t-V(S_t)\right]
\]

**Monte Carlo (MC)** prediction moves the current estimate toward a sampled return Gt. Alpha is the step size. With a fixed policy and a complete correctly discounted trajectory, the return is an unbiased sample of the conditional expected return.

First-visit MC updates from the first occurrence of a state in an episode; every-visit MC uses each occurrence. Samples within an episode can be correlated. Episodic MC must wait for the episode's rewards to be available.

## 3. TD fills in a continuation estimate

\[
\delta_t=R_{t+1}+\gamma V(S_{t+1})-V(S_t),\qquad
V(S_t)\leftarrow V(S_t)+\alpha\delta_t
\]

**Temporal-Difference (TD)** prediction uses one reward and a bootstrapped next-state value. Delta is the TD error: target minus current prediction. At a genuine terminal state the continuation value is zero, following 1.5.

TD can update immediately after one transition and can operate in continuing tasks. Its target depends on existing estimates, which may be inaccurate.

## 4. A shared transition, different evidence

Let V(s)=4, observed reward=1, successor estimate=6, gamma=0.9, and alpha=0.2. TD's target is 6.4, its error is 2.4, and the new estimate is 4.48.

If the eventual sampled return is 8, MC's update from the same original estimate produces 4.8. Neither update alone proves the other wrong: one uses a prediction of the remaining trajectory; the other uses this particular realized future.

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

MC returns can have high variance over a long stochastic horizon. TD commonly reduces target variance at the cost of dependence on imperfect estimates. These are useful tendencies, not an unconditional theorem comparing every estimator in every task.

With one-step TD, a newly observed terminal reward initially changes nearby predictions; repeated updates propagate its effect backward.

## 6. Learning rates and convergence assumptions

A sample-average update uses alpha=1/N for the Nth observation of a fixed mean. Constant alpha keeps adapting to changing targets but leaves persistent noise.

Tabular on-policy TD converges under standard discounted or suitable episodic assumptions, adequate state visitation, and appropriate diminishing step sizes. Introducing neural approximation or a changing policy requires separate reasoning; a scalar tabular convergence claim is not a general deep-learning guarantee.

## 7. What a TD error does and does not tell you

A large error can indicate a surprising outcome, a poor value estimate, or a changed policy. A small error can mean consistent estimates even when the policy is bad or the reward misses the real objective.

```python
target = reward + gamma * continuation_value
td_error = target - value
value += learning_rate * td_error
```

This tabular snippet assumes continuation_value already handles the episode boundary. Neural updates instead change shared parameters through a loss.
