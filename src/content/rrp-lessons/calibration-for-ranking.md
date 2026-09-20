## When the score has to be a real probability

**A model is calibrated when its 0.7 means the thing happens 70% of the time.** Ranking does not need that. Several things downstream of ranking need it badly.

### 1. Ranking survives any distortion of the score

```text
true rates:     0.40   0.20   0.10
model says:     0.80   0.40   0.20      ← every number is doubled and WRONG
ranking:        same order                ← completely unaffected
```

Multiply every score by two, square them, take logs - as long as the transformation preserves order, the ranked list is identical. So a model can rank perfectly and be badly calibrated, and ranking metrics will never notice.

---

### 2. Where it suddenly matters

```text
ads / auctions      expected value = predicted rate × bid
                    → inflate the rate by 40% and you overspend by 40%

blending            w₁·P(click) + w₂·P(purchase)
                    → if the two are on different scales, the weights are meaningless

thresholds          "auto-promote anything above 0.6"
                    → the threshold only has a stable meaning if the score does

showing a number    "83% match"
                    → obviously

budget pacing       spend forecasts built from predicted rates
```

### Rule of thumb

> The moment the score is multiplied by anything - money, another probability, a cost - it has to be true, not just correctly ordered.

Advertising is the clearest case: the whole auction is arithmetic on predicted rates, so a miscalibrated model does not rank things wrongly, it charges the wrong amounts.

---

### 3. The thing that breaks calibration here

Down-sampling negatives is near-universal in this domain - a 1% click rate means 99 useless rows for every useful one, so you keep a fraction of them.

```text
true rate           1%
keep 1 in 10 negatives
training rate      ~9.2%     ← the model learns THIS
```

The model is now systematically over-confident by a large factor. The correction is arithmetic, because the sampling rate is known:

\[
p_{\text{true}} = \frac{p}{p + (1-p)/w}
\]

where \(w\) is the down-sampling rate for negatives. Applying that at serving time restores the real scale.

---

### 4. Other sources of miscalibration

| Source | Effect |
|---|---|
| Down-sampled negatives | rates inflated, correctable analytically |
| Class weighting | same effect, same fix |
| Distribution shift | yesterday's calibration is wrong today |
| Pairwise training | there is no meaningful scale at all |
| Ensembling or blending | scales differ between components |

The last row is why blending and calibration are usually discussed together.

---

### 5. Fixing it

```text
1. analytic correction     when you know the sampling rate      ← do this first
2. Platt scaling           fit a small logistic on held-out scores
3. isotonic regression     fit a flexible monotone mapping; needs more data
4. per-segment calibration separate mappings per country, device, surface
```

Two rules: fit the calibrator on **held-out** data the model did not train on, and **re-fit it after every retrain**, because the score distribution moves. Monitoring is simple and worth doing - compare the average predicted rate against the realized rate, daily.

---

## What matters most

- **Ranking only needs order, and order survives any monotone distortion,** so ranking metrics cannot detect miscalibration.
- **Auctions, blending, thresholds, and displayed numbers all need the score to be true.**
- **Down-sampling negatives is standard here and inflates predicted rates,** but the sampling rate is known so the correction is arithmetic.
- **Fit calibrators on held-out data and re-fit after every retrain,** because the score distribution moves.
- **Monitor predicted versus realized rates daily** - it is the cheapest check in the system.

Next topic is **Re-ranking the final list**.
