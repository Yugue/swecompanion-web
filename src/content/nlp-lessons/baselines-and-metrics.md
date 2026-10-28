# Baselines and basic evaluation

## 1. Establish a reference

A **baseline** is a reference method tested under the same conditions. A **metric** measures the outcome of interest.

For spam, compare “always legitimate,” current rules, and a simple learned model.

## 2. Count outcomes

A **confusion matrix** compares predicted and actual classes. Here the positive class is spam:

| Count | Meaning | Value |
|---|---|---|
| TP | Spam correctly flagged | 30 |
| FP | Legitimate message flagged | 10 |
| FN | Spam missed | 70 |
| TN | Legitimate message allowed | 890 |

There are 1,000 messages, 100 actual positives, and 40 flags.

## 3. Choose the denominator

**Precision** measures correct flags; **recall** measures recovered positives:

\[
P=\frac{TP}{TP+FP}=0.75,\qquad R=\frac{TP}{TP+FN}=0.30
\]

\(P,R\) denote precision and recall. False alarms reduce precision; missed positives reduce recall.

## 4. Read summary scores

**Accuracy** is \((TP+TN)/n=0.92\), with \(n\) total cases. The all-legitimate baseline scores 0.90 while finding no spam.

**F1** is the harmonic mean of precision and recall:

\[
F_1=\frac{2TP}{2TP+FP+FN}\approx0.429
\]

F1 does not specify error costs. Declare handling of undefined denominators.

## 5. Average classes deliberately

| Averaging | Operation |
|---|---|
| Macro | Equal weight per class |
| Weighted | Weight by class counts |
| Micro | Pool counts before scoring |

For ordinary single-label classification over all classes, micro-F1 equals accuracy. Inspect rare classes separately.

## 6. Compare equal workloads

Forty flags and four hundred flags create different review burdens. Lowering a cutoff cannot reduce recall on fixed scores, but precision can rise or fall.

## 7. Interview reasoning

**Question:** Can higher accuracy make filtering less useful?

**Answer:** Yes. It may miss costly spam or block valuable legitimate messages. Compare error types and review workload against the current policy.
