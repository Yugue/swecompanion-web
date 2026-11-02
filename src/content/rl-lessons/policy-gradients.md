# 4.1 Direct policy learning and the score-function gradient

## 1. Learn probabilities instead of enumerating values

A **policy-gradient method** directly learns action probabilities to increase expected return. Value-based control instead derives actions from value estimates.

Direct learning is useful for continuous actions or stochastic behavior, but still needs informative exploration and tolerable gradient noise.

## 2. Parameterize a valid policy

Discrete policies use softmax logits. A continuous Gaussian policy can output mean μ and log scale log σ; exponentiation keeps σ positive.

θ is policy parameters; a sampled action; s state. Independent coordinates add log densities. Bounded-action transformations need the correction developed in SAC.

\[
\log\pi_\theta(a\mid s)=-\frac{(a-\mu_\theta(s))^2}{2\sigma_\theta(s)^2}
-\log\sigma_\theta(s)-\frac12\log(2\pi)
\]

## 3. Why an environment derivative is unnecessary

For a finite undiscounted episode, R(τ) sums rewards on trajectory τ. The **score-function identity** differentiates its expected return J:

\[
\nabla_\theta J=\mathbb E_{\tau\sim p_\theta}
\left[R(\tau)\nabla_\theta\log p_\theta(\tau)\right]
\]

pθ is trajectory probability. The identity ∇p=p∇log p moves differentiation onto likelihood, assuming valid differentiation under the expectation.

When initial conditions and dynamics do not depend on θ, only policy factors remain:

\[
\nabla_\theta\log p_\theta(\tau)=\sum_t\nabla_\theta\log\pi_\theta(A_t\mid S_t)
\]

Sₜ,Aₜ are sampled states/actions. Differentiate their policy log probabilities, not the action sampler or environment code.

## 4. Remove rewards that precede the decision

**Reward-to-go** keeps only rewards after each decision. Earlier rewards have zero expected score contribution, so removing them preserves the gradient and often reduces noise.

\[
\widehat g=\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(A_t\mid S_t)G_t
\]

ĝ estimates the policy gradient; Gₜ here is remaining undiscounted return; T episode length. For the discounted start-state objective, use γᵗ times discounted Gₜ. Discounted-visitation formulations use a different sampling convention.

## 5. REINFORCE turns outcomes into a loss

**REINFORCE** uses complete sampled returns in a Monte Carlo score-function update. Minimize the negative return-weighted log probability:

```python
weighted_log_probs = action_log_probs * returns.detach()
policy_loss = -weighted_log_probs.sum()
policy_loss.backward()
```

This snippet is one undiscounted episode; average episodes for a batch. Add matching discount weights for a discounted objective. Detach return to block unintended gradients.

## 6. What the update encourages

For a binary policy, **sigmoid** converts logit z into action-one probability p=1/(1+e^(−z)). The action-one log-probability derivative is 1−p; action-zero’s is −p.

At p=0.5, action one with return 4 contributes gradient +2 to its logit. Negative return reverses the direction. One lucky outcome is still noisy evidence.

## 7. Randomness and gradient variance

**Entropy** measures distributional spread: for discrete actions, −Σₐπ(a given s)log π(a given s). An entropy bonus discourages early concentration; random actions need not discover purposeful sequences.

Long horizons and rare success make REINFORCE noisy. Reward-to-go, baselines, and critics improve estimation; they cannot replace missing experience.

## 8. Compare the learning mechanisms

| Mechanism | Learned object | Main update signal |
|---|---|---|
| Q-learning | Action values | Bootstrapped optimality error |
| REINFORCE | Policy distribution | Sampled return times score gradient |
| Actor–critic | Policy and value predictor | Estimated advantage and value error |

An **actor–critic** learns both a policy (actor) and a value predictor (critic). The next lesson explains how the critic supplies an improvement signal.
