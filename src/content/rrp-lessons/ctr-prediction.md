## Predicting clicks and numeric outcomes

## 1. Name the output's units

**Click-through rate (CTR)** is clicks divided by impressions. A CTR model predicts a click probability; a **regression model** predicts a numeric quantity such as rating, watch seconds, or value.

The target contract determines which output the policy can use.

## 2. Complete the example

```text
unit:   one rendered impression with a stable ID
inputs: information available at selection
target: click within 30 minutes, after accepted arrival delay
```

An unrendered candidate is not an observed non-click. Numeric targets likewise need a defined window and available labels; missing ratings are not zero ratings.

## 3. Penalize confident click mistakes

**Binary log loss**, also called binary cross-entropy, is:

\[
\ell=-y\log p-(1-y)\log(1-p)
\]

\(y\in\{0,1\}\): label; \(p\in(0,1)\): predicted probability; \(\ell\): loss; log: natural logarithm.

For a non-click, predictions 0.9 and 0.1 cost about **2.303** and **0.105** respectively.

## 4. Sweep a decision threshold

A **threshold** turns scores into positive predictions. **True positives (TP)** are correctly predicted positives; **false positives (FP)** are negatives predicted positive; **true negatives (TN)** are correctly predicted negatives; **false negatives (FN)** are positives predicted negative.

\[
TPR=Recall,\qquad FPR=\frac{FP}{FP+TN}
\]

**True-positive rate (TPR)** measures recovered positives. **False-positive rate (FPR)** measures the fraction of actual negatives flagged. Precision, taught with ranking metrics, instead divides by all predicted positives.

Sweeping the threshold traces an **ROC (receiver operating characteristic) curve**, TPR against FPR, or a **precision–recall (PR) curve**, precision against recall.

At 1% CTR, predicting no clicks gets 99% accuracy but zero TPR.

## 5. Read both views of sparse clicks

In 10,000 impressions, 100 clicked: **prevalence**, the positive fraction, is 1%. At one threshold, recover 80 clicks and flag 99 non-clicks:

```rrp-visual
prediction-metrics
```

Non-clicks vastly outnumber clicks, so a small fraction of flagged non-clicks can outnumber recovered clicks. Read precision alongside FPR.

## 6. Choose the metric for the question

**Area under the curve (AUC)** summarizes a threshold curve. **ROC-AUC** also equals the fraction of correctly ordered positive–negative pairs, counting tied scores as half correct. Chance-level ordering scores 0.5; perfect pair ordering scores 1.

**PR-AUC** summarizes precision versus recall across thresholds. It is useful for scarce positives, but depends on prevalence; report class rate and the area-computation convention. Random ranking has prevalence as its precision reference: 1% here.

| Question | Evidence |
|---|---|
| Separate clicks from non-clicks? | ROC-AUC / PR-AUC |
| Probabilities numerically trustworthy? | Log loss and calibration: predicted/observed frequency agreement |
| Order each request well? | Request-level NDCG / recall |
| Improve the deployed product? | Suitable experiment |

## 7. Overall AUC can disagree with request ordering

Each toy request has one relevant and one irrelevant item:

| Request | Model A: relevant / irrelevant score | Model B: relevant / irrelevant score |
|---|---|---|
| 1 | 0.2 / 0.1 | 0.8 / 0.1 |
| 2 | 0.5 / 0.4 | 0.9 / 0.2 |
| 3 | 0.8 / 0.7 | 0.7 / 0.75 |

Overall ROC-AUC rises **6/9 → 8/9**, but equal-request mean NDCG@1 falls **1 → 2/3**. Overall AUC includes cross-request pairs; the displayed winner depends on within-request order.

## 8. Choose a numeric loss

Let \(e_t=\hat y_t-y_t\): predicted minus actual outcome for example \(t\), among \(n\) examples.

\[
MSE=\frac1n\sum_t e_t^2,\qquad
MAE=\frac1n\sum_t|e_t|,\qquad RMSE=\sqrt{MSE}
\]

**Mean squared error (MSE)** emphasizes large errors; **mean absolute error (MAE)** grows linearly; **root MSE (RMSE)** restores the original units.

Ideal squared-loss fitting targets the mean outcome for given inputs; absolute-loss fitting targets the median, the middle outcome. Expected-value ranking generally needs the mean.

## 9. Watch an outlier change the choice

Toy observed durations are [0,0,9] seconds. Compare constant predictions:

| Prediction | MSE, seconds squared | MAE, seconds |
|---|---|---|
| 0 seconds | 27 | 3 |
| 3 seconds | 18 | 4 |

Squared loss prefers 3; absolute loss prefers 0. Choose according to the intended quantity and error costs, not merely the smaller-looking number.

## 10. Validate the intended population

Compare against training-rate or training-mean baselines on representative held-out examples. Keep outcome windows and eligibility fixed.

Exposure and position affect logged clicks. Non-click downsampling changes class proportions; its probability correction belongs in the calibration chapter. Model-family choices follow in “Choosing a ranking model.”

## 11. Interview reasoning

**Question:** Why is 99% accuracy unconvincing at 1% CTR?

**Answer:** A model can achieve it by predicting no clicks. Compare probability quality and useful ranking against a credible reference.
