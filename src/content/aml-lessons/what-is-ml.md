## What machine learning is

**Machine learning (ML) fits a model from data so it can make useful predictions or find patterns in new examples.** A model is a function whose behavior is learned rather than fully specified by hand.

A spam filter can learn from messages marked “spam” or “not spam.” A handwritten filter instead applies rules such as “block this sender.” Both need evaluation when the messages change.

## 1. Training and prediction are different steps

```text
training:    past messages + labels → learning algorithm → fitted model
prediction:  new message + fitted model → spam probability
```

A **label** is the answer supplied for a training example. Not every learning problem has labels; finding groups of similar messages is another kind of ML.

We often write a prediction as \(\hat y=f(x)\): \(x\) is the input, and \(\hat y\) is the model's output. The hat means “estimated.”

**Generalization** means working on new examples, beyond the data used to fit the model. A lookup table can memorize training answers without generalizing.

## 2. An output needs a use

Models can output a number, a category, a probability, or a group. For a probability-based fraud system:

```text
predicted fraud probability: 0.08
policy: review if probability ≥ 0.05
action: send the transaction to an analyst
```

The **threshold** is the cutoff that turns a score into an action. Its choice depends on error costs and review capacity.

## 3. When is ML useful?

Use it when representative data contains a learnable pattern and explicit rules are difficult to maintain. Recognizing objects in photographs is a good example.

“Flag transactions above $10,000 from accounts less than one day old” is already a complete rule. Measure that rule before adding a model. A model might help with a broader question: “Which transactions are likely fraudulent?”

ML also introduces costs: collecting data, measuring mistakes, serving predictions, and monitoring changes. Better offline accuracy is useful only if it improves the decision enough to justify those costs.

> **Mental image:** training builds an adjustable tool from examples; evaluation checks whether that tool works on the next job.
