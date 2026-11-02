# 4.3 Controlled policy changes: trust regions and Proximal Policy Optimization

## 1. A good gradient can still produce a bad step

A large update can move behavior beyond what a recent batch supports. **Proximal Policy Optimization (PPO)** moderates changes while reusing recent rollouts for several optimization passes.

A **surrogate objective** is the tractable expression optimized in place of direct new-policy environment performance.

## 2. Measure a distribution change

**Kullback–Leibler (KL) divergence** measures distributional change:

\[
D_{\mathrm{KL}}(p\Vert q)=\sum_a p(a)\log\frac{p(a)}{q(a)}
\]

p,q are action distributions with appropriate support. KL is nonnegative and asymmetric; a small state-average can hide large local changes.

A **trust region** restricts policy movement during optimization. **Trust Region Policy Optimization (TRPO)** uses a KL constraint; clipped PPO pursues controlled movement without enforcing a hard KL bound.

## 3. Compare new and collection probabilities

Compare candidate and collection probabilities for each stored action:

\[
\rho_t(\theta)=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{\mathrm{old}}(a_t\mid s_t)}
\]

πold generated action aₜ at state sₜ; πθ is the candidate; ρₜ is their likelihood ratio. Store old log probabilities and hold them fixed.

Ratio-weighted old advantages adjust action probabilities on sampled states; they do not fully correct future state visitation.

## 4. The clipped surrogate

Maximize the clipped surrogate:

\[
L_{\mathrm{clip}}(\theta)=\mathbb E_t\left[
\min\left(\rho_t\widehat A_t,
\operatorname{clip}(\rho_t,1-\epsilon,1+\epsilon)\widehat A_t\right)\right]
\]

Â is fixed estimated advantage; ε positive clip range; Eₜ averages sampled decisions. A minimizing optimizer uses −Lclip.

The minimum removes incentives for some excessive advantage-favored changes. It does not clip actual probabilities or parameter steps.

## 5. Check both advantage signs

With Â=2, ρ=1.5, ε=0.2: min(3,2.4)=2.4. Further ratio increases give this sample no additional reward.

With Â=−2 and ρ=0.5: min(−1,−1.6)=−1.6. Excessively reducing this bad action’s probability stops improving its contribution.

Unfavorable movement can still be penalized outside the interval. Other samples and shared weights can keep moving a clipped action.

## 6. The collection-and-update cycle

```text
current policy → recent rollout batch → fixed advantages + old log probabilities
       ↑                                      ↓
       └──── new collection ← several optimization epochs
```

Train the critic alongside the actor. Inspect empirical KL, clip frequency, entropy, value error, and realized evaluation return.

```python
ratio = (new_log_prob - old_log_prob).exp()
raw = ratio * advantage
clipped = ratio.clamp(1 - clip_range, 1 + clip_range) * advantage
policy_loss = -torch.minimum(raw, clipped).mean()
```

Keep old_log_prob and advantage fixed, with shapes matching new_log_prob.

## 7. Hyperparameters change evidence reuse

More epochs reuse evidence but can overfit rollout states and advantages. Larger ε permits stronger incentives; smaller ε can inhibit learning. Neither fixes KL exactly.

Rollout length affects advantage quality; batch size and learning rate affect noise. Reward scaling changes value-loss and entropy tradeoffs.

## 8. Why PPO remains an on-policy family

PPO improves locally around a recent collection policy. Several passes on that batch differ from arbitrary long-history off-policy replay.

Clipping does not repair missing support. Early stopping on excessive measured KL is a practical additional control.
