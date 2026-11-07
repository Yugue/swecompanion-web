# Visual product search from an uploaded photo

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

A shopper uploads a photo of a chair or sneaker. Find **the exact catalog product/variant when identifiable**, or otherwise return visually similar purchasable items. The system must handle cluttered backgrounds, unseen products, and a frequently changing catalog.

# 2. Interviewer–candidate clarification Q&A

**Candidate:** Exact SKU identification or visually similar recommendations?  
**Interviewer:** Both: exact match if confidence is high, else visually similar options marked as such.

**Candidate:** Does the image contain one product or multiple?  
**Interviewer:** May contain multiple; allow user-selected object or automatically detect the main product.

**Candidate:** How large and dynamic is the catalog?  
**Interviewer:** Ten million SKU/variants; many daily adds, removals and stock updates.

**Candidate:** Are color, size, brand and price strict requirements?  
**Interviewer:** Exact variants must honor those attributes; similarity results may relax some.

**Candidate:** What latency?  
**Interviewer:** P95 under 400 ms to show initial results.

**Candidate:** Do we have multiple images per SKU?  
**Interviewer:** Usually several catalog images plus limited user image–product matches.

# 3. Requirements

**Functional:** Upload image; identify/crop object; retrieve likely exact SKU + ranked alternatives; obey catalog availability and explicit filters; update catalog rapidly; return `NO_EXACT_MATCH` when exact identification is uncertain.  
**Non-functional:** Large-index throughput, low P95 latency, high precision for exact matches, robustness to viewpoint/background/lighting, rapid item updates.

# 4. ML objectives

- **Retrieval:** Catalog-item Recall@K and NDCG@K/Precision@K for visually relevant results.
- **Exact identification:** Precision/recall for correct SKU/variant, with a conservative acceptance threshold; use false exact-match rate.
- **Detection/cropping:** Box localization AP/IoU when object detection is needed.
- **Business:** Search-to-product-click, product-detail satisfaction, out-of-stock exposure, diversity.

The primary outcome contains two distinct decisions: which catalog items are similar and is the highest ranked one actually the identical variant?

# 5. Data

- Catalog images plus SKU attributes: brand, model, color, size, style, product category, availability, merchant.
- Positive pairs: multiple views of same SKU, verified user-image matches, labeled visually interchangeable items (for similarity objective).
- Hard negatives: same model different color, different model same color, near-identical packaging, competing products.
- Captured photos vary in occlusion, angle, lighting and clutter; augment appropriately and train on genuine user imagery.
- Split by SKU/product family and time to test generalization to new inventory; watch leakage from duplicate merchant photos.
- Maintain **canonical catalog IDs**; raw duplicate merchant listings need separate entity resolution before building ground truth.

# 6. Architecture

<!-- system-design-diagram -->

For a photo containing multiple objects, first detect candidates and ask the user which one to search (or choose based on attention/centrality with a clear correction UI).

# 7. Models and training

- **Retrieval:** ViT/CLIP-style image encoder or domain-tuned metric-learning encoder. Supervised contrastive or triplet loss: bring multiple views of same product closer; hard negatives distinguish variants.
- **Multi-view catalog items:** Store multiple embeddings per SKU or aggregate carefully; multiple vectors improve recall but require deduplication during ranking.
- **Reranker / exact verifier:** Cross-attention or image-pair model for fine-grained comparison; combine product metadata and high-resolution visual evidence.
- **Detection/segmentation:** Lightweight object detector or Segment Anything Model (SAM)-like segmentation if clutter affects search; benchmark computational cost.
- Use explicit attribute filters for **hard constraints** (e.g., exact size, in-stock) rather than assuming cosine similarity enforces them.

# 8. Serving and updates

- Catalog embeddings precomputed asynchronously; user image encoded online.
- Query ANN with main+delta for fresh products; tombstone removed/deactivated SKUs immediately; availability updated via metadata rather than full re-embedding.
- Fine-grained verifier only top-N if Recall@K high but exact-match precision inadequate.
- Model re-embedding migration must avoid comparing vectors from incompatible encoder versions.
- Index budget example: 10M SKUs × 4 views × 768 FP16 ×2 bytes ≈ **61.4 GB** raw vectors before index/replicas.

# 9. Evaluation and failures

**Offline:** Exact SKU Recall@K, exact-match precision at threshold, similarity NDCG@10, crop detection AP, slices by category/color/new items.  
**Online:** Product click/conversion proxy, user correction of selected object, exact-match complaints, stock freshness, latency.  
**Failures:** Near-identical variants, multi-object photos, counterfeit/duplicate listings, out-of-stock results, loss of color fidelity, background bias and domain shift.

**L5 decision:** Optimize **retrieval recall** and **variant-level verification precision** separately; similarity alone is not proof of exact SKU identity.


# 10. One-minute interview summary

> “I’d use crop detection + embedding retrieval for recall, then fine-grained visual/attribute verification to distinguish same SKU from merely similar products, while keeping catalog and stock freshness independent.”
