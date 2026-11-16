# Encoders, decoders, and language-model objectives

## 1. Choose allowed information

An **encoder** reads all valid input positions; a **causal decoder** reads a prefix. An **encoder–decoder** combines full-source reading with target-prefix generation.

## 2. Match architecture to objective

| Design | Typical objective | Available information |
|---|---|---|
| Encoder | Predict masked input tokens | Both sides of a masked position |
| Causal decoder | Predict the next token | Target prefix |
| Encoder–decoder | Reconstruct or translate a source | Full source and target prefix |

**Masked language modeling** hides selected input tokens and predicts them. **Sequence denoising** reconstructs clean text from a corrupted source.

## 3. Bridge two sequences

**Cross-attention** uses queries from one sequence and keys/values from another. A translation decoder can consult the complete source sentence while keeping future translated tokens masked.

```genai-visual
encoder-decoder
```

Cross-attention mixes source evidence into target states; it does not require source and target tokens to align one to one.

## 4. Understand generation behavior

Masked prediction learns conditionals with both-side context. Repeated mask filling is not automatically causal sampling.

An encoder–decoder also generates autoregressively, conditioned on source text and target prefix.

## 5. Avoid a terminology trap

A model called “decoder-only” commonly uses masked self-attention without the source cross-attention found in the original encoder–decoder Transformer.

**Instruction tuning** is training on task instructions and desired responses. It changes learned behavior, not necessarily the block architecture. A base decoder can become conversational through later training and formatting.

## 6. Choose from the task

Compare encoders for representations/classification and causal decoders for flexible continuation. For source-to-target tasks, compare both decoder-only and encoder–decoder approaches on quality and serving cost.

> **Reason it through:** Which context is legal when translating a known source but predicting an unfinished target, and how do the masks differ?
