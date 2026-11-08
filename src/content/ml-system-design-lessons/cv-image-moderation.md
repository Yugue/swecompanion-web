# Image moderation at internet scale

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Automatically identify policy-violating images in a large user-generated content platform. Distinguish categories such as graphic violence, adult content and scam imagery, and choose among **allow, review, or block**. Policy definitions and error costs vary by category and jurisdiction.

# 2. Interviewer–candidate clarification Q&A

**Candidate:** Are categories mutually exclusive?  
**Interviewer:** No, one image may violate multiple categories.

**Candidate:** What actions and costs should be optimized?  
**Interviewer:** Three-way decision; false blocks harm legitimate users, missed severe violations harm safety.

**Candidate:** Does context beyond pixels matter?  
**Interviewer:** Yes. Captions, OCR text and account context may matter, but user policy data is strictly access-controlled.

**Candidate:** What is throughput and latency?  
**Interviewer:** Millions of images/day; near-real-time decisions, with different latency budgets for blocking and human review.

**Candidate:** Is human moderation available?  
**Interviewer:** Yes, but reviewer capacity is limited and exposure must be minimized.

**Candidate:** Can policy labels change?  
**Interviewer:** Frequently; we must version policy taxonomy and decisions.

# 3. Requirements

**Functional:** Multi-label category scores; allow/review/block routing; human appeal workflow; policy updates; support image + optional context; remove content and reprocess decisions when policies change.  
**Non-functional:** Low serving latency; privacy, audited access, careful reviewer safety; adversarial robustness; calibration and interpretability; acceptable reviewer workload.

# 4. ML objectives

- **Per-policy precision and recall**, **PR-AUC** (area under precision–recall curve), and Macro-F1; report by severity, language and domain.
- Minimize **expected cost** of false blocks, missed harmful content and human reviews, rather than maximizing global accuracy.
- **Decision metrics:** false-block rate on benign images; severe-content recall; review queue volume and positive yield; score calibration.
- A moderation “review” is not necessarily a model failure: it is an intentional risk-management action.

# 5. Data strategy

**Labeling approach:** A small policy-expert gold set defines the rubric for a multimodal LLM teacher. Generate multi-label pseudo-labels with evidence and abstentions; audit benign lookalikes, rare harms and language/context slices before training a compact classifier.

**Quality and escalation:** Separate prompt-development gold from validation/calibration and locked tests. Improve prompts or supported soft prompts, then use teacher LoRA on development gold if policy precision/recall still fails. Expert bulk labeling is a costed last resort for critical remaining categories; live appeals still need review.

**Prompt tuning** learns a small soft prompt while keeping base weights frozen; it requires model support. **LoRA** learns low-rank weight adapters. Neither uses validation/test gold for training.

**Feature engineering:** Use image embeddings, optional text/context and known-content hashes; policy version and category-specific thresholds stay outside the model.

- **Gold:** Policy-trained expert reviewers with documented labeling guidelines and adjudication for disagreements.
- **Sources:** Reported and appealed content, randomly sampled uploads, synthetic/adversarial perturbations, policy update examples.
- **Sampling bias:** Report-driven labels overrepresent obvious violations; build an unbiased/stratified random sample for reliable prevalence and production metrics.
- **Hard negatives:** Medical education, news reporting, art, and harmless imagery visually similar to disallowed content.
- **Handling:** Strict storage/retention rules, access segregation, content hashing where appropriate, staff well-being safeguards; don't put sensitive user data into general external labeling tools.
- Time-based test sets and “new attack” evaluation; document evolving policy annotation schema.

# 6. Models and training

- Start with a pretrained image backbone (ViT or ConvNeXt), multi-label output head and **sigmoid activations** per category.
- Train with binary cross-entropy; use class weighting, focal loss, or targeted sampling if imbalance is severe. Avoid tuning only on aggregate accuracy.
- For context-rich policies, combine image representation with text features or a multimodal encoder; benchmark added complexity.
- More severe categories need specialist gold audits; add a dedicated classifier only when the measured error cost warrants it.
- Calibrate scores per category; choose **two thresholds** per category: high confidence for auto-block, low risk for auto-allow, send ambiguous band to review. Risk costs may dictate asymmetric thresholds.
- A foundation model/vision-language model may assist prelabeling, but cannot automatically define policy truth.

## Training and inference cost estimate

**Assumptions:** 1K uploads/s, with one image/upload. The context-aware variant is assumed to process half as many images/s per GPU as the simple image model. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Frozen backbone + trained head | 1M images × 3 passes ÷ (200 images/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$16.67/run** | 1K requests/s × 1 images/request ÷ (1K images/s/GPU) → 1 GPU × ($4/GPU-h) = **$4/h** |
| Optional context-aware model | 1M images × 3 passes ÷ (100 images/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$33.33/run** | 1K requests/s × 1 images/request ÷ (500 images/s/GPU) → 2 GPUs × ($4/GPU-h) = **$8/h** |

# 7. Serving and operations

- Run inexpensive exact hash/checks first for known items, then GPU inference; prioritize fast dangerous-content routing where policy requires.
- Use queues to buffer peak upload bursts; backpressure with safe temporary review/pending state rather than bypassing checks.
- Separate model score from policy engine, so policy thresholds can change without retraining.
- Continuous active learning: sample high-uncertainty predictions and appealed decisions for expert review; audit biased collection.
- Maintain an appeal/rollback path with decision logs, model version and policy version.

# 8. Architecture

<!-- system-design-diagram -->

Content hashing can catch **identical previously reviewed media**, but cannot replace semantic classification; malicious edits bypass exact hashes. Context and user signals should respect privacy, security and fairness rules.

# 9. Evaluation and failures

**Offline:** Per-class PR-AUC, P/R/F1, calibrated risk, severity-sliced false blocks and false negatives, adversarial test suites.  
**Online:** Confirmed appeal reversals, reviewed precision and missed-content audit rates, review backlog, latency, drift. Reliable online P/R requires labeled random samples; predictions alone are proxies.  
**Failures:** Distribution shift, adversarial crops/overlays, context-dependent meanings, mislabeled educational content, rare severe classes, reviewer disagreement.

**L5 decision:** Treat moderation as a cost-sensitive, multi-label decision system with human review, not just image classification.

# 10. One-minute interview summary

> “I’d build multi-label image classification with category-specific calibrated allow/review/block thresholds, trained on reviewed cases plus representative random samples, and optimize severity-weighted false-positive/false-negative cost.”
