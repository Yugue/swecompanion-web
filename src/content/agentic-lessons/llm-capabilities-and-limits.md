## What the underlying model gives you

The model supplies language and judgment. Tools and runtime supply capabilities text generation cannot guarantee.

## 1. Inherited capabilities

Models interpret goals, extract text, propose plans, select tools, and produce structured output.

“My package is late” can become an investigation. Current shipment status still needs a lookup.

## 2. What the system supplies

| Need | Source |
|---|---|
| Live facts | Authoritative tool |
| Exact arithmetic | Calculator or code |
| Persistent state | Storage |
| Permission enforcement | Runtime |
| Verified completion | Result or artifact check |

> The model is a navigator; tools supply instrument readings.

## 3. Missing evidence can become invention

```text
search returns no match → required order_id → invented ID
```

Represent **not found**, allow clarification, and reject unsupported IDs. A schema checks shape, not existence.

## 4. Test capability before orchestration

Give one call all necessary evidence on a representative case.

If it succeeds, orchestration may help gather that evidence. If it fails, compare another model, deterministic tool, or narrower task.

Decomposition and verification can help; extra steps alone are not a guarantee.

## 5. Reliability across steps

If ten required steps independently succeed with probability \(0.95\):

\[
P(\text{all succeed})=0.95^{10}\approx0.60
\]

Real steps are correlated, so this is illustrative. Reduce unnecessary decisions and verify important transitions.

## 6. Diagnose the layer

- Missing fact: retrieval or context.
- Wrong tool: selection, description, or model.
- Invalid argument: schema or semantics.
- Unauthorized execution: permission enforcement.
- False completion: success validation.

## What matters most

> Use flexible judgment alongside authoritative data, exact operations, and enforcement.
