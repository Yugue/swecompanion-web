## Position bias

## 1. Placement changes opportunity

Position bias means placement changes examination or clicking beyond an item's appeal. High-ranked items may get more attention simply because they are easier to see.

> More applause under a brighter spotlight does not alone prove a better performance.

## 2. Separate examination from attractiveness

A toy **examination model** assumes clicks require examination:

\[
P(click\mid x,i,r)=e(r,x)a(i,x)
\]

\(P\): probability; \(x\): context; \(i\): item; \(r\): rank; \(e\): examination probability; \(a\): click probability given examination, assumed rank-independent here.

The multiplication depends on those assumptions.

## 3. Hold attractiveness fixed

```rrp-visual
position-examination
```

An unchanged item can receive different CTR because the chance of examination changed.

Raw rank CTR cannot identify the components: the old ranker intentionally placed different items at different ranks.

## 4. Create comparable placement evidence

Randomized swaps compare items and audiences under different placements. Other sources of rank variation or fitted click models need justified assumptions about selection.

Device, layout, and scrolling can change the effect. “Position” is more than a row number.

## 5. Interpret a relative correction

Suppose rank 5 gets half rank 1's examination. Dividing rank-5 CTR by 0.5 puts it on a reference-position scale.

It does not automatically recover an absolute preference probability.

Small examination estimates also create large inverse weights and unstable learning.

## 6. Recognize model failures

Trust in high-ranked results and competition for attention can violate the simple examination model.

Examination is also different from **selection propensity**, the serving policy's probability of choosing an action. The next chapter uses that probability.

## 7. Interview reasoning

**Question:** Why not divide by observed CTR at each rank to remove bias?

**Answer:** Rank CTR mixes placement with the items and audiences assigned there. Correcting examination needs evidence or assumptions that separate those effects.
