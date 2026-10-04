## When multi-agent pays for itself

Multiple agents help when separate execution contexts provide a measured benefit worth coordination.

## 1. Two common reasons

**Parallelism:** independent source investigations run together.

**Context isolation:** a worker processes extensive material and returns compact findings.

Different capabilities or permission scopes can also justify separation.

## 2. Weak justifications

Role names alone do not prove a gain. A focused prompt may work within one agent.

Review can add value with a distinct perspective, rubric, or evidence, but agents may share correlated blind spots.

Measure improvement against a simpler baseline.

## 3. Cost arithmetic

```text
total = worker calls + repeated setup + briefs + orchestration + merge
```

Splitting can add overhead or reduce repeated large-context processing. Total cost is not universally worse or better than linear.

## 4. More seams

```text
worker A result → worker B premise → merge → final answer
```

Each boundary can lose constraints, hide gaps, or amplify errors. Debug the whole system, not only individual workers.

## 5. A practical sequence

Start with a capable single-agent/workflow baseline. Locate the bottleneck, split along a useful boundary, and compare quality, latency, and cost.

Keep the split only if evidence supports it.

## What matters most

> Add a second desk when separation helps the work, then budget the handoff between desks.
