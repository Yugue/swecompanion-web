## Class imbalance

**Class imbalance** means some target classes appear much less often than others. A 0.1% fraud rate supplies one positive example per thousand transactions.

Imbalance can make evaluation misleading and minority patterns hard to learn. It does not mean unweighted training always fails.

## 1. Start with prevalence and the operating point

**Prevalence** is the positive fraction. At 0.1%, an all-negative predictor is 99.9% accurate and has zero recall.

Report the baseline, precision, recall, and actual counts at a useful threshold. Average precision summarizes ranking behavior, but the review team still needs to know what enters its queue.

Distinguish rarity from sample count: 0.1% of one billion examples is one million positives; 0.1% of one thousand is one positive. The second problem has far less evidence.

## 2. Try the decision threshold first

A model can rank positives usefully while rarely predicting positive at the default threshold of 0.5. Lowering the cutoff may meet the decision's needs without changing training.

For 10,000 cases with 50 positives:

| Threshold | TP | FP | Precision | Recall |
|---|---|---|---|---|
| Higher | 2 | 1 | 66.7% | 4% |
| Lower | 35 | 65 | 35% | 70% |

These are illustrative operating points. Choose by error costs and capacity using validation data, then evaluate the chosen policy honestly.

## 3. Weights and resampling change fitting

- **Class weighting:** multiply selected classes' losses. No rows are removed, but the fitting objective changes.
- **Random oversampling:** duplicate minority training examples. It adds emphasis, not independent information.
- **Undersampling:** remove majority examples, reducing work while losing information.
- **SMOTE (Synthetic Minority Over-sampling Technique):** interpolate between minority neighbors to create synthetic examples. These can be implausible for mixed categories, sparse spaces, or time-dependent data.

Perform resampling only within training folds. Never resample validation or test to make results look balanced. Preserve the population you need to evaluate, unless the evaluation explicitly estimates weighted target-population performance.

## 4. Preserve probability meaning and label quality

Oversampling positives changes the apparent base rate; class weights can have a similar effect on probability estimates. Fit calibration on representative held-out predictions if probabilities are used directly. Analytic corrections require assumptions about the sampling process.

Check whether negatives include undetected positives. More weight on noisy labels can amplify their errors.

When positive patterns are poorly covered, consider better labelling, a high-recall first stage, or anomaly detection alongside supervised learning. Rarity alone does not determine the right method.

> **Mental image:** there are three controls: which errors you measure, where you act on scores, and what evidence training emphasizes. They solve different problems.
