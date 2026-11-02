# 1.6 Values, advantages, and Bellman reasoning

## 1. Compress a future into a prediction

A **value function** predicts expected return, allowing a robot to compare routes before rewards arrive.

Value depends on the objective and future policy; it is not an intrinsic property of a location.

## 2. State and action values

A **state value** evaluates a starting state; an **action value** evaluates a first action followed by the policy:

\[
V^\pi(s)=\mathbb E_\pi[G_t\mid S_t=s],\qquad
Q^\pi(s,a)=\mathbb E_\pi[G_t\mid S_t=s,A_t=a]
\]

\(V^\pi\)(s) follows π from state s. \(Q^\pi\)(s,a) first takes a, then follows π. Gₜ is return. V is the policy-weighted average of Q over actions.

An **optimal action value** Q* assumes optimal continuation, rather than the current behavior.

## 3. The Bellman expectation equation

The **Bellman expectation equation** splits return into reward and continuation:

\[
V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s',r}p(s',r\mid s,a)
\left[r+\gamma V^\pi(s')\right]
\]

π weights actions; p weights successor s′ and reward r; γ discounts continuation. Average over both action and environment randomness.

A **Bellman backup** evaluates this right side using current predictions to form a new estimate or target.

## 4. A branch diagram and numerical backup

```text
state s → choose action using policy
                ↓
       possible (reward, successor) branches
                ↓
       average [reward + discounted successor value]
```

One action yields (reward 2, successor value 4) with probability 0.75, or (−2,0) otherwise. At γ=0.9 its backup is 0.75×5.6+0.25×(−2)=3.7.

## 5. Optimality replaces a policy average with a choice

Bellman optimality chooses the best next action:

\[
Q^*(s,a)=\mathbb E\left[R_{t+1}+\gamma\max_{a'}Q^*(S_{t+1},a')\mid s,a\right]
\]

Q* is optimal action value; a′ ranges over valid successor actions. A **greedy policy** selects the largest value. Maximization chooses actions, not environmental outcomes.

In a finite MDP with γ<1 and bounded rewards, this equation has a unique fixed point—a value function unchanged by its backup. Neural approximations need separate guarantees.

## 6. Advantage compares actions within one state

An **advantage** compares an action with the policy’s average in the same state:

\[
A^\pi(s,a)=Q^\pi(s,a)-V^\pi(s)
\]

\(A^\pi\) is advantage; \(Q^\pi\) is action value; \(V^\pi\) is state value. Positive A means better than the policy average. Exact advantages average to zero under that policy.

A costly key pickup can have positive advantage if it unlocks a better future.

## 7. Values, rewards, and predictions can disagree

| Quantity | What it answers |
|---|---|
| Immediate reward | What feedback followed this action? |
| Return | What discounted outcomes followed over time? |
| Value | What return is expected under specified behavior? |
| Advantage | How does this action compare with that behavior's average? |

Keep each quantity distinct from its learned estimate. A high predicted value may reflect optimism rather than success.
