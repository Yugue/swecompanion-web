## Position bias

**Position bias** means an item's placement changes the chance it is examined or clicked, beyond the item's underlying appeal. A click is therefore evidence about both the item and its presentation.

Raw CTR at different ranks does not identify this effect: the old policy deliberately placed different items at different ranks.

## 1. A simple examination model

```rrp-visual
position-examination
```

Under a particular model, clicking requires examination and attractiveness after examination:

\[
P(click\mid x,i,r)=e(r,x)\,a(i,x)
\]

\(e\) is examination probability for rank \(r\) and context \(x\); \(a\) is conditional click attractiveness, assumed independent of rank in this model.

If \(a=0.1\), examination 0.8 at rank 1 gives CTR 0.08. Examination 0.4 at rank 5 gives CTR 0.04 for the same attractiveness.

This illustrates an assumption, not an examination estimate inferred from those two click rates alone.

## 2. Identify placement effects with suitable evidence

Randomized swaps can compare similar items and audiences under different placements. Natural rank variation or joint click models may also help, but require assumptions about confounding and identifiability.

Often evidence identifies only relative examination, such as rank 5 receiving half the examination of rank 1. Dividing CTR by that relative multiplier puts it on a reference-position scale; it does not automatically recover absolute preference probability.

Measure layout and device differences. “Position” can include scrolling, image size, and grid location, not just a vertical rank number.

## 3. Corrections have limits

Bias-aware learning can weight observed evidence using an appropriate examination model. A model trained with observed position can also score candidates at a common reference position, if its assumptions support that use.

Neither turns every unclicked low-rank item into a definite negative preference. Small examination estimates also produce large inverse weights and unstable results; clipping changes the bias–variance tradeoff.

## 4. Distinguish other mechanisms

Users may trust high-ranked items more, and one result can change attention to others. These effects violate the simple examination-times-attractiveness model.

Examination probability is also distinct from **selection propensity**: the probability that the serving policy chose an action. Correcting visibility and evaluating a different policy are related but different problems.

> **Mental image:** placement controls the spotlight. More applause under a brighter spotlight does not, by itself, prove a better performance.
