# YouTube-Style Home-Feed Recommendation

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design an ML system that recommends a personalized home feed of videos to hundreds of millions of users from a catalog of hundreds of millions of videos. It must select relevant videos quickly while balancing engagement, user satisfaction, freshness, diversity, and safety.

# 2. Clarifying Q&A

**Candidate:** What surface are we optimizing: homepage, search, or next video?  
**Interviewer:** The personalized home feed. We return an ordered list of 20–50 videos.

**Candidate:** What's the primary objective—clicks, total watch time, or longer-term satisfaction?  
**Interviewer:** Long-term satisfaction and healthy engagement. Watch time is useful, but clickbait should be penalized.

**Candidate:** What feedback is available?  
**Interviewer:** Impressions, clicks, watch duration, completion, likes/dislikes, surveys, skips, and explicit “not interested” feedback.

**Candidate:** How large and dynamic is the video catalog?  
**Interviewer:** Hundreds of millions of videos, with new uploads continually arriving.

**Candidate:** How fresh must personalization be, and what is the latency?  
**Interviewer:** Reflect recent watching within minutes where possible. Target P95 < 200 ms for recommendation serving.

**Candidate:** Are minors, inappropriate content, and repeated recommendations in scope?  
**Interviewer:** Yes. Eligibility and safety are hard constraints; repetition and creator saturation are undesirable.

# 3. Requirements

**Functional**

- Generate an ordered, personalized home feed.
- Integrate long-term preferences and recent interactions.
- Handle new users and new videos; avoid repeats and already-consumed items.
- Apply safety, geography, rights, age, and availability filters.
- Blend relevance with freshness, diversity, exploration, and user controls.

**Non-functional (illustrative)**

| Dimension | Assumption |
|---|---|
| Users | 500M monthly active |
| Eligible video corpus | 300M |
| Feed requests | 50K QPS peak |
| P95 feed service latency | < 200 ms |
| Personalized-event freshness | Minutes |
| Feed length | 20–50 items |

# 4. ML objectives

This is not a single classification problem. It is a **multi-stage ranking decision**.

- **Candidate generation:** maximize relevant-item **Recall@K** from the full catalog (e.g., candidate pool K=1,000).
- **Ranking:** predict or optimize a composite utility incorporating meaningful watch time, satisfaction, and negative feedback.
- **Final slate:** maximize whole-feed utility subject to freshness, diversity, policy, and repeat constraints.
- **Online outcome:** long-term retained/returning users, satisfaction, qualified watch time; guardrails for negative feedback and harmful exposure.

Avoid optimizing click-through rate (CTR) alone: high CTR with low satisfaction can reduce long-term product quality.

# 5. Data: events, labels, and splits

**Raw entities:** user ID (privacy-protected), video ID, creator/category, upload date, title/transcript/video embeddings, device, locale, language, contextual session features.

**Interactions:** exposure/impression, click, watch seconds, percentage completed, fast skip, like/dislike, survey satisfaction, repeat watch, “not interested,” subscriptions.

**Training examples:** `(user, context, candidate video, impression timestamp) -> labels`.

**Important bias:** only surfaced items receive feedback. Unexposed videos are unknown, not automatically negative. Logging the candidate set, position, propensity/exploration policy and impression is essential. Position and selection bias can corrupt learning.

**Label construction:**

- Watch-time label can be normalized to limit preference for inherently long videos; consider satisfied-watch signals.
- Fast skip is a strong negative; a click is a weak positive; no click on an actually visible impression can be a negative with caveats.
- Use sufficiently mature windows for delayed satisfaction or long-term retention outcomes.
- Add human- or policy-labeled safety datasets separately from behavioral outcomes.

**Splits:** chronological train/validation/test, with user/session-aware leakage controls. Build retrieval evaluation against the catalog that existed when each query happened. Keep dedicated cold-start and tail-content slices.

# 6. Architecture

<!-- system-design-diagram -->

**Why a funnel?** Ranking every video is impossible. Multiple inexpensive candidate sources create coverage; progressively expensive models score smaller sets.

# 7. Candidate generation: two-tower retrieval

- **User tower:** long-term interaction history, recent watch sequence, subscriptions, language/region, time of day; output user vector `u`.
- **Video tower:** title/transcript, multimodal content embeddings, category, creator, freshness; output video vector `v`.
- Approximate relevance via `u · v` (or cosine similarity); precompute video embeddings and index them with ANN (HNSW/ScaNN/IVF variants depending on scale and updates).
- Train with contrastive/softmax objectives from historical positive interactions and sampled negatives. Use **in-batch negatives**, popularity-debiased or exposure-aware sampling, and hard negatives where useful.
- Mix retrieval sources: two-tower ANN, subscriptions, similar videos, trending, new uploads, editorial and exploration pools. A single embedding tower often underserves niche/fresh items.

**Metrics:** positive-item Recall@100/1000, candidate coverage by cohort and catalog age, ANN recall versus exact vector search, retriever latency.

**Cold start:** item content embeddings allow retrieval before behavioral history; brand-new users get contextual/popularity/onboarding candidates until interaction history accrues.

# 8. Ranking model and objective

A ranker receives richer cross-features than a two-tower dot product:

- User interests and recent sequence versus video topic.
- Predicted watch probability, conditional watch duration, completion, satisfaction, skip, dislike.
- Context: device, network, time, history of creator exposure.
- Video freshness, quality/safety signals, trustworthiness.

**Model choices:** gradient-boosted trees (GBDT) as a strong tabular baseline; Deep & Cross Network (DCN), DLRM/Wide & Deep, or attention/sequence-based deep rankers when behavior and sparse interaction data justify complexity.

A multi-task model can have independent heads for `P(click)`, expected qualified watch seconds, `P(satisfaction)`, `P(dislike)`.

Example utility (weights chosen through experiments):

```text
score = a * expected_satisfied_watch
      + b * P(positive_satisfaction)
      - c * P(negative_feedback)
      - d * repetition_penalty
```

**Caution:** summing separately predicted metrics requires calibrated scales and thoughtful business weighting. Avoid optimizing a proxy that rewards long or sensational content regardless of satisfaction.

**Loss:** binary cross-entropy for binary outcomes; Huber/quantile/regression or distributional loss for duration; weighted sum or learned multi-task balancing. Counterfactual/propensity adjustments may be required for exposure bias.

# 9. Slate construction and exploration

Individual scores do not determine the best feed. Apply re-ranking with:

- Diversity of topics/creators; per-creator caps.
- Freshness and repeated-exposure suppression.
- Safety and age constraints as hard filters.
- Exploration of new creators/items with guarded randomized traffic or contextual-bandit policies.

A simple greedy slate selection can maximize `relevance(item) - lambda * similarity_to_selected` (Maximal Marginal Relevance, MMR), with constraints.

Exploration must be logged with action probabilities when used for unbiased off-policy analysis. Avoid unconstrained random recommendations.

# 10. Serving and capacity

- **Offline:** training and bulk video embedding generation; periodic rebuilding or segmented incremental updates.
- **Near-line:** session counters and user state, fresh uploaded-video embeddings, removal/tombstones.
- **Online:** fetch user/session features, parallel candidate sources, eligibility filtering, batch ranking, slate selection, logging.
- Shard ANN by geography/eligibility when appropriate; cache stable public features and item embeddings, not stale personal state indiscriminately.
- Feature version and event-time consistency: use point-in-time correct training joins to avoid leakage and offline/online skew.

**Back-of-envelope:** if 50K QPS × 500 ranker candidates/request = **25M candidate scores/sec** before pre-ranking. A cascade reducing 1,000 -> 200 -> 50 materially lowers expensive model compute. Benchmark throughput/GPU; don't infer it from parameters alone.

# 11. Evaluation and experiments

| Layer | Offline | Online |
|---|---|---|
| Retrieval | Recall@K, catalog coverage, freshness | Contribution to satisfied sessions |
| Ranking | NDCG@K with graded relevance, log loss, calibration | Qualified watch time, satisfaction |
| Slate | Diversity, duplication, safety violation rate | Retention, negative feedback, survey outcomes |
| Infrastructure | Latency, throughput, feature freshness | P95, failures, cost |

- A/B test at user level to limit cross-session interference; consider creator ecosystem effects.
- Monitor slices: new users, underserved languages, new creators, short/long videos.
- Detect feedback loops: popularity amplification, declining diversity, and model exposure bias.

# 12. Trade-offs and common mistakes

- **Mistake:** optimize CTR alone. **Fix:** satisfaction-aware multi-objective ranking.
- **Mistake:** treat every unclicked item as a negative without considering visibility or exposure. **Fix:** impression-aware labels.
- **Mistake:** rely solely on ANN. **Fix:** multiple candidate generators and slate-level constraints.
- **Mistake:** use stale user embeddings for fast-moving session interests. **Fix:** recent-session state and fast features.
- **Trade-off:** more complex ranker may improve quality but blow P95; benchmark and cascade.

**Interview close:** “I use a retrieval–ranking–re-ranking funnel: two-tower ANN plus additional candidate sources, a multi-task satisfaction-oriented ranker, and a constrained slate optimizer. I handle exposure bias in data, support fresh content/user state, and validate with online retention and satisfaction rather than clicks alone.”
