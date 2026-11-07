# Summarize Long Documents and Extract Facts

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Given a long document or document set (potentially 100K+ tokens), produce a **concise, factually supported summary** and **structured facts** such as dates, amounts, entities, actions, and obligations. Preserve supporting evidence for both. Documents may be redundant or internally contradictory.

Example output: executive summary plus JSON-like fields for parties, contract dates, renewal terms, prices, and cited document locations.

# 2. Clarification Q&A

**Candidate:** Do we need only a prose summary or specific facts as well?  
**Interviewer:** Both: a concise human-readable summary and a defined structured schema, each with evidence citations.

**Candidate:** How long and what kinds of documents?  
**Interviewer:** Up to 100K+ tokens with PDFs, attachments, tables, and repeated/contradictory updates.

**Candidate:** Are fact types fixed or arbitrary?  
**Interviewer:** Several required fields are predefined, but some extraction requests vary by document type.

**Candidate:** How should we handle contradictions?  
**Interviewer:** Surface disagreements and distinguish current authoritative information from obsolete claims.

**Candidate:** Accuracy versus cost/latency?  
**Interviewer:** Factual mistakes are expensive; asynchronous/batch processing of very long documents is acceptable, with interactive results for shorter ones.

# 3. Requirements

**Functional:** Extract document text/tables; summarize core decisions, events and caveats; return required structured facts with field-level source citations; capture missing/uncertain values as null/unknown; handle contradictions, dates and supersession; work for large documents beyond an efficient single context window.

**Non-functional:** Strong evidence-based factuality, reproducibility, document-version awareness, data privacy, bounded cost, scalable asynchronous pipelines, monitoring of extraction failures.

# 4. ML objectives

There are **two different outputs and objectives**:

1. **Structured extraction:** Accurate field values and support spans → per-field exact-match accuracy, span/typed entity precision/recall/F1, numeric/date normalization accuracy, evidence validity.
2. **Abstractive summary:** Coverage of decision-relevant points and absence of unsupported claims → claim-level groundedness/factuality, completeness/coverage, contradiction handling and citation precision.

ROUGE/BERTScore measure overlap/semantic similarity to references but **cannot validate factual correctness by themselves**.

# 5. Data

**Sources:** Long-form reports, agreements, policy documents, emails and attachments; historical human summaries; annotated fields and evidence spans; version histories and metadata on document authority.

**Ground truth:** Human-written summaries, field-level canonical values, page/paragraph source ranges, examples where the correct value is unknown, superseded or contradictory. Include tables, footnotes and OCR errors. Split at document family/entity/version level to avoid near-duplicate leakage; simulate previously unseen document formats.

**Preprocessing:** PDF/table parsing and section segmentation, explicit page+offset mapping, OCR quality flags if scanned, normalized date/currency units with original strings preserved. Chunk on semantic boundaries with overlap; keep heading/table associations and provenance in every chunk.

# 6. High-level architecture

<!-- system-design-diagram -->

The **map-reduce/hierarchical design** avoids sending all raw text in one massive prompt and reduces omission risk. An important improvement is to retain **structured evidence** between stages, not merely recursively summarize summaries until source details vanish.

# 7. Models and training

**Fixed schema fields:** Use a supervised named-entity recognition (NER)/span extractor when the requested types are stable and can be anchored in the source. The value strings themselves can be unseen (new company names, dates and amounts). When fields are compositional, relational, or change by task, use a constrained generative extractor with a schema and nulls for unsupported fields.

**Summaries:** A generation model produces chunk-level claim summaries, then a final synthesis model merges them using source references. Keep a structured evidence ledger such as:

```text
claim: "Contract renews on March 1"
source: document_7, page_9, paragraph_4
observed_date: 2026-02-10
authority: signed_amendment
confidence/uncertainty: verified_in_source
```

A verifier checks extracted numbers, names, dates and key claims against cited spans. Normalizing amounts and dates is deterministic where possible; a claim whose support is missing should be dropped or marked uncertain rather than invented. If two signed amendments conflict, surface the conflict unless authority/supersession metadata resolves it.

**Training:** Start with pretrained extraction/LLM models and gold examples of structured output, evidence, and high-quality summaries. Fine-tune smaller task models for repeated high-volume extraction if cost warrants. Include difficult negative/ambiguous fields and long-range dependencies in training/validation.

# 8. Serving and scaling

Use asynchronous jobs for 100K-token documents, partitioned chunk processing and controlled parallelism. Cache parsed chunks and intermediate evidence records by document version; incremental document updates should invalidate affected chunks and potentially dependent global summaries. Avoid parallelizing everything without a merge budget: conflicts and cross-section references require reconciliation.

Cost is roughly related to total map input/output tokens plus reduce-stage tokens and validation passes. Track tokens, GPU/CPU usage, completion latency and proportion requiring human review. Separate user-visible summary speed from the time required for verified structured facts.

# 9. Evaluation and diagnosis

| Component | Metrics |
|---|---|
| Parsing/chunking | Table fidelity, OCR error rate, lost-section rate |
| Structured facts | Per-field exact-match, typed/span F1, date/currency accuracy, missing-value calibration |
| Summary | Human completeness, claim-level entailment/groundedness, unsupported claim rate |
| Evidence | Citation precision/recall, correct source/page grounding |
| Contradiction handling | Conflict detection accuracy, supersession correctness |
| Serving | End-to-end completion time, cost/document, document-version freshness |

**Diagnosis:** Correct field exists in the raw doc but absent in output → chunk coverage or map-stage recall failure. Field found but wrong authoritative value chosen → reconciliation/version failure. Summary reads well but invents exact amounts → grounding/verification failure. High ROUGE with hallucinations → objective is misaligned; use human or claim-level factuality checks.

# 10. Interview summary

> “I'd parse long documents into structure-aware chunks with page and version metadata, then run parallel chunk summarization and evidence-backed fact extraction. A reducer reconciles candidate facts across sections, resolves valid supersession, flags contradictions, and generates the final cited summary and schema. I'd verify key claims and numerical fields against original passages, and evaluate structured fact F1 separately from summary groundedness and coverage.”
