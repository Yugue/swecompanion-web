# Encoders, decoders, and language-model objectives

## 1. Choose allowed information

An **encoder** builds representations using all valid positions of an available input. A **causal decoder** represents each position using its prefix. An **encoder–decoder** combines full-source reading with target-prefix generation.

The names describe common arrangements, not a universal guarantee about every model bearing the label.

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

A causal decoder naturally models a probability for any left-to-right sequence. A masked model learns different conditional predictions, so repeatedly filling masks is not automatically equivalent to causal sampling.

Encoder–decoder models can generate autoregressively too. Their decoder predicts the next target token conditioned on both source and target prefix.

## 5. Avoid a terminology trap

A model called “decoder-only” commonly uses masked self-attention without the source cross-attention found in the original encoder–decoder Transformer.

**Instruction tuning** is training on task instructions and desired responses. It changes learned behavior, not necessarily the block architecture. A base decoder can become conversational through later training and formatting.

## 6. Choose from the task

For text classification, an encoder or small specialized model may suffice. For flexible continuation, consider a causal decoder. For source-to-target tasks, compare both decoder-only prompting and encoder–decoder designs.

Measure quality, data needs, and serving cost. Architecture alone does not guarantee better multilingual behavior or factuality.
