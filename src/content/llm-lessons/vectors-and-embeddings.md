# Token embeddings and vocabulary outputs

## 1. Learn a starting representation

An **embedding** is a learned vector. Table E has shape [V,d]: V vocabulary entries, d features per entry. An ID selects one row.

Training adjusts coordinates; individual coordinates need not represent named linguistic properties.

## 2. Follow a lookup

V=4, d=3 → 12 learned values. IDs [2,0] return shape [2,3]; B length-T sequences return [B,T,d].

## 3. Distinguish static and contextual states

The same “bank” ID selects the same initial row. Later **hidden states** differ between “river bank” and “bank loan” because they incorporate context.

## 4. Score the vocabulary

An **output head** maps hidden features to task scores.

\[
z=Wh+b
\]

h is a column hidden state of width d; W has shape [V,d]; bias b has V entries. The output z contains V **logits**, unnormalized scores for next-token choices.

**Weight tying** reuses E as W when dimensions agree. Lookup selects rows; output scoring compares a hidden state against all rows. The operations serve different roles.

## 5. Choose a sequence representation

**Pooling** combines token states, for example by averaging non-padding positions.

Evaluate pooled vectors on real query–document pairs; next-token training does not automatically produce effective search embeddings.

> **Reason it through:** Why can two occurrences share an embedding row yet receive different next-token scores?
