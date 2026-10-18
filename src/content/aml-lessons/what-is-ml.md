## What machine learning is

## 1. Learn a rule from examples

**Machine learning (ML)** fits a **model**—a function learned from data—to predict outcomes or find patterns in new examples.

A spam filter learns from messages marked spam or legitimate. A handwritten filter applies rules chosen by a person.

> Training adjusts the tool; prediction uses the adjusted tool.

## 2. Training and prediction

```text
past messages + answers → training algorithm → fitted model
new message + fitted model                  → spam probability
```

A **label** is a supplied training answer. Some ML methods instead find structure without labels.

## 3. Read the notation

\[
\hat y=f(x)
\]

\(x\) is an input, \(f\) the fitted model, and \(\hat y\) its prediction. The hat means estimated. Changing the input can change the output without retraining.

## 4. Turn a prediction into an action

A **threshold** is a score cutoff used to choose an action:

```text
fraud probability = 0.08
review threshold  = 0.05
decision          = review
```

The model estimates risk; the threshold reflects review capacity and error costs.

## 5. Generalize beyond the examples

**Generalization** means useful performance on new examples. Memorizing every training answer does not establish it.

Use ML when representative data contains patterns that are difficult to specify manually. If the requirement is already a complete rule, measure that rule first. Include data, serving, and maintenance costs when judging improvement.

## 6. Interview reasoning

**Question:** A filter memorizes all training messages perfectly. Is it useful?

**Answer:** Test representative new messages. Perfect recall of old answers does not show that the learned pattern transfers or improves the decision.
