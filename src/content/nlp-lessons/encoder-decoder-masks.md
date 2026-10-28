# Padding masks, causal masks, and information access

## 1. Specify legal access

A **mask** excludes selected information. An **attention mask** specifies which keys each query may read.

An input corruption marker such as [MASK] and an ignored loss target perform different operations.

## 2. Block before normalization

\[
a_j=\operatorname{softmax}_j(s_j+m_j)
\]

s_j is key j’s score; m_j is 0 when allowed and conceptually −∞ when blocked; a_j is the resulting weight.

Scores [log 3,0] produce [0.75,0.25]. Blocking the second produces [1,0]. Zeroing it afterward without renormalizing leaves a different output.

## 3. Block future targets

A **causal mask** permits the prefix, including the current input under next-token prediction:

```nlp-visual
masks
```

At input “cats,” predict “sleep.” Reading “cats” is legal; reading the future target is not. Labels must be shifted consistently.

## 4. Exclude artificial keys

A **padding mask** blocks positions added only for storage. An encoder can read all valid source tokens without reading padding.

Blocking padded keys does not automatically zero padded query outputs.

## 5. Distinguish exclusions

| Mask | Excludes |
|---|---|
| Attention | Unavailable keys |
| Pooling | Positions omitted from a summary |
| Loss | Targets omitted from cost |

A prompt can supply context while contributing no target loss.

## 6. Handle empty access

All-blocked scores have no ordinary softmax distribution. Handle that case explicitly.

Check boolean direction and broadcast dimensions: APIs differ in whether true means allow or block.
