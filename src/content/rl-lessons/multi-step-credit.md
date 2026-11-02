# 2.3 Multi-step returns, eligibility traces, and temporal credit

## 1. Choose how much future to observe

An **n-step return** observes n rewards before bootstrapping once. It lies between one-step TD and complete-return MC, moving delayed evidence farther per update.

## 2. The n-step return

Use observed rewards followed by one predicted continuation:

\[
G_t^{(n)}=\sum_{k=0}^{n-1}\gamma^k R_{t+k+1}
+\gamma^n V(S_{t+n})
\]

n is backup length; γ discounts rewards R; V estimates continuation at Sₜ₊ₙ. Termination shortens the sum and removes continuation.

Substitute this target into the target-minus-value update. At an external collection boundary, bootstrap from a valid final observation.

## 3. A short numerical comparison

For rewards [1,2], γ=0.9, V(S₁)=4, and V(S₂)=5: one-step target=4.6; two-step target=1+1.8+4.05=6.85.

The longer target replaces one prediction with observed evidence. That does not guarantee lower error on every trajectory.

## 4. Lambda mixes backup lengths

A **lambda return** mixes backup lengths:

\[
G_t^\lambda=(1-\lambda)\sum_{n=1}^{\infty}\lambda^{n-1}G_t^{(n)},\qquad 0\le\lambda<1
\]

λ weights the mixture. λ=0 gives one-step TD. In a finite episode, assign remaining mixture weight to the terminal return; λ→1 then approaches complete-return MC.

γ changes reward weighting in the objective. λ changes the estimator. They are different controls.

## 5. Traces carry credit backward

An **eligibility trace** retains credit for earlier states. A tabular accumulating trace uses:

\[
e_t(s)=\gamma\lambda e_{t-1}(s)+\mathbf1\{S_t=s\},\qquad
V(s)\leftarrow V(s)+\alpha\delta_t e_t(s)
\]

eₜ(s) is state s’s trace; the indicator adds one on a visit. Previous traces decay by γλ. The current TD error δₜ updates all states in proportion to their traces; α is step size.

```text
new reward → current TD error
                    ↓
    recent states ← decaying trace weights → older states
```

Forward lambda returns and backward traces share this credit mechanism. Exact equivalence depends on update timing and formulation, especially when predictions change online.

## 6. The practical tradeoff

| Change | Benefit to seek | Cost to check |
|---|---|---|
| Larger n | Faster use of distant observed rewards | More sample noise and buffering |
| Larger lambda | Less reliance on immediate bootstraps | More variance and longer influence |
| Smaller n or lambda | Shorter, often quieter targets | More sensitivity to critic errors |

Long backups help when rewards are delayed and continuation values are weak. They still require actually encountering informative rewards.

## 7. Boundaries and off-policy data matter

Reset traces at episode boundaries. At truncation, bootstrap the final value but never recurse into the reset episode.

Multi-step returns include intervening behavior actions. Off-policy use may require corrections or a specialized target; longer backups can amplify policy mismatch.
