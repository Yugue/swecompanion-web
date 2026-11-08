# Customer Support Issue Classification

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Build a multilingual machine learning (ML) system that reads a customer support message and predicts **every applicable issue category** from 150 stable categories. One message can describe several problems. Return scored labels or a review/no-known-label outcome.

Example: “My order arrived damaged, and I was charged twice.” → `DAMAGED_ITEM`, `DUPLICATE_CHARGE`.

# 2. Clarification Q&A

**Candidate:** Can a message contain multiple issue types?  
**Interviewer:** Yes. Multiple labels may simultaneously be correct.

**Candidate:** Is the taxonomy stable, and are labels mutually exclusive or hierarchical?  
**Interviewer:** About 150 curated labels, updated infrequently. Some parent-child relationships exist, but overlapping labels are allowed.

**Candidate:** Which languages, fields, and types of supervision are available?  
**Interviewer:** Twenty languages; title/body, channel, and product metadata. We have 200,000 human-labeled messages, including multilabel cases, plus millions unlabeled.

**Candidate:** What do we do when no existing label applies?  
**Interviewer:** Return no known label or route to review. Do not automatically invent a new issue category.

**Candidate:** Any high-risk labels or serving constraints?  
**Interviewer:** Missing fraud/safety issues is costly. Peak 20,000 requests/second; P95 latency under 100 ms.

# 3. Requirements

**Functional:** Return all relevant taxonomy labels and scores; support 20 languages and multiple simultaneous issues; accept empty/no-known-label results; send low-confidence or high-risk cases to review; produce explanations/evidence snippets if operationally required.

**Non-functional:** 20K QPS, <100 ms P95, stable serving under bursts; strong per-language and rare-label quality; privacy controls and audited label versions. Targets are hypothetical.

# 4. ML objectives

This is **multilabel classification**, not multiclass classification. Learn 150 independent label scores. Optimize macro-F1 and **per-label precision/recall**, especially high recall for costly-to-miss labels. Calibrate **per-label decision thresholds** rather than defaulting to 0.5 or using one global threshold. Assess both quality and coverage of the no-known-label outcome.

A missing known label is not proof that the message concerns an entirely novel issue; it can be a low-confidence or out-of-scope instance.

# 5. Data

**Labeling approach:** Use the existing 200K human labels as an asset, not a reason to commission millions more. Split out prompt-development gold, validation/calibration gold and a locked human test set. Give a teacher the taxonomy, counterexamples and few-shot multilabel gold; use its checked pseudo-labels to cover unlabeled languages and rare categories.

**Quality and escalation:** Require valid label IDs and supporting text; audit per-label precision/recall on validation gold, including missing labels. If prompt engineering or supported soft-prompt tuning misses the quality target, try teacher LoRA on development gold. Only fund targeted human bulk labels if that still fails and error costs justify it.

**Prompt tuning** learns a small soft prompt while keeping base weights frozen; it requires model support. **LoRA** learns low-rank weight adapters. Neither uses validation/test gold for training.

**Feature engineering:** Cleaned title/body, language, product and preserved error codes feed a pooled multilingual embedding; the classifier emits 150 independent scores.

**Sources:** Available gold tickets, adjudicated disagreements, noisy routing feedback and sampled production messages; the unlabeled corpus supplies bulk teacher-labeling candidates.

**Annotation guidelines:** Define each label precisely with positive/negative examples; permit multiple labels; capture language, product, severity, and a `none-of-known-labels` evaluation slice. Double-label ambiguous/high-impact cases. Avoid treating unannotated labels as automatically negative when annotation is incomplete.

**Preprocessing:** Remove signatures, templates, duplicate threads and personal information; preserve negations, error codes, product names, and meaningful metadata. Use language-stratified and time-based holdouts. Deduplicate near-identical templates across train/test to prevent leakage.

**Class imbalance:** Oversample informative minority cases, use weighted binary cross-entropy or focal loss when appropriate, and target teacher labeling plus sampled human audits at rare labels/languages. Do not assume a large volume of low-quality pseudo-labels beats 200K good gold labels.

# 6. Model and training

Start with a compact multilingual Transformer encoder (e.g., distilled multilingual BERT or XLM-R family, benchmarked for target languages). Pool the sequence representation, apply a linear head with 150 logits, and train **binary cross-entropy (BCE) with logits**. Sigmoid allows labels to co-occur; softmax would force competition and is wrong for this task.

```python
logits = classifier(encoder(ticket))  # shape: [batch, 150]
loss = BCEWithLogitsLoss(pos_weight=weights)(logits, multi_hot_labels)
```

Benchmark the frozen encoder plus a trained multilabel head first. Train a compact student on filtered teacher pseudo-labels and available development gold; adapt encoder weights only if validation shows a real gap, preferring adapters where supported. Evaluate a lighter student model for 20K QPS. Do not assume low training loss means more data is unnecessary: use held-out performance and learning curves.

Calibrate each threshold `T_i` with validation predictions. For a severe fraud label, choose a lower threshold to capture more cases (possibly with human review); for a label triggering irreversible automation, favor precision. Account for co-occurrence/hierarchy constraints only if the taxonomy requires them.

## Training and inference cost estimate

**Assumptions:** 20K ticket requests/s, with one message classified per request. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Frozen encoder + trained head | 1M examples × 3 passes ÷ (500 examples/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$6.67/run** | 20K requests/s × 1 messages/request ÷ (5K messages/s/GPU) → 4 GPUs × ($4/GPU-h) = **$16/h** |
| Optional encoder adapter | 1M examples × 3 passes ÷ (500 examples/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$6.67/run** | Same as baseline |

# 7. Serving and scaling

Batch inference opportunistically, but cap batch waiting time to protect P95. Use smaller encoders, model quantization/distillation if accuracy holds, and CPU/GPU cost benchmarks. At 20K QPS, even 2 ms of pure device compute per request represents ~40 device-seconds of work each second before batching efficiency; size the fleet from **measured throughput** plus headroom, not theoretical model size alone. Monitor language-specific token length and truncation.

Cache repeated templates only when ticket-specific content is not accidentally masked. Deploy canary and rollback with versioned label mappings and threshold sets.

# 8. High-level architecture

<!-- system-design-diagram -->

# 9. Evaluation and diagnosis

| Layer | Metrics | Why |
|---|---|---|
| Offline multilabel | Macro-F1; micro-F1; per-label precision/recall; PR-AUC | Macro highlights rare labels; micro reflects volume |
| Decision thresholds | Per-label precision/recall; false-negative rate of critical labels | Business risk and calibration |
| Slice quality | Per-language/category/severity performance | Fair coverage and distribution shifts |
| Operations | P95/P99, QPS, cost, review rate, label prevalence | Serving and drift |

**Diagnosis:** Good overall micro-F1 but poor rare-label recall → stronger minority annotations/weights and per-label thresholds. Low performance in one language → audit its gold labels, pretraining coverage, and translation/normalization. Rising predicted label prevalence alone indicates drift, **not** proven degradation in precision; collect fresh gold labels.

**Main pitfalls:** treating multilabel as softmax multiclass; always adding an extra `NO_ISSUE` output class when all-zero predictions already suffice; clustering routine known-label traffic without a discovery requirement; conflating confidence scores with calibrated probabilities.

# 10. Interview summary

> “Because categories are stable and a message can contain several issues, I’d benchmark a frozen multilingual encoder and train a 150-output sigmoid head with weighted BCE, then calibrate thresholds per category based on false-positive and false-negative costs. I’d use development gold to calibrate an LLM teacher, expand with checked pseudo-labels, and reserve human gold for validation and tests, and measure macro-F1 plus per-label precision/recall. A distilled model and batched serving would address 20K QPS.”
