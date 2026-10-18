## Class imbalance

## 1. Count evidence, not just percentages

**Class imbalance** means some target classes are much rarer than others. **Prevalence** is the positive fraction.

At 0.1% prevalence, a billion examples contain a million positives; a thousand examples contain one. These have very different amounts of learning evidence.

## 2. Choose useful evaluation

An all-negative predictor gets 99.9% accuracy here and finds no positives. Use the confusion-matrix and curve measures at the actual action budget.

Unweighted training can still learn useful rare patterns. Rarity alone does not prescribe a training method.

## 3. Try the threshold first

For 10,000 cases with 50 positives:

| Cutoff | TP / FP | Precision / recall |
|---|---|---|
| Higher | 2 / 1 | 66.7% / 4% |
| Lower | 35 / 65 | 35% / 70% |

A lower cutoff may meet the objective without changing fitting. Choose from validation costs and capacity.

## 4. Change the fitting emphasis when needed

| Method | Mechanism | Limitation |
|---|---|---|
| Class weighting | Multiply selected class losses | Changes the fitting objective |
| Oversampling | Repeat minority rows | Adds no independent evidence |
| Undersampling | Remove majority rows | Loses information |
| SMOTE | Interpolate minority neighbors | Can create implausible examples |

**SMOTE** expands to Synthetic Minority Over-sampling Technique. Interpolation needs particular care with categories, sparse features, and temporal data.

## 5. Preserve the intended population

Resample only within training folds. Keep evaluation representative of deployment.

Changed class proportions or weights can distort probability estimates; follow the calibration procedure when probabilities matter. More emphasis on incorrect minority labels can amplify their errors, so audit labels and coverage too.

## 6. Interview reasoning

**Question:** Does duplicating positives 50 times create 50 times more evidence?

**Answer:** No. It changes their training influence, not their independent information. Evaluate whether that emphasis helps, and recheck probability meaning on representative data.
