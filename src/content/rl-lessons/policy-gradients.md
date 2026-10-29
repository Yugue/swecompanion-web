# 4.1 Direct policy learning and the score-function gradient

## 1. Learn probabilities instead of enumerating values

A value-based agent compares action values and derives a policy from them. A **policy-gradient** method directly parameterizes behavior and adjusts it to increase expected return.

This is useful when actions are continuous, stochastic behavior matters, or maximizing a learned value over all possible actions is difficult. Direct policy learning still faces exploration, sample noise, and changing data distributions.

## 2. Parameterize a valid policy

For discrete actions, a network outputs scores and softmax produces a categorical distribution. For continuous actions, a network can output a Gaussian mean mu and log standard deviation; exponentiating the latter ensures positive scale.

For one Gaussian action coordinate:

\[
\log\pi_\theta(a\mid s)=-\frac{(a-\mu_\theta(s))^2}{2\sigma_\theta(s)^2}
-\log\sigma_\theta(s)-\frac12\log(2\pi)
\]

Theta denotes policy parameters, a the sampled action, and s the input state. Independent coordinates contribute additive log densities. Bounded transformations require density corrections, developed in 4.5.

## 3. Why an environment derivative is unnecessary

For a finite, undiscounted episode, let R(tau) be the sum of rewards on trajectory tau. The **score-function identity** gives:

\[
\nabla_\theta J=\mathbb E_{\tau\sim p_\theta}
\left[R(\tau)\nabla_\theta\log p_\theta(\tau)\right]
\]

It follows from differentiating an expectation using the identity gradient p = p times gradient log p, under appropriate differentiability and integrability conditions.

When initial conditions and dynamics do not depend on theta, only policy factors remain:

\[
\nabla_\theta\log p_\theta(\tau)=\sum_t\nabla_\theta\log\pi_\theta(A_t\mid S_t)
\]

The sampled trajectory is evidence. Differentiation follows the probability assigned to its actions, not the discrete action sampler or the environment's transition code.

## 4. Remove rewards that precede the decision

An action cannot cause rewards already received. Their expected contribution to its score gradient is zero. Replacing the whole episode reward with **reward-to-go** preserves the gradient while often reducing variance.

\[
\widehat g=\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(A_t\mid S_t)G_t
\]

Here Gt is the remaining undiscounted return for this derivation. For the discounted start-state objective in 1.5, the corresponding finite-trajectory estimator includes gamma to the t times the discounted Gt. Some implementations instead sample time steps according to a discounted visitation distribution; state the convention.

## 5. REINFORCE turns outcomes into a loss

**REINFORCE** is the common name for this Monte Carlo score-function policy update. It uses sampled returns and gradient ascent on performance, or gradient descent on their negative log-probability surrogate.

```python
weighted_log_probs = action_log_probs * returns.detach()
policy_loss = -weighted_log_probs.sum()
policy_loss.backward()
```

This is one episode's undiscounted surrogate; average episode contributions for a batch. Use the matching discount weights when optimizing the discounted start-state objective. Detach the sampled return to avoid unintended gradient paths.

## 6. What the update encourages

In a binary policy, let p be the probability of action one and z its logit, so p is sigmoid(z). For action one, the derivative of log p with respect to z is 1−p. For action zero, it is −p.

At p=0.5, a sampled action one with positive return 4 contributes gradient 2 toward increasing its logit. A negative return reverses that direction. This is a noisy contribution to an expectation, not proof that one sampled action caused the entire result.

## 7. Randomness and gradient variance

**Entropy** measures distributional randomness; for discrete policies it is minus the sum of pi(a given s) log pi(a given s). An entropy bonus can discourage premature concentration, but randomness alone does not discover long purposeful action sequences.

Long horizons, variable rewards, and rare successful trajectories can make plain REINFORCE noisy. Reward-to-go, baselines, and learned critics address estimation quality; they do not create missing experience.

## 8. Compare the learning mechanisms

| Mechanism | Learned object | Main update signal |
|---|---|---|
| Q-learning | Action values | Bootstrapped optimality error |
| REINFORCE | Policy distribution | Sampled return times score gradient |
| Actor–critic | Policy and value predictor | Estimated advantage and value error |
