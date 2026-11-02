# 6.1 Reward design, objective mismatch, and constraints

## 1. The policy optimizes the signal it receives

Reward distance traveled and a delivery robot may circle. Reward a completion flag and it may exploit the detector.

**Reward hacking** achieves high measured reward while missing the intended outcome. It can be successful optimization of a flawed specification.

## 2. Distinguish objective, proxy, and reporting metrics

Separate intended success, the training **proxy** used to represent it, and independent reporting metrics. Track completion, latency, collisions, and energy separately.

A weighted total can hide one worsening metric behind another’s improvement. Choose weights from required tradeoffs, not curve smoothness.

## 3. Sparse rewards and shaping

A terminal success signal gives little guidance before first success. **Reward shaping** adds intermediate feedback, such as progress toward a goal.

Naive bonuses can change the task: repeated approach/retreat cycles may outscore completion. Check loops, waiting, failures, and early endings.

## 4. Potential-based shaping has a useful guarantee

**Potential-based shaping** adds the discounted difference of a state score:

\[
r'(s,a,s')=r(s,a,s')+\gamma\Phi(s')-\Phi(s)
\]

\[
G'_0=G_0-\Phi(s_0)+\gamma^T\Phi(s_T)
\]

Φ is the potential; γ the objective’s discount; r original reward; r′ shaped reward. Summing along a trajectory cancels intermediate potentials:

G′₀ and G₀ are shaped/original returns; T episode length. Zero terminal potentials, or bounded potentials in an infinite discounted task, remove the last term. Rankings then shift by a policy-independent initial-state constant.

Finite-horizon tasks may need time-dependent potentials and compatible terminal conditions. Dropping a nonzero terminal term breaks this guarantee.

## 5. A numerical shaping check

With γ=0.9, reward 0, Φ(s)=−3, and Φ(s′)=−2: shaping bonus=0.9×(−2)−(−3)=1.2.

Policy preservation comes from the whole telescoping sum, not one positive bonus. Reverse moves and termination must use the same definition.

```python
shaped_reward = reward + gamma * next_potential - potential
```

The snippet assumes potentials already implement correct terminal handling.

## 6. Reward scale and offsets have different effects

Positive scaling preserves unregularized return rankings but changes target and gradient magnitudes. Entropy/KL weights may need matching adjustments.

Adding a per-step constant can favor longer or shorter episodes when duration depends on policy. It is not universally harmless.

## 7. Penalties are not hard constraints

A **constrained objective** maximizes reward under a cost budget:

\[
\max_\pi J_R(\pi)\quad\text{subject to}\quad J_C(\pi)\le c
\]

JR is expected reward; JC expected cumulative cost; c budget. A **Lagrangian** instead optimizes reward minus λ times cost-budget, with λ≥0.

Expected-cost control does not ensure every action or episode is safe. Enforce hard actuator and permission limits through the action interface.

## 8. Audit behavior, not only equations

| Proxy | Possible loophole | Independent check |
|---|---|---|
| Distance traveled | Circling | Delivery completion |
| Short completion time | Abort difficult tasks | Success and abandonment rate |
| Visible test passes | Special-case exposed tests | Held-out functional checks |
| Low energy | Refuse all movement | Completion under required service level |

Watch high-reward failures, not just aggregate curves. After changing reward, reevaluate previously competent behavior.
