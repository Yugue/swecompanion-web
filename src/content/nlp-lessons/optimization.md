# Mini-batches, optimizers, and learning rates

## 1. Change parameters using training evidence

An **optimizer** uses gradients and possibly stored state to update parameters. The **learning rate** controls the size of the step.

The objective defines what training should prefer; the optimizer defines how to search. More updates do not help when the target or objective is wrong.

## 2. Estimate a gradient from a batch

A **mini-batch** is a selected group of training examples. Averaging its losses supplies an estimated gradient.

Full-batch descent uses every example per update; stochastic gradient descent originally uses one. “SGD” is also commonly used for mini-batch implementations, so state the intended batch size.

Smaller batches reduce per-step work but add sampling noise. Full-data loss need not decrease after every sampled update.

## 3. Retain gradient history

**Momentum** carries a running direction so updates need not respond only to the latest gradient. One exponential-average form is:

\[
m_t=\beta m_{t-1}+(1-\beta)g_t
\]

\(g_t\) is the current gradient; \(m_t\) its running average; \(0\le\beta<1\) controls persistence; \(t\) indexes steps. Larger persistence smooths more but responds more slowly to changes.

## 4. Adapt coordinate scales

**Adam** tracks averages of gradients and squared gradients. Its adjusted step uses:

\[
\Delta w=-\eta\frac{\hat m}{\sqrt{\hat v}+\epsilon}
\]

\(w\) is a parameter coordinate; \(\hat m,\hat v\) are bias-corrected running estimates; \(\epsilon>0\) stabilizes the denominator. Different coordinates receive different effective scaling.

**AdamW** applies weight decay separately from this adaptive gradient step. Adding an L2 loss term is not generally equivalent under Adam’s adaptive scaling.

## 5. Follow a learning-rate schedule

**Warmup** increases the rate gradually at the start; **decay** reduces it later. These are scheduling choices, not additional learning signals.

For \(L(w)=(w-3)^2\), starting at 1 gives derivative −4. Rate 0.1 moves to 1.4 and reduces loss from 4 to 2.56. Rate 2 moves to 9 and raises loss to 36.

## 6. Control unstable steps

**Gradient clipping** limits gradient magnitude, for example by rescaling a vector whose norm exceeds a bound. It changes the update, not the computed forward prediction.

Inspect loss scaling, nonfinite values, batch composition, and learning rate before assuming clipping fixes the cause. Compare training runs under consistent token and update budgets.

## 7. Interview reasoning

**Question:** Does doubling batch size and keeping the same number of steps preserve the experiment?

**Answer:** No. The model sees more examples per step and the gradient noise changes. Specify data exposure, accumulation, learning rate, and update budget before comparing outcomes.
