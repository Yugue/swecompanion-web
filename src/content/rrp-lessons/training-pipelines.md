## Building the training data

A **training pipeline** converts recorded events into reproducible examples. Joins, label windows, sampling, feature availability, and splits define the learning problem as much as the model does.

## 1. Join outcomes to the intended exposure

```text
impressions → deduplicate → attach outcomes → mature labels → assemble inputs
```

Use stable impression or event keys. Joining only by user and item can merge repeated displays or give one purchase credit several times.

An **attribution window** defines which later outcomes are attached to an exposure. State how multiple eligible exposures share or receive credit. This convention does not establish that a particular display caused the outcome.

Check event counts, join multiplicity, and unmatched records. A successful data job can still create invalid examples.

## 2. Treat unfinished labels as unfinished

For click within 30 minutes, wait through that window and the chosen arrival allowance. A missing click after two minutes is not yet a completed negative.

Delayed purchases can require mature cohorts or an explicit delay-aware objective. Label delay limits the newest complete training examples, not the current features usable at inference.

Track late outcomes and completeness by surface. A broken outcome collector can look like a sudden reduction in engagement.

## 3. Sample without losing the sampling design

Keeping fewer non-clicks can reduce work but changes class proportions. Record retention probabilities. Use a valid weighted objective or probability correction for the target population.

Uniform class-conditional sampling is simple to correct under its assumptions. Feature-dependent sampling can also be valid when inclusion probabilities and objective treatment are appropriate; it is not automatically forbidden.

Keep representative evaluation data. For retrieval contrasts, record the candidate and negative-sampling construction separately from impression-level class downsampling.

## 4. Preserve time, versions, and provenance

| Retained information | Why it matters |
|---|---|
| Request, impression, user, item, timestamps | Correct units and outcome linkage |
| Features or versioned serving snapshots | Historical input availability |
| Positions and retrieval-source tags | Placement and funnel diagnosis |
| Actual action probabilities where supported | Off-policy evaluation |
| Dataset, model, and policy versions | Reproducibility |

A deterministic score is not an action probability. Randomization probabilities must describe the final selection after eligibility and mixture rules.

Choose temporal or grouped splits from the deployment claim, and fit transformations and sampling inside the allowed training portion. Validate duplicates across splits, future-derived inputs, unexpected label rates, and missing cold slices before fitting.

> **Mental image:** a training row is an audited reconstruction of one decision, including what was knowable and what later happened.
