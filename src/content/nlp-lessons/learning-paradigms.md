# How models learn from language

## 1. Identify the learning signal

**Training** adjusts a model using examples and a learning signal. A **parameter** is an adjustable value learned during that process; a **hyperparameter** configures the model or fitting procedure.

A vocabulary vector’s entries can be parameters. Choosing its width is a hyperparameter.

## 2. Learn from supplied targets

**Supervised learning** uses input–target pairs. A **label** is the supplied target: a spam category, entity boundary, or translated sentence.

Labels can come from people or recorded outcomes. A clicked result is an observed response to something shown, not a direct judgement about every document that could have been shown.

## 3. Find structure without per-example targets

**Unsupervised learning** seeks structure without a supplied answer for each input. Examples include grouping similar documents or estimating where feature vectors concentrate.

A discovered group is not automatically a meaningful intent. Its usefulness must be checked against the intended use.

## 4. Construct a prediction task from text

**Self-supervised learning** creates targets from the data itself:

```text
input:  The parcel arrived on [MASK].
target: Tuesday
```

The answer is withheld from the input used for that prediction. Predicting a next token from a prefix is another self-supervised task.

**Pretraining** first learns reusable parameters from such tasks; later task training can adapt them. It is a stage of learning, not a guarantee of useful downstream behavior.

## 5. Combine limited labels with other evidence

| Approach | Signal |
|---|---|
| Semi-supervised learning | Labelled and unlabelled examples for a target task |
| Weak supervision | Noisy labels from heuristics or indirect evidence |
| Active learning | Selected examples sent for human labelling |

These approaches solve different constraints and can be combined. More unlabelled text does not directly supply missing task labels.

## 6. Keep evaluation independent

Separate the source of training targets from the evidence used to assess success. A masked-word objective measures a particular prediction task; support-routing quality needs trustworthy routing labels.

With 500 reviewed messages, first establish an honest supervised baseline. Reuse pretrained features or additional text when they improve the target task under the same evaluation.

## 7. Interview reasoning

**Question:** Does self-supervised learning mean that training has no targets?

**Answer:** No. Its targets are constructed from the input data instead of separately supplied answers. The model still solves a prediction problem with a measurable objective.
