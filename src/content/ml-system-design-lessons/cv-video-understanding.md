# Searchable video understanding and activity detection

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Build a system that analyzes uploaded videos, detects events/activities (“person falls,” “dog jumps into pool”), generates short searchable descriptions, and allows retrieval of **timestamps/clips** rather than only whole videos.

# 2. Interviewer–candidate clarification Q&A

**Candidate:** Offline indexing of uploads or continuous live analytics?  
**Interviewer:** Focus on uploaded videos and near-real-time indexing; live detection is optional later.

**Candidate:** What output do we need?  
**Interviewer:** Timestamped activities with confidence and text descriptions; semantic search over events.

**Candidate:** Is audio available?  
**Interviewer:** Yes; speech transcripts and non-speech sound can be useful but optional.

**Candidate:** What duration and resolution?  
**Interviewer:** Minutes to hours, varying frame rates, many videos/day.

**Candidate:** Do we have temporal annotations?  
**Interviewer:** A smaller set of labeled activity intervals and a larger weakly captioned corpus.

**Candidate:** Is the goal precise temporal localization or general summary?  
**Interviewer:** Both; correct start/end times matter for event search.

# 3. Requirements

**Functional:** Process videos, discover activity segments, attach timestamps/descriptions, search clips with text queries, optionally incorporate audio, handle deletion/reindexing.  
**Non-functional:** Scalable asynchronous processing, searchable freshness target (e.g., minutes), video-level privacy, adjustable indexing cost and storage, robust long-duration coverage.

# 4. ML objectives

- **Temporal event detection:** Segment-level **mAP** at temporal IoU thresholds; activity precision/recall/F1.
- **Video-text retrieval:** Recall@K and NDCG@K over clip-level relevance.
- **Descriptions:** Grounded factuality, coverage, correct entities/actions, timestamp alignment; human labels and calibrated model judging.
- **Serving:** Processing throughput (video minutes/minute of compute), time to index, query latency, cost/minute.

Frame-level classification accuracy alone does not measure when an activity occurs or whether clip boundaries are correct.

# 5. Data

**Labeling approach:** Use a small human temporal gold set to prompt a multimodal teacher for clip captions and candidate event intervals. Combine proposals with temporal detectors and audio/transcript evidence; filter pseudo-labels using boundary consistency and sampled human audits.

**Quality and escalation:** Test temporal IoU and missed brief actions on separate video/source/time gold. Tune prompts or supported soft prompts before teacher LoRA; fund targeted human interval correction only for important persistent localization failures. A caption alone is not a precise timestamp label.

**Prompt tuning** learns a small soft prompt while keeping base weights frozen; it requires model support. **LoRA** learns low-rank weight adapters. Neither uses validation/test gold for training.

**Feature engineering:** Fuse sampled frames, motion, ASR/audio and shot boundaries; adaptive dense windows protect short actions and timestamps remain tied to original video.

- Video files, sparse/shot-based frames, audio tracks, subtitles/automatic speech recognition (ASR), metadata.
- Teacher proposals for `[start, end, action]`, scene boundaries and event descriptions, anchored by small human temporal gold; negative clips with confusing motion.
- Sample diverse camera motion, speed, lighting, content styles and long-tail events.
- Weak labels from user captions can initialize training but don't provide precise event boundaries.
- Split by video/source and time; adjacent clips from the same video must not leak across train/test.
- Privacy and copyright-aware ingestion/retention; audio may reveal extra sensitive data.

# 6. Model and training choices

- **Frame baseline:** Encode sparse frames with pretrained ViT/CLIP, pool over short windows; inexpensive but loses precise motion.
- **Temporal model:** Temporal convolution or VideoMAE/TimeSformer-style backbone on frame sequences; better actions requiring motion (falling vs standing).
- **Temporal localization:** Predict activity class and start/end boundaries or score candidate windows; train on labeled time intervals and temporal IoU/segment matching losses.
- **Video-language alignment:** Contrastive clip–text training for semantic search; captioning head or multimodal large language model (MLLM) for descriptions, with timestamps sourced from detector.
- **Audio:** Combine ASR and sound embeddings for spoken content or off-screen events; audio is optional but can add evidence.
- Hard negatives: similar frames with different temporal order/actions; caption-only training can create static-scene shortcuts.

## Training and inference cost estimate

**Assumptions:** 1K video-hours/day. Sample one frame/video-second for the frame baseline. The temporal stage processes 10% of footage as nonoverlapping clips of 2 video-seconds each. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Frozen sparse-frame encoder | None | 3600K frames/day ÷ (1K frames/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$4/day** |
| Optional temporal model | 100K clips × 5 passes ÷ (50 clips/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$11.11/run** | 180K clips/day ÷ (50 clips/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$4/day** |

# 7. Scaling and serving

- Avoid full-frame processing of every hour at high resolution. Use scene-based sampling, motion-guided denser sampling for action candidates, and tiered models.
- Example: 1 hour video × 30 FPS = **108,000 frames**. Sampling 1 FPS yields 3,600 frames, a 30× decrease, but may miss sub-second events; use adaptive dense windows where needed.
- Asynchronous decode/index queues and GPU batching; video processing is much heavier than text search.
- Store per-clip embeddings and structured timestamps; main+delta searchable indexes for fresh clips.
- For long videos, hierarchical representations: frame → clip → event → video summary; return source timestamps for verification.

# 8. Architecture

<!-- system-design-diagram -->

# 9. Evaluation and failures

**Offline:** Temporal mAP@IoU, event F1, clip Recall@K, description grounding and time alignment.  
**Online:** Search success, clip preview engagement, indexing delay, false activity alerts, compute cost per video minute.  
**Failures:** Rare short events missed by sparse sampling, camera cuts mistaken for motion, temporal reasoning errors, duplicate near-identical clips, hallucinated captions, ASR mismatch.

**L5 decision:** Separate **visual recognition**, **temporal localization**, **caption grounding**, and **clip retrieval**. Sampling policy is a first-order system-design choice.

# 10. One-minute interview summary

> “I’d segment/sparsely sample videos, run temporal activity localization, generate grounded clip descriptions, and index timestamped clip embeddings. I’d tune sampling against missed short events.”
