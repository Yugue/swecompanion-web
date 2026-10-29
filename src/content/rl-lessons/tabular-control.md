# 2.6 Learning control: SARSA, Expected SARSA, and Q-learning

## 1. Learn which action to take

Prediction estimates a specified policy's return. **Control** uses value estimates to improve action choices. A **Q-table** stores an estimated action value for each state-action pair in a finite problem.

The algorithms here share one update shape: move the selected entry toward an immediate reward plus a continuation target. Their key difference is which next action defines that continuation.

## 2. SARSA follows the behavior's next action

\[
Q(S_t,A_t)\leftarrow Q(S_t,A_t)+\alpha
\left[R_{t+1}+\gamma Q(S_{t+1},A_{t+1})-Q(S_t,A_t)\right]
\]

**State–Action–Reward–State–Action (SARSA)** samples the next action from the policy being evaluated. Alpha is the step size. With an epsilon-greedy behavior policy and matching target, it learns the value of behavior that includes exploratory actions.

The name lists the five quantities used by the update. At genuine termination, omit the continuation action value.

## 3. Expected SARSA averages next actions

\[
y=R_{t+1}+\gamma\sum_{a'}\pi(a'\mid S_{t+1})Q(S_{t+1},a')
\]

Y is the target, and pi is the specified target policy. Averaging over next actions removes the randomness of sampling one next action while retaining transition and reward randomness.

Expected SARSA can be on-policy when pi matches behavior or off-policy when a different target policy supplies the average. Computing the action average is easy for a small discrete action set and harder for a large or continuous one.

## 4. Q-learning uses a greedy target

\[
y=R_{t+1}+\gamma\max_{a'}Q(S_{t+1},a'),\qquad
Q(S_t,A_t)\leftarrow Q(S_t,A_t)+\alpha[y-Q(S_t,A_t)]
\]

Q-learning evaluates a greedy continuation even when behavior explores. This makes it an off-policy control method. The observed transition remains real; only the hypothetical future action selection is greedy.

```text
same observed transition
        ↓
SARSA: sampled next action
Expected SARSA: target-policy average
Q-learning: maximizing next action
```

## 5. One numerical comparison

Let current Q=2, reward=1, gamma=0.9, alpha=0.1, and next-state action values be 4 and 0. Behavior chooses them with probabilities 0.8 and 0.2.

If SARSA samples the second action, its target is 1 and the updated entry is 1.9. Expected SARSA's target is 1+0.9×3.2=3.88, giving 2.188. Q-learning's target is 4.6, giving 2.26.

The differences are meaningful assumptions about continuation, not three unrelated update tricks.

## 6. Exploration changes learned behavior

In a cliff-walking task, a path near the edge is efficient under perfectly greedy actions but dangerous if random exploration occasionally steps off the cliff. SARSA can learn a safer route because its target includes that future exploration risk.

Q-learning can learn the greedy shortest route while its exploring behavior still incurs falls. If exploration is removed at deployment, the comparison changes. State whether the question concerns training reward or the final greedy policy.

## 7. Know the limits of convergence claims

For finite discounted tabular Q-learning with bounded rewards, adequate visitation of every relevant state-action pair and diminishing learning rates satisfying sum alpha=infinity and sum alpha squared<infinity support convergence to optimal action values.

On-policy SARSA control needs corresponding conditions, including behavior becoming greedy in the limit while continuing sufficient exploration. Persistent fixed epsilon generally evaluates a different behavior from an exactly greedy policy.

```python
target = reward + gamma * (0.0 if terminated else q[next_state].max())
q[state, action] += learning_rate * (target - q[state, action])
```

These tabular guarantees do not automatically apply after replacing entries with a neural network.
