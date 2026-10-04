## Reflection and self-critique

**Reflection** revises an artifact against evidence and criteria.

## 1. Ungrounded versus grounded

```text
“Are you sure?”                   → no independent check
draft → tests → critique → revise → new evidence
```

Self-critique can help or hurt. Measure whether it improves final outcomes.

## 2. Choose evidence

| Check | Useful for |
|---|---|
| Schema/type checks | Structure |
| Compiler/linter | Program issues |
| Tests | Covered behavior |
| Retrieved sources | Factual claims |
| Model critique | Rubric-based review |
| Human review | Domain judgment |

No checker catches everything.

## 3. Actor and critic

Give the critic the artifact, requirements, and test/source evidence.

Avoid anchoring it to a long justification from the actor.

> Think of a reviewer checking the work against a specification.

## 4. Bound revision

```python
for _ in range(max_revisions):
    issues = critic(draft, criteria, evidence)
    if not issues:
        break
    draft = revise(draft, issues)
```

Stop on acceptance, budget, or no improvement. Watch for oscillation and endless polishing.

## 5. Match the repair

Missing policy: retrieve it. Wrong arithmetic: calculate it. Missed requirement: revise against criteria.

A critic cannot establish an unavailable authoritative fact by agreement alone.

## 6. Reflect while change is possible

Review code before merge, a report before delivery, or a proposal before execution.

After an external action, focus on detection and defined recovery.

## What matters most

> A critique is useful when it identifies a checkable issue and can still change the result.
