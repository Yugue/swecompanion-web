# OCR and structured document understanding for invoices

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Extract structured fields from photographed/scanned invoices and receipts: merchant, invoice number, date, currency, totals, taxes, line items and supplier IDs. Return field-level evidence and abstain on uncertain critical values.

# 2. Interviewer–candidate clarification Q&A

**Candidate:** Which document types and languages?  
**Interviewer:** Invoices and receipts across multiple layouts and languages, including low-quality phone photos.

**Candidate:** Are fields fixed? Do we need tables and line items?  
**Interviewer:** Core schema fixed; line items can vary in count and order.

**Candidate:** Can wrong amounts be silently accepted?  
**Interviewer:** No. Financial fields require strict validation and human review when uncertain.

**Candidate:** What is the latency target?  
**Interviewer:** Seconds per document are acceptable; batch throughput matters more than interactive millisecond response.

**Candidate:** Do we have annotations?  
**Interviewer:** Thousands of labeled documents with spans/boxes and structured ground truth; millions unlabeled.

**Candidate:** How should conflicting values be handled?  
**Interviewer:** Return evidence, confidence/abstain and validation errors rather than guessing.

# 3. Requirements

**Functional:** Accept PDF/images; identify text/reading order; extract header fields and line items; normalize dates/currency; return structured JSON plus source boxes/page references; validate totals; human-review uncertain documents.  
**Non-functional:** Robust to rotation, blur, multi-page documents, unseen templates; PII/financial privacy; high accuracy on amounts and IDs; auditable outputs.

# 4. ML objectives

- **Text detection/recognition:** Character error rate (CER), word error rate (WER), word/box detection recall.
- **Field extraction:** Exact-match accuracy or field-level precision/recall/F1 after normalization; table row/cell structure accuracy.
- **Document success:** Complete invoice accuracy, line-item completeness, arithmetic consistency (subtotal + tax ≈ total), critical-field false-accept rate.
- **Operational:** Review rate, corrections per document, cost per processed page.

# 5. Data

- Collect diverse vendors/templates, phone-camera distortions, scan noise, handwritten notes, multi-page examples, languages and currencies.
- Labels: OCR text and bounding polygons, reading order, table structure, key-to-value relations, normalized field values, line item groupings.
- Annotate evidence provenance: page + box for each extracted value.
- Split by **vendor/template and time** so memorization of one invoice layout does not inflate performance.
- Use pretraining on document corpora; synthetic receipts can diversify layouts, but manually audit typography and realism.
- Protect PII and payment data in training and logs.

# 6. Architecture

<!-- system-design-diagram -->

Alternative end-to-end models can generate structure directly from pixels. Compare with modular OCR+layout depending on language quality, debugging needs, and cost.

# 7. Model selection and training

**Baseline modular approach:**

1. **OCR:** text detector (e.g., DBNet family) + recognizer (e.g., CRNN/Transformer), or a mature OCR service.
2. **Layout model:** LayoutLMv3-like token+box(+image) encoder; classify entities and relations or use a document question answering model.
3. **Tables:** identify row/column boundaries; assign cells to columns and parent line items.
4. **Normalization:** deterministic parsing for dates/currencies/units and accounting rules.

**End-to-end alternative:** Donut-style vision-to-text encoder–decoder predicts structured output without explicit OCR; may work better on some layouts but can hallucinate and needs schema validation/evidence alignment.

Training: token/span classification and relation losses for modular setup; sequence cross-entropy with constrained target syntax for generative extraction. Use teacher forcing and schema-constrained decoding where supported. Do not rely only on JSON syntax validity to infer factual correctness.

# 8. Serving and safety

- Image preprocessing and OCR usually dominate CPU/image handling; extraction model can batch across pages.
- Multi-page context: process pages independently, merge using document-level constraints; handle totals repeated on later pages.
- Use confidence-aware critical-field thresholds; request manual correction when totals disagree or evidence is missing.
- Deterministic validators: `subtotal + taxes + adjustments ≈ total` within currency rounding tolerance; field presence; date plausibility; duplicate invoice ID checks.
- Version extraction schemas separately from model versions; log evidence and reviewer corrections to build gold data.

# 9. Evaluation and failure modes

**Offline:** CER/WER, normalized field exact match, table cell F1, line-item recall, document-level complete accuracy, breakdown by scan quality/template.  
**Online:** Correction/exception rates, touch time per document, validation failures, latency, review cost.  
**Failures:** OCR swaps 0/O or 1/I, decimal separators, tax-inclusive prices, multi-currency invoices, overlapping stamps, split tables, hallucinated amounts.

**L5 decision:** Separate **reading text**, **understanding layout**, **extracting fields**, and **validating financial truth**; do not use an LLM as a substitute for arithmetic checks.


# 10. One-minute interview summary

> “I’d combine OCR, layout-aware field extraction, and deterministic document-level validators. Financial values require evidence and abstention, measured with normalized field accuracy and review cost.”
