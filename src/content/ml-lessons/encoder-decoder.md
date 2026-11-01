# Encoder–decoder Transformers

An encoder–decoder model separates reading the source from generating the target. **Cross-attention** lets each target position consult the encoded source.

## 1. Follow the two streams

```text
source → bidirectional encoder → source states ───────┐
                                                    ↓ keys, values
previous target tokens → causal decoder → queries → cross-attention
                                                    ↓
                                            next-target logits
```

The source is available in full. The target decoder can use only the target prefix, so it cannot look ahead to the word it must predict.

## 2. Give each attention operation a role

| Operation | Queries | Keys and values |
|---|---|---|
| Encoder self-attention | Source states | Source states |
| Decoder self-attention | Target states | Allowed target states |
| Decoder cross-attention | Target states | Encoded source states |

For source length S, target length T, and key width dₖ, cross-attention Q has shape [T,dₖ] and K has shape [S,dₖ]. Its score matrix is [T,S]: one row of source-position scores per target position. Batch and head axes are omitted here.

## 3. Work through translation

For source “je mange,” the encoder reads both source tokens. When generating “I eat,” the decoder first predicts “I,” then uses that target prefix and the source states to predict “eat.”

Cross-attention provides direct access to source representations at each step. This replaces the early sequence-to-sequence bottleneck of squeezing the whole source into one fixed vector.

## 4. Train and serve consistently

Training uses shifted correct target tokens, called **teacher forcing**, with a causal target mask. Inference uses previously generated targets. Source padding must be masked in cross-attention; target padding and target supervision need their own treatment.

The source encoder runs once per request. Generation remains sequential; source keys/values and earlier target keys/values can be cached.

This structure suits tasks with a clear source–target boundary. A decoder-only model can also perform them by placing the source in its prompt. Compare measured quality, training data, and serving costs rather than assuming one architecture always wins.
