## How multi-agent systems fail

Coordination can fail even when each worker returns a plausible result.

## 1. Five failures

- Duplicate work.
- Unowned requirements.
- Wrong findings reused as premises.
- Contradictions hidden by merging.
- Resource or latency blowups.

These can occur in single-agent systems too; multiple contexts add seams.

## 2. Error amplification

```text
outdated “400 employees” → revenue/employee calculation → confident report
```

Carry source, date, entity, and uncertainty with the input claim. Correct arithmetic cannot repair an outdated denominator.

## 3. Ownership and coverage

Map every required artifact to an accountable owner. Explicitly mark intentional duplicate verification.

Check unassigned and overlapping tasks before dispatch.

## 4. Merge against the goal

Flag unsupported claims, preserve contradictions, list gaps, and check the requested final outcome.

Three good summaries do not automatically form a useful recommendation.

## 5. Global budgets

Six workers with ten-step caps can still spend 60 steps plus orchestration.

Enforce global spend, token, time, and step budgets alongside local limits.

## 6. Stale reads

```text
read v3 → compute → conditional write expecting v3
                    ├→ success
                    └→ conflict: reread or reconcile
```

Record dependency versions. Turn silent overwrites into visible conflicts.

## 7. Coordination evaluation

Test disagreement, timeout, duplicate delivery, incomplete output, and reordered completion.

Check provenance, ownership, conflicts, partial-result honesty, and global budgets at system level.

## Interview mental model

> The seams are part of the system and need their own checks.

## Chapter 5 checkpoint

Explain the benefit of a split, its briefs and return contracts, the merge rules, and recovery when a worker fails.
