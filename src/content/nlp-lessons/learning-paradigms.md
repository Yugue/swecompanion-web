# How models learn from language

## 1. Identify the signal

**Training** adjusts a model using examples. A **parameter** is a learned value; a **hyperparameter** configures the model or fitting procedure.

A word’s classifier weight is a parameter. Choosing the model’s size is a hyperparameter.

A **loss** is a numerical training cost; an **objective** is the complete quantity optimized, including any penalties.

## 2. Supply target answers

**Supervised learning** uses input–target pairs. A **label** is the supplied target: a category, entity boundary, or translated sequence.

Labels may come from people or recorded outcomes. A click describes a response to a shown result, not every document’s relevance.

## 3. Discover structure

**Unsupervised learning** seeks patterns without a supplied answer per example, such as document groups.

A discovered group needs inspection before calling it an intent.

## 4. Construct targets from text

**Self-supervised learning** creates targets from the data itself:

```text
input:  The parcel arrived on [MASK].
target: Tuesday
```

The [MASK] marker hides the word to predict.

**Pretraining** learns reusable parameters before task adaptation. Predicting the next word or piece from a prefix is another self-supervised task.

## 5. Combine scarce labels with other evidence

| Approach | Signal |
|---|---|
| Semi-supervised learning | Labelled and unlabelled task examples |
| Weak supervision | Noisy heuristic or indirect labels |
| Active learning | Selected examples sent for human labelling |

These choices address different constraints; they can be combined.

## 6. Evaluate the actual task

With 500 reviewed messages, establish a supervised starting model. Test whether pretraining or extra text improves routing on independent routing labels.

Masked-word performance alone does not answer that question.

## 7. Interview reasoning

**Question:** Does self-supervised training have no targets?

**Answer:** It has targets constructed from the data rather than separately supplied answers. The model still minimizes a prediction cost.
