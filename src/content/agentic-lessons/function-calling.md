## Function calling mechanics

**Function calling** lets a model request a tool operation. The runtime decides whether to execute it.

## 1. The sequence

```text
schemas → model request → validate/authorize → execute → observation → model
```

Looking up an order is an ordinary backend call after the model selects it.

## 2. What crosses the boundary

```json
{
  "call_id": "c1",
  "name": "get_order",
  "arguments": {"order_id": "48812"}
}
```

This is a request, not an executed action. A returned observation carries the same call ID.

> Think of the model submitting a form to a checked backend.

## 3. Tool definitions enter context

A schema supplies name, purpose, arguments, and constraints.

Long definitions consume input capacity. Overlapping names can confuse selection. Measure the actual schemas and available tools per turn.

## 4. Authorization belongs in code

| Prompt guidance | Runtime check |
|---|---|
| Read only this user's orders | Filter by authenticated session identity |
| Respect refund limits | Validate amount against policy |
| Use staging | Credentials scoped to staging |

Do not accept model-supplied identity as proof of ownership.

## 5. Bind results to calls

```text
c1 → order lookup → order observation
c2 → user lookup  → user observation
```

Results can arrive out of order. Bind by ID so one response cannot become another call's evidence.

## 6. Validate arguments

Check shape, domain meaning, permissions, and preconditions.

A numeric refund amount can still be negative, too large, or unauthorized.

## 7. Divide responsibilities

The model proposes tools and arguments from evidence. Runtime checks determine whether they are valid and allowed.

Return concise actionable errors so correctable requests can be repaired.

## What matters most

> Selection is a model decision; execution is a validated runtime operation.
