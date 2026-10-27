# Using contextual representations

## 1. Distinguish lookup from contextual state

A **contextual representation** changes with surrounding evidence after a model processes the input. The same static lookup for “bank” can lead to different states in financial and river contexts.

The state reflects the model’s allowed information, learned parameters, and training objective—not a guaranteed complete meaning representation.

## 2. Choose a token or sequence output

For one input of \(T\) positions and state width \(d\), a contextual model produces a [T,d] array.

A token task can attach a head to each valid position. A sentence task needs a sequence-level representation or a generation formulation. Those are different output interfaces.

## 3. Pool valid positions

**Pooling** summarizes several states into one vector. A masked mean is:

\[
s=\frac{\sum_t m_th_t}{\sum_t m_t}
\]

\(h_t\) is position \(t\)'s vector; \(m_t\in\{0,1\}\) indicates inclusion; \(s\) the pooled vector. Require at least one included position.

Padding and selected special tokens need explicit inclusion rules. Averaging storage positions indiscriminately can change the representation when batch padding changes.

## 4. Understand a special summary position

A **classification token**, often written CLS, is a designated position whose output can feed a task head. Its usefulness depends on how training taught that position to summarize information.

It is not automatically a high-quality sentence-similarity vector. A model trained to recover masked tokens and one trained to compare sentences optimize different relationships.

## 5. Reuse or adapt the features

**Frozen feature extraction** applies a pretrained model without updating its weights, then trains a smaller downstream predictor.

This can reduce training cost and overfitting pressure. It cannot guarantee that the frozen features preserve a rare domain distinction. Comparing layers, pooling, or a trainable task head is still a validation choice.

A causal decoder’s last valid state summarizes its available prefix; an encoder’s token states may each use the complete valid input.

## 6. Test what similarity means

A pooled vector suitable for sentiment can be poor for document relevance. Sentence length, repeated templates, and lexical overlap can dominate a representation in ways the product does not want.

Use frozen mean pooling as a measured baseline when appropriate. The later sentence-embedding lesson teaches an objective designed specifically for pair relationships.

## 7. Interview reasoning

**Question:** Why can averaging good token representations still produce a weak retrieval embedding?

**Answer:** The pooling and pretraining objective may not make sentence-level distances reflect relevance. Compare a retrieval-trained objective and inspect what the average loses.
