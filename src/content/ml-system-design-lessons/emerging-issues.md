# Discover Emerging Customer Issues

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Detect genuinely **new recurring customer problems** following product releases, without mistaking spam, copied complaints, irrelevant content, or random isolated tickets for an emerging incident. Discover groups of similar unknown issues and promote validated groups into known-issue tracking.

Example: After an application update, many unrelated customers report “App closes when I open the camera” in different languages. The system should detect the cluster early, explain evidence, and alert reviewers.

# 2. Clarification Q&A

**Candidate:** Do we already have known issue categories?  
**Interviewer:** Yes, a few hundred established issues; new issues are not pre-labeled.

**Candidate:** What defines “emerging”: one unusual report or a sustained cluster?  
**Interviewer:** A previously unknown issue with meaningful frequency or growth across independent users, often after a release.

**Candidate:** Should alerts be automatic or reviewed?  
**Interviewer:** Show ranked candidate issues to incident analysts; human approval before adding new official categories.

**Candidate:** How do we deal with copied reports, spam and generic praise?  
**Interviewer:** These should not trigger false incidents; we have user/source metadata and spam signals.

**Candidate:** What is the expected freshness and data scale?  
**Interviewer:** Millions of messages/day, near-real-time candidate detection, with reviewed alerts within tens of minutes.

# 3. Requirements

**Functional:** Identify known issues; route potentially novel actionable problems to discovery; group equivalent emerging reports; track volume/growth/persistence and distinct reporters; surface representative evidence and affected release/version; require human confirmation before promotion; support multilingual messages.

**Non-functional:** Millions/day, stream processing and minute-scale freshness, low false-alert rate, bounded analyst review workload, high early-detection coverage, auditability.

# 4. ML objectives

This is **novel issue discovery plus temporal change detection**, not merely message classification or one-time clustering.

Objectives:

- Known-issue recognition: high precision/recall for established categories.
- Novelty routing: capture genuinely new issues while suppressing generic/benign/spam messages.
- Unknown-pool clustering: high coherence/purity and stable issue descriptions.
- Emergence ranking: high **incident-level detection recall**, low false promotion/alert rate, short **time-to-detection**.

Because the system discovers previously unknown groups, ground truth often requires retrospective human incident adjudication.

# 5. Data

**Inputs:** Ticket/chat/app-review text; timestamps; language; product/version/region/channel; anonymized user/source IDs; known issue categories; release calendar and incident logs; spam/promotion labels.

**Data hygiene:** Normalize boilerplate and repeated templates; near-deduplicate exact/copied reports, but **retain counts of unique reporters and source diversity**, since independent repetition is meaningful evidence. Filter spam and generic feedback before clustering; preserve log/error codes and version info. Beware one viral copy-paste campaign being counted as 10,000 independent customer reports.

**Labels:** Known-issue labels; human-validated novel clusters; historical incident onset times, severity, and reviewer dismissals. Hold out entire future incidents and releases to avoid hindsight leakage. Include days with no incidents to measure false alarms.

# 6. High-level architecture

<!-- system-design-diagram -->

# 7. Modeling and temporal discovery

**Known routing:** Use a known-class classifier when taxonomy is stable, or embedding-to-prototype retrieval when issues are frequently added. Apply an appropriately calibrated novelty/abstention rule. Do not treat every low-confidence message as a true novel issue: explicitly screen out off-topic, unintelligible, generic, and spam content.

**Unknown embedding:** Use multilingual SBERT representations. For the unknown pool, **HDBSCAN** is a useful starting point because cluster number is unknown, densities vary, and noise points should remain unclustered. Evaluate against mini-batch K-means if consistent topic density and operational simplicity favor it. HDBSCAN does not intrinsically maintain a centroid; compute a medoid/centroid or several representatives **afterward** for summaries and approximate future matching.

**Emergence scoring:** Rank clusters using more than count:

- Rate per time window compared with historical baseline (e.g., last 1–4 weeks adjusted for overall traffic).
- Growth acceleration and sustained persistence across windows.
- Number of distinct reporters, regions/devices, and channels.
- Semantic novelty relative to known issue prototypes.
- Severity and release/version correlation.

Conceptual score: `novelty × anomalous_growth × independent_support × severity`, with normalization to avoid small-sample explosion. Use statistical change detection (e.g., CUSUM or Poisson-rate modeling with baselines) if simple thresholds are too noisy.

**Promotion:** Human verifies examples, clusters, root-cause coherence, and severity. Approved issue gets one or multiple canonical descriptions/prototype embeddings in a known registry/delta index; supervised classifier can be periodically retrained as labels accumulate. Do not auto-promote raw clustering outputs to product incidents.

# 8. Serving and lifecycle

Use streaming windows for recent unknowns; micro-batch clustering and nightly/periodic larger re-clustering to repair fragmented groups. Store immutable message IDs, embeddings, model versions, cluster assignment history, and reviewer actions. Detect cluster splits/merges across time, with human oversight. Control reviewer load by ranking alerts and suppressing repeated notifications for already investigated incidents.

Frequent known-category index updates should not require reclustering the whole known catalog. Re-embed unknown-pool messages on major encoder upgrades before comparing vectors.

# 9. Evaluation and diagnosis

| Component | Metrics |
|---|---|
| Unknown routing | Novel-issue capture recall; benign/spam leakage |
| Clustering | Cluster purity/coherence, coverage, stability; noise rate |
| Incident detection | Detection recall, time-to-detection, false alerts/day, precision of promoted incidents |
| Alert prioritization | Reviewer accept rate, time saved, alert burden |
| Operations | Processing lag, per-release/language coverage |

**Failure modes:** One-day volume spikes with no persistence; a generic message group falsely called novel; copy-pasted spam; one root cause split across multiple language clusters; multiple unrelated issues merged because they mention the same feature. Evaluate with prospective replay of historical timelines, not only post-hoc topic coherence.

# 10. Interview summary

> “I’d first separate known issues from plausible unknown actionable problems and filter spam/duplicated copies. For unknowns, multilingual embeddings and HDBSCAN discover candidate groups. I’d rank clusters by growth relative to baseline, persistence, independent reporter diversity, novelty, and severity, then require analyst confirmation. Approved groups become new known-issue prototypes immediately; classifiers retrain later. Key metrics are incident detection recall, false-alert rate, and time-to-detection.”
