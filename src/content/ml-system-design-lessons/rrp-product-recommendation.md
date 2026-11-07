# E-Commerce Product Recommendation

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design personalized product recommendations for an e-commerce marketplace: home-page suggestions and “you may also like” carousels, with millions of products, changing inventory/prices, and substantial cold-start traffic.

# 2. Clarifying Q&A

**Candidate:** Which surfaces are in scope—home recommendations, item-to-item, or search?  
**Interviewer:** Personalized home recommendations plus similar/complementary product carousels. Search is out of scope.

**Candidate:** What outcome matters: clicks, purchases, revenue, or repeat customer value?  
**Interviewer:** Relevant purchases and long-term customer satisfaction, while avoiding returns and misleading recommendations.

**Candidate:** What data do we have?  
**Interviewer:** Impressions, clicks, add-to-cart, purchases, returns, product metadata, images/text, price and inventory.

**Candidate:** How dynamic is the catalog?  
**Interviewer:** Tens of millions of SKUs, frequent new listings, price changes, and stockouts.

**Candidate:** Do users commonly have no prior history?  
**Interviewer:** Yes, guest users are common, and many products have very few interactions.

**Candidate:** Should a similar product carousel contain substitutes or complements?  
**Interviewer:** It depends on the placement: alternatives for similar-item pages, complementary products for accessories.

# 3. Requirements

**Functional:** recommendations for signed-in and guest shoppers; personalize from history/session; distinguish substitute and complementary relationships; filter unavailable, ineligible and already-purchased items; react to inventory/price changes; handle new users/items; return a diverse and useful slate.

**Non-functional illustrative:** 30M SKUs, 20K QPS peak, P95 < 150 ms, inventory updates within seconds, product embedding updates within minutes after listing.

# 4. Objectives

- Candidate retrieval Recall@K for interacted/purchased items, plus catalog coverage, cold-start representation and diversity.
- Ranking prediction of add-to-cart, purchase, expected margin-adjusted value, and potential returns.
- Final slate utility: customer relevance and likely long-term value, subject to availability, seller and category diversity, safe inventory/price freshness.
- Online A/B: incremental purchases, gross merchandise value with guardrails, return/refund rate, conversion, user retention and customer satisfaction.

Avoid assuming observed purchases are unconfounded preference labels: users purchase only items they saw and could afford/inventory enabled.

# 5. Data, labels, and product representations

**User/session signals:** category/brand preferences, viewed items, cart state, purchases (with recency), returns, device, geography, query interactions where permitted, guest session context.

**Product:** catalog ID/SKU, brand, taxonomy, structured attributes, price, stock, seller, text description, images and review/quality signals.

**Labels:** impression -> click/add-to-cart/purchase; returns/cancellations as negative quality feedback with delay. Purchase is rare; use intermediate engagement tasks but validate against actual purchases and satisfaction.

**Negative sampling:** shown-but-unengaged items can be negatives with position/visibility caveats; random unexposed products are not equivalent negatives. For item-to-item training, distinguish complementary (co-purchase) from substitutes (similar attributes, alternatives), rather than mixing them blindly.

**Splitting:** temporal with point-in-time price/inventory; unseen-item and new-user slices, seasonal and geographic shifts.

# 6. Architecture

<!-- system-design-diagram -->

# 7. Candidate generation: collaborative + content hybrid

**Collaborative filtering:** implicit matrix factorization/ALS/BPR, item-to-item co-occurrence, or two-tower user–item retrieval. Excellent when sufficient interaction history exists; fails for new items/users.

**Content-based:** image-text multimodal item embeddings and structured product attributes, so new products can match tastes before accumulating clicks. For **exact product identity** (SKU/variant), lexical and structured matching are vital; embedding similarity alone can mix sizes/colors/models.

**Two-tower training:** user/session history and candidate product metadata -> embeddings, optimized using contrastive softmax, sampled negatives or pairwise ranking. Offline product vectors are ANN indexed, with a delta index for fresh items.

**Complement vs substitute:** train separate co-purchase/complement signal (e.g. camera -> memory card) and substitute similarity (camera -> alternative camera). A product's embedding neighbors are not automatically useful cross-sell complements.

**Cold start:** new user = contextual popular items, session views, category affinity, lightweight onboarding; new item = metadata/image/text features, seller/category priors, controlled exploration.

# 8. Ranking and constraint handling

**Features:** user–item affinity, collaborative similarity, content match, prior interactions, price relative to budget, delivery estimates, availability, reviews/quality, promotions, return risk, user region.

**Rankers:** LightGBM strong baseline; Wide & Deep/DCN or other deep interaction models for sparse IDs and cross-features. Multi-task predict `P(click)`, `P(cart)`, `P(purchase)`, and return probability.

Example decision utility:

```text
utility = w1 * P(purchase) * expected_customer_value
        - w2 * expected_return_or_dissatisfaction_cost
        + w3 * novelty_or_discovery_value
```

Avoid simplistic profit-only ranking that harms user trust or pushes irrelevant expensive items.

**Hard filters:** inventory and legal availability checked at serve time; do not rely on embeddings or last night's snapshot for stock correctness. Price and shipping eligibility should be refreshed from authoritative services.

**Slate re-ranking:** enforce category/brand diversity, cap repeated variants, avoid redundant products. Explainable complementary suggestions can be added to product-detail pages.

# 9. Evaluation, experiments, and scaling

| Layer | Metrics |
|---|---|
| Retrieval | Recall@K, item coverage, new-item share, long-tail coverage |
| Ranking | NDCG@K, PR-AUC purchase, log loss, calibration |
| Business | Conversion, incremental revenue, return rate, retention |
| Catalog | Out-of-stock exposure, stale-price rate, eligibility violations |
| Serving | P95 latency, cache hit rate, embedding/index freshness |

- Product availability changes rapidly: maintain streaming feature updates, delta-index insertion, tombstones, and final authoritative inventory checks.
- Cache item embeddings and content features; use up-to-date user/session features; avoid serving stale prices.
- During seasonal peaks, test traffic mixes and ad/promotional campaigns that shift ranking-label distributions.
- A/B test with control for placement bias and network effects. New-item exploration prevents entrenched popularity bias.

**Storage estimate:** 30M items × 768 dimensions × 2 bytes (FP16) ≈ **46 GB raw vectors**, excluding index/metadata/replicas. Index memory and serving costs can exceed raw storage significantly.

# 10. Trade-offs and pitfalls

- Collaborative-only misses cold-start items; content-only misses collaborative taste patterns: hybrid works best.
- Do not use a single similarity score for both substitutes and accessories.
- Do not expose out-of-stock items solely because the ranker predicts high relevance.
- Purchases are sparse and delayed; intermediate engagement labels help but do not replace purchase/return evaluation.
- Strong offline NDCG does not guarantee incremental lift under biased serving logs.

**Interview close:** “I combine collaborative and multimodal content-based candidate generation with two-tower ANN retrieval, then rank with user×item context and purchase/return objectives. I differentiate substitutes from complements, update embeddings incrementally, enforce real-time inventory/price checks, and evaluate cold-start coverage plus incremental customer value online.”
