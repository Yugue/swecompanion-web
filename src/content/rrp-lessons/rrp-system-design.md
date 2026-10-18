## A ranking system design answer

## 1. Start with one concrete decision

Design a video home feed returning **six eligible items**. Define useful viewing, complaint limits, freshness, traffic, and latency.

This chapter combines earlier mechanisms into one design; architecture follows the requirements.

## 2. Specify the evidence

Use one displayed impression per training row, with stable outcome linkage and completed label windows.

Preserve decision-time inputs, placement, versions, and action probabilities where the intended evaluation requires them. Compare with the existing policy and contextual popularity.

## 3. Retrieve a bounded pool

Suppose an evaluated budget permits **800 candidates**. Combine vector search, item neighbors, subscriptions, and fresh inventory as justified by marginal coverage.

Deduplicate IDs, retain source tags, enforce eligibility, and bound source deadlines. New uploads need both representation and timely index publication.

## 4. Rank and assemble

Start with an appropriate simple ranker. Add joint features or session modeling for measured weaknesses.

Define whether watch estimates are per impression or conditional on clicking. Apply final eligibility and the intended creator/redundancy rules when selecting six items.

## 5. Evaluate each claim

| Layer | Evidence |
|---|---|
| Retrieval | Reference-positive recall and cold slices |
| Ranking | Fixed-protocol ordering and required probability quality |
| List | Duplication, useful variety, constraints |
| Policy | Product experiment with primary outcome and guardrails |

Use later data, realistic competition, and uncertainty. Logged relevance alone cannot establish every deployed policy effect.

## 6. Budget and recover

At 10,000 requests/second, 800 candidates imply **eight million scores/second**. Profile feature access, batching, and model work.

Version compatible components; keep eligibility-aware fallbacks and rollback. For invisible new creators, monitor publication, retrieval, and display separately.

## 7. Interview reasoning

**Question:** What changes if request volume grows tenfold?

**Answer:** Recompute score and feature demand, locate the measured bottleneck, and compare caching, candidate caps, batching, or model changes with their quality costs.
