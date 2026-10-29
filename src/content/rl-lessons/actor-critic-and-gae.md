# 4.2 Baselines, advantage estimation, and actor–critic updates

## 1. Ask whether an outcome was better than expected

A return of 10 may be excellent in a hard state and disappointing in an easy one. Using raw returns makes the policy gradient respond to variation the chosen action did not explain.

A **baseline** subtracts a reference outcome. An **actor–critic** learns a policy, the actor, alongside a value predictor, the critic, that supplies this reference or a bootstrapped learning signal.

## 2. Why an action-independent baseline preserves the gradient

\[
\mathbb E_{a\sim\pi_\theta(\cdot\mid s)}
\left[b(s)\nabla_\theta\log\pi_\theta(a\mid s)\right]
=b(s)\nabla_\theta\sum_a\pi_\theta(a\mid s)=0
\]

B(s) is independent of the sampled action. Policy probabilities sum to one, whose derivative is zero. Therefore subtracting b(s) from the return does not change the expected score gradient under the usual assumptions.

Treat the baseline as fixed within that actor-gradient calculation. An action-dependent baseline needs additional correction; arbitrary action-dependent subtraction does not enjoy the same identity.

## 3. A learned value baseline and advantage

Using V(s) as a baseline estimates how much better the sampled action's future was than the policy's expected future. With a complete sampled return, Gt−V(St) remains an unbiased baseline-adjusted signal even if the baseline is imperfect, when used correctly.

Replacing the full return with a bootstrapped target reduces reliance on long sampled outcomes but can introduce bias through critic error. That is the important distinction between a harmless imperfect baseline and an imperfect bootstrapped advantage estimator.

## 4. The one-step actor–critic signal

\[
\delta_t=r_{t+1}+\gamma(1-d_t)V_\phi(s_{t+1})-V_\phi(s_t)
\]

Phi denotes critic parameters and d genuine termination. With an exact on-policy value, the expected TD error conditioned on state and action equals the advantage. With an approximate critic, the error becomes a biased but often useful estimate.

```text
observation → actor → action → environment → reward, successor
     └──────→ critic ────────────────→ estimated advantage
                         advantage → actor update
```

## 5. Generalized advantage estimation

**Generalized Advantage Estimation (GAE)** mixes future TD errors:

\[
\widehat A_t^{\mathrm{GAE}}=\sum_{l=0}^{L-1}(\gamma\lambda)^l\delta_{t+l}
\]

L is the available trajectory length from t, gamma the task discount, and lambda the estimator's mixing parameter from 2.3. Stop the sum at the relevant sequence boundary and bootstrap the final value appropriately.

Lambda=0 gives the one-step TD error. With lambda=1 and a complete genuinely terminated episode, the terms telescope to the Monte Carlo return minus the initial value. Larger lambda generally relies more on sampled future information and less on intermediate bootstraps.

## 6. A two-step example

Let gamma=0.9, lambda=0.8, delta0=1, and delta1=2. Then estimated advantage at the first decision is 1+0.72×2=2.44. At lambda=0 it would be 1.

This does not alter which future rewards the task discounts. It changes the mixture of errors used to estimate improvement. At a collection truncation, include the final continuation estimate in the final delta, but do not recurse into an unrelated reset episode.

## 7. Actor and critic losses have different jobs

\[
L_{\mathrm{actor}}=-\mathbb E[\log\pi_\theta(a_t\mid s_t)\operatorname{stopgrad}(\widehat A_t)],\qquad
L_{\mathrm{value}}=\frac12\mathbb E[(V_\phi(s_t)-\operatorname{stopgrad}(\widehat R_t))^2]
\]

R hat is a selected return target, often advantage plus the value used during collection. Stopgrad means treat the quantity as fixed for that loss. The actor expression is a common rollout surrogate; weighting depends on the objective convention described in 4.1.

Shared encoders receive gradients from both losses. Critic loss weight can therefore affect representation learning even though the actor and critic have different outputs.

## 8. Practical tradeoffs

A critic trained too little can provide poor advantages. A critic aggressively fitted to narrow recent data can overfit or destabilize shared features. Advantage normalization can improve scale conditioning but changes finite-batch behavior and is not a proof of unbiasedness.

Synchronous **Advantage Actor–Critic (A2C)** collects on-policy experience from several environments and updates with advantage estimates. Parallel collection improves throughput; it does not by itself permit unrestricted old-data replay.
