## Regression, classification, ranking, and clustering

## 1. Choose the answer's shape

A **task type** specifies what the model should produce. Begin with the decision it supports.

| Task | Output | Example |
|---|---|---|
| Regression | Numeric estimate | 34 delivery minutes |
| Classification | Category or class probabilities | Fraud risk |
| Ranking | Ordered candidates | Top customers to review |
| Clustering | Similarity-based groups | Shopping segments |

A numeric category code still denotes a class, not a quantity.

## 2. Classification has several forms

- **Binary:** two possible classes, such as spam or legitimate.
- **Multiclass:** one of several mutually exclusive classes.
- **Multilabel:** several labels can be true simultaneously.

An article can concern politics and economics together.

## 3. Match probabilities to the events

**Softmax** converts scores into probabilities summing to one; it suits mutually exclusive classes. A **sigmoid** converts one score into a probability between zero and one; independent sigmoids commonly support multilabel outputs.

Politics risk 0.8 and economics risk 0.7 need not sum to one because they describe separate events.

## 4. Reframe the same problem

| Churn decision | Suitable framing |
|---|---|
| Estimate inactivity within 30 days | Binary classification |
| Call the 500 highest-risk customers | Ranking |
| Estimate when inactivity begins | Time-to-event modelling |

**Censoring** means an outcome time is only partly known. A still-active customer supplies a lower bound on time to churn, not a known ordinary regression target.

## 5. Evaluate the requested output

**Recall@500** is the fraction of all positives captured in the first 500 positions. **Calibration** asks whether predicted probabilities match event frequencies.

Good ordering need not imply accurate probabilities. Finding high-risk customers also does not establish that contacting them changes their behavior.

## 6. Interview reasoning

**Question:** A team can call only 500 customers. Is classification accuracy enough?

**Answer:** Inspect the top-500 queue and its useful outcomes. Whole-population accuracy can hide poor ordering at the action budget.
