## Structured output and schemas

An agent acts through machine-readable output. The schema is the contract between a probabilistic model and code that has to run. The interview point most candidates miss: a schema constrains **shape**, and shape has nothing to do with **truth**.

### 1. Three ways to get structure

| Method | Guarantee | Cost |
|---|---|---|
| Ask nicely in the prompt | None - best effort | Free, and fails a few percent of the time |
| Ask + validate + retry | Eventually valid | An extra round trip on failure |
| Constrained decoding | Valid by construction | Slight decode overhead, less flexibility |

Constrained decoding works at sampling time: at each position, tokens that could not continue a valid document are masked out, so the probability of malformed output is zero rather than small.

```text
grammar/schema ──► token mask ──► sample only from legal tokens
```

With a few percent malformed rate and a 20-step agent, roughly one run in three would hit a parse failure. That is why this matters more for agents than for chat.

---

### 2. Shape is not truth

```text
{
  "order_id": "ORD-48812",     ← valid string, matches the pattern, does not exist
  "refund_amount": 240.00,     ← a number, not the number
  "policy_clause": "4.2(b)"    ← well-formed citation of nothing
}
```

Every field validates. Nothing is true. Structured output moves the failure from "crashes your parser" to "silently proceeds with invented values," which is more dangerous unless you add semantic validation after parsing.

### Rule of thumb

> Constrained decoding guarantees your code will run. It does not guarantee it should.

---

### 3. Design schemas the model can satisfy honestly

The most common schema bug is a required field the model cannot know.

```text
✗  {"customer_tier": "gold" | "silver" | "bronze"}          required
   → model must guess when the record didn't include it

✓  {"customer_tier": "gold" | "silver" | "bronze" | "unknown",
    "tier_source": "record" | "inferred" | "missing"}
```

Give the model a legal way to say "I don't know," or it will use an illegal one that happens to typecheck.

Other rules that pay off:

- Enums over free text wherever the set is closed.
- Units in the field name: `timeout_seconds`, not `timeout`.
- Flat over deeply nested - nesting raises the error rate.
- A short `reasoning` or `evidence` field before the decision field, so the ordering of generation puts justification first.

---

### 4. Validate in two layers

```text
parse  ──► schema valid?  ──► semantically valid?  ──► act
             │                      │
           retry                  reject / ask / halt
```

Layer two is yours: does this order exist, is the amount within policy, is this recipient on the allowlist? For anything irreversible, layer two is mandatory.

---

### 5. Failure handling is part of the design

Decide up front what happens when validation fails:

1. Retry with the validation error appended as an observation - usually effective, because the error is concrete.
2. Fall back to a narrower schema or a simpler question.
3. Escalate to a human.

An agent with no defined behavior on validation failure will do the worst of the three by accident.

---

## What you should say in an interview

For "constrained decoding guarantees valid JSON - what does it not prevent?":

> Two things. First, semantic falsehood: every field can be well-typed and still be invented - an order ID matching the right pattern for an order that doesn't exist, or an amount that isn't the amount. The schema constrains shape, not truth, so I still need a validation layer that checks the values against the system of record before anything irreversible runs. Second, it doesn't prevent forced guessing: if a field is required and the model has no way to know it, a valid enum value comes out anyway. I design around that by giving every uncertain field a legal "unknown" value plus a source field, so the model can be honest inside the schema. And I decide the failure path in advance - retry with the validation error as an observation, narrow the schema, or escalate - because an agent with no defined behavior on invalid output picks one at random.

Next topic is **The agent loop**.
