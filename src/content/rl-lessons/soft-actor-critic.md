# 4.5 Maximum-entropy learning and Soft Actor–Critic

## 1. Optimize useful randomness as well as reward

**Soft Actor–Critic (SAC)** learns a stochastic actor from replay while rewarding entropy as part of its objective.

It learns a reward/randomness tradeoff, rather than adding noise after optimizing a deterministic policy.

## 2. The maximum-entropy objective

The **maximum-entropy objective** adds policy entropy to discounted reward:

\[
J(\pi)=\mathbb E_\pi\left[\sum_{t\ge0}\gamma^t
\left(R_{t+1}+\alpha\mathcal H(\pi(\cdot\mid S_t))\right)\right]
\]

R is task reward; γ discount; α≥0 the **temperature**; H entropy. For continuous actions, entropy is expected minus log density; it can be negative and depends on units.

Increasing α values spread more relative to reward. Rescaling reward changes that tradeoff unless α adjusts; the optimum can differ from reward-only control.

## 3. Soft values include future entropy

A soft critic target includes successor entropy:

\[
y=r+\gamma(1-d)\left[\min_j Q_{\bar\phi_j}(s',a')
-\alpha\log\pi_\theta(a'\mid s')\right],\qquad a'\sim\pi_\theta(\cdot\mid s')
\]

j indexes two critics with parameters φj; bars mark targets; d denotes genuine termination. Sample a′ from πθ at s′ and hold the target fixed during critic fitting.

This Q convention contains immediate reward and future entropy. The actor supplies current-action entropy; avoid counting it twice.

## 4. The actor balances value and log density

Minimize an actor loss balancing log density and critic value:

\[
L_{\mathrm{actor}}=\mathbb E_{s\sim\mathcal D,\,a\sim\pi_\theta}
\left[\alpha\log\pi_\theta(a\mid s)-\min_jQ_{\phi_j}(s,a)\right]
\]

D supplies replay states; a is a newly sampled policy action. The value term favors high-Q actions; the expected log-density term favors entropy.

Twin critics can share unsupported errors. These are new sampled actions at stored states, rather than likelihood updates on stored actions.

## 5. Reparameterize continuous action samples

**Reparameterization** expresses an action using fixed base noise and differentiable parameters:

\[
u=\mu_\theta(s)+\sigma_\theta(s)\odot\epsilon,\qquad
\epsilon\sim\mathcal N(0,I),\qquad a=\tanh(u)
\]

μ,σ are learned mean/scale vectors; ⊙ multiplies coordinates; ε is standard Gaussian noise. Tanh maps u into (−1,1); physical bounds may add scaling and shifting.

Gradients flow through action to μ and σ. REINFORCE instead holds the sampled action fixed and differentiates its log probability.

## 6. Squashing changes probability density

Squashing changes density, requiring a **change-of-variables correction**:

\[
\log\pi(a\mid s)=\log p_U(u\mid s)-\sum_k\log\left(1-\tanh^2(u_k)\right)
\]

pU is the pre-squash Gaussian density; k indexes coordinates. Additional action scaling contributes a constant log-scale term. Ignoring this correction optimizes the wrong entropy.

Use a numerically stable transformed distribution near action bounds, where naive log(1−tanh²u) loses precision.

## 7. A small soft-target calculation

Reward 1, γ=0.9, smaller Q=5, α=0.2, and successor log density −1 give continuation 5.2 and target 5.68.

Log density −1 is not negative probability: it is the logarithm of a continuous density.

## 8. Temperature and operational choices

A fixed α needs tuning against reward/action scale. Automatic temperature tuning adjusts it toward a selected entropy target.

SAC trades replay reuse for multiple networks and coverage sensitivity. PPO needs fresh rollouts but different bookkeeping. Compare interaction cost, compute, and observed reliability.

Record evaluation behavior: a stochastic sample and a mean action measure different policies. Continuous SAC is not its only possible action-space variant.
