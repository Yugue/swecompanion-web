# Long-document summarization beyond the context window

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design a service that summarizes a 100K–1M-token document or collection of reports, extracting critical facts, dates, numbers, decisions, and unresolved issues. Inputs may exceed the LLM context window, contain contradictions, and require traceable evidence for generated statements.

Unlike the narrower NLP extract-and-summary task, this problem emphasizes **generative synthesis, long-range dependencies, evidence consolidation, and hallucination control**.

# 2. Clarification Q&A

| Candidate asks | Interviewer answers (assumed) | Design consequence |
|---|---|---|
| What documents? | Contracts, meeting transcripts, incident reports, PDFs. | Structure-aware parsing, source pointers. |
| What outputs? | 1-page executive summary + structured fact table with citations. | Parallel extraction and synthesis. |
| How long? | Up to 500K tokens, sometimes multiple versions. | Hierarchical map–reduce / selective retrieval. |
| What matters most? | No invented amounts, dates, or conclusions. | Strict fact verification, provenance. |
| What about conflicts? | Preserve contradictory statements and chronology. | Explicit contradiction resolution logic. |
| Performance? | Batch jobs usually; P95 < 60 s for common sizes. | Async orchestration, parallel chunk processing. |
| Do we have gold summaries? | Thousands, limited human fact annotations. | Human QA plus model-assisted checks. |

# 3. Requirements

**Functional:** ingest various formats; preserve structure, tables, timestamps and document versions; generate concise user-specified summary; extract named facts with evidence pointers; distinguish conflicting versions/claims; represent unknown fields as unknown; optionally answer follow-up questions against source evidence.

**Non-functional:** high factual accuracy and coverage, deterministic output schema for facts, reproducibility, privacy, quality across lengths, scalable batch latency/cost, resumable long-running tasks.

# 4. ML objectives

- **Coverage:** capture all gold salient decisions, facts, and key changes.
- **Groundedness:** each generated factual claim is entailed by source evidence.
- **Structured extraction:** field-level precision, recall, F1 or exact-match for dates, amounts, people, and events; normalize units/time zones.
- **Contradiction handling:** distinguish original, superseded, and conflicting claims; avoid silently choosing the wrong version.
- **Utility:** human assessment of organization, concision, usefulness, and task-specific relevance.
- **Efficiency:** total tokens, number of model passes, wall time; preserve quality under compression.

ROUGE/BERTScore measure lexical/semantic overlap and can supplement evaluation, but **do not establish factual correctness**.

# 5. Data

**Labeling approach:** Prompt a teacher to draft chunk facts, claim-to-source links and merged summaries using a small expert gold set. Validate exact numbers, offsets and contradictions against original documents; checked pseudo-labels supply scale without commissioning every summary.

**Quality and escalation:** Separate document-family gold for prompt development, validation and locked tests. Try prompt engineering or supported soft-prompt tuning before teacher LoRA on development gold; fund human bulk summaries only for important persistent gaps.

**Prompt tuning** learns a small soft prompt while keeping base weights frozen; it requires model support. **LoRA** learns low-rank weight adapters. Neither uses validation/test gold for training.

**Feature engineering:** Preserve sections, tables, source offsets and version precedence; chunk-level evidence ledgers provide the features for cross-chunk synthesis.

**Source storage:** original bytes; page/paragraph offsets; headings, tables, figures, speaker and timestamp tags; OCR confidence; version and owner. Keep provenance for each extracted span.

**Gold set:** source document → topic-specific summary → canonical structured facts → claim-to-source anchors → contradictions and precedence annotations. Include long-distance references (an event introduced in section 2 clarified in section 30), duplicates, outdated amendments, missing values, and adversarial misleading sections.

**Label checks:** validate teacher-generated facts and supporting spans with source and exact-value checks; sample numerical and high-stakes claims for expert audits. Split by full document family/version to avoid nearly identical template leakage.

# 6. Modeling approach

1. **Preprocess:** preserve document layout and tables; identify metadata. A bad OCR/table extraction propagates errors to every downstream model.
2. **Chunk semantically:** target natural boundaries; choose lengths based on model context and retrieval quality, not arbitrary page count. Keep enough overlap for cross-boundary references, but consolidate repeated evidence later.
3. **Local summarization:** prompt a capable LLM to summarize each segment with fixed fields (major facts, entities, decisions, open questions, citations). Use consistent output schema and compact intermediate representation.
4. **Fact extraction:** fixed field types can use span extraction/NER plus normalizers; open fields benefit from generative extraction with schema validation. Keep actual source spans, units, and timestamps.
5. **Aggregate:** deduplicate events, link references to the same entities, order claims over time, represent contradictions explicitly (e.g., “original estimate $4M; revised to $5M”). Use authority rules only when defined by domain.
6. **Global synthesis:** generate final summary from structured facts plus selected chunk summaries. Reserve token budget for high-priority sections and rare critical details.
7. **Verification:** align each summary claim with original source, use entailment or LLM judge calibrated against human gold, check exact values/dates and unsupported conclusions. If unsupported, remove/rewrite or flag uncertainty.

**Alternative:** if document fits comfortably in a long-context model, benchmark a single-pass baseline. Long context doesn't guarantee perfect retrieval of buried details (“lost in the middle”), and costs scale with input length. For targeted follow-up questions, retrieval over the source may outperform regenerating the whole summary.

# 7. Training and adaptation

Start prompt-only with a strong LLM and structure-aware chunking; the bigger risk is source omissions, not necessarily a lack of generative capacity. Consider a compact summarizer adapter only if prompted synthesis still fails, using evidence-checked teacher pairs and available development gold. Consider a small extraction model for repetitive factual fields to reduce per-chunk generative expense.

Train/evaluate using document-level splits; include contradiction, number preservation, temporal ordering, and uncertainty examples. Distill teacher summaries only when they are evidence-checked; otherwise the student memorizes polished hallucination patterns.

## Training and inference cost estimate

**Assumptions:** 0.1 documents/s, each containing 100K source tokens. Each document uses 50 map calls at 2K input tokens and 100 output tokens/call, then one merge call at 5K input tokens and 500 output tokens. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Prompted map stage | None | 10K input tokens/s ÷ (10K input tokens/s/GPU) → 1 GPUs; 500 output tokens/s ÷ (2K output tokens/s/GPU) → 1 GPUs. (1 + 1) GPUs × ($4/GPU-h) = **$8/h** |
| Prompted merge stage | None | 500 input tokens/s ÷ (10K input tokens/s/GPU) → 1 GPUs; 50 output tokens/s ÷ (2K output tokens/s/GPU) → 1 GPUs. (1 + 1) GPUs × ($4/GPU-h) = **$8/h** |
| Optional synthesis adapter | 20M tokens × 3 passes ÷ (500 tokens/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$133.33/run** | Same serving cost as baseline |

# 8. Serving, scale, and reliability

- Process chunks in parallel with a bounded worker pool; aggregate with dependency-aware scheduling and checkpoint intermediate facts/summaries.
- Use asynchronous jobs for large inputs, with progress and retry/resume on failures. Set per-document token and cost caps.
- Store compact intermediate representations and their source pointers so follow-ups can use them without reprocessing full source, while retaining access to original evidence.
- Prevent cross-tenant content leakage in cache and job storage; apply retention policies and document ACLs.
- For revisions, perform incremental reprocessing at changed-section granularity but re-run global conflict checks after material changes.

# 9. High-level architecture

<!-- system-design-diagram -->

**Why parallel tracks?** Pure “summary of summaries” progressively loses precise numbers, negations, and minority but critical details. Independent extraction preserves exact claims and provides a verification source for the final generated summary.

# 10. Evaluation and diagnosis

| Metric | Why it matters |
|---|---|
| Claim-level factual support rate | Flags hallucination / unsupported claims |
| Key-fact coverage/recall | Detects missing crucial content |
| Structured field P/R/F1; number/date exact match | Protects critical specifics |
| Evidence citation precision/recall | Sources truly back claims |
| Contradiction/version handling accuracy | Avoids obsolete or contradictory summary |
| Human utility/readability score | Measures actual value, beyond overlap |
| P95 job time, tokens/doc, $/doc | Throughput and economics |

**Diagnostic:** high factuality but low coverage → chunk selection/aggregation dropped evidence. Good coverage but wrong values → extraction, normalization, or hallucination checks. Correct local summaries but flawed final → aggregation and conflict reconciliation.

# 11. Trade-offs and interview summary

Map–reduce scales but can lose context across chunks. Long-context single-pass is simpler but may be costly and miss dispersed facts. More aggressive summarization reduces tokens but raises omission risk. Explicit provenance and parallel fact extraction mitigate these issues.

> **Interview answer:** “I'd parse documents structurally and preserve source offsets, then run parallel local summarization and explicit fact extraction. A reducer merges events, resolves entities, preserves conflicts and chronology, and produces the final summary. I'd verify claims and critical dates/numbers against original evidence, and evaluate coverage and groundedness separately. For large documents I'd use asynchronous chunk workers with checkpointing; for smaller ones I'd benchmark a single-pass long-context baseline.”
