# 2.6 Learning control: SARSA, Expected SARSA, and Q-learning

## 1. Learn which action to take

**Control** improves action choices; prediction evaluates specified behavior. A **Q-table** stores estimated values for finite state-action pairs.

These methods share target-minus-prediction updates. Their continuation target differs: sampled action, action average, or maximum.

## 2. SARSA follows the behavior's next action

**SARSA** (State–Action–Reward–State–Action) backs up the next action sampled by the policy being evaluated:

\[
Q(S_t,A_t)\leftarrow Q(S_t,A_t)+\alpha
\left[R_{t+1}+\gamma Q(S_{t+1},A_{t+1})-Q(S_t,A_t)\right]
\]

α is step size; γ discount; Rₜ₊₁ reward; Q the current action-value estimate. With epsilon-greedy behavior and a matching target, future exploration affects the learned values.

At genuine termination, omit the successor action value.

## 3. Expected SARSA averages next actions

**Expected SARSA** averages next-action values under target policy π:

\[
y=R_{t+1}+\gamma\sum_{a'}\pi(a'\mid S_{t+1})Q(S_{t+1},a')
\]

y is the target; a′ indexes successor actions. Averaging removes next-action sampling noise, but not transition or reward noise.

It is on-policy if π matches behavior, off-policy otherwise. Exact averaging is easiest with few discrete actions.

## 4. Q-learning uses a greedy target

**Q-learning** uses the maximum next-action estimate:

\[
y=R_{t+1}+\gamma\max_{a'}Q(S_{t+1},a'),\qquad
Q(S_t,A_t)\leftarrow Q(S_t,A_t)+\alpha[y-Q(S_t,A_t)]
\]

```text
same observed transition
        ↓
SARSA: sampled next action
Expected SARSA: target-policy average
Q-learning: maximizing next action
```

y is its target; α controls the update. Greedy continuation can differ from exploratory behavior, making Q-learning off-policy. The observed transition remains unchanged.

## 5. One numerical comparison

Let Q=2, reward=1, γ=0.9, α=0.1, next values=[4,0], and behavior probabilities=[0.8,0.2].

SARSA sampling action two: target 1 → Q=1.9. Expected SARSA: target 3.88 → Q=2.188. Q-learning: target 4.6 → Q=2.26.

The arithmetic differs because each method assumes different continuation behavior.

## 6. Exploration changes learned behavior

Near a cliff, random exploration can make the shortest path dangerous. SARSA’s target includes that risk and can favor a safer route.

Q-learning estimates greedy continuation while its exploring behavior may still fall. Compare training reward separately from final behavior with exploration removed.

## 7. Know the limits of convergence claims

Finite discounted tabular Q-learning with bounded rewards needs sufficient state-action visits and step sizes satisfying Σα=∞, Σα²<∞ for convergence guarantees.

SARSA control also needs behavior that becomes greedy while retaining sufficient exploration. Fixed ε generally evaluates exploratory rather than exactly greedy behavior.

```python
target = reward + gamma * (0.0 if terminated else q[next_state].max())
q[state, action] += learning_rate * (target - q[state, action])
```

Neural function approximation does not inherit these tabular guarantees.
