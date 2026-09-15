## Offline evaluation, thresholds, and train/validation/test strategy

A model's raw score is not a decision. Turning a score into something the business can act on requires three things working together: the right offline metric, a deliberately chosen threshold, and a split strategy that doesn't lie to you about how well the model will actually perform.

### Pick the metric that matches the deployment decision

There is no universal "best" metric - the right one depends on what the model's output is used for:

- **Imbalanced classification** (fraud, churn, rare disease): precision, recall, F1, and PR-AUC. Accuracy is close to meaningless here (see the class imbalance lesson).
- **Ranking** (search, feed, ads): NDCG, MRR, MAP - metrics that reward getting the *order* right, since that's what the user actually experiences.
- **Anything whose probability is consumed directly** (e.g. to compute expected value or risk): calibration error, alongside whatever discrimination metric (AUC) you'd otherwise use. A model can have great AUC and still be badly calibrated - it separates classes well, but its actual probability numbers are wrong.

Naming the right metric for the *specific* deployment decision, rather than reciting "we'd use precision and recall," is what distinguishes a strong answer here.

### Threshold selection is a business decision wearing an ML costume

A classifier outputs a score; a product decision needs a yes/no (or a ranked list cutoff). The threshold that converts one into the other is chosen by walking the precision-recall (or ROC) curve and picking the operating point whose trade-off matches the real-world cost of each error type.

\[
\text{Precision} = \frac{TP}{TP+FP} \qquad \text{Recall} = \frac{TP}{TP+FN}
\]

Raising the threshold trades recall for precision (fewer false positives, more missed positives); lowering it does the reverse. The correct threshold is the one where the cost of a false positive times its rate, plus the cost of a false negative times its rate, is minimized - not simply "0.5," and not "wherever F1 peaks" unless the true costs of the two error types happen to be equal.

**Example:** for fraud detection, a false positive blocks a legitimate purchase (a cost in customer trust and lost revenue on that transaction); a false negative eats the transaction's value as a chargeback plus fees. If a chargeback costs 10x more than a blocked legitimate purchase in expected terms, the threshold should sit further toward higher recall than a naive "balance precision and recall" instinct would suggest.

> Whatever threshold you pick, revisit it after every retrain. The operating point that was optimal for one data distribution silently drifts as the distribution shifts - a stale threshold is a common, easy-to-miss production bug.

### Train / validation / test strategy

The classic three-way split exists so that model *fitting*, model *selection*, and final *evaluation* never contaminate each other:

- **Train**: fit model parameters.
- **Validation**: choose hyperparameters, architecture, and (as above) the decision threshold.
- **Test**: touched exactly once, at the end, to estimate real-world performance - if you tune anything based on test performance, it stops being a trustworthy estimate of generalization.

### Chronological splits for time-dependent data

Most production ML data has a time dimension, and a random split silently leaks the future into training:

\[
\text{random split: train and test rows can be interleaved in time} \Rightarrow \text{the model can "see the future" via correlated events}
\]

The fix is a chronological split: train on data up to some cutoff date, validate on the period right after, and test on the period after that - mimicking exactly how the model will actually be used (trained on the past, applied to data it hasn't seen yet).

| Split style | When it's safe | Failure mode if used incorrectly |
|---|---|---|
| Random | i.i.d. data with no time dependence, no shared entities across rows | Leaks correlated events (e.g. two transactions from the same fraud ring) across train/test |
| Chronological | Any data with a time dimension (which is most production data) | None if done correctly - random splitting here is the actual bug |
| Grouped (e.g. by user) | Data with repeated entities (multiple rows per user) | A random or even chronological split can still leak if the same user appears in both train and test |

A strong interview answer combines these where needed: chronological *and* grouped by user, so that a given user's history is never split across the training and evaluation periods in a way that leaks their identity-specific patterns.

### Bringing it together

A complete evaluation strategy for an ML system design answer states: the metric (matched to the deployment decision), the threshold (matched to the real cost of each error type, re-checked after every retrain), and the split (chronological, and grouped by entity if needed, to honestly simulate how the model will be used).
