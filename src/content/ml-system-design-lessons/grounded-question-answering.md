# Answer Questions from Company Documents

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Build an enterprise question-answering assistant that gives **grounded, cited answers** from a large, frequently changing set of internal company documents. If the available evidence does not support an answer, **abstain** rather than fabricate.

Example: “What is the latest documented refund exception policy in Canada?” → answer with citations to authorized, current policy passages—or explain that evidence is insufficient.

# 2. Clarification Q&A

**Candidate:** Are sources unstructured documents, structured databases, or both?  
**Interviewer:** Mostly documents—wikis, PDFs, tickets, and internal guides. Structured queries can be considered an extension.

**Candidate:** Do documents have access restrictions?  
**Interviewer:** Yes; each user may only access authorized documents.

**Candidate:** Are sources frequently updated and occasionally contradictory?  
**Interviewer:** Yes. Prefer the latest authoritative applicable document and surface uncertainty.

**Candidate:** Must answers include citations and abstain when unsupported?  
**Interviewer:** Yes, cite relevant passages, do not answer without sufficient evidence.

**Candidate:** What scale and service target?  
**Interviewer:** Tens of millions of chunks, documents change continuously, 500 QPS, P95 below roughly 3 seconds.

# 3. Requirements

**Functional:** Natural-language queries; retrieve authorized and relevant internal evidence; answer with passage-level citations; handle versions and conflicting sources; abstain or ask clarification for unanswered/ambiguous questions; support follow-up questions if requested.

**Non-functional:** ACL-safe retrieval and generation, timely update/delete propagation, availability, P95 within seconds, auditable responses, cost controls and personal data protection.

# 4. ML objectives

Split into **retrieval** and **answer generation/verification**:

1. Retrieval: retrieve sufficient relevant evidence → Recall@K, nDCG@K, evidence coverage.
2. Answerability: determine whether retrieved passages actually support the requested answer → calibrated abstention accuracy, false-answer rate.
3. Generation: grounded factual accuracy, completeness, citation precision/recall, and safe handling of contradictions.

**Key distinction:** A high vector similarity score does **not** prove the passage answers the question.

# 5. Data

**Labeling approach:** Prompt a teacher over authorized source passages to generate questions, evidence spans, answers and unanswerable counterexamples. Use a small human gold set to engineer the rubric and audit supported-claim precision; reject invented citations and answers without source evidence.

**Quality and escalation:** Keep document-family-separated human validation and locked tests outside prompt tuning and generation. Tune prompts or supported soft prompts before teacher LoRA on development gold. Add targeted human training answers only if evidence-grounded quality still fails and the task merits the cost.

**Prompt tuning** learns a small soft prompt while keeping base weights frozen; it requires model support. **LoRA** learns low-rank weight adapters. Neither uses validation/test gold for training.

**Feature engineering:** Use section-aware chunks, sparse terms, dense passage/query embeddings, authority, recency and ACL metadata; preserve page/table evidence pointers.

**Sources:** Documents and their titles, authors, modification dates, authority tiers, access-control lists (ACLs), version histories, and stable source URLs/IDs. Extract PDF pages and tables with structural context; preserve headings, section boundaries, and citations.

**Chunking:** Split by semantic section/paragraph or sliding window (~300–800 tokens as a starting benchmark), add overlap sparingly, and retain document ID, section/page, timestamps, and permissions per chunk. Never lose table headers or policy qualification clauses through blind token slicing.

**Labels:** Teacher-generated question → checked evidence passage(s) → grounded reference answer, including deliberately unanswerable and contradictory-source questions. Incorporate logged queries and reviewer corrections after privacy filtering. Split by time/document version so the test simulates future content and updated policies.

# 6. Models and training

**Retriever:** Start with hybrid dense embeddings + BM25; lexical search matters for document identifiers, policy numbers and exact strings. Fine-tune retrieval embeddings on `(question, relevant passage)` pairs with hard negatives if baseline Recall@K is weak. **Reranker:** Optional cross-encoder over top-N when high recall but weak ranking wastes context budget.

**Generator:** Start with a capable LLM prompted to answer **only** from evidence and cite exact supplied source IDs. A learned answerability verifier can decide if evidence is sufficient; calibrate this against unsupported-question test cases. For critical claims, use claim-to-evidence entailment checking or human auditing; a second LLM judge is a proxy, not unquestioned ground truth.

**Conflicts:** Version dates and source authority should be explicit, with the assistant declining unsupported reconciliation rather than silently choosing a convenient passage.

## Training and inference cost estimate

**Assumptions:** 500 questions/s; rerank 20 passages/question. Generate one answer/question with 2K input tokens and 200 output tokens. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Frozen query encoder | None | 500 requests/s × 1 query encodings/request ÷ (5K query encodings/s/GPU) → 1 GPU × ($4/GPU-h) = **$4/h** |
| Passage reranker | None | 500 requests/s × 20 pairs/request ÷ (5K pairs/s/GPU) → 2 GPUs × ($4/GPU-h) = **$8/h** |
| Prompted grounded generator | None | 1M input tokens/s ÷ (10K input tokens/s/GPU) → 100 GPUs; 100K output tokens/s ÷ (2K output tokens/s/GPU) → 50 GPUs. (100 + 50) GPUs × ($4/GPU-h) = **$600/h** |
| Optional teacher LoRA | 10M tokens × 3 passes ÷ (500 tokens/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$66.67/run** | Same serving cost as baseline |

# 7. Serving, updates, and scaling

Maintain event-driven reindex for updated docs, delete tombstones, cache safe query/results with ACL and index-version keys, and use a recency/authority filter. Bound context tokens and prefer reranked high-value evidence. Separate retrieval latency, LLM prefill, and autoregressive decoding budgets; sample token count and benchmark actual tokens/sec/GPU rather than assuming subsecond generation.

For large document corpora, index can be sharded by tenant/permission domain or by corpus section where appropriate; avoid unnecessary cross-shard fanout. Document citations must resolve to valid current passages, not only stable-looking URLs.

# 8. High-level architecture

<!-- system-design-diagram -->

**Security:** Enforce access before disclosing text to the LLM and during retrieval; post-hoc filtering alone is not a dependable privacy boundary. Never treat instructions found inside retrieved documents as system instructions (prompt injection).

# 9. Evaluation and diagnosis

| Stage | Metrics |
|---|---|
| Retrieval | Evidence Recall@K, nDCG@K, coverage of required facts |
| Answerability | Unsupported-answer false-positive rate, abstention precision/recall |
| Generation | Claim-level groundedness/factuality, completeness, correct citation precision/recall |
| Safety | ACL leakage incidents, prompt-injection success tests |
| Operations | Source freshness, P95 latency, output tokens and cost |

**Diagnosis:** Correct source absent from top-K → retriever/chunking/BM25 issue. Source present but answer wrong → reranking/context formatting/LLM generation issue. Correct answer with citations to unrelated passages → citation verification failure. Conflicting policies → metadata/authority handling, not a larger LLM by default.

**Extension — structured databases:** If needed, add a separate schema retrieval → constrained text-to-SQL → parse/type/read-only authorization → safe execution branch. Measure **SQL execution accuracy**, not just exact query text. Do not blend SQL generation into document-only retrieval without safeguards.

# 10. Interview summary

> “I'd use ACL-filtered hybrid retrieval with section-aware chunks, optional reranking, and an LLM that receives only cited authorized evidence. A separate answerability/grounding check drives abstention. I'd treat source authority, timestamps and document deletions as first-class requirements, and evaluate evidence retrieval separately from factuality, citation correctness, and ACL safety.”
