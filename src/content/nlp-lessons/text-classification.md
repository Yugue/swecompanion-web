# Text classification, sentiment, and intent

## 1. Classify the required meaning

**Text classification** assigns categories to text. “The refund was handled brilliantly” expresses positive sentiment about a refund; attitude and requested action are different targets.

## 2. Choose the output structure

| Labels | Head |
|---|---|
| Spam or legitimate | One sigmoid score |
| Exactly one routing category | Softmax |
| Billing and delivery can coexist | Sigmoid per label |

Define mixed-request labels before fitting.

## 3. Compare usable baselines

Evaluate rules, a TF-IDF linear model, and a contextual model on the same split.

Inspect whether context resolves failures that lexical features cannot express. Compare cost alongside quality.

## 4. Handle rare classes

**Class imbalance** means unequal class frequencies. Report per-class counts and F1; majority accuracy can conceal rare-intent failure.

**Class weighting** scales loss by class. **Resampling** changes how often cases are selected. Keep evaluation representative of deployment.

## 5. Choose a threshold from scores

For positive scores [0.9,0.6] and negative scores [0.8,0.2], flag scores at or above the cutoff:

| Cutoff | Precision | Recall |
|---|---|---|
| 0.85 | 1 | 0.5 |
| 0.55 | 2/3 | 1 |

A **precision–recall curve** plots these quantities across cutoffs. Choose using error costs or review capacity, on validation data.

## 6. Check confidence separately

If 100 predictions near 0.8 contain only 60 correct labels, confidence and observed frequency disagree.

**Temperature scaling** fits a positive logit divisor on held-out loss. It can adjust multiclass confidence without changing the highest-scoring class.

## 7. Test unsupported inputs

Negation, quotations, unfamiliar names, and missing conversation context expose different failures.

An unknown intent can receive a large softmax score. Calibration on known inputs does not establish unknown-intent detection; validate a review or clarification policy too.

## 8. Interview reasoning

**Question:** Does 0.99 maximum softmax justify routing an unfamiliar request automatically?

**Answer:** No. The model must distribute probability among its known classes. Test unsupported inputs and the review policy independently.
