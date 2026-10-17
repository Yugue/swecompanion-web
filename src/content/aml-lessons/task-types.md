## Regression, classification, ranking, and clustering

A **task type** describes the output you need. Choose it from the decision the output will support.

## 1. Four output shapes

| Task | What it produces | Example |
|---|---|---|
| Regression | A numeric estimate | Delivery will take 34 minutes |
| Classification | A category or class probabilities | Transaction is fraudulent or legitimate |
| Ranking | An ordering of candidates | Customers ordered by churn risk |
| Clustering | Groups based on similarity | Customers grouped by shopping behavior |

A numeric class code does not make a task regression: predicting “category 3” still means choosing a category, not estimating a quantity.

## 2. Three kinds of classification

- **Binary:** exactly two classes, such as spam and not spam.
- **Multiclass:** exactly one of several classes, such as cat, dog, or bird.
- **Multilabel:** several labels can be true together, such as politics and economics for one article.

**Softmax** converts class scores into probabilities summing to one; it suits mutually exclusive classes. Independent **sigmoids** convert each score into its own probability and are a common multilabel choice.

An article can be 80% likely to concern politics and 70% likely to concern economics. Those probabilities describe separate events and need not sum to one.

## 3. One business problem, different tasks

For customer churn:

| Decision | Framing | Useful evaluation |
|---|---|---|
| Estimate probability of churn within 30 days | Binary classification | Probability accuracy and error costs |
| Call the 500 highest-risk customers | Ranking | How many eventual churners enter that queue |
| Estimate when churn will occur | Time-to-event modelling | Time-sensitive predictions with incomplete outcomes |

A customer who has not churned yet supplies a lower bound on survival time. This is **censoring**; treating it as an ordinary known regression target is misleading.

A classifier's scores can also create a ranking. Ranking quality measures order; **calibration** asks whether a stated probability matches event frequency. A good order does not guarantee good probabilities.

## 4. Match evaluation to the task

Regression cares about error size. Classification cares about the types of mistakes and, when used, probability quality. Ranking cares especially about the top of the list. Clustering needs geometry, stability, reference labels where available, and downstream usefulness.

For a queue of 500, **recall@500** means the fraction of all actual positives found in those 500 places. It does not tell you whether calling those customers prevents churn; that needs evidence about the intervention.

> **Mental image:** choose the answer's shape first: a ruler, a set of category boxes, a sorted queue, or groups on a map.
