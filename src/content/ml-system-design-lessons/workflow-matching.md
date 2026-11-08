# Match Requests to Changing Workflows

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Given a user's natural-language request, choose the **one correct executable workflow/action** from a changing catalog, or return `UNSUPPORTED`. Workflows have descriptions, examples, parameter schemas, permissions, and versioned definitions.

Example: “Stop charging me every month.” → `cancel_recurring_subscription` if the action is permitted and supported.

# 2. Clarification Q&A

**Candidate:** Is the set of actions fixed or updated frequently?  
**Interviewer:** About 20K actions, added/removed daily; no practical retrain for each new action.

**Candidate:** One action or several?  
**Interviewer:** One canonical action or `UNSUPPORTED`; arguments may be extracted downstream.

**Candidate:** Is accidentally invoking the wrong workflow risky?  
**Interviewer:** Yes. False acceptance is worse than abstention.

**Candidate:** Which languages, traffic, and deadlines?  
**Interviewer:** Multilingual requests, 10K QPS and P95 under 120 ms.

**Candidate:** Do we have positive action matches and unsupported examples?  
**Interviewer:** Yes, executed/intended action logs, some human labels, and explicit out-of-catalog requests.

# 3. Requirements

**Functional:** Map requests to a valid active action ID; check permissions/eligibility and required arguments before execution; abstain when no supported action exists; make new catalog entries searchable promptly; never return deleted or unauthorized actions.

**Non-functional:** 20K changing actions, 10K QPS, <120 ms P95; high precision on accepted actions; near-real-time catalog freshness; auditability and version compatibility.

# 4. ML objectives

This is **open-catalog semantic matching**, not a fixed 20K-way classification head. Optimize candidate **Recall@K** first, then top-1 match accuracy and **precision among accepted decisions** with abstention. If false execution is high cost, maximize supported-request coverage subject to a high final precision target. Evaluate unsupported-request false-accept rate separately.

# 5. Data

**Labeling approach:** Use a small expert gold set of requests paired with action IDs or UNSUPPORTED to engineer a teacher prompt around catalog descriptions. Generate multilingual paraphrases and confusable request–action pseudo-labels; validate schema, action existence and independent authorization rules.

**Quality and escalation:** Keep unseen-action and unsupported-intent human gold separate for validation and locked testing. If prompt engineering or supported soft-prompt tuning misses accepted-action precision, try teacher LoRA on development gold. Buy targeted human labels only if the remaining wrong-action cost warrants them.

**Prompt tuning** learns a small soft prompt while keeping base weights frozen; it requires model support. **LoRA** learns low-rank weight adapters. Neither uses validation/test gold for training.

**Feature engineering:** Encode request text and action descriptions; use exact parameter names, locale and permissions as separate eligibility features, not inferred authority.

**Catalog:** Curated action ID; concise functional description; aliases; example utterances in multiple languages; parameter schema; prerequisites; authorization scope; activation/expiry dates. Ensure descriptions differentiate actions that sound similar but have different effects.

**Training pairs:** (request, correct action) positives; confusable actions, permission mismatches, and unsupported queries as hard negatives. Use reviewer-approved text, not only noisy historical action execution logs (some executions are mistakes).

**Validation:** Time-based split reflecting unseen new actions and unsupported intents; verify generalization to descriptions never seen during training. Keep a special set for language, ambiguity, and wrong-action cost. Separate discovery/relevance labels from execution-eligibility checks.

# 6. Model and training

Use a multilingual Sentence-BERT (SBERT) bi-encoder. Embed each action description **offline** and each query **online**. The ANN index retrieves nearest candidates and typically returns similarity scores without re-encoding candidate text.

Benchmark the frozen bi-encoder first; if needed, train a small projection/head or adapter on checked positive and hard-negative pseudo-labeled pairs with contrastive loss. New actions can become searchable by embedding their definitions—**without retraining the model**.

A cross-encoder is **conditional**, not a default: compare retrieval Recall@K with top-1 accuracy, mean reciprocal rank (MRR), normalized discounted cumulative gain (NDCG@K), and final acceptance precision. If true actions are usually in top-K but rank poorly, cross-encode `(query text, action description)` for top-K. If Recall@K is low, fix retrieval first.

**Threshold:** Without a cross-encoder, choose top-1 using a calibrated similarity score. With one, threshold the verifier/reranker score (after calibration). `K` is the candidate budget, `T` is acceptability; ANN normally returns K even if none is truly relevant. A fake `NO_ACTION` embedding is unnecessary.

```text
if active_and_permitted(best) and score(best) >= T:
    return best_action_id
else:
    return UNSUPPORTED
```

A top-1/top-2 score margin can be diagnostic but is unreliable when multiple actions are legitimately similar; do not substitute it for gold-backed calibration.

## Training and inference cost estimate

**Assumptions:** 10K workflow requests/s; encode each once. An optional reranker scores 10 request–action pairs/request. The catalog contains 20K actions. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Frozen bi-encoder | None | 10K requests/s × 1 text encodings/request ÷ (5K text encodings/s/GPU) → 2 GPUs × ($4/GPU-h) = **$8/h** |
| Optional retrieval adapter | 200K pairs × 3 passes ÷ (500 pairs/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$1.33/run** | Same as baseline |
| Optional top-10 reranker | 200K pairs × 3 passes ÷ (500 pairs/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$1.33/run** | 10K requests/s × 10 pairs/request ÷ (5K pairs/s/GPU) → 20 GPUs × ($4/GPU-h) = **$80/h** |

# 7. Serving, freshness, and consistency

A 20K-vector catalog may be small enough for exact dense search; benchmark against ANN before adding operational complexity. At 768 dimensions in FP16, raw vectors are ~31 MB, so compute and metadata filtering may dominate rather than storage.

For daily updates, embed and insert new actions into a small delta index immediately; tombstone deleted actions and recheck active state at decision time; search main+delta, merge top-K, periodically compact. Version embeddings/indexes together on model updates. Never let a stale embedding authorize a retired or forbidden workflow.

Support retrieval/decision tracing for debugging and human correction. Keep executing actions **outside** the matcher and subject to independent authorization/parameter validation.

# 8. High-level architecture

<!-- system-design-diagram -->

**Key design choice:** The workflow catalog is curated; do **not** apply topic clustering to main/delta catalogs. The index's vector-space partitioning (e.g., IVF K-means) is an implementation detail, not semantic topic discovery.

# 9. Evaluation and diagnosis

| Layer | Metrics | Interpretation |
|---|---|---|
| Bi-encoder retrieval | Gold relevance Recall@K | Is the correct action among candidates? |
| ANN implementation | Approximate Recall@K vs exact vectors | Is index approximation losing neighbors? |
| Ranking | Top-1 accuracy, MRR, NDCG@K | Can the correct action rise to the top? |
| Final decision | Match precision/recall, supported coverage, unsupported false-accept rate | Is execution selection safe? |
| Operations | Freshness lag, stale-action errors, P95/QPS | Meets contract? |

**Diagnosis:** Recall@20 99% / top-1 82% → reranking/verification may help. Recall@20 75% → improve embeddings/examples/retrieval before reranking. High accepted precision but low coverage → threshold may be too conservative, provided labels are reliable.

# 10. Interview summary

> “Because the action set changes daily, I’d use bi-encoder semantic retrieval over versioned action definitions, not a 20K-class softmax. I’d measure Recall@K first and only add a cross-encoder if ranking is the bottleneck. Final top-1 acceptance is thresholded to maximize precision, with `UNSUPPORTED` as a legitimate outcome. Delta indexing plus tombstones makes new/removed actions take effect without model retraining.”
