## Structured output and schemas

An agent communicates with software, not only with people. Tool requests, plans, decisions, and final results therefore need machine-readable structure.

A schema defines the shape of that communication. It reduces parsing failures, but it does not make the content true.

---

## 1. Three levels of structure

| Method | What it provides | Main weakness |
|---|---|---|
| “Return JSON” in the prompt | A formatting request | May produce invalid or extra text |
| JSON mode | Syntactically valid JSON | Shape may still be wrong |
| Schema-constrained output | Required fields and allowed types | Values may still be false |

Use schema-constrained output for interfaces that code must consume. Prompt-only formatting is appropriate only when occasional repair is acceptable.

---

## 2. Shape and truth are different guarantees

This object is valid and still unsafe:

```json
{
  "order_id": "ORD-99999",
  "status": "refunded",
  "confidence": 0.99
}
```

A schema can verify that the fields exist and have the right types. It cannot verify that the order exists or that a refund occurred.

### Core intuition

Use schemas for shape. Use tools and validation for truth.

---

## 3. Design schemas the model can satisfy honestly

A bad schema forces invention:

```json
{
  "cause": "string",
  "resolution": "string"
}
```

What if the cause is unknown? A better schema represents that state:

```json
{
  "status": "resolved | needs_information | blocked",
  "cause": "string | null",
  "evidence_ids": ["string"],
  "missing_information": ["string"],
  "next_action": "string | null"
}
```

Useful schema choices include:

- enums for small known sets,
- optional or nullable fields for genuinely unknown values,
- explicit status fields,
- evidence references for important claims,
- defaults only when a real default exists.

### Rule of thumb

Never require a value the model may not have enough evidence to provide.

---

## 4. Validate in two layers

```text
structural validation
  - valid JSON
  - required fields present
  - correct types and enum values

domain validation
  - order ID exists
  - amount is within policy
  - cited evidence belongs to this run
  - requested transition is allowed
```

Structural validation can often happen during generation. Domain validation belongs in application code after parsing.

---

## 5. Decide what failure means

When validation fails, choose an explicit response:

```text
repair once        for a small formatting mismatch
ask the user       when required input is missing
call a tool        when an authoritative value can be retrieved
return blocked     when permission or evidence is unavailable
stop safely        when retrying could repeat a side effect
```

Do not silently insert invented defaults to make the object pass.

---

## 6. Keep interfaces small

Large nested schemas create more places for inconsistent or unnecessary data. Separate different decisions when they have different lifecycles:

```text
investigation result → evidence and cause
action proposal      → requested side effect and justification
final response       → customer-facing message
```

This also makes permissions clearer: producing an investigation result is not the same as authorizing an action.

---

## What matters most

- **Structured output is an interface contract between the model and code.**
- **Schema-constrained output guarantees shape, not truth.**
- **Represent unknown, blocked, and incomplete states explicitly.**
- **Validate both structure and domain meaning.**
- **Define repair, clarification, retrieval, and safe-stop behavior before failure occurs.**
- **Prefer several small contracts over one oversized schema.**

Next topic is **Defining the agent task contract**.
