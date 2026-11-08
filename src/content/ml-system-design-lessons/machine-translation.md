# Translate Messages with a Live Glossary

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Translate support messages across many languages at high throughput and low cost while **preserving approved company/product terminology**, names, codes, monetary amounts, and numbers. A glossary is frequently updated and must affect output **without retraining the translation model for every edit**.

Example: Translate a message to French, preserving the approved localized product name and leaving an error code unchanged.

# 2. Clarification Q&A

**Candidate:** Which languages and latency/volume?  
**Interviewer:** Twenty languages; millions of messages daily with peak thousands of QPS and low per-message latency.

**Candidate:** Is the glossary static?  
**Interviewer:** No; new approved terms arrive daily, and some are customer- or product-specific.

**Candidate:** Must technical identifiers and numbers remain exact?  
**Interviewer:** Yes. Terminology mistakes or altered amounts can be serious.

**Candidate:** What supervised data exists?  
**Interviewer:** Human parallel translations for common languages; sparse parallel data for several low-resource pairs, plus monolingual logs.

**Candidate:** Are we optimizing for speed, cost or maximum translation quality?  
**Interviewer:** Strong quality and strict terminology fidelity under a high-throughput budget; benchmark a large teacher and smaller production student.

# 3. Requirements

**Functional:** Support source/target language combinations; translate natural text; preserve formatting, numbers, SKUs, error codes and named entities; enforce applicable customer/product glossary; gracefully flag ambiguous/incompatible terms; handle glossary edits promptly.

**Non-functional:** High QPS, bounded P95 and compute cost, high adequacy/fluency across language pairs, versioned glossary audit and privacy-safe text processing.

# 4. ML objectives

This is **sequence-to-sequence generation**, not text classification. Optimize semantic adequacy, fluency, approved-term accuracy, exact entity/number preservation, and latency. Use **COMET** (trained translation-quality estimation) with human evaluation; chrF/BLEU as complementary overlap metrics. Track critical-error rate separately from average quality.

# 5. Data

**Labeling approach:** Use existing translator-approved parallel data without assuming new bulk translation is affordable. A small per-language gold set guides a multilingual LLM teacher with glossary examples; generate pseudo-parallel messages and terminology counterexamples, checking exact numbers, entities and required terms.

**Quality and escalation:** Reserve separate translator validation and locked tests, especially low-resource pairs. Improve prompts or supported soft prompts first; use teacher LoRA on development gold if adequacy is still poor. Commission additional translations only for important failing pairs when the budget supports them.

**Prompt tuning** learns a small soft prompt while keeping base weights frozen; it requires model support. **LoRA** learns low-rank weight adapters. Neither uses validation/test gold for training.

**Feature engineering:** Inputs are source tokens, language/domain tags and retrieved glossary entries; preserve placeholders and original numbers. Changing glossary facts remain external data.

**Human parallel data:** Source-target messages with language pair, domain, register, and glossary context. Include translator-approved terminology and preserved entities. Partition by language pair, domain, and time, with held-out low-resource and newly introduced terms.

**Synthetic augmentation:** A high-quality multilingual LLM or translation teacher can generate candidate translations and contrastive terminology cases, with human review of a representative sample. Back-translation can help low-resource directions but must be checked for hallucinated or drifted meaning.

**Glossary store:** Approved `(source phrase, target phrase, locale, domain, priority, validity dates)` records plus exact-use conditions. This is **external serving data**, not simply extra vocabulary tokens or model parameters.

**Preprocessing:** Normalize encoding, preserve placeholders, identify numbers/product IDs, and detect source language as needed. Parallel data quality and domain fit matter more than raw synthetic volume.

# 6. Model and training

Use a multilingual **encoder-decoder Transformer** (e.g., a compact sequence-to-sequence translation model). The encoder processes the source tokens; the decoder generates target tokens **autoregressively**. Training normally uses token-level cross-entropy under teacher forcing; inference is much more expensive because output tokens are generated sequentially.

Start by benchmarking a strong teacher. If inference cost/latency is excessive, distill high-quality teacher outputs (plus available development parallel data) into a smaller student, validate per-language degradation, and measure terminology adherence separately.

**Live glossary integration choices:**

1. Retrieve only glossary entries actually relevant to the input locale/domain and pass as conditional context or structured constraints.
2. Protect strings that must remain verbatim with placeholders, translate, then restore exactly.
3. Apply constrained decoding for mandatory approved terms when technically feasible.
4. Postcheck that relevant terms and number/ID placeholders remain correct; trigger retry or review on failure.

Naive post-generation search/replace alone can break grammar, inflection and context. Likewise, adding each new glossary term to the tokenizer does **not** automatically teach a translation mapping.

## Training and inference cost estimate

**Assumptions:** 2K messages/s; one translation/message, with 100 source tokens and 100 target tokens. Treat source encoding and target decoding as separate capacity pools. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Pretrained compact translator | None | 200K input tokens/s ÷ (20K input tokens/s/GPU) → 10 GPUs; 200K output tokens/s ÷ (10K output tokens/s/GPU) → 20 GPUs. (10 + 20) GPUs × ($4/GPU-h) = **$120/h** |
| Optional adapter/student training | 1M pairs × 3 passes ÷ (500 pairs/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$6.67/run** | Same as baseline |

# 7. Serving and scaling

Separate encoder/prefill and **autoregressive decoder** compute in the capacity model. Rough peak required generated tokens/sec ≈ `QPS × average output tokens`; divide by **measured model throughput on target hardware** and add headroom for longer outputs. Batch compatible requests, but protect tail latency; benchmark beam search vs greedy/sampling strategies depending on translation quality.

Glossary is a versioned online service/index with fast updates. Cache retrieved terms by `(locale, domain, glossary version)`, not forever; log glossary misses and conflicts. Reuse the base model across glossary versions to avoid continuous retraining.

# 8. High-level architecture

<!-- system-design-diagram -->

# 9. Evaluation and diagnosis

| Area | Metrics |
|---|---|
| Translation quality | Human adequacy/fluency; COMET; chrF/BLEU secondary |
| Terminology | Approved-term compliance, glossary recall, wrong-term rate |
| Invariants | Number/currency/error-code/entity preservation accuracy |
| Low-resource equity | Per-language-pair quality and critical-error rate |
| Production | P95 latency, generated tokens/sec, cost/1K messages, glossary propagation lag |

**Diagnosis:** Good COMET but missing approved product names → glossary retrieval/constraints problem. Accurate terms but garbled sentences → model/domain training problem. Low-resource pair worse after distillation → targeted human parallel data and per-pair balancing. Altered numbers → placeholder/validator defect, not necessarily model capacity.

# 10. Interview summary

> “I'd train or distill a multilingual encoder-decoder translation model, with translator gold as the quality anchor. The frequently changing glossary lives in an external versioned store: retrieve only applicable terms per request and enforce them through conditioning, placeholders or constrained decoding, followed by exact consistency checks. I'd measure human/COMET translation quality separately from terminology and number preservation, and size capacity around decoder token throughput.”
