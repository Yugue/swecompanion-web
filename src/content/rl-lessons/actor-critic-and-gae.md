# 4.2 Baselines, advantage estimation, and actor–critic updates

## 1. Ask whether an outcome was better than expected

Return 10 may be excellent in a difficult state and poor in an easy one. A **baseline** subtracts a state-specific reference.

The actor uses this comparison to change behavior; the critic learns the reference values or bootstrapped signal.

## 2. Why an action-independent baseline preserves the gradient

An action-independent baseline has zero expected score-gradient contribution:

\[
\mathbb E_{a\sim\pi_\theta(\cdot\mid s)}
\left[b(s)\nabla_\theta\log\pi_\theta(a\mid s)\right]
=b(s)\nabla_\theta\sum_a\pi_\theta(a\mid s)=0
\]

b(s) does not depend on sampled action a. πθ probabilities sum to one, whose derivative is zero. Subtracting b(s) therefore preserves the expected actor gradient.

Treat the baseline as fixed during that calculation. Action-dependent subtraction needs additional correction.

## 3. A learned value baseline and advantage

A complete return minus V(s) remains unbiased as an actor signal with a correctly used action-independent baseline, even if V is inaccurate.

A bootstrapped return also depends on successor predictions. Critic errors can then bias the estimated advantage, rather than merely change its variance.

## 4. The one-step actor–critic signal

A one-step actor–critic can use TD error:

\[
\delta_t=r_{t+1}+\gamma(1-d_t)V_\phi(s_{t+1})-V_\phi(s_t)
\]

```text
observation → actor → action → environment → reward, successor
     └──────→ critic ────────────────→ estimated advantage
                         advantage → actor update
```

φ denotes critic parameters; r reward; γ discount; d genuine termination. With exact on-policy V, expected δ given state/action equals advantage. An approximate critic can bias it.

## 5. Generalized advantage estimation

**Generalized advantage estimation (GAE)** mixes successive TD errors:

\[
\widehat A_t^{\mathrm{GAE}}=\sum_{l=0}^{L-1}(\gamma\lambda)^l\delta_{t+l}
\]

Â is estimated advantage; L available sequence length; γ task discount; λ mixture strength. Stop at sequence boundaries and handle the final bootstrap correctly.

λ=0 gives one-step TD error. At λ=1 in a complete terminated episode, errors telescope to return minus starting value. Larger λ generally uses more sampled future information.

## 6. A two-step example

For γ=0.9, λ=0.8, and TD errors [1,2], advantage is 1+0.72×2=2.44. At λ=0 it is 1.

λ changes estimation, not the task’s discounting. At truncation, include the final bootstrap in δ but stop recursion before reset.

## 7. Actor and critic losses have different jobs

Actor and value losses optimize different outputs:

\[
L_{\mathrm{actor}}=-\mathbb E[\log\pi_\theta(a_t\mid s_t)\operatorname{stopgrad}(\widehat A_t)],\qquad
L_{\mathrm{value}}=\frac12\mathbb E[(V_\phi(s_t)-\operatorname{stopgrad}(\widehat R_t))^2]
\]

θ is actor parameters; φ critic parameters; R̂ a chosen return target, often collection value plus estimated advantage. **Stopgrad** holds targets fixed. Actor time weighting must match the objective convention.

Shared feature encoders receive both gradients, so value-loss weighting can alter policy representations.

## 8. Practical tradeoffs

An undertrained critic gives poor advantages; overfitting narrow recent data can destabilize shared features. Advantage normalization changes finite-batch scaling and does not prove unbiasedness.

**Advantage Actor–Critic (A2C)** synchronously collects on-policy experience from parallel environments. Faster collection does not permit unrestricted historical replay.
