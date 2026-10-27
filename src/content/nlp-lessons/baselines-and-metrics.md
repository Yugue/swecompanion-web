# Baselines and basic evaluation

## 1. Establish what improvement means

A **baseline** is a reference method tested under the same conditions as a proposed model. Compare a trivial prediction, the current system, and a simple learned model.

For spam, “always legitimate” and existing filtering rules answer different comparison questions.

## 2. Count decisions against outcomes

A **confusion matrix** compares predicted and actual classes. Name the positive class first: here, spam.

| Count | Meaning | Toy count |
|---|---|---|
| TP | Spam flagged correctly | 30 |
| FP | Legitimate message flagged | 10 |
| FN | Spam missed | 70 |
| TN | Legitimate message allowed | 890 |

There are 1,000 messages, 100 actual spam messages, and 40 flags.

## 3. Ask two denominator questions

**Precision** asks how many flags are correct; **recall** asks how many actual positives were found:

\[
P=\frac{TP}{TP+FP}=0.75,\qquad R=\frac{TP}{TP+FN}=0.30
\]

Here \(P\) and \(R\) denote precision and recall. Both use TP, but they assess different failures.

## 4. Interpret summary scores

**Accuracy** is the correct fraction: \((TP+TN)/n=0.92\), where \(n\) is total cases. The all-legitimate baseline gets 0.90 and finds no spam.

**F1** is precision and recall’s harmonic mean:

\[
F_1=\frac{2TP}{2TP+FP+FN}\approx0.429
\]

It does not encode every possible error cost. Undefined denominators require a reporting convention.

## 5. Average classes deliberately

**Macro** averaging gives each class equal weight. **Weighted** averaging uses class counts. **Micro** averaging pools counts before computing a score.

Ordinary single-label classification over all classes has micro-F1 equal to accuracy. Keep per-class evidence when a rare intent matters.

## 6. Compare the actual decision

For a review queue, compare models at the same capacity. Forty flags versus four hundred are different workloads. Lowering a score cutoff adds cases and cannot reduce recall on a fixed dataset, but precision may rise or fall.

A probability-quality metric and a ranking metric need original scores; a confusion matrix describes decisions at one cutoff.

## 7. Interview reasoning

**Question:** Can higher accuracy make spam handling less useful?

**Answer:** Yes. The change may miss costly spam or block important legitimate messages. Compare the relevant error types and workloads against the current policy.
