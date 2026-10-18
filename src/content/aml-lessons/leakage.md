## Data leakage

## 1. Reconstruct what was knowable

**Data leakage** occurs when fitting or selection uses information unavailable in the claimed prediction or evaluation setting. It can inflate offline results.

> Reconstruct the model's desk at prediction time.

## 2. Audit a historical feature

For a Monday churn score:

| Feature | Validity |
|---|---|
| Account age on Monday | Available |
| Prior sessions already recorded | Available |
| Next month's cancellation reason | Future information |
| Lifetime spend computed today | Must reconstruct Monday's value |

An old event timestamp is insufficient if the value arrived or was corrected later.

## 3. Audit the fitted transformations

**Feature selection** chooses input columns, often using their association with labels. Selecting from all labels before evaluation can retain accidental correlations.

```text
split first → fit preprocessing on training → transform held-out inputs
```

The split and cross-validation lessons describe pipeline fitting. A pipeline cannot repair an input already built from future events.

## 4. Match the claimed population

New-patient evaluation must keep one patient's records together. Future-event evaluation must respect chronology and historical label availability.

Existing customers can appear across a forward-time split when deployment predicts their future activity. The problem is violating the claim, rather than repetition alone.

## 5. Investigate suspicious gains

After a sudden score jump, inspect joins, timestamps, copies, target-derived columns, and split assignment. Remove suspect features and rebuild the evaluation as a diagnostic experiment.

For target encoding, check inner fold restrictions too. Excluding a row's label still leaks when future labels influence its input.

## 6. Interview reasoning

**Question:** Does a feature have to cause the outcome to be valid?

**Answer:** No. It must be available and evaluated honestly for the intended use. Causality matters when claiming that changing it would change the outcome.
