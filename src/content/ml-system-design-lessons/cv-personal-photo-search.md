# Search personal photos using natural-language queries

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design a Google Photos–like feature: a user can type **“my dog running on the beach at sunset”** and retrieve their relevant photos from a personal library. It should understand concepts absent from filenames or metadata and must never expose photos belonging to another user.

# 2. Interviewer–candidate clarification Q&A

**Candidate:** Is this semantic retrieval over one user's library or a public internet-wide index?  
**Interviewer:** A private per-user library; tens of billions of images globally, typically thousands per user.

**Candidate:** Text-to-image only, or also image-to-image queries?  
**Interviewer:** Text queries first; image-to-image is a future extension.

**Candidate:** Are metadata such as date, GPS, album and OCR text searchable?  
**Interviewer:** Yes; users may ask “the red car I saw in Montreal last summer.”

**Candidate:** Does the system need exact matches, or ranked top results?  
**Interviewer:** Ranked results. Optional filters can be exact; rank the remaining results by relevance.

**Candidate:** How quickly must new images become searchable, and what is latency?  
**Interviewer:** Within a minute of upload; P95 under 250 ms for search (excluding photo display).

**Candidate:** Do we have relevance labels?  
**Interviewer:** Some human-reviewed query–image pairs, privacy-safe opt-in feedback and aggregate interaction signals; coverage is incomplete.

# 3. Functional / non-functional requirements

**Functional:** Search using free-form descriptions; return ranked photos with thumbnails; respect ownership and sharing permissions; support date/location/entity filters; index uploads/deletions promptly; optionally handle multilingual queries.  
**Non-functional:** Global scale in the billions of images; P95 search <250 ms; strong isolation and deletion compliance; robust retrieval for unusual queries; controlled embedding/index cost.

# 4. ML objectives

- **Candidate retrieval:** Maximize human-relevance **Recall@K** (e.g., Recall@100).
- **Final ranking:** Optimize **NDCG@10** (normalized discounted cumulative gain) and **Precision@10**; use graded relevance when available.
- **Product:** Query success rate, time-to-first-useful-photo, filter correctness, per-language quality, and exposure of inaccessible images (must be zero).
- Track indexing freshness, not just model quality.

A fixed K retrieved from an approximate nearest neighbor (ANN) index is not the same as a score acceptance threshold. Unlike strict entity linking, general photo search often returns a ranked list even if relevance is weak; an explicit “no results” decision is product-dependent.

# 5. Data and labels

**Labeling approach:** Start with frozen vision-language embeddings. Use a small consented human query–photo gold set to prompt a multimodal LLM teacher for captions and relevance pseudo-labels, including compositional hard negatives. Check image evidence; clicks remain noisy behavioral evidence.

**Quality and escalation:** Hold out people/libraries, near-duplicates and time in human validation/tests. Improve prompts or supported soft prompts before teacher LoRA on development gold. Buy targeted human relevance labels only if retrieval gaps remain important enough to justify them.

**Prompt tuning** learns a small soft prompt while keeping base weights frozen; it requires model support. **LoRA** learns low-rank weight adapters. Neither uses validation/test gold for training.

**Feature engineering:** Combine image/text embeddings with permitted date, location and OCR filters; ownership/ACL checks remain deterministic and embeddings share a version.

- **Images:** Consent-authorized photos and derivative thumbnails; retain EXIF/time/location separately where allowed; secure embeddings under equivalent access policies.
- **Positive pairs:** Teacher-labeled query–photo matches checked against gold; natural image captions; user queries linked to selected relevant photos (weakly supervised).
- **Negatives:** Random mismatches, plus hard negatives that share objects but not the requested scene (“dog on grass,” “beach without dog”).
- **Bias:** Clicks encode position and exposure bias; correct through randomized evaluation, propensity estimation where feasible, and independent human-gold sets.
- **Splits:** Time split; prevent near-duplicate photo leakage and evaluate by language, scene, rare concept, and user-library size. Never mix sensitive content or user data into public training without valid authorization.

# 6. Modeling and training

Start from a contrastively pretrained vision-language model, such as **Contrastive Language–Image Pretraining (CLIP)**. It learns an image encoder and text encoder whose compatible outputs occupy a shared embedding space.

- Image encoder: pretrained Vision Transformer (ViT); image embedding precomputed on upload.
- Text encoder: tokenize query and compute one embedding online.
- Normalize embeddings to unit length; use cosine similarity (equivalent to dot product for unit vectors).
- Keep the pretrained encoders frozen initially. If needed, train a projection or supported adapter with contrastive InfoNCE on checked teacher query–image pairs and diverse in-batch/hard negatives. Avoid treating every unlabeled image as a definitively irrelevant negative.
- Optional: image-caption generation/OCR to strengthen text retrieval; hybrid keyword retrieval improves exact text, names and locations.
- Reranker: image–text cross-attention model only if **Recall@K is strong** but ranking quality is poor and latency permits.

## Training and inference cost estimate

**Assumptions:** 1K queries/s; one text encoding/query; 10B photos in the initial backfill. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Frozen CLIP online queries | None | 1K requests/s × 1 query encodings/request ÷ (5K query encodings/s/GPU) → 1 GPU × ($4/GPU-h) = **$4/h** |
| Photo embedding backfill | None | 10B photos/backfill ÷ (1K photos/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$11,111.11/backfill** |
| Optional projection/adapter | 1M pairs × 3 passes ÷ (200 pairs/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$16.67/run** | 1K requests/s × 1 query encodings/request ÷ (5K query encodings/s/GPU) → 1 GPU × ($4/GPU-h) = **$4/h** |

# 7. Serving and scalability

- At 10 billion photos × 768 dimensions × FP16 (2 bytes), raw embeddings ≈ **15.4 TB** before replicas, graph/index structure and metadata. Compression/sharding may be necessary.
- Most embedding computation happens on upload; query encoding is online.
- Prefer tenant-aware partitions, metadata filters, and efficient ANN (HNSW, ScaNN, IVF/PQ depending update/memory trade-offs).
- Delta indexes for fresh uploads; tombstone deletions immediately and compact. Plan reindexing for encoder version upgrades.
- Cache safe per-user popular queries only with permission/version-aware keys; beware stale sharing permissions.

# 8. Architecture

<!-- system-design-diagram -->

**Critical:** Enforce access control within retrieval or using a guaranteed permission-safe filtering layer, not just a best-effort last-minute UI filter. An image index spanning all users requires tenant-safe scoping and adversarial tests.

# 9. Evaluation and production failures

**Offline:** Recall@K and NDCG@K on human relevance labels, ANN recall versus exhaustive search, category and language slices.  
**Online:** Search success, reformulation rate, click/long-open rate, P95, index delay, privacy/access violations.  
**Failures:** Ambiguous descriptions; precise text visible in images (OCR); rare people/objects; changing model embeddings; duplicate photos crowding results; user privacy leakage. Diversification and duplicate suppression can improve user experience.

**L5 decision:** Start CLIP-like bi-encoder + tenant-safe ANN; add hybrid metadata/OCR and a reranker only for demonstrated gaps. Never trade correctness of permissions for ranking gains.

# 10. One-minute interview summary

> “I’d use a pretrained contrastive image–text encoder, index image embeddings asynchronously, use tenant-scoped ANN for high Recall@K, and rerank only if NDCG remains weak. I’d enforce permissions and fast deletion outside model scoring.”
