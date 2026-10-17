## A ranking system design answer

A **recommendation system design** connects a product decision to data, retrieval, ranking, evaluation, and operation. Explain why each component is needed for this surface rather than presenting a fixed architecture menu.

## 1. Frame the home-feed decision

For a video app, suppose the response contains six eligible items. Define useful viewing, complaint limits, freshness needs, and a measured serving budget.

One training row can be one displayed impression, with click and useful-watch labels completed under stated windows. Log request and impression IDs, available inputs, placement, versions, and actual selection probabilities when the policy supports that evaluation.

“Watched 30 seconds” is a proxy, not a complete definition of satisfaction. Keep a current-system and contextual-popularity baseline.

## 2. Choose candidates and scores

Retrieve an illustrative 800 candidates from a feature-based vector index, item neighbors, history or subscriptions, and fresh inventory. Merge eligible IDs, retain all source tags, and give sources deadlines.

Use a candidate count justified by recall, final quality, and downstream cost. A feature-based tower can represent new uploads, but only index publication and successful retrieval make them candidates.

Start ranking with an appropriate simple model. Add joint features or sequence modelling for demonstrated weaknesses. Define whether watch predictions are conditional on clicking or unconditional per impression before combining them with other outcomes.

Re-rank for the intended list properties. Hard eligibility is mandatory; soft creator or category targets need explicit priorities and an infeasibility policy.

## 3. Evaluate the claim being made

| Layer | Evidence |
|---|---|
| Retrieval | Reference-positive recall and cold-item coverage |
| Ranking | Fixed-protocol list metrics and probability quality where used |
| List selection | Duplication, useful variety, constraints |
| Product policy | Suitable experiment with primary outcomes and guardrails |

Use deployment-matched time and group restrictions, historical input availability, realistic candidates, and uncertainty. Logged clicks inherit exposure and placement; correction needs identified assumptions, not just a “debiasing” label.

If longer-term effects matter, use an experiment long enough and appropriately designed to measure them.

## 4. Explain cost and the expected failure

At 10,000 requests per second, 800 candidates imply eight million scores per second. Profile features, batching, network access, and model work before choosing the cost intervention.

Version compatible towers, vectors, index, transforms, calibrator, and policy. Keep eligibility-aware fallbacks and a rollback path.

For “new creators receive no exposure,” monitor publication-to-index delay, retrieval membership, and final selection separately. The fix differs for absent vectors, stale indexes, filtering, and inadequate exploration.

> **Mental image:** every stage needs an input contract, a reason to exist, a measurement, and a recovery path.
