# Decoder-only Transformers

A decoder-only language model predicts the next token from a prefix. **Causal self-attention** ensures a position can use its prefix and itself, while excluding later positions.

## 1. Turn a prefix into vocabulary scores

```text
prefix → token embeddings + positions → causal Transformer blocks
       → final hidden states → vocabulary logits → next-token choice
```

A **logit** is an unnormalized score. Softmax converts vocabulary logits into probabilities. The output head maps hidden width D to vocabulary size V.

This architecture has no separate source encoder or encoder–decoder cross-attention. The prompt and generated continuation share one token stream.

## 2. Train on shifted targets

```text
input:   [start]  the    cat
target:  the      cat    sleeps
```

With the complete training sequence available, many positions can be evaluated in parallel. The causal mask stops a position from reading its answer in the future input. Cross-entropy trains each supervised position to assign probability to its target token.

Padding and positions excluded from supervision also need appropriate masks; an attention mask and a loss mask do different jobs.

## 3. Generate sequentially

At inference, future tokens are unknown:

```text
prompt → choose token → append token → choose another → stop
```

Greedy selection or sampling decides which token to append. A key–value cache reuses earlier attention keys and values, avoiding their recomputation at every step. It does not remove dependencies between newly generated tokens.

## 4. Connect the architecture to behavior

Classification, extraction, and translation can all be expressed as prompted continuations. Reliable instruction following still depends on suitable training and adaptation; causal attention alone does not provide it.

Compared with a bidirectional encoder, a token state cannot read later tokens. Compared with an encoder–decoder model, source and target are not processed by separate stacks. These are information-access differences, not guarantees about which system wins a task.
