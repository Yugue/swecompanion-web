# Generative AI editorial audit — 2026-10-28

Reviewed all 60 saved lessons, public overviews, diagram explanations, and the relationship to the existing chapter quizzes. Revised 48 lessons and retained 12 whose current explanations were adequate. The eight chapters, 60 lesson IDs, numbering, progress keys, and 64 private question/answer pairs are preserved.

## What the audit changes

- Supply missing mechanisms rather than extend the topic with more chapters: masked and sequence-denoising pretraining, exposure bias, confidence calibration, and answer coverage.
- Make important mathematics operational: actual affine weights, AdamW, LayerNorm/RMSNorm, nucleus renormalization, PPO clipping, denoising inversion, rank fusion, quantization, and speculative rejection correction.
- Define terms at first use, including hallucination, likelihood, denoiser, ELBO, rubric, stride, and unlearning. Remove repeated primary definitions of sampling, conditioning, provenance, and quantization.
- Replace the original position-order diagram with a RoPE example and add one denoising-target example. The result is 42 figures rather than 41. Other comparisons use concise tables or arithmetic.
- Keep source probability and required-evidence support distinct from fluency, judge scores, and individual token probability.

The source changes from 17,440 to 18,502 words (6.1% growth), principally from worked calculations and three additional internal sections. Lessons remain 256–392 words. Concision is judged by explanatory value rather than a fixed word target. Current inventory: 363 internal sections, 42 figures, 20 tables, and 44 display formulas.

## Lesson-by-lesson disposition

| Lesson | Disposition | Change or review conclusion |
|---|---|---|
| 1.1 What generative AI does | Revised | Define foundation models and hallucinations at first use. |
| 1.2 Vectors, matrices, and tensors | Revised | Correct the linear/affine wording around a bias-containing map. |
| 1.3 Probability and conditional reasoning | Revised | Explain likelihood and its connection to log-probability optimization. |
| 1.4 Softmax, entropy, and learning objectives | Revised | Typeset logit and target-probability labels consistently; retain the stable-loss explanation. |
| 1.5 How a neural network works | Revised | Supply actual weights and biases for the forward example; define a unit; remove an early undefined denoiser reference. |
| 1.6 Gradients and backpropagation | Revised | Define computation graphs and distinguish the derivative and probability chain rules. |
| 1.7 Training a neural network | Revised | Show AdamW’s decoupled update and define its terms. |
| 1.8 Generalization and learning curves | Revised | Introduce a baseline before later lessons depend on the term. |
| 2.1 Tokens and tokenization | Retained | Retain: BPE example, vocabulary tradeoffs, and tokenizer/model compatibility are already explicit. |
| 2.2 Embeddings and language-model outputs | Retained | Retain: lookup shapes, contextual states, output scoring, and weight tying are already distinguished. |
| 2.3 Self-attention | Retained | Retain: the complete numerical query/key/value example and scaling explanation already work. |
| 2.4 Multiple attention heads | Revised | Explain fixed-width head allocation without suggesting the sequence is split between heads. |
| 2.5 Attention masks | Retained | Retain: causal, padding, and target-loss masks already have distinct explanations. |
| 2.6 Position information | Revised | Replace the word-order figure with a numerical RoPE comparison; derive relative-gap dependence. |
| 2.7 A complete Transformer block | Revised | Explain gates; compute LayerNorm and RMSNorm with defined variables and contrasting numerical outputs. |
| 2.8 Transformer architectures and expert routing | Revised | Explain expert capacity and capacity-limited routing failures. |
| 3.1 Pretraining through next-token prediction | Revised | Add exposure bias and a causal/masked/sequence-denoising objective comparison. |
| 3.2 Training-data quality | Retained | Retain: quality, deduplication, mixture sampling, provenance, and contamination have concrete roles. |
| 3.3 Model size, data, and compute | Revised | Compare two parameter/token budgets with the same approximate compute. |
| 3.4 Training within resource limits | Revised | Quantify training state and global accumulation; clarify precision and recomputation requirements. |
| 3.5 Supervised fine-tuning and domain adaptation | Retained | Retain: raw-domain and supervised signals, response masking, and forgetting are already clear. |
| 3.6 Efficient adaptation with LoRA and QLoRA | Revised | Explain why one zero factor preserves the base output while two zero factors stall adapter learning. |
| 3.7 Distillation and synthetic training data | Revised | Show information retained by teacher distributions but discarded by a single hard target. |
| 4.1 Selecting a generated sequence | Retained | Retain: the greedy counterexample, beam limits, and length effects are already useful. |
| 4.2 Sampling and generation controls | Revised | Calculate nucleus selection and renormalization; remove a repeated general sampling definition. |
| 4.3 Instructions and structured outputs | Revised | Define zero-shot prompting and show present/missing extraction demonstrations. |
| 4.4 Reinforcement learning foundations | Revised | Correct the advantage description and show how its sign affects sampled actions. |
| 4.5 Learning from human feedback | Revised | Define rubrics earlier and work through PPO clipping; distinguish clipping from a hard update constraint. |
| 4.6 Direct preference optimization | Revised | Clarify beta’s role in the derivation and the observed training margin. |
| 4.7 Learning from verifiable rewards | Retained | Retain: process/outcome rewards and group-relative normalization have a checked example. |
| 4.8 Reasoning and computation at inference time | Revised | Distinguish oracle candidate success from actual selection and compute an independent-attempt example. |
| 5.1 Autoencoders and variational autoencoders | Revised | Define ELBO, typeset posterior/decoder conditionals, and calculate a reparameterized sample. |
| 5.2 Generative adversarial networks | Revised | Explain why discriminator output one half does not itself prove generator quality. |
| 5.3 Diffusion models | Revised | Define denoisers before use and replace generic cautions with seed-based diagnosis. |
| 5.4 Training and sampling diffusion models | Revised | Derive a clean estimate and add a checked training-target/prediction diagram. |
| 5.5 Latent diffusion and denoiser architectures | Revised | Define stride and spatial padding where the convolution figure first uses them. |
| 5.6 Conditioning, guidance, and image editing | Revised | Explain which image/text features supply cross-attention roles rather than redefining conditioning. |
| 5.7 Flow matching | Revised | Use separate noise/data symbols to avoid reversing the diffusion notation; calculate an interpolation and explain conditional-average velocity. |
| 5.8 Aligning images and text | Revised | Work through an actual false-negative pairing; typeset score indices. |
| 5.9 Vision–language models | Revised | Remove an unexplained early abstention term while retaining the missing-evidence behavior. |
| 5.10 Extending generation to video and audio | Retained | Retain the approved introductory scope and explicit representation/temporal tradeoffs. |
| 6.1 Knowledge in weights versus context | Revised | Introduce chunks and indexes locally; compare retrieval with supplying a complete small corpus. |
| 6.2 Preparing documents for retrieval | Revised | Remove the repeated provenance definition and preserve concrete source/version conditions. |
| 6.3 Retrieving relevant evidence | Retained | Retain: lexical/dense/approximate search errors are already separated. |
| 6.4 Improving retrieval | Revised | Calculate reciprocal-rank fusion on two candidate rank lists. |
| 6.5 Generating grounded answers | Revised | Require positive evidence support for faithfulness and calculate an evidence-token budget. |
| 6.6 Choosing the right intervention | Revised | Show controlled oracle/context/prompt comparisons with appropriately limited conclusions. |
| 7.1 Designing a generative-model evaluation | Revised | Add confidence calibration, answer coverage, and a numeric abstention tradeoff. |
| 7.2 Evaluating generated text | Retained | Retain: perplexity, overlap, reference variation, and factual disagreement are already distinguished. |
| 7.3 Human evaluation and model judges | Revised | Distinguish human validation from probabilistic confidence calibration. |
| 7.4 Evaluating grounded answers | Retained | Retain: retrieval/context checks and truth/support/citation dimensions are already separated. |
| 7.5 Evaluating images and multimodal outputs | Revised | Replace repeated fidelity definitions with failure comparisons; define covariance before FID. |
| 7.6 Prompt injection and unsafe tool use | Revised | Explain that text-only answers can be corrupted even without tool execution. |
| 7.7 Privacy, bias, and harmful outputs | Revised | Define unlearning and distinguish it from deleting an original document. |
| 8.1 Prefill, decoding, and the key–value cache | Revised | Show when a sampled token enters decoding and calculate a simple complete-response latency. |
| 8.2 Memory estimates and inference quantization | Revised | Derive rounding/clipping and distinguish quantization calibration from answer-confidence calibration. |
| 8.3 Efficient attention and cache management | Revised | Compare prefill and one-token decoding attention shapes and conditional bottlenecks. |
| 8.4 Serving multiple requests | Revised | Calculate compatible prefix reuse without equating token savings to a universal speedup. |
| 8.5 Speculative decoding | Revised | Align the block example, include the bonus-token case, and verify probability conservation after rejection. |
| 8.6 Choosing and debugging a deployed model | Revised | Compare complete workload cost and close with existing deployment criteria. |

## Verification

The guide checker verifies first-use definitions, distinct paragraph content, parser/math correctness, all lesson/figure inventories, and the unchanged private quiz inventory. New numeric checks cover rotary dot-product invariance, LayerNorm/RMSNorm outputs, denoising recovery/error, nucleus probabilities, PPO-related arithmetic, rank fusion, flow interpolation, answer coverage, cache sizes, quantization clipping, and probability-preserving rejection correction.

Desktop and 375 × 812 mobile previews were inspected for the RoPE and denoising diagrams. A mobile DOM sweep of eight affected lessons checked the new formulas, tables, and figures with no page-level overflow or KaTeX error elements. Hub searches for calibration, ELBO, and RMSNorm returned the expected revised lessons. The temporary viewport was restored after review. This targeted audit review complements the original all-60-page mobile sweep; it is not a claim that every paragraph was visually rechecked at every width.

The chapter quizzes were compared with the audit baseline and are unchanged. This audit neither publishes quiz documents nor pushes or deploys the site.

## Primary sources checked for revisions

- [RoFormer / rotary positions](https://arxiv.org/abs/2104.09864)
- [Decoupled weight decay](https://arxiv.org/abs/1711.05101)
- [Masked language modeling in BERT](https://arxiv.org/abs/1810.04805)
- [Sequence denoising in BART](https://arxiv.org/abs/1910.13461)
- [PPO](https://arxiv.org/abs/1707.06347) and [DPO](https://arxiv.org/abs/2305.18290)
- [Language-model confidence](https://arxiv.org/abs/2207.05221)
- [Long-context evidence use](https://arxiv.org/abs/2307.03172)
- [Exact speculative sampling](https://arxiv.org/abs/2211.17192)

These are authoring references. Lessons remain independent of external readings and other topics.
