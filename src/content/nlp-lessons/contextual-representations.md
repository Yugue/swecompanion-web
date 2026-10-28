# Using contextual representations

## 1. Use states after context processing

The same “bank” lookup can produce different states in financial and river sentences.

These states reflect available context and the training objective. They are not guaranteed complete meaning representations.

## 2. Choose position or sequence outputs

T positions with width d produce [T,d] states.

| Task | Interface |
|---|---|
| Tagging | Head at valid positions |
| Classification | Sequence representation → head |
| Search | Trained sentence representation → comparison |

Selecting a shape does not select a useful similarity objective.

## 3. Pool valid positions

**Masked mean pooling** averages included states:

\[
s=\frac{\sum_t m_th_t}{\sum_t m_t}
\]

h_t is position t’s vector; m_t is 1 for included positions, otherwise 0; s is the summary. Require a nonempty set.

Declare padding/special-token inclusion. Otherwise longer batch padding can change a sentence’s representation.

## 4. Understand CLS

A **classification token**, often CLS, is a designated summary position whose output can feed a head.

Its usefulness depends on training. A masked-token model’s CLS vector is not automatically trained for sentence similarity.

## 5. Freeze features when appropriate

**Frozen feature extraction** keeps pretrained weights fixed and trains a smaller downstream predictor.

This reduces update cost but cannot adapt missing distinctions. Compare layers, pooling, and heads using validation data.

An encoder’s states may read the full input; a causal decoder’s last valid state reads its prefix.

## 6. Inspect the lost distinction

Averaging can dilute one decisive word among boilerplate. A sentiment-trained summary can organize documents by attitude rather than answer relevance.

Evaluate the intended comparison; the sentence-embedding lesson supplies a relationship-specific training objective.
