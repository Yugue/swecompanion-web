# Mini-batches, optimizers, and learning rates

## 1. Choose how to update

An **optimizer** changes parameters using gradients and possibly stored history. The learning rate sets step size.

The objective states what training prefers; the optimizer searches for a fit.

## 2. Estimate from a mini-batch

A **mini-batch** is a group of training examples used for one gradient estimate.

| Method | Examples per estimate |
|---|---|
| Full batch | Entire training set |
| Stochastic gradient descent (original usage) | One |
| Mini-batch SGD | Selected group |

Smaller batches add sampling noise. Full-data loss need not decrease after every sampled update.

## 3. Carry a running direction

**Momentum** smooths gradient history. One form is:

\[
m_t=\beta m_{t-1}+(1-\beta)g_t
\]

g_t is current gradient; m_t running average; t step; \(0\le\beta<1\) persistence. Larger beta smooths more but reacts more slowly.

## 4. Adapt coordinate scales

**Adam** tracks gradient and squared-gradient averages:

\[
\Delta w=-\eta\frac{\hat m}{\sqrt{\hat v}+\epsilon}
\]

For parameter coordinate w, hats denote averages corrected for their initial bias toward zero; eta is learning rate; \(\epsilon>0\) stabilizes division.

**AdamW** separately shrinks weights toward zero, an operation called **weight decay**. Adding an L2 loss penalty is not generally equivalent under adaptive scaling.

## 5. Size and schedule steps

For L(w)=(w−3)² at w=1, gradient=−4:

| Rate | New w | New loss |
|---|---|---|
| 0.1 | 1.4 | 2.56 |
| 2 | 9 | 36 |

**Warmup** gradually increases the early rate; **decay** lowers it later.

## 6. Limit unstable updates

**Gradient clipping** limits magnitude, for example by rescaling gradients beyond a norm bound.

Check targets, rate, nonfinite values, and batch composition too. Clipping limits an update; it does not repair the wrong objective.
