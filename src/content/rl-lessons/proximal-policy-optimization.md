# 4.3 Controlled policy changes: trust regions and Proximal Policy Optimization

## 1. A good gradient can still produce a bad step

A policy update changes both action probabilities and the states later encountered. A large change based on a limited batch can move the policy into regions where the batch provides weak evidence.

**Proximal Policy Optimization (PPO)** uses a surrogate objective to moderate changes while reusing a batch of recent rollouts for several optimization passes.

## 2. Measure a distribution change

For discrete action distributions, **Kullback–Leibler (KL) divergence** is:

\[
D_{\mathrm{KL}}(p\Vert q)=\sum_a p(a)\log\frac{p(a)}{q(a)}
\]

P and q are probability distributions over the same actions, with appropriate support. KL is nonnegative for exact distributions and is generally asymmetric. A small average KL can still hide larger changes in particular states or actions.

Trust Region Policy Optimization motivates limiting policy change using a KL constraint. PPO approximates the practical goal with simpler first-order optimization; the clipped version does not impose an exact hard KL constraint.

## 3. Compare new and collection probabilities

\[
\rho_t(\theta)=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{\mathrm{old}}(a_t\mid s_t)}
\]

Pi old generated the batch, pi theta is the candidate updated policy, and rho is an action likelihood ratio. Store old log probabilities when collecting data and treat them as fixed during the update.

Multiplying the ratio by an old-policy advantage estimates a local action-distribution change on the sampled states. It does not fully correct the state distribution to the new policy's future visitation.

## 4. The clipped surrogate

\[
L_{\mathrm{clip}}(\theta)=\mathbb E_t\left[
\min\left(\rho_t\widehat A_t,
\operatorname{clip}(\rho_t,1-\epsilon,1+\epsilon)\widehat A_t\right)\right]
\]

A hat is the fixed advantage estimate from 4.2, epsilon is a positive clip range, and the objective is maximized. In a minimizing optimizer, use its negative.

The minimum removes some incentive to push probabilities too far in the advantage-favored direction. It clips a surrogate expression, not the actual policy probabilities or parameter updates.

## 5. Check both advantage signs

With advantage 2, ratio 1.5, and epsilon=0.2, the unclipped term is 3 and the clipped term is 2.4; the minimum is 2.4. Further increases in that ratio do not improve this sample's clipped contribution.

With advantage −2 and ratio 0.5, the terms are −1 and −1.6; the minimum is −1.6. The objective stops rewarding an excessively large reduction in this bad action's probability.

An unfavorable change can remain penalized outside the clip range. Other samples and shared parameters can still move the probability after one contribution becomes flat.

## 6. The collection-and-update cycle

```text
current policy → recent rollout batch → fixed advantages + old log probabilities
       ↑                                      ↓
       └──── new collection ← several optimization epochs
```

Update a critic alongside the actor and optionally add an entropy bonus. Monitor empirical KL, clipping frequency, entropy, value error, and actual evaluation return.

```python
ratio = (new_log_prob - old_log_prob).exp()
raw = ratio * advantage
clipped = ratio.clamp(1 - clip_range, 1 + clip_range) * advantage
policy_loss = -torch.minimum(raw, clipped).mean()
```

The old log probabilities and advantages in this snippet must be fixed tensors with matching shapes.

## 7. Hyperparameters change evidence reuse

More epochs extract more optimization from each rollout but can overfit its states and advantages. A large clip range allows more aggressive changes; a very small one can inhibit improvement. Neither setting guarantees a particular KL.

Rollout length affects advantage quality and temporal context. Batch size and learning rate affect update noise. Reward scale interacts with value loss and entropy coefficients, so compare task returns before concluding that a lower actor loss is better.

## 8. Why PPO remains an on-policy family

PPO's batch comes from a recent policy, and the update approximates a local improvement around that policy. Reusing that batch within a bounded update procedure differs from unrestricted replay across a long history of behavior policies.

Clipping ratios limits some incentives but does not solve arbitrary support gaps or state-distribution shift. A common practical safeguard is early stopping when measured KL grows too large.
