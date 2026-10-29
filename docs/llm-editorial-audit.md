# LLM editorial audit

> Historical editorial review. The [October 29 curriculum audit](llm-curriculum-audit.md) supersedes its lesson boundaries and inventory.

Reviewed all 42 saved lessons and their interview-ready overviews on October 28, 2026. Revised 34 lessons; retained eight after review. The seven-chapter, 42-lesson structure remains appropriate for an independent topic.

## Findings and changes

The main gaps were omitted mechanics and repeated generic advice, rather than missing chapters. Revisions explain token-loss gradients, attention shapes, SwiGLU, reward comparison learning, GRPO, position interpolation, and serving scaling inside their existing lessons. Small examples now expose token weighting, judgment conventions, calibrated but uninformative confidence, and cache identity errors.

One new diagram connects token IDs, embeddings, block states, vocabulary logits, and token selection. Existing diagrams remain in place where they explain different mechanisms. First-use definitions were repaired without adding reader-facing prerequisite links or closing reasoning/reference sections. Nine overviews were updated to reflect the revised lessons.

The guide now has 258 sections, 25 figures, 15 tables, 26 display formulas, and 14,638 source words (302–461 per lesson). Word counts document the result, not a required ceiling. The modest increase replaces missing mechanisms with explanation; the later optimization lesson now avoids reteaching basic gradient descent.

## Lesson-by-lesson disposition

| Lesson | Result | Review |
|---|---|---|
| 1.1 What a large language model learns | Revised | Simplified the opening; defined corpus and latency at first use; formatted conditional-probability notation. |
| 1.2 Tokens and tokenization | Revised | Explained fixed merge ranks, WordPiece segmentation, and text normalization. |
| 1.3 Vectors, embeddings, and vocabulary scores | Revised | Removed the repeated token-ID analogy; defined batch and vector length; qualified identical-token context examples. |
| 1.4 Probabilities, softmax, and cross-entropy | Revised | Made entropy and KL readable formulas, including support and zero-probability conventions. |
| 1.5 How a neural network works | Revised | Removed a repeated opening definition already supplied in 1.1. |
| 1.6 Gradients, backpropagation, and learning | Revised | Added the single-token cross-entropy logit gradient and worked target-versus-alternative update directions. |
| 2.1 Self-attention | Revised | Added projection shapes and full-sequence score/output shapes; defined saturation and distinguished key and value widths. |
| 2.2 Attention heads and causal masks | Revised | Added the cache-size implication of four query heads sharing two KV heads. |
| 2.3 Position information | Retained | Retained: RoPE mechanism, numerical diagram, masking distinction, and extrapolation caveat are clear. |
| 2.4 A complete Transformer block | Revised | Added SwiGLU mechanics and one full-decoder diagram; kept new equations readable on mobile. |
| 2.5 Encoders, decoders, and language-model objectives | Retained | Retained: architecture/objective table and cross-attention diagram explain information access without unnecessary depth. |
| 2.6 Mixture-of-experts and sparse activation | Revised | Clarified that routing selects the k highest-scoring experts. |
| 3.1 Next-token targets and teacher forcing | Revised | Added a numerical token-weighted loss example and the separate packed-boundary target check. |
| 3.2 Data curation, deduplication, and contamination | Revised | Removed the corpus definition now taught at first use in 1.1. |
| 3.3 Scaling laws and compute allocation | Retained | Retained: fixed-compute comparison, exposure-versus-novelty distinction, and lifecycle tradeoff are sufficient. |
| 3.4 Training a neural network | Revised | Replaced duplicated basic gradient descent with momentum mechanics and a numerical smoothing example; focused diagnosis on updates. |
| 3.5 Training memory and parallelism | Revised | Defined FP32/BF16/FP16 and their range/precision tradeoff; clarified replica gradient combination. |
| 3.6 Validation, loss curves, and training failures | Retained | Retained: controlled comparisons, failure table, and development-leakage checks already support diagnosis. |
| 4.1 Supervised fine-tuning and domain adaptation | Revised | Added missing-value demonstrations and assistant-end supervision. |
| 4.2 Efficient adaptation with LoRA and QLoRA | Revised | Explained why frozen base operations still participate in backward computation and do not eliminate activation memory. |
| 4.3 RLHF, rewards, and policy learning | Revised | Added reward-model comparison learning and sigmoid; distinguished a value baseline from a reference policy. |
| 4.4 Direct preference optimization | Revised | Split long math into readable steps; clarified sequence sums rather than length means; removed the repeated sigmoid definition. |
| 4.5 Reasoning and verifiable rewards | Revised | Explicitly introduced GRPO and Pass@N; worked centered versus standardized group rewards and zero-spread behavior. |
| 4.6 Distillation and synthetic instruction data | Revised | Made soft-target cross-entropy explicit; removed an early undefined schema reference. |
| 5.1 Decoding, temperature, and sampling | Retained | Retained: greedy/search distinction, temperature, nucleus example, and stopping behavior cover the core tradeoffs. |
| 5.2 Instructions, chat templates, and structured output | Revised | Defined in-context learning and supplied two short extraction demonstrations instead of a repeated prompt definition. |
| 5.3 Long context, positions, and evidence placement | Revised | Explained position interpolation with an index-scaling example and its changed separation tradeoff. |
| 5.4 Retrieval-augmented generation and grounding | Revised | Contrasted exact-identifier lexical search with paraphrase-sensitive dense retrieval and joint reranking. |
| 5.5 Tool calling and verified execution | Revised | Defined executor and trust boundary at first use while preserving the validated tool-loop example. |
| 5.6 Choosing prompting, retrieval, fine-tuning, or tools | Retained | Retained: failure-to-intervention table and controlled evidence/behavior comparisons consolidate earlier methods. |
| 6.1 Designing an LLM evaluation | Revised | Turned the paired-score example into actual shared wins, losses, and regressions. |
| 6.2 Scoring answers, evidence, and exact tasks | Revised | Replaced repeated correctness/faithfulness definitions with a concise failure comparison table. |
| 6.3 Human evaluation and model judges | Revised | Added an operational scoring rubric and a numerical example of two tie conventions. |
| 6.4 Confidence, calibration, and abstention | Revised | Added the calibrated-but-uninformative constant-score counterexample. |
| 6.5 Prompt injection and authorization boundaries | Revised | Replaced a repeated trust-boundary definition with a concrete indirect injection example. |
| 6.6 Privacy, memorization, and bias | Retained | Retained: exposure routes, deletion limits, privacy concepts, and subgroup checks are appropriately scoped. |
| 7.1 Prefill, decoding, and the key–value cache | Revised | Removed a repeated decoding definition while preserving the important token-timing and cache explanation. |
| 7.2 Memory estimates and inference quantization | Revised | Added four-bit weight storage, defined zero point, and clarified units and cache independence. |
| 7.3 FlashAttention and paged caches | Revised | Separated projection/FFN growth from pairwise attention work; defined prefix caching before use. |
| 7.4 Serving multiple requests | Revised | Added throughput-versus-waiting example and distinguished KV reuse from answer-cache freshness. |
| 7.5 Speculative decoding | Revised | Spelled out positive-part rejection correction as concrete operations. |
| 7.6 Choosing and diagnosing an LLM deployment | Retained | Retained: final consolidation uses earlier mechanisms and introduces no new prerequisite. |

## Verification

- Source validator: all lessons, headings, formula rendering, first-use definition guards, duplicate passages, diagrams, metadata, and numerical examples pass.
- New calculations include finite-difference verification of the cross-entropy logit gradient, momentum, token-weighted means, reward comparison probability, standardized group rewards, paired outcomes, judge tie conventions, and four-bit weight storage.
- Production build and the built validator pass for all 50 LLM routes. Export checks cover links, canonical metadata, structured data, figures, sitemap, premium entry gates, and quiz-payload privacy.
- All 34 revised lessons checked at 375×812: correct title and article, no KaTeX errors, and no horizontal page overflow. New decoder diagram inspected at desktop and mobile widths; SwiGLU and DPO math inspected on mobile. The SwiGLU formula was split into short steps to remove internal horizontal scrolling.
- Targeted ESLint, TypeScript, and whitespace checks pass.
- The 42 local mock-interview question/answer pairs remain byte-for-byte unchanged from the audit baseline. No question publication, deployment, commit, or push was performed for this audit.

## Source checks

Technical additions were checked against primary sources:

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762): projections, attention shapes, and attention versus positionwise-network computation.
- [GLU Variants Improve Transformer](https://arxiv.org/html/2002.05202v1): the SwiGLU mechanism.
- [DeepSeekMath](https://arxiv.org/html/2402.03300v3): group-relative policy optimization and reward normalization.
- [Position Interpolation](https://arxiv.org/html/2306.15595v2): scaling position indices and long-context adaptation.
- [DPO](https://arxiv.org/abs/2305.18290): reference-relative sequence scores and pairwise objective.
- [QLoRA](https://arxiv.org/abs/2305.14314): frozen base storage and adapter training.
- [FlashAttention](https://arxiv.org/abs/2205.14135): reducing memory traffic without removing full pairwise attention.
- [Distillation](https://arxiv.org/abs/1503.02531): soft-target learning.
- [Hugging Face WordPiece explanation](https://huggingface.co/learn/llm-course/en/chapter6/6): encoding by longest matching pieces; no claim about an unavailable original training implementation was added.
- [PyTorch cross-entropy contract](https://docs.pytorch.org/docs/2.14/generated/torch.nn.CrossEntropyLoss.html): raw-logit inputs, target IDs, and supported loss semantics.
