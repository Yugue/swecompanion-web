# TikTok-Style Real-Time Short-Video Feed

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design a personalized infinite-scroll short-video feed that adapts to a user's evolving interests within seconds of swipes, rewatches, shares, skips, and follows. Optimize satisfaction, retention, and healthy engagement, not merely raw time spent.

# 2. Clarifying Q&A

**Candidate:** How is this different from a traditional home feed?  
**Interviewer:** Sessions have many rapid decisions; immediate skip and completion feedback are strong, and interests can change within the session.

**Candidate:** What is returned per request?  
**Interviewer:** The next several clips, with a continuously updated queue.

**Candidate:** What latency?  
**Interviewer:** P95 recommendation computation < 100 ms, ideally with prefetching for seamless playback.

**Candidate:** What are primary signals and counter-signals?  
**Interviewer:** Watch fraction, completion, rewatches, swipe-away speed, shares, follows, dislikes, reports.

**Candidate:** What's the catalog dynamic?  
**Interviewer:** Large and fast growing, including millions of new clips daily, with content moderation and freshness requirements.

# 3. Requirements

**Functional:** rank next clips; incorporate recent session events within seconds; avoid repetition and saturating a creator/topic; promote cold-start content fairly; handle safety/rights constraints; support exploration and uncertainty.

**Non-functional illustrative:** tens of thousands of feed QPS, P95 < 100 ms for recommend step, event-to-state delay < 5–15 s, high availability, playback prefetch to mask model latency.

# 4. Objectives

- Retrieval Recall@K for relevant clips, and high coverage of new-item pools.
- Per-candidate predictions: `P(watch beyond t)`, watch fraction, completion, rewatch, share, negative feedback.
- Ranking utility: expected meaningful session enjoyment and long-term satisfaction with penalties for repetitive/low-quality content.
- Session-level measures: satisfaction, healthy return rate, topic diversity, explicit negative actions.

**Important:** observed watch duration partly depends on video length, autoplay, and position. Normalize or model completion/hazard to avoid trivial “long videos always win” effects.

# 5. Data and labels

**Labeling approach:** Completion, skip, rewatch and follow events provide outcome labels at scale. An LLM cannot fabricate individual satisfaction. Prompt a multimodal teacher from small human gold examples for topic, content quality and safety pseudo-labels that help new clips.

**Quality and escalation:** For semantic tags, improve prompts or supported soft prompts, then consider teacher LoRA on development gold if validation fails; funded human bulk tags are last. Keep independent human safety/relevance validation and tests plus chronological real watch outcomes.

**Prompt tuning** learns a small soft prompt while keeping base weights frozen; it requires model support. **LoRA** learns low-rank weight adapters. Neither uses validation/test gold for training.

**Feature engineering:** Encode ordered session actions and time gaps with clip/audio/text embeddings, creator exposure and network state; exclude post-prediction events and buffering artifacts.

**Events:** feed impression with visibility, autoplay start, play duration, swipe time, completion, rewatch, sound on/off, likes/shares/follows, reports, device/network, session ordering.

**Content:** clip frames, speech transcript, audio features, creator metadata, language, upload time, safety labels. Build multimodal content embeddings from video/text/audio; behavioral ID embeddings when mature.

**Training:** time-ordered sequences of `(user, session state, candidate, action)`. Include sequence position and time gaps; avoid future interactions leaking into current training examples. Mask post-prediction events.

**Negative labels:** immediate skip is a useful negative but not always evidence of dislike (accidental swipes, buffering). Adjust for playback failures and visibility.

**Evaluation splits:** chronological, user/session-aware, with slices for new clips and short/long video duration.

# 6. Session modeling and retrieval

**Baseline:** exponentially decayed topic/video-embedding average from the latest watches, optionally weighted by completion/like/skip. It is cheap, interpretable, and a strong place to start.

**Advanced:** GRU4Rec or transformer/SASRec-style sequence encoder over watched clips, action types, and time gaps. It captures order and changing short-term intent, e.g., “cooking -> travel -> workout” within minutes.

Combine long-term and short-term representations with gating or attention to avoid overfitting to one accidental interaction.

**Candidate retrieval:** item embeddings via two-tower contrastive training, ANN over large catalog, plus trending, recent uploads, followed creators, related content, and exploratory pools.

**Retraining cadence:** new item/content embeddings immediately when uploaded; streaming recent-user aggregates instantly; model weights retrained in scheduled/near-line cycles depending on drift and stability.

# 7. Ranking and diversification

Train a multi-task ranker with heads for qualified watch, completion, share/follow, long skip, dislike/report. Use BCE for binary heads and bounded regression/survival models for watch duration.

Ranking utility must balance short-term and long-term signals. Apply creator/topic caps, repetitive-video removal, policy filters, and controlled exploration at slate time.

**Bandits:** contextual exploration can help learn new creator relevance. Account for delayed outcomes, non-stationarity, and exposure propensity logging; guard against boosting unsafe or low-quality clips.

## Training and inference cost estimate

**Assumptions:** 50K requests/s. Score 1K clips/request cheaply, encode one session/request, then deep-rank 200 clips/request. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Decayed-history + cheap ranker | 1B rows ÷ (1M rows/core-h) × ($0.05/core-h) = **$50/run** | 50K requests/s × 1000 clip scores/request ÷ (200K clip scores/s/CPU core) → 250 CPU cores × ($0.05/CPU core-h) = **$12.50/h** |
| Optional sequence encoder | 1B examples × 2 passes ÷ (100K examples/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$22.22/run** | 50K requests/s × 1 session encodings/request ÷ (10K session encodings/s/GPU) → 5 GPUs × ($4/GPU-h) = **$20/h** |
| Multi-task top-200 ranker | 1B examples × 2 passes ÷ (100K examples/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$22.22/run** | 50K requests/s × 200 clip scores/request ÷ (100K clip scores/s/GPU) → 100 GPUs × ($4/GPU-h) = **$400/h** |

# 8. Architecture

<!-- system-design-diagram -->

# 9. Evaluation

| Component | Offline | Online |
|---|---|---|
| Retrieval | Recall@K, new-video coverage | Discovery of relevant new content |
| Ranker | NDCG@K, log loss, calibration, watch prediction error | Qualified watch, shares, positive satisfaction |
| Sequence model | Next-action prediction, ablation of recent events | Responsiveness to within-session pivots |
| Slate | Diversity, creator concentration, repetition rate | Session satisfaction, complaint/report rate |
| Ops | P95, stream delay, index freshness | Playback continuity, request failures |

Offline replay on observational logs is biased by the previous ranking policy; complement with A/B tests and controlled exploration.

# 10. Scaling and failure modes

- Pipeline can precompute the next 3–10 clips per user/session; update/replenish as swipes arrive.
- Cache content embeddings and fixed item features; stream session state to a low-latency key-value store.
- Use lightweight first-stage ranking and smaller top-N expensive scoring to meet P95.
- Control out-of-order/duplicate events by event-time processing and idempotency.
- Maintain fallbacks to safe trending/contextual content during cold starts or feature failures.

**Common mistakes:** treating all watch seconds equally; ignoring rapid session interests; optimizing engagement at expense of satisfaction; no correction for autoplayer/position bias; no safety checks before serving.

**Interview close:** “I build a retrieval–ranking funnel like a home-feed recommender but add a fast, sequence-aware short-term user representation from streaming swipe/watch events. I use multimodal video features for new clips, multi-task watch/satisfaction objectives, slate diversity and controlled exploration, and prefetch for low latency. I evaluate adaptation speed and long-term satisfaction, not just watch time.”
