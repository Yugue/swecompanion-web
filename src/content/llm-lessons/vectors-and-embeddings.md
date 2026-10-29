# Token embeddings and vocabulary outputs

## 1. Learn a starting representation

An **embedding** is a learned vector representation. With vocabulary size V and feature width d, embedding table E has shape [V,d]. Each token ID selects one row.

The coordinates learn through the training objective. They need not correspond to named dictionary properties such as “plural” or “financial.”

## 2. Follow a lookup

With V=4 and d=3, E contains 12 learned values. IDs [2,0] select two rows and produce shape [2,3]. A batch of B length-T sequences produces [B,T,d].

The lookup does not multiply by the numerical size of an ID. It retrieves the vector stored at that address.

## 3. Distinguish static and contextual states

When “bank” receives the same ID in two contexts, its initial row is unchanged. Later transformations mix allowed contextual information, yielding different **hidden states** for “river bank” and “bank loan.”

One token row is a starting representation, not the complete meaning of every occurrence.

## 4. Score the vocabulary

An **output head** maps hidden features to task scores.

\[
z=Wh+b
\]
h is a column hidden state of width d; W has shape [V,d]; bias b has V entries. The output z contains V **logits**, unnormalized scores for next-token choices.

**Weight tying** reuses E as W when dimensions agree. Lookup selects rows; output scoring compares a hidden state against all rows. The operations serve different roles.

## 5. Choose a sequence representation

**Pooling** combines token states into one sequence vector, for example by averaging valid positions. Exclude padding.

A next-token model's pooled states are not automatically effective search vectors. Evaluate the representation and training objective on actual query–document pairs.
