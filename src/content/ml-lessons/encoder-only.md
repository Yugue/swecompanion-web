# Encoder-only Transformers

An encoder turns input tokens into contextual representations. Its defining pattern is **bidirectional self-attention**: each non-padding position can use tokens on either side.

## 1. Read with both directions available

In “the bank of the river,” the representation of “bank” can use “river” to help resolve its meaning.

```text
input tokens → embeddings + positions → encoder blocks → token states
                                                        ↓
                                                  task-specific head
```

For batch size B, input length N, and hidden width D, the encoder produces [B,N,D]. Each state describes a token in this input, rather than a fixed dictionary entry.

## 2. Attach an output that matches the task

| Task | How to use the states |
|---|---|
| Entity tagging | Predict a label at each token |
| Document classification | Pool states or use a designated summary token, then classify |
| Retrieval | Train a pooling and embedding objective suited to similarity search |

Raw hidden states are not automatically good sentence embeddings. The objective and pooling determine what similarity means.

## 3. Pretrain without exposing the answer

A BERT-style masked-language objective hides selected input tokens and predicts them from the visible context:

```text
input:  the [MASK] of the river
label:  bank
```

Predicting an unchanged token while allowing attention to that same token would permit a copying shortcut. Masking changes the learning problem so contextual information matters.

## 4. Know when to use it

An encoder is a natural choice when the full input is available before a classification, tagging, or retrieval decision. Its bidirectional computation differs from the causal next-token objective of an autoregressive decoder.

Encoder-only does not mean “classification only.” It means the representation-building stack has no autoregressive decoder. Generation can be added through other objectives or components, but it is not the standard encoder's ordinary operating loop.
