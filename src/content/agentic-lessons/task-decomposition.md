## Task decomposition and dependency graphs

Decomposition turns a goal into artifacts and dependencies. One agent or a workflow can execute it.

## 1. Name the artifact

“Investigate pricing” is vague.

“Return pricing tiers with currency, date, and source” defines a usable result.

## 2. Real boundaries

Separate independent sources, records, files, or phases.

Keep tightly coupled decisions together when splitting would require constant context exchange.

## 3. Dependency graph

```text
product data ─┐
pricing data ─┼→ comparison → recommendation
review data ──┘
```

```json
{
  "id": "compare",
  "depends_on": ["products", "pricing", "reviews"],
  "artifact": "comparison.json"
}
```

Ready nodes can run together.

## 4. Granularity

“Analyze the entire market” is too broad. “Read one title” may be too small.

“Extract one competitor's pricing tiers” has a natural output and independent failure boundary.

## 5. Coverage

Map every requirement to a clear accountable owner: discovery, pricing, source verification, synthesis.

Collaboration is allowed; ambiguous responsibility creates gaps and duplication.

## 6. Failure behavior

Define retry eligibility, useful partial results, downstream blockers, and replanning triggers.

A missing required price should remain visible, not silently become zero.

## 7. Local budgets

Allocate steps/time/spend per node within the global limit.

A six-step pricing branch can return partial fields on exhaustion rather than starving synthesis.

## 8. Merge contract

Use shared IDs, field names, units, provenance, and conflict rules.

```text
worker result → {entity_id, fields, sources, missing}
merge         → join by ID; retain conflicts
```

## What matters most

> Decompose into pieces that fit together, not merely pieces that can run separately.
