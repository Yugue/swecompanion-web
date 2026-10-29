# 4.5 Maximum-entropy learning and Soft Actor–Critic

## 1. Optimize useful randomness as well as reward

A deterministic policy may commit early to a poor action region. **Soft Actor–Critic (SAC)** learns a stochastic policy with replay while rewarding entropy as part of its objective.

This connects two mechanisms: off-policy actor–critic data reuse and direct control of policy randomness. It is not simply deterministic control with extra action noise attached afterward.

## 2. The maximum-entropy objective

\[
J(\pi)=\mathbb E_\pi\left[\sum_{t\ge0}\gamma^t
\left(R_{t+1}+\alpha\mathcal H(\pi(\cdot\mid S_t))\right)\right]
\]

Gamma discounts future terms, alpha is a nonnegative **temperature**, and H is policy entropy. For a continuous density, differential entropy is the expectation of minus log density and can be negative; it also depends on action units.

Larger alpha puts more weight on spread relative to reward. Reward rescaling therefore changes the effective tradeoff unless temperature is adjusted. The regularized optimum can differ from the reward-only optimum.

## 3. Soft values include future entropy

A standard SAC critic target is:

\[
y=r+\gamma(1-d)\left[\min_j Q_{\bar\phi_j}(s',a')
-\alpha\log\pi_\theta(a'\mid s')\right],\qquad a'\sim\pi_\theta(\cdot\mid s')
\]

Phi j are two critic parameter sets, bars identify target critics, and d indicates genuine termination. The target treats the bracket as fixed during critic fitting.

The soft Q convention here includes immediate reward and future entropy contributions. The actor's objective supplies the current decision's entropy term. Mixing conventions can accidentally count an entropy term twice or omit it.

## 4. The actor balances value and log density

\[
L_{\mathrm{actor}}=\mathbb E_{s\sim\mathcal D,\,a\sim\pi_\theta}
\left[\alpha\log\pi_\theta(a\mid s)-\min_jQ_{\phi_j}(s,a)\right]
\]

D is replayed states. Minimizing this expression favors high critic value and, in expectation, higher entropy. The twin critics reduce a source of optimistic action evaluation; both can still be wrong in the same unsupported region.

Unlike a stored-action likelihood update, the actor samples new actions at replayed states. This distinction matters for its gradient calculation.

## 5. Reparameterize continuous action samples

\[
u=\mu_\theta(s)+\sigma_\theta(s)\odot\epsilon,\qquad
\epsilon\sim\mathcal N(0,I),\qquad a=\tanh(u)
\]

Mu and sigma are learned mean and scale vectors, epsilon is fixed base noise for a sampled gradient computation, and the elementwise tanh maps actions to (−1,1). Physical action bounds can add a scale and shift.

This **reparameterization** preserves a differentiable path from the sampled action through mu and sigma to theta. It differs from REINFORCE's score-function estimator, which treats a sampled action as fixed while differentiating its log probability.

## 6. Squashing changes probability density

\[
\log\pi(a\mid s)=\log p_U(u\mid s)-\sum_k\log\left(1-\tanh^2(u_k)\right)
\]

P subscript U is the pre-squash Gaussian density; k indexes action coordinates. The second term is the change-of-variables correction. If actions are additionally scaled, include the corresponding constant log-scale term in the density convention.

Near action bounds, a naive implementation can lose numerical precision; use a stable transformed distribution or equivalent stable expression. Ignoring the correction trains the wrong entropy and actor objective.

## 7. A small soft-target calculation

Suppose reward=1, gamma=0.9, the smaller successor Q is 5, alpha=0.2, and sampled next-action log density is −1. The continuation is 5−0.2×(−1)=5.2, giving target 5.68.

A log density of −1 is not a probability of −1. For continuous actions it is the logarithm of a density, as introduced in 1.2.

## 8. Temperature and operational choices

A fixed temperature requires tuning relative to reward and action scales. Automatic tuning can adjust a positive alpha to encourage a selected entropy target; target conventions differ for continuous and discrete policies.

SAC reuses data efficiently but runs multiple networks and depends on replay coverage. PPO often uses simpler recent-rollout bookkeeping but generally collects more fresh experience. Compare environment cost, compute, tuning budget, and observed reliability rather than asserting a universal winner.

The common continuous SAC formulation shown here is not its only possible action-space variant. At evaluation, choosing a mean or deterministic action changes the behavior being measured; record the convention.
