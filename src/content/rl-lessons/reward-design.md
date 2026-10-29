# 6.1 Reward design, objective mismatch, and constraints

## 1. The policy optimizes the signal it receives

Reward a delivery robot for distance traveled and it may drive in circles. Reward it only for parcels marked complete and it may exploit the completion detector.

**Reward hacking** is behavior that achieves high measured reward while missing the intended objective. It can result from an ordinary learning algorithm successfully optimizing a flawed specification.

## 2. Distinguish objective, proxy, and reporting metrics

The intended outcome might be timely completed deliveries with no collisions. Training can use a proxy combining delivery reward, time cost, and energy use. Evaluation should separately report real completion, latency, collisions, and energy.

A weighted sum can hide a regression in one metric behind improvement in another. Choose weights from the required tradeoff rather than merely from whichever makes the learning curve smooth.

## 3. Sparse rewards and shaping

A terminal success reward is direct but provides little guidance before the first success. **Reward shaping** adds intermediate feedback, such as progress toward a goal.

Naive progress bonuses can change the task. If approaching a target earns more than retreating costs, repeated approach-and-retreat cycles can outperform completion. Check loops, waiting, early termination, and failure states when auditing a reward.

## 4. Potential-based shaping has a useful guarantee

\[
r'(s,a,s')=r(s,a,s')+\gamma\Phi(s')-\Phi(s)
\]

Phi is a chosen state potential and gamma is the same discount used in the objective. Along a trajectory, the shaping terms telescope:

\[
G'_0=G_0-\Phi(s_0)+\gamma^T\Phi(s_T)
\]

T is episode length. With appropriate terminal potentials set to zero, or in an infinite discounted task with bounded potential so the last term vanishes, shaping shifts the return by a state-dependent constant independent of the chosen policy. Policy rankings are then preserved.

A finite-horizon task may need a time-dependent potential and compatible boundary conditions. Dropping the terminal term without checking those conditions can invalidate the claim.

## 5. A numerical shaping check

Let gamma=0.9, original reward=0, Phi(s)=−3, and Phi(s prime)=−2. The shaping reward is 0.9×(−2)−(−3)=1.2.

A single positive shaped step is not the guarantee; the telescoping sum over the full trajectory is. A reverse step, delayed termination, and terminal potential must all use the same definition.

```python
shaped_reward = reward + gamma * next_potential - potential
```

This line assumes the chosen potentials already implement the correct terminal semantics.

## 6. Reward scale and offsets have different effects

Multiplying unregularized returns by a positive constant preserves policy rankings, but changes gradient and target scales. In entropy- or KL-regularized training, the relative regularization weight changes unless it is adjusted too.

Adding a constant per step can favor longer or shorter episodes when episode duration depends on the policy. It is not universally harmless. Discounting and termination conventions determine the resulting shift.

## 7. Penalties are not hard constraints

\[
\max_\pi J_R(\pi)\quad\text{subject to}\quad J_C(\pi)\le c
\]

J R is expected reward, J C expected cumulative cost, and c a budget. A Lagrangian replaces this with reward minus lambda times cost-budget, where lambda is nonnegative.

This handles an expected tradeoff under assumptions. It does not ensure that every action is safe, every episode respects a budget, or a rare catastrophic event is impossible. Hard action limits and external constraint checks may need explicit enforcement.

## 8. Audit behavior, not only equations

| Proxy | Possible loophole | Independent check |
|---|---|---|
| Distance traveled | Circling | Delivery completion |
| Short completion time | Abort difficult tasks | Success and abandonment rate |
| Visible test passes | Special-case exposed tests | Held-out functional checks |
| Low energy | Refuse all movement | Completion under required service level |

Watch full trajectories and search for high-reward failures. Changing the reward changes the task the learner sees; reevaluate previously successful behavior afterward.
