# Embeddings and language-model outputs

## 1. Look up a representation

An **embedding** is a learned vector representing a discrete item. An **embedding table** stores one vector per vocabulary ID. Looking up an ID gathers its row rather than treating the ID as a measurement.

Two occurrences of the same token initially select the same vector.

## 2. Track lookup shapes

For vocabulary size V and hidden width d, the table has shape [V,d]. IDs shaped [B,T] produce embeddings shaped [B,T,d]. B is batch size and T sequence length.

```genai-visual
embedding-lookup
```

Repeated IDs reuse a row; their training gradients accumulate into that row.

## 3. Make the representation contextual

A sequence model updates token vectors using allowed surrounding information. A **contextual representation** therefore depends on both the token and its context.

The token “bank” can start from the same lookup vector but finish with different states near “river” and “loan.”

## 4. Predict vocabulary scores

\[
z=hW_{out}+b
\]
h is a row hidden state of width d; \(W_{\mathrm{out}}\) has shape [d,V]; bias b and logits z have width V. Softmax converts z to probabilities over possible next tokens.

The output head is a learned mapping, not a nearest-word dictionary lookup.

## 5. Understand weight tying

**Weight tying** reuses an embedding table’s transpose as the output matrix when dimensions agree. It reduces parameters and links input and output representations.

Sharing storage does not make the roles identical: input lookup selects one row; output scoring compares a hidden state against all vocabulary rows.

## 6. Avoid geometric shortcuts

Similarity between static embeddings can reveal patterns, but it does not determine final contextual predictions. Norms, positions, and later learned transformations affect final output scores.

Large vocabularies increase table storage and output-scoring work. Compare vocabulary changes under a measured sequence-length benefit.
