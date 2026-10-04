## Structured output and schemas

A **schema** is the communication contract between model output and application code.

## 1. Levels of structure

| Approach | Checks |
|---|---|
| Prompt asks for JSON | Best-effort format |
| JSON-constrained mode | JSON syntax |
| Schema-constrained generation | Supported fields/types |

Handle refusal, truncation, and unsupported schemas according to the interface.

## 2. Shape is not truth

```json
{"order_id": "ORD-99999", "status": "refunded"}
```

Valid structure does not prove the order exists or a refund happened.

> A correctly filled form can contain wrong information.

## 3. Allow honest unknowns

```json
{
  "status": "needs_information",
  "cause": null,
  "evidence_ids": [],
  "missing_information": ["order identifier"]
}
```

Use enums, optional/nullable fields, and evidence references.

## 4. Two validation layers

**Structural:** fields, types, allowed values.

**Domain:** ID exists, amount is valid, evidence belongs to the run, transition is legal.

## 5. Handle failures

Repair formatting within a limit. Retrieve facts or ask the user. Return blocked when access is unavailable.

Do not invent defaults to pass validation.

## 6. Keep contracts small

Separate investigation results, action proposals, and customer responses. They have different consumers and permissions.

## 7. Version schemas

Optional additions may be compatible. Changed meanings or new required fields can break consumers.

Record versions and reject unsupported contracts.

## 8. Generation is not authorization

```text
generate → parse → validate meaning → authorize → execute
```

Use trusted session state for permissions. Valid structure cannot grant access.

## What matters most

> Schemas protect structure; evidence and application checks protect meaning.
