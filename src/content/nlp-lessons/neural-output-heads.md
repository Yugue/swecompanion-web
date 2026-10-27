# Output heads, probabilities, and losses

## 1. Match the answer’s structure

An **output head** turns learned features into task predictions. Its raw real-valued scores are **logits**.

A logit is not a probability. Choose the transformation and target encoding according to whether answers are exclusive categories, simultaneous labels, or numeric values.

## 2. Normalize exclusive alternatives

**Softmax** converts competing logits into probabilities summing to one:

\[
p_k=\frac{e^{z_k}}{\sum_j e^{z_j}}
\]

\(z_k\) is class \(k\)'s logit; \(j\) ranges over the candidate classes. Increasing one logit relative to the others raises its probability.

Logits [log 3, 0] give probabilities [0.75, 0.25]. Adding the same constant to every logit changes neither probability.

## 3. Allow several labels together

For independent binary output decisions, apply sigmoid to each score. A message can concern both billing and delivery; these event probabilities need not sum to one.

Independent sigmoid heads do not prove the labels are statistically independent in the world. They define the chosen output parameterization and loss.

## 4. Compare predictions with targets

For a mutually exclusive target class \(y\), **cross-entropy loss** is \(-\log p_y\). A one-hot target has one entry equal to one and the others zero.

For numeric target \(y\) and prediction \(\hat y\), squared loss is \((\hat y-y)^2\). A similarity score or duration needs an explicit numeric target definition rather than arbitrary category codes.

An **objective** is the complete quantity optimized, possibly including penalties. A **metric** measures behavior after fitting and may differ from that objective.

## 5. Keep library inputs straight

For a batch of two three-class examples:

```python
logits = torch.tensor([[2., 0., -1.], [0., 1., 2.]])
targets = torch.tensor([0, 2])
loss = torch.nn.functional.cross_entropy(logits, targets)
```

Here targets are class indices. This operation expects logits and performs stable log normalization internally; applying softmax first would change the intended computation.

## 6. Check common interface failures

Verify output shape, label order, and the class axis. Flattening token positions or normalizing across examples creates a different task.

Use appropriate stable binary-logit loss for sigmoid heads. Choose decision thresholds on validation data; training probability estimates does not automatically select the right action policy.

## 7. Interview reasoning

**Question:** Why can a softmax classifier never assign 0.8 to each of two classes?

**Answer:** Its class probabilities must sum to one because it represents exclusive alternatives. Use a suitable multilabel head when both events may be true.
