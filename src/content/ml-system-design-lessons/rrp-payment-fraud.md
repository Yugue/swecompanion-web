# Real-Time Payment Fraud Detection

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design an ML system that scores each payment transaction for fraud before authorization, enabling approve, challenge, review, or decline decisions while minimizing customer friction and expected financial loss.

# 2. Clarifying Q&A

**Candidate:** What type of fraud—stolen card, account takeover, friendly fraud, or all?  
**Interviewer:** Focus on unauthorized transactions and account takeover; we can expand categories later.

**Candidate:** Do we need a binary prediction or an action decision?  
**Interviewer:** Both: produce risk estimates, then make a cost-sensitive decision (approve, step-up challenge, review, decline).

**Candidate:** When are ground-truth labels available?  
**Interviewer:** Chargebacks and investigations may arrive weeks later; many transactions never get fully verified.

**Candidate:** How costly are false positives and false negatives?  
**Interviewer:** False negatives lose money; false positives block legitimate customers and damage retention. Costs vary by amount, merchant, and region.

**Candidate:** Scale and latency?  
**Interviewer:** 10K TPS peak, P99 model-and-feature latency under ~50 ms within the authorization budget.

**Candidate:** Can we use identity, velocity, or device graph signals?  
**Interviewer:** Only permissioned signals, with privacy and compliance controls.

# 3. Requirements

**Functional:** ingest transaction/context features; return fraud risk score; map risk to approve/challenge/review/decline; apply hard policy rules; support manual investigation feedback; detect new attacks, account takeovers, and repeated suspicious behaviors.

**Non-functional illustrative:** P99 < 50 ms for feature lookup + inference, high availability, auditable decisions, resilient fallbacks, strict security and privacy controls, rapid feature freshness.

# 4. ML objectives and decision theory

This is an imbalanced classification plus cost-sensitive action problem.

- Model target: `P(unauthorized fraud | transaction at decision time)` with clearly defined eventual labels.
- Model metrics: PR-AUC, recall at a fixed false-positive rate, precision at investigation capacity, calibration, performance by amount/region.
- Policy objective: minimize **expected monetary loss + customer friction + investigation cost**, subject to chargeback and regulatory constraints.

For transaction amount `A`, a rough expected fraud loss of approving is `p_fraud * expected_loss_if_fraud(A)`. Challenge/decline actions have different intervention effectiveness, customer costs, and operational constraints. Do not use one global threshold if costs differ dramatically across segments.

# 5. Data, labels, and sampling

**Labeling approach:** Use confirmed chargebacks, matured legitimate outcomes and investigator findings. These delayed real outcomes are cheaper and more defensible than bulk speculative annotation; an LLM cannot infer ground-truth fraud from a transaction narrative.

**Quality and escalation:** A teacher guided by small analyst gold can pseudo-tag investigation reasons for analyst search, never overwrite the fraud target. Tune prompts first, consider LoRA only for that tagging task, and fund human investigation where expected loss warrants it. Validation and locked tests use mature confirmed outcomes with independent audits.

**Feature engineering:** Use point-in-time amount, merchant, device, account age, velocity windows and precomputed graph features; calibrate to actual fraud prevalence after negative sampling.

**Real-time features**

- Transaction amount, currency, merchant/category, payment channel, time, region.
- User/account age, prior transaction counts, historical fraud rates (smoothed).
- Device/IP/network reputation, geolocation inconsistency, velocity counts (last 1/5/60 minutes), unusual spending relative to user's baseline.
- Graph features: shared devices, cards, addresses or IP links among risky entities (when permitted).

**Labels**

- Confirmed unauthorized chargeback or investigator determination = positive.
- Matured legitimate transaction = likely negative, but beware unresolved/unreported fraud.
- Challenge outcomes are **not equivalent** to ground-truth fraud labels.
- Declined transactions have no observed downstream outcomes: action-induced censoring/selection bias.

**Delayed labels:** wait for appropriate maturity windows or model time-to-report. Train on rolling temporally separated windows; test on out-of-time data. Deduplicate user/transaction leakage and prevent post-authorization feature leakage.

**Class imbalance:** the majority are legitimate. Weighted losses, class-aware sampling, focal loss or explicit costs can be useful; if training on resampled data, **recalibrate probabilities to real prevalence**.

# 6. Models and training

**Strong baseline:** LightGBM/XGBoost gradient-boosted decision trees, often excellent on heterogeneous tabular data, missing values, and hand-engineered velocity features.

**Optional additions:**

- Sequence models for transaction behavior and deviations from baseline.
- Graph neural network or graph-derived features to detect fraud rings; expensive graph precomputation near-line, not giant online graph traversals.
- Unsupervised/anomaly models for novel patterns or sparse-label cold-start segments—but anomaly does not equal fraud, so use as additional feature or review trigger.

**Loss:** weighted binary cross-entropy or expected-cost-aware loss; evaluate probabilities and optimize business policy separately. Explainability via feature attributions/reason codes where required, with care about instability or sensitive inferences.

## Training and inference cost estimate

**Assumptions:** 10K transactions/s, with one risk prediction/transaction. Training uses 100M mature transaction outcomes per run. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| GBDT risk baseline | 100M rows ÷ (1M rows/core-h) × ($0.05/core-h) = **$5/run** | 10K requests/s × 1 risk scores/request ÷ (200K risk scores/s/CPU core) → 1 CPU core × ($0.05/CPU core-h) = **$0.05/h** |
| Optional sequence-risk model | 100M examples × 2 passes ÷ (100K examples/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$2.22/run** | 10K requests/s × 1 transactions/request ÷ (10K transactions/s/GPU) → 1 GPU × ($4/GPU-h) = **$4/h** |

# 7. Thresholds, policy, and human review

Assume risk score `p`:

- `p < T1`: approve.
- `T1 <= p < T2`: step-up authentication or queue review based on capacity.
- `p >= T2`: decline where justified.

Tune thresholds on validation/replay with realistic transaction economics and label delays, not merely maximum F1. Prioritize recall at a tolerable false-positive rate, or maximize expected savings under an explicit false-decline budget.

**A/B testing ethics:** avoid exposing users to unchecked high-risk traffic. Use shadow scoring, canary rollout, and risk-limited experiments; measure fraud only after label maturity and account for interventions changing outcomes.

# 8. Freshness, reliability, and monitoring

- Stream transaction events into rolling velocity counters; use idempotent event processing and well-defined TTLs.
- Keep online feature lookups bounded in latency; do not synchronously fetch slow external systems in the critical path.
- Graceful degradation: policy-approved fallback rules or previous stable model; never default to unconditional approval during outages.
- Track data/label drift, unseen merchants/devices, model score shift, fraud incidence (matured), review overturns, false declines, and differential error rates across permitted cohorts.
- Retrain as attack strategies evolve, with adversarial monitoring for manipulated inputs.

# 9. Architecture

<!-- system-design-diagram -->

Separate **risk prediction** from the **decision policy**. Rule-based protections may run independently and are not necessarily ML.

# 10. Evaluation and release gates

Use a chronological, mature-outcome holdout. Measure log loss, calibration and PR-AUC by cohort; check business loss and false-positive costs at the chosen policy. Evaluate semantic pseudo-label quality separately from observed outcomes. Shadow, then canary the candidate with latency and outcome guardrails; do not promote on training fit or an LLM judge alone.

# 11. Trade-offs and pitfalls

- **Accuracy is meaningless** under extreme imbalance; report PR-AUC and recall/FPR at actual base rates.
- **Optimize decisions, not F1 alone**; money and friction have unequal costs.
- **Label delay and intervention bias** matter more than a fancy model.
- **Concept drift/adversarial adaptation** requires fast monitoring and safe rollout.
- **Compliance** limits features and requires auditability and data retention/deletion controls.

**Interview close:** “I frame fraud as calibrated rare-event prediction feeding a cost-sensitive decision policy. I use point-in-time transaction and velocity features, start with GBDT, address delayed/censored labels, and tune approval/challenge/decline against expected loss and false-decline constraints. P99 latency, streaming freshness, explainability, and adversarial drift are first-class design requirements.”
