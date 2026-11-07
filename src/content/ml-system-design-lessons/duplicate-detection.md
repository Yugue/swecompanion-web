# ML System Design: Semantic Duplicate Ticket Detection

# 1. Problem statement

Design a multilingual machine learning system that detects whether a newly submitted support ticket describes the same underlying issue as an existing ticket among 100 million historical tickets.

The system should return an existing canonical ticket ID if a duplicate is found, or NOVEL otherwise.

Examples:

| New ticket | Existing ticket | Duplicate? |
| --- | --- | --- |
| "I was charged twice for my subscription." | "My subscription payment was processed two times." | Yes |
| "My refund is still pending." | "My refund was rejected." | No |
| "No puedo iniciar sesión." | "I cannot log into my account." | Potentially, depending on the underlying issue |

The central challenge is distinguishing semantic similarity from true duplicate equivalence.

# 2. Requirement clarification: interviewer–candidate Q&A

In a Google L5 interview, I would clarify the business definition, data, scale, and error costs before proposing an architecture.

**Candidate** What exactly constitutes a duplicate?

**Interviewer** Two tickets describing the same underlying actionable issue, even if wording or language differs. Tickets about the same general topic aren't necessarily duplicates.

**Candidate** Should we return one canonical ticket or multiple similar tickets?

**Interviewer** Return one canonical ticket/group ID, or NOVEL if no valid match exists.

**Candidate** What languages and input fields do we support?

**Interviewer** Twenty languages. Each ticket contains a title, description, and optional product, error code, and version metadata.

**Candidate** Do we have historical duplicate labels or human-reviewed merges?

**Interviewer** Yes, historical merge decisions and reviewer feedback, although some labels are noisy or incomplete.

**Candidate** What's our scale, latency requirement, and update frequency?

**Interviewer** 100 million historical tickets, 1 million new tickets daily, 1,000 queries/second at peak, and P95 latency below 200 ms.

**Candidate** Which is more costly: missing a duplicate or incorrectly merging tickets?

**Interviewer** Incorrect merges are significantly more expensive. Prefer abstaining when uncertain.

These assumptions drive the design: high-recall candidate retrieval followed by high-precision duplicate verification.

# 3. Requirements

## Functional requirements

- Accept multilingual tickets with titles, descriptions, and optional metadata.
- Identify duplicates despite different wording or languages.
- Return the canonical ticket/group ID or NOVEL.
- Support new ticket ingestion and updates.
- Allow human reviewers to correct incorrect matches.

## Non-functional requirements

| Dimension | Assumed target |
| --- | --- |
| Historical corpus | 100M tickets |
| Daily ingestion | 1M tickets |
| Peak traffic | 1K QPS |
| P95 latency | Under 200 ms |
| Languages | 20 |
| Primary quality priority | High precision |
| Freshness | New tickets searchable within seconds/minutes |

# 4. ML objectives

We decompose the problem into two ML tasks.

## Objective A: Candidate retrieval

Given a new ticket \(q\), retrieve the top-K tickets most likely to contain a true duplicate.

Primary metric: Recall@K, measured using ground-truth duplicate relationships.

For example:
Recall@20 = 98% means 98% of test queries with known duplicates have at least one valid duplicate among their top-20 candidates.

We prioritize high recall because subsequent stages cannot recover a missing candidate.

## Objective B: Duplicate verification

For each retrieved ticket \(d\), predict:
\[
P(\text{duplicate}\mid q,d)
\]

Optimize final duplicate precision and recall, with a strong penalty for false merges.

For example, we may target:

- At least 99% precision on automatically accepted matches.
- Maximum achievable duplicate recall under that precision constraint.
- A manual-review path for ambiguous cases.

These targets must be calibrated on representative validation data, not assumed to be achievable.

# 5. Data

This section should come before model selection because the available labels determine how we train and evaluate the system.

## 5.1 Data sources

| Source | Information | Purpose |
| --- | --- | --- |
| Historical tickets | Title, description, language, metadata | Input corpus |
| Resolved duplicate groups | Confirmed equivalent ticket IDs | Positive training pairs |
| Rejected merge suggestions | Reviewer-confirmed nonduplicates | Hard negatives |
| Human-reviewed samples | Verified duplicate / nonduplicate labels | Reliable evaluation |
| Production feedback | Accepted/reverted merges | Active learning and monitoring |

We should not assume every historical merge is correct or every unmerged pair is a true negative.

## 5.2 Data preprocessing

For each ticket:

1. Remove irrelevant boilerplate, signatures, and duplicated email chains.
2. Normalize obvious formatting differences.
3. Preserve important details such as error codes, product names, version numbers, and negation.
4. Detect language if needed.
5. Remove or protect personally identifiable information before training.
6. Construct a consistent input representation.

Example:

```text
Title: Double subscription charge
Description: My card was debited twice this month.
Product: Premium Subscription
Error code: N/A
```

Avoid excessive normalization that could erase details distinguishing genuinely different issues.

## 5.3 Building training pairs

### Positive pairs

Tickets confirmed as belonging to the same canonical issue group.

```text
A: My subscription was charged twice.
B: Two identical subscription payments were taken.
Label: 1
```

### Easy negative pairs

Clearly unrelated tickets.

```text
A: Subscription charged twice.
B: Password reset email never arrived.
Label: 0
```

### Hard negative pairs

Semantically similar tickets that are not duplicates.

```text
A: My refund is pending.
B: My refund was rejected.
Label: 0
```

Hard negatives are especially important because the model must distinguish the same problem from merely related problems.

We can mine hard negatives using an initial SBERT model: retrieve high-similarity candidates, exclude known positives, and send uncertain pairs for human review. We must not label all unmerged pairs as negatives automatically.

## 5.4 Train / validation / test splitting

Use time-based splits for realistic production evaluation.

Example:

- Training: older historical data.
- Validation: more recent reviewed tickets.
- Test: newest held-out tickets.

Avoid leaking duplicated or near-identical examples across splits in a way that makes generalization appear artificially strong.

For retrieval evaluation, simulate the historical index as it existed at each query's timestamp. This prevents future tickets from appearing as retrieval candidates.

Also measure performance by language, issue category, and rare product/error-code combinations.

# 6. High-level architecture

The central design is **retrieve → verify → decide**.

<!-- system-design-diagram -->

## Why two stages?

A cross-encoder can compare two tickets accurately but cannot efficiently compare every incoming query against 100 million tickets.

The bi-encoder performs efficient candidate generation. The cross-encoder spends more computation on only the most promising pairs.

# 7. Stage 1: Candidate retrieval with multilingual SBERT

## Model selection

Start with a pretrained multilingual Sentence-BERT (SBERT) bi-encoder.

It independently converts the incoming ticket and historical tickets into embeddings.

```text
New ticket → SBERT → query embedding

100M historical tickets
→ SBERT offline
→ stored embeddings
```

At query time, Approximate Nearest Neighbor (ANN) search retrieves the most similar historical embeddings.

## Training

Fine-tune with contrastive learning:

- Anchor: incoming ticket.
- Positive: confirmed duplicate.
- Negatives: unrelated and hard-negative tickets.

A multiple-negatives ranking loss is a reasonable starting point.

We want positive ticket pairs close in embedding space and nonduplicate pairs farther apart.

## ANN index

Potential choices:

| Method | Trade-off |
| --- | --- |
| HNSW | Strong recall and dynamic insertion support, but higher memory cost |
| ScaNN | Efficient large-scale retrieval with optimized partitioning/scoring |
| IVF-PQ | Reduces memory with compression, potentially lowering recall |

For 100 million vectors, benchmark several approaches under the actual memory, update, and latency constraints.

Primary evaluation: Recall@K against verified duplicate relationships.

Remember that semantic Recall@K is different from the ANN implementation's recall relative to exhaustive exact-vector search.

# 8. Stage 2: Duplicate verification with a cross-encoder

A bi-encoder finds semantically related tickets. It may not reliably distinguish subtle differences such as:

- "Refund requested" versus "Refund rejected."
- "Cannot sign in" versus "Account permanently disabled."
- Same error message but different product versions or root causes.

A cross-encoder jointly processes each query–candidate pair:

```text
[CLS] New ticket [SEP] Candidate ticket [SEP]
                   ↓
              Cross-encoder
                   ↓
         Duplicate match score
```

It allows direct token-level interaction between both descriptions.

## Training

Use labeled duplicate/nonduplicate pairs and binary cross-entropy loss.

Prioritize hard negatives: semantically similar but genuinely different issues.

## Decision

Assume the cross-encoder returns:

| Candidate | Score |
| --- | --- |
| Ticket #1042 | 0.96 |
| Ticket #8100 | 0.67 |
| Ticket #9031 | 0.19 |

Choose the highest-scoring valid candidate and apply a threshold calibrated on held-out data.

```python
if best_score >= threshold:
    return canonical_id
else:
    return "NOVEL"
```

For expensive false merges, optimize the threshold for high precision, with ambiguous cases routed to human review.

A cross-encoder is not automatically mandatory. If the bi-encoder's ranking and thresholded final metrics are already sufficient, omit it to save latency and cost.

# 9. Continuous ingestion and canonical groups

Maintain two logical components:

## Vector indexes

```text
100M historical tickets → Main ANN index
New tickets             → Delta ANN index

Search both → merge top-K candidates
```

New ticket embeddings are inserted promptly into the delta index, while periodic compaction moves them into the main index.

## Canonical issue mapping

```text
Ticket #100 → Group A
Ticket #101 → Group A
Ticket #102 → Group B
```

When a duplicate is verified, associate it with the canonical group. Otherwise, create a new group.

Do not assume that pairwise semantic similarity is perfectly transitive: A≈B and B≈C do not guarantee A≈C. Protect against erroneous chained merges with group-level validation.

For deletions, apply tombstones or immediate exclusion; for model upgrades, maintain consistent embedding versions and reindex as necessary.

Clustering methods such as K-means or HDBSCAN are not the default way to decide strict duplicate equivalence.

# 10. Evaluation and diagnosis

| Component | Metric | Interpretation |
| --- | --- | --- |
| Retriever | Recall@20 | Did we retrieve a true duplicate? |
| ANN implementation | Recall vs exact search | How much recall does approximation lose? |
| Ranking | MRR / NDCG@K | Are true duplicates ranked near the top? |
| Final verification | Precision | How many accepted duplicates are valid? |
| Final verification | Recall | How many actual duplicates are recovered? |
| Final verification | False-merge rate | How frequently do we merge incorrectly? |
| Production | P95 latency, QPS | Can the system serve required traffic? |

## Diagnosing quality

If Recall@20 is 75%, focus on retrieval: improve the encoder, hard-negative training, candidate filters, or ANN index settings.

If Recall@20 is 99%, but top-1 accuracy and final precision are poor, invest in verification quality, pairwise hard negatives, and threshold calibration.

Online monitoring can track merge reversals, score distributions, unmatched rates, drift, and per-language quality. Representative human-reviewed labels are still required to estimate production precision and recall.

# 11. Scaling and capacity estimation

For 100 million embeddings, each containing 768 FP16 values:
\[
100M \times 768 \times 2 \approx 154\text{ GB}
\]

That is raw embedding storage only, excluding metadata, ANN structures, replicas, and serving overhead.

An illustrative latency budget for P95 below 200 ms:

| Component | Budget |
| --- | --- |
| Preprocessing + SBERT | 20 ms |
| ANN search | 30 ms |
| Cross-encoder top-20 | 100 ms |
| Decision/network overhead | 30 ms |
| Total | 180 ms |

Actual feasibility must be benchmarked; inference batch size, hardware, sequence length, shard fan-out, and tail latency matter significantly.

The highest-impact optimizations are cross-encoder distillation, batching pair evaluations, tuning K, and ANN compression/sharding.

# 12. Final interview summary

> “I would first clarify whether duplicates mean the same topic or the same actionable issue, since that determines our labels and false-merge risk. Given 100 million multilingual tickets and a strict precision requirement, I'd build a two-stage system. A fine-tuned multilingual SBERT encoder retrieves top-20 candidates through ANN, optimizing Recall@20. Then a cross-encoder verifies true duplicate equivalence, with a precision-calibrated threshold to return an existing canonical group or NOVEL. I'd train using historical merges, reviewer-confirmed nonduplicates, and especially hard negatives. Finally, I'd support fresh ticket ingestion using main and delta indexes, evaluate retrieval separately from final duplicate precision and recall, and monitor incorrect merges through human feedback.”

The most important design principle: retrieval must find the possible duplicate; verification must determine true equivalence; the acceptance threshold controls the risk of merging incorrectly.
