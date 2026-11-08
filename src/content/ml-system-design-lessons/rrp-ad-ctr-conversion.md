# Google Ads CTR and Conversion Prediction

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design a system that predicts the probability that an ad will be clicked (**CTR**) and that a click leads to a desired conversion (**CVR**) in order to support ad auction/ranking decisions at high QPS.

# 2. Clarifying Q&A

**Candidate:** What exactly are labels and prediction targets?  
**Interviewer:** Probability of click after a visible ad impression; conversion within 7 days of a click, with privacy-preserving attribution.

**Candidate:** Does conversion prediction need to work before the click?  
**Interviewer:** Yes. At ad serving time we want expected conversion value for each candidate ad.

**Candidate:** What context can we use?  
**Interviewer:** Query/context, coarse user/session signals where permitted, ad creative, advertiser, campaign, bid, device, geography, and history.

**Candidate:** What about privacy, user consent, and cold-start advertisers?  
**Interviewer:** Strict access and consent rules; new ads have little interaction history.

**Candidate:** What scale and latency?  
**Interviewer:** Hundreds of thousands of predictions per second, with a tight per-auction model budget of a few to tens of milliseconds.

**Candidate:** Is maximizing CTR the whole business objective?  
**Interviewer:** No. Advertiser outcomes, quality, user experience, and auction policy matter.

# 3. Requirements

**Functional:** calibrated `P(click | impression context)` and `P(conversion | click, context)` (or directly joint post-impression conversion); use probabilities in auction/relevance scoring; support sparse ad/user/context fields; update for new campaigns and market shifts; explain aggregate model quality and guardrails.

**Non-functional illustrative:** 200K QPS; per-example model inference ~5–15 ms within overall auction budget; high availability; streaming feature freshness; privacy-preserving logging.

# 4. ML objectives and probability decomposition

Let `I` be an impression, `C` a click, `V` a conversion attributed to that impression.

- CTR: `pCTR = P(C=1 | I, x)`.
- Post-click CVR: `pCVR = P(V=1 | C=1, x)`.
- Post-impression conversion: `pCTCVR = P(C=1, V=1 | I, x) = pCTR * pCVR` **when conditionals and attribution definitions align**.
- Expected conversion value: `pCTCVR * expected_value_given_conversion`.

**Critical subtlety:** Training CVR only on clicked impressions creates selection bias; a multitask model jointly modeling clicks and conversions over the entire impression space (e.g., an Entire Space Multi-task Model, ESMM) can help, though it does not solve all counterfactual attribution issues.

**Metrics:** log loss, PR-AUC/ROC-AUC as appropriate, Brier score, Expected Calibration Error (ECE), calibration by cohort, normalized entropy, conversion-value prediction error and online marketplace KPIs. For rare conversions, PR-AUC and calibration often matter more than raw accuracy.

# 5. Data and labels

**Labeling approach:** Clicks and matured attributed conversions are observed events, not labels an LLM can know. Use those logs for CTR/CVR. A small human semantic gold set guides teacher-generated ad-topic, query-relevance and creative-policy pseudo-labels for cold-start features.

**Quality and escalation:** For semantic tags only, tune prompts or supported soft prompts before teacher LoRA; buy human bulk tags only for important remaining gaps. Keep independent human relevance/policy validation and tests, while calibrated probability tests use mature real outcomes.

**Prompt tuning** learns a small soft prompt while keeping base weights frozen; it requires model support. **LoRA** learns low-rank weight adapters. Neither uses validation/test gold for training.

**Feature engineering:** Use sparse ad/campaign IDs, text embeddings, smoothed historical rates and context crosses computed as of the impression; never leak the future click or conversion.

**Dataset rows:** one eligible ad impression with timestamp, observed position, auction context, features as-of impression, click label and conversion label after maturation window.

**Feature groups**

- Sparse IDs: ad, advertiser, campaign, keyword, publisher/category, device, region.
- Query/ad textual features: semantic relevance embeddings, exact phrase/token overlap.
- Dense numeric: historical CTR/CVR with smoothed counts, price/bid, time of day, session features.
- Crosses/interactions: `(query_category, advertiser_category)`, `(device, ad_format)`, `(user_interest, ad_topic)`.

**Delayed and incomplete labels:** conversion may happen days later. Do not mark all unconverted recent clicks as permanent negatives. Use matured cohorts, delay-aware weighting/survival modeling, or correction. Attribution can be incomplete under privacy limits; define observable targets explicitly.

**Data hygiene:** point-in-time feature joins, exclusion of post-impression behavior from training features, deduped events, bot/spam filtering, consent boundaries, and deletion pipelines. Exclude user identifiers where policy forbids them.

**Splits:** chronological; hold out recent mature periods, plus slices for new advertisers, rare geographies, and traffic shifts.

# 6. Models and training

**Baselines:** logistic regression/FTRL with hashed sparse features; extremely efficient and interpretable for scale. GBDT handles numeric/tabular nonlinearities but sparse high-cardinality interactions are a challenge.

**Deep models:** Wide & Deep, Deep & Cross Network (DCN), Deep Learning Recommendation Model (DLRM). Learn low-dimensional embeddings for sparse IDs and cross them with numerical/text features.

**Multi-task:** shared embeddings/trunk with separate CTR and CVR/CTCVR heads. Loss may combine binary cross-entropy for clicks, joint conversion, and conditional conversion heads, with label masks appropriate to observed events.

**Cold start:** use advertiser/creative/category content rather than only ID embedding; smooth historical rates (e.g., Bayesian priors). Back off to global/category priors for unseen IDs.

**Calibration:** post-hoc isotonic regression or Platt/temperature scaling on validation slices, or adjust model loss/training to improve native calibration. Recalibrate after distribution shifts; ensure sample weighting/sampling correction maintains real-world probabilities.

## Training and inference cost estimate

**Assumptions:** 200K auction requests/s × 100 candidate ads/auction = 20M candidate-ad scores/s. QPS means auctions here; if it counts individual ad predictions, divide this demand by 100. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Logistic baseline | 1B impressions × 2 passes ÷ (1M impressions/s/core) ÷ (3,600 s/h) × ($0.05/core-h) ≈ **$0.03/run** | 200K requests/s × 100 ad scores/request ÷ (200K ad scores/s/CPU core) → 100 CPU cores × ($0.05/CPU core-h) = **$5/h** |
| Deep multi-task model | 1B examples × 2 passes ÷ (100K examples/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$22.22/run** | 200K requests/s × 100 ad scores/request ÷ (100K ad scores/s/GPU) → 200 GPUs × ($4/GPU-h) = **$800/h** |

# 7. Exposure bias and counterfactual caveats

Observed CTR depends on placement, competing ads, auction policy, and user behavior. A model trained only on selected shown ads may not generalize to unserved candidate ads.

- Log relevant propensity/position information where feasible.
- Randomized small-scale traffic, policy-aware weighting, and doubly robust estimators can reduce bias.
- Reject simplistic inverse-propensity weighting when propensities are unknown/near-zero; high variance is a real issue.
- Conversion lift is **causal**: observed conversion does not necessarily mean the ad caused it. Incrementality studies are separate from standard CVR prediction.

# 8. Serving and production

- Batch candidate ad predictions per auction; cache shared ad features and embeddings.
- Maintain streaming counters with time-decayed aggregates but avoid feature leakage and self-reinforcing estimation.
- Distill large models into fast serving models; apply quantization only after calibration/quality checks.
- Separate offline training metrics from **online business impact** (conversion value, advertiser ROI, ad revenue, user satisfaction).
- Monitor overall and slice-wise calibration: a 0.02 score should correspond to ~2% outcome frequency over comparable examples.
- Shadow, canary, and rollback; track data availability and feature skew.

**Example throughput:** 200K candidate predictions/sec × 1 ms CPU each = 200 CPU-seconds of work per wall-clock second before other overhead; batching and vectorization change the actual provisioned capacity. Benchmark real hardware.

# 9. Architecture

<!-- system-design-diagram -->

The auction mechanism itself is a separate system; never assert that raw `pCTR × bid` is the complete ranking formula.

# 10. Evaluation and release gates

Use a chronological, mature-outcome holdout. Measure log loss, calibration and PR-AUC by cohort; check business loss and false-positive costs at the chosen policy. Evaluate semantic pseudo-label quality separately from observed outcomes. Shadow, then canary the candidate with latency and outcome guardrails; do not promote on training fit or an LLM judge alone.

# 11. Trade-offs and pitfalls

- **CTR ≠ CVR ≠ incremental lift.** State the label/causal target clearly.
- **Delays:** premature negative labels bias CVR downward.
- **Calibration:** great AUC with miscalibrated probabilities can harm auction decisions.
- **Position bias:** clicks depend on placement.
- **Sparse IDs:** new campaigns need content/generalizable features; avoid unbounded embedding growth.
- **Privacy:** tracking constraints may limit data and attribution; treat missing conversions appropriately.

**Interview close:** “I define CTR and post-click CVR precisely, create point-in-time impression-level training data, handle conversion delay and selection bias, and train a sparse-feature model (logistic/FTRL baseline, then DCN/Wide & Deep or multi-task ESMM-style). I validate ranking and calibrated probabilities, serve candidates in low-latency batches, and measure advertiser and user outcomes online.”
