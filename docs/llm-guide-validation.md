# LLM guide: curriculum and validation

Updated October 29, 2026. Local route: `/mldomain/llm`.

## Scope

Independent topic assuming basic programming and school algebra. It teaches its own probability, vectors, neural networks, attention, training, and reinforcement-learning prerequisites. Chapter and lesson section counts follow concepts, with no fixed six-item template.

## Current curriculum

### 1. Foundations — 8 lessons

- 1.1 What a large language model learns
- 1.2 Tokens and tokenization
- 1.3 Vectors, matrices, and tensor shapes
- 1.4 Token embeddings and vocabulary outputs
- 1.5 Probabilities, softmax, and cross-entropy
- 1.6 Entropy, cross-entropy, and KL divergence
- 1.7 How a neural network works
- 1.8 Gradients, backpropagation, and learning

### 2. Transformer architecture — 8 lessons

- 2.1 Self-attention
- 2.2 Attention heads and shared keys/values
- 2.3 Causal masks, padding, and information leakage
- 2.4 Position information
- 2.5 Feed-forward networks and SwiGLU
- 2.6 A complete Transformer block
- 2.7 Encoders, decoders, and language-model objectives
- 2.8 Mixture-of-experts and sparse activation

### 3. Pretraining and training systems — 7 lessons

- 3.1 Next-token targets and teacher forcing
- 3.2 Data curation, deduplication, and contamination
- 3.3 Scaling laws and compute allocation
- 3.4 Optimizers and training schedules
- 3.5 Training memory and numerical precision
- 3.6 Data, tensor, and pipeline parallelism
- 3.7 Validation, loss curves, and training failures

### 4. Adaptation and post-training — 8 lessons

- 4.1 Supervised fine-tuning and domain adaptation
- 4.2 Efficient adaptation with LoRA and QLoRA
- 4.3 Reinforcement learning for language models
- 4.4 RLHF, reward models, and PPO
- 4.5 Direct preference optimization
- 4.6 Verifiable rewards and GRPO
- 4.7 Distillation: transferring teacher behavior
- 4.8 Synthetic data and instruction-data quality

### 5. Generation, context, and grounding — 9 lessons

- 5.1 Sequence decoding and beam search
- 5.2 Temperature, top-k, and nucleus sampling
- 5.3 Prompting, chat templates, and in-context learning
- 5.4 Structured output and constrained decoding
- 5.5 Inference-time reasoning and candidate verification
- 5.6 Long context, positions, and evidence placement
- 5.7 Lexical search, dense retrieval, and reranking
- 5.8 Retrieval-augmented generation and grounding
- 5.9 Tool calling and verified execution

### 6. Evaluation, reliability, and safety — 7 lessons

- 6.1 Designing an LLM evaluation
- 6.2 Scoring answers, evidence, and exact tasks
- 6.3 Human evaluation and model judges
- 6.4 Confidence, calibration, and abstention
- 6.5 Prompt injection and authorization boundaries
- 6.6 Privacy, memorization, and data removal
- 6.7 Bias, harmful behavior, and over-refusal

### 7. Inference and serving — 7 lessons

- 7.1 Prefill, decoding, and the key–value cache
- 7.2 Inference memory: weights, states, and KV cache
- 7.3 Inference quantization and calibration
- 7.4 FlashAttention and paged caches
- 7.5 Serving multiple requests
- 7.6 Speculative decoding
- 7.7 Choosing and diagnosing an LLM deployment

## Current inventory

54 lessons; 300 sections; 31 figures; 16 tables; 29 display formulas; 17,070 source words (231–504 per lesson). Internal lesson sections range from five to eight as a result of the material, not as a prescribed limit. Every lesson has a summary, three takeaways, and an interview probe.

Seven local premium quizzes contain 57 question/answer pairs. Question counts derive from coverage, not a lesson quota. They have not been published to Firestore.

## Validation

The production build and built LLM validator pass for all 62 routes. Checks cover source/metadata consistency, numbering, definitions, duplicate passages, formulas, tables, numerical examples, figures, navigation links, canonical metadata, structured data, sitemap, premium gates, and quiz privacy in the static export. Targeted lint, TypeScript, and whitespace checks pass. All 54 lessons pass mobile page-overflow and KaTeX checks at 375×812.

The quiz command ran with `--prefix=llm- --dry-run` only; no credentials were loaded or database writes made. Existing non-LLM quiz documents were compared with the restructuring baseline and preserved. All 42 original LLM pairs remain, plus 15 new pairs.

See [the curriculum audit](llm-curriculum-audit.md) for split/merge decisions, source verification, and the retired recap. The [earlier editorial audit](llm-editorial-audit.md) is retained as historical evidence of the first content review.

Changes remain local. No commit, push, deployment, or quiz publication was performed.
