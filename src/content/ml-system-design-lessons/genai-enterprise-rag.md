# Enterprise retrieval-augmented generation (RAG) assistant

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design an assistant that answers employee questions using millions of internal documents (wiki pages, PDFs, tickets, policies) and **cites the evidence**. Documents change daily and have different access permissions. If retrieved passages cannot support an answer, the assistant must abstain rather than hallucinate.

Example: “What is our reimbursement policy for international travel?” → cited explanation reflecting the latest policy the asking employee is allowed to view.

# 2. Clarification Q&A

| Candidate asks | Interviewer answers (assumed) | Design consequence |
|---|---|---|
| What sources and formats? | 20M pages, PDFs, wiki, ticket notes. | Extraction, document structure, connectors. |
| How fresh? | Updates searchable within 5 minutes; policy deletions immediate. | Incremental indexing, tombstones. |
| What permissions? | Per-document and sometimes per-section access control. | Enforce authorization **before** LLM context assembly. |
| Is citation/abstention mandatory? | Yes; no unsupported claims. | Grounding checks, claim-level citations. |
| Scale and latency? | 500 queries/sec peak, P95 < 3 seconds. | Two-stage retrieval and constrained generation. |
| Are multiple documents sometimes needed? | Yes; answers may combine several sources, with conflicts. | Multi-hop retrieval and conflict handling. |
| Can we use hosted foundation models? | Yes, subject to data residency/security approval. | Benchmark managed versus self-hosted generation. |

# 3. Requirements

**Functional:** ingest and parse authorized sources; handle natural-language questions; retrieve across sources; answer with document/page links; cite key claims; say “insufficient evidence” when needed; respect tenant/user permissions; reflect edits and deletions.

**Non-functional:** strong confidentiality/isolation; freshness SLA; stable P95 latency; auditability; quality across departments/languages; fault tolerance; reasonable cost per answer.

# 4. ML objectives

This is **not** a single-model accuracy problem. Optimize the pipeline:

1. **Evidence retrieval:** high answer-supporting evidence Recall@K, not only semantic overlap.
2. **Ranking:** relevant, authoritative, current, permitted passages near the top (NDCG@K / MRR where suitable).
3. **Generation:** grounded, complete, useful answer conditional on evidence.
4. **Abstention:** high precision when claiming the evidence is sufficient; low unsupported-answer rate.
5. **Citations:** cited spans genuinely entail claims; measure claim-level citation precision/recall.

Use hard business constraints: **unauthorized-content leakage rate ≈ 0** and low unsupported-claim rate. Optimize answer coverage subject to these constraints.

# 5. Data

**Labeling approach:** Generate question–passage–answer pseudo-labels from authorized documents with a prompted LLM teacher. A small human gold set teaches citation, abstention and conflicting-version rules; reject unsupported claims with evidence checks. Do not fine-tune the generator merely to memorize changing policies.

**Quality and escalation:** Use separate gold for prompt development, validation and locked document-family/time tests. If prompt engineering or supported soft-prompt tuning fails after retrieval is fixed, try teacher LoRA on development gold. Fund targeted human answers only for valuable remaining gaps.

**Prompt tuning** learns a small soft prompt while keeping base weights frozen; it requires model support. **LoRA** learns low-rank weight adapters. Neither uses validation/test gold for training.

**Feature engineering:** Use heading-aware chunks, BM25 terms, dense embeddings, ACL, authority and version metadata; reranking combines query/passage relevance with valid evidence.

**Sources:** documents + canonical URL, document ID, owner, update timestamp, ACL, source type, section hierarchy, version, language; historical user questions and independently reviewed answers; user feedback and search logs (with privacy safeguards).

**Ingestion:** connector → parse/OCR where necessary → document normalization → heading/section-aware chunking → metadata/ACL attachment → sparse (BM25) index + dense embeddings index. Retain the original document and offsets to produce real citations. Avoid arbitrary fixed-size chunks splitting tables, procedures, or conditions. A typical starting chunk length is 300–800 tokens with selective overlap; validate empirically on recall and citation fidelity.

**Training/evaluation data:** question → relevant evidence passages → ideal answer → supported/unsupported flag → per-claim evidence pointers. Include adversarial or hard cases: access-denied answers, nonexistent policies, conflicting revisions, ambiguous questions, missing facts, stale procedures, prompt injection inside documents.

**Label leakage:** split by document family/version and time; otherwise near-identical passages across splits inflate retrieval metrics. If employee documents are sensitive, do not send them to external teachers without authorization.

# 6. Models, training, and prompting

- Start with a capable pretrained embedding model. Only if baseline recall is inadequate, adapt with checked teacher (query, supporting passage) positives and **hard negatives** from same-topic but wrong-answer documents; optimize contrastive retrieval.
- Add a cross-encoder reranker if evidence Recall@20 is strong but NDCG/top-5 usefulness poor. Train on explicit relevance grades; don't confuse ANN approximate recall with ground-truth evidence recall.
- Start generation with a pretrained instruction-tuned large language model (LLM). The instruction should require cited claims, distinguish quoted evidence from instructions, and declare insufficient evidence. Use LoRA only if prompt+RAG baselines cannot meet tone, format, or domain behavior requirements at acceptable cost.
- Support question decomposition for genuinely multi-hop queries, but do not automatically invoke multiple rounds for simple lookups.
- Optionally add a lightweight answerability/evidence sufficiency verifier trained on supporting and non-supporting retrieved contexts. A high cosine similarity score alone does **not** imply the answer is present.

## Training and inference cost estimate

**Assumptions:** 500 questions/s; rerank 20 passages/question. One generation/question processes 4K input tokens and produces 300 output tokens. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Retrieval encoder | None | 500 requests/s × 1 query encodings/request ÷ (5K query encodings/s/GPU) → 1 GPU × ($4/GPU-h) = **$4/h** |
| Top-20 reranker | None | 500 requests/s × 20 pairs/request ÷ (5K pairs/s/GPU) → 2 GPUs × ($4/GPU-h) = **$8/h** |
| Prompted RAG generator | None | 2M input tokens/s ÷ (10K input tokens/s/GPU) → 200 GPUs; 150K output tokens/s ÷ (2K output tokens/s/GPU) → 75 GPUs. (200 + 75) GPUs × ($4/GPU-h) = **$1,100/h** |
| Optional adapter | 10M tokens × 3 passes ÷ (500 tokens/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$66.67/run** | Same serving cost as baseline |

# 7. Serving, scale, and production lifecycle

- **Latency:** split budget across identity/auth, hybrid retrieval, rerank, prefill, token generation, checks. Generation often dominates; stream user-visible output only if policy permits provisional text.
- **Context:** select diverse evidence up to a token budget; remove duplicate snippets, preserve exact cited anchors; adding more irrelevant context can hurt quality.
- **Freshness:** updates produce versioned upserts; deletes/ACL changes must invalidate cached snippets immediately, independent of slow embedding refresh.
- **Caching:** cache retrieval or final answers only with identity/ACL, document versions, and expiration in the cache key. Never share private results across users by accident.
- **Prompt injection:** fetched documents are untrusted data. Do not execute instructions embedded in them; keep source text segregated and strip tool authority.
- **Conflicting policies:** prefer current authorized source-of-truth; if evidence genuinely conflicts, surface it or abstain rather than silently inventing a resolution.

# 8. High-level architecture

<!-- system-design-diagram -->

**Why hybrid?** Dense search handles paraphrases; lexical search is important for exact document IDs, error codes, names, and legal phrases. Rerank only when retrieval Recall@K is already high but top-result quality is weak.

**Access control:** do not retrieve unauthorized snippets and hope the LLM ignores them. Apply ACL-safe filtering in retrieval and recheck before passing content into context, including cached results. Index partitioning, ACL-aware filters, and identity-aware caches may be required.

# 9. Evaluation and diagnostics

| Stage | Offline metrics | Typical failure |
|---|---|---|
| Retrieval | Evidence Recall@5/20, per-source/language coverage | Missing the necessary clause |
| Ranking | NDCG@K, MRR, precision of selected passages | Wrong version ranked first |
| Answer | Claim-level groundedness/entailment, completeness, exact factual checks | Plausible but unsupported statement |
| Citations | Claim-to-source support precision/recall | Citation points to irrelevant text |
| Abstention | Supported-query coverage vs unsupported answer rate | Answers when evidence is absent |
| Security | Access-control penetration tests, leakage incidents | Cross-user document exposure |
| Product | Human task success, correction rate, P95 latency, $/answer | Slow/expensive answers |

**Diagnosis:** Low evidence Recall@K → parser/chunks/retriever/index. High evidence Recall@K but poor answer → reranking, context assembly, prompt, generator, or verifier. Hallucinations when no evidence → answerability/abstention design. Online thumbs-up is not a substitute for labeled factuality audits.

# 10. Trade-offs and interview summary

**Trade-offs:** larger chunks improve context but reduce precise evidence; reranking improves relevance but costs latency; fully generative answers improve usability but require grounding; pre-filter permissions are nonnegotiable. Do not assume fine-tuning makes an LLM know rapidly changing documents.

> **Interview answer:** “I separate ingestion from online answering. I build versioned, ACL-aware dense and lexical indexes over structured chunks, retrieve a high-recall candidate set, optionally rerank it, and feed only permitted evidence into an LLM. I require source-backed claims, verify evidence sufficiency, abstain when needed, and monitor retrieval recall separately from factuality, citation quality, permissions, freshness, latency, and cost.”
