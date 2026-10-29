# 1.6 Values, advantages, and Bellman reasoning

## 1. Compress a future into a prediction

The robot needs to compare routes before their rewards arrive. A **value function** predicts expected future return so a decision can use more than its immediate outcome.

The prediction is always relative to an objective and, unless explicitly optimal, a policy. A state's value is not an intrinsic property independent of future behavior.

## 2. State and action values

\[
V^\pi(s)=\mathbb E_\pi[G_t\mid S_t=s],\qquad
Q^\pi(s,a)=\mathbb E_\pi[G_t\mid S_t=s,A_t=a]
\]

V evaluates starting in state s and following policy pi. Q evaluates taking action a first and following pi afterward. For a stochastic policy, V is its action-probability-weighted average of Q in that state.

An optimal action value Q star assumes optimal behavior after the initial action. Distinguish that assumption from evaluating the policy currently collecting experience.

## 3. The Bellman expectation equation

\[
V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s',r}p(s',r\mid s,a)
\left[r+\gamma V^\pi(s')\right]
\]

Pi weights actions, p weights joint successor and reward outcomes, and gamma discounts the continuation value. This follows by splitting the return into its first reward and the rest, then applying conditional expectation.

The equation is a consistency relationship for the true value. A **Bellman backup** uses its right side with a current estimate to produce a new estimate or target.

## 4. A branch diagram and numerical backup

```text
state s → choose action using policy
                ↓
       possible (reward, successor) branches
                ↓
       average [reward + discounted successor value]
```

Suppose one action leads to reward 2 and successor value 4 with probability 0.75, or reward −2 and successor value 0 otherwise. At gamma=0.9, its action value is 0.75×5.6+0.25×(−2)=3.7, assuming those successor values evaluate the continuation policy correctly.

## 5. Optimality replaces a policy average with a choice

\[
Q^*(s,a)=\mathbb E\left[R_{t+1}+\gamma\max_{a'}Q^*(S_{t+1},a')\mid s,a\right]
\]

Q star is the best achievable action value, and a prime ranges over valid next actions. A greedy policy selects an action maximizing Q star. The maximization chooses future behavior; it does not remove uncertainty in transitions.

For a finite discounted MDP with gamma below one, Bellman optimality has a unique fixed point. Later deep algorithms approximate this equation without inheriting every tabular guarantee.

## 6. Advantage compares actions within one state

\[
A^\pi(s,a)=Q^\pi(s,a)-V^\pi(s)
\]

A is the **advantage**. Positive advantage means an action is better than the policy's average action at that state. Its policy-weighted mean is zero when V and Q are exact.

An action can incur an immediate cost yet have positive advantage by opening a valuable future. Conversely, an immediately rewarding action may have negative advantage when it sacrifices a better continuation.

## 7. Values, rewards, and predictions can disagree

| Quantity | What it answers |
|---|---|
| Immediate reward | What feedback followed this action? |
| Return | What discounted outcomes followed over time? |
| Value | What return is expected under specified behavior? |
| Advantage | How does this action compare with that behavior's average? |

A high predicted value can reflect optimism rather than actual success. Always distinguish the mathematical quantity from its learned estimate.
