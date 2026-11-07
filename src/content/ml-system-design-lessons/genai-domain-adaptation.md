# Domain-specific AI assistant via fine-tuning

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design a specialized assistant for customer support or enterprise operations that must follow domain-specific conventions, classify and explain complicated cases, generate reliable structured outputs, and cost less than using a large general-purpose LLM on every request. Decide whether to use prompting, retrieval-augmented generation (RAG), supervised fine-tuning (SFT), parameter-efficient fine-tuning, preference optimization, or distillation.

**Key insight:** model adaptation and knowledge retrieval solve different problems. Fine-tuning is best for repeated behavior, style, decision patterns, format, or domain terminology; RAG is usually better for rapidly changing facts.

# 2. Clarification Q&A

| Candidate asks | Interviewer answers (assumed) | Design consequence |
|---|---|---|
| What's wrong with the baseline? | Large LLM is accurate but expensive; small one misses domain formats/edge cases. | Evaluate teacher/student and SFT. |
| What must output look like? | Strict JSON: category, rationale, action suggestion, uncertainty. | Schema-constrained outputs, field-level metrics. |
| How often do domain facts change? | Policy changes weekly; writing rules change quarterly. | RAG for fresh policy, SFT for stable behavior. |
| Do we have labels? | 200K reviewed task examples and millions of unreviewed messages. | SFT with targeted human annotation. |
| What's scale/latency? | 1,000 QPS and P95 < 1.5 seconds. | Smaller model, batching, shorter outputs. |
| Are some actions high-risk? | Yes: billing/legal recommendations need human escalation. | Calibrated abstention and risk controls. |
| What's the objective? | Maintain high task quality while cutting serving cost. | Pareto frontier of quality, latency, cost. |

# 3. Requirements

**Functional:** interpret user request; ground against applicable policy; generate schema-valid answer or escalation; handle edge cases; preserve terminology and required fields; support multilingual input if specified.

**Non-functional:** target quality on reviewed test sets, strict schema validation, stable latency at QPS, auditable model/version, privacy-compliant training, predictable rollout, safe refusal for unsupported/high-risk cases.

# 4. ML objectives

Do not optimize only token-level next-token loss or perplexity. Optimize **downstream task quality**:

- Task success / human acceptance and error severity, stratified by domain and language.
- **Field-level exact match, precision/recall/F1** on structured outputs and validity rate on JSON schemas.
- Groundedness and policy compliance; calibrated uncertainty or handoff recall for high-risk cases.
- Latency P95 and serving cost per successful response.
- Robustness to unseen phrasing, out-of-distribution requests, changed policy documents, and adversarial inputs.

Define a weighted score only after safety constraints; do not allow high average task accuracy to compensate for severe compliance failures.

# 5. Data and labeling

**High-quality human gold:** a curated, representative set of inputs with ideal structured outputs, evidence links, abstain decisions, and graded severity. Reserve a clean untouched test set before generating training data.

**Additional training:** historical reviewed conversations, successful agent resolutions, domain rules, public/general instruction data where legally allowed. Filter PII, stale policy, contradictions, and duplicated templates.

**Teacher distillation:** use a stronger LLM to label selected unlabeled examples, especially rare categories and hard edge cases. Require evidence, confidence rationale where available, deterministic schema validation, and human spot audits. Teacher labels are not ground truth. Prefer human labeling for high-severity examples.

**Sampling:** stratify by task, locale, difficulty, frequency, and failure mode. Mine errors where baseline predictions disagree with expert labels. Use temporal or customer-level splits to avoid leakage of repeated conversations.

**Preference labels:** for two candidate responses to the same input, experts choose the more helpful/compliant one. Make sure preferences correlate with actual task correctness, not merely verbosity or tone.

# 6. High-level architecture

<!-- system-design-diagram -->

# 7. Model strategy and training

**Baseline ladder (in order):**

1. **Prompting and few-shot examples:** establish a baseline. Cheapest engineering change, but high inference cost if the model is large and examples increase context.
2. **RAG:** add if failures are caused by missing/stale factual knowledge, not formatting or reasoning behavior.
3. **Full SFT:** for stable tasks with abundant high-quality labels. Train with autoregressive cross-entropy over the desired response tokens (often mask prompt tokens from loss). Monitor held-out task metrics, not just training convergence.
4. **LoRA (low-rank adaptation) / QLoRA:** update small adapter matrices; useful when the base LLM is large and GPU memory is constrained. For a small model, full fine-tuning may be simpler and competitive. QLoRA uses quantized base weights during adapter fine-tuning; check supported deployment format.
5. **Knowledge distillation:** teacher → large volume of checked responses → smaller student. Choose student based on measured accuracy/cost and high-risk failure modes; not all teacher reasoning or edge cases survive distillation.
6. **Preference optimization:** direct preference optimization (DPO) or related approaches after SFT can shift style/choices toward human preferences. It does not substitute for factual ground truth or security checks.

**Loss:** SFT autoregressive cross-entropy; preference optimization aligns selected-vs-rejected responses; optional auxiliary loss on structured fields. Weighting examples matters, but avoid aggressively repeating rare cases until the model memorizes them.

**Freeze what?** With LoRA, freeze original model weights and learn low-rank adapters. With full fine-tuning, update all parameters; requires more memory and caution against catastrophic forgetting. Evaluate general capabilities after adaptation.

**When not to fine-tune:** if 90% of failures are missing current policy context, fix retrieval; if all failures are invalid JSON, try constrained decoding first; if quality is already sufficient, optimize inference rather than retrain.

# 8. Serving and operations

Serve the adapted model with batching, token limits, and schema-constrained output. Choose a fallback policy for uncertainty, schema failures, high-risk cases, or detected out-of-distribution input. Use rules/validators for mandatory structured fields and domain-specific invariants; a fine-tuned generator can still hallucinate.

Track versioned: base model, adapter, training dataset, tokenizer, prompt, retrieved corpus, eval suite. Canary traffic to new versions; compare against prior baseline and teacher on a common fixed evaluation slice. Recalibrate escalation thresholds when scores shift.

**Online learning risk:** user thumbs-up or agent corrections can be noisy, self-selected, or malicious. Curate and audit before adding to training. Do not retrain solely because daily label volume increased; use held-out learning curves and error clusters.

# 9. Evaluation and diagnosis

| Observation | Likely bottleneck | Next experiment |
|---|---|---|
| Correct facts, wrong JSON | Decode/format control | Schema-constrained decoding / SFT |
| Wrong current policy | Knowledge freshness | RAG, policy index updates |
| Small model fails subtle cases | Capability gap | Targeted gold labels, bigger student, fallback |
| Good in English, poor other languages | Training imbalance | Stratified data and per-language eval |
| Human preference high, factuality low | Reward/preference mismatch | Grounded factual labels and hard constraints |
| Student cheaper but escalates too often | Calibration/coverage | Confidence calibration, targeted fine-tune |

**A/B test:** compare actual human-review load, resolution rate, correction severity, user satisfaction, latency, and $/completed task. Keep a high-quality gold evaluation set stable across iterations.

# 10. Trade-offs and interview summary

SFT improves stable behaviors but can encode outdated facts; RAG handles factual updates but adds retrieval dependence. Larger models cost more per output token. Distillation improves cost only if quality still meets the business requirement. LoRA primarily helps training resource usage—not automatically lower inference cost.

> **Interview answer:** “I would first separate knowledge failures from behavior failures. I'd benchmark prompt-only and RAG baselines, define a human-reviewed gold suite with task and high-severity metrics, then fine-tune or distill a smaller LLM for repeated domain behaviors. I'd validate JSON and policy compliance outside the model, use current evidence via RAG, calibrate escalation, and deploy through shadow/canary with quality–latency–cost monitoring.”
