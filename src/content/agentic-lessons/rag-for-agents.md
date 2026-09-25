## Retrieval as a tool

**Retrieval means looking something up and dropping the result into the model's context so it can use it.** Without it a model can only answer from what it absorbed during training - nothing about your documents, your customers, or today.

The classic arrangement (usually called RAG, retrieval-augmented generation) looks things up **once**, before answering. An agent instead treats retrieval as an **action it can repeat**: read what came back, notice it is not enough, and search again with better words. That fixes the single-shot query's biggest weakness and costs you round trips.

The context-engineering lesson decides how much evidence may enter the window. This lesson focuses only on how that evidence is found and grounded.

---

## 1. The two shapes

```text
classic RAG:     query ──► retrieve ──► generate ──► answer
                          (one shot; if the query was wrong, so is the answer)

agentic RAG:     goal ──► retrieve ──► read ──► reformulate ──► retrieve ──►
                       ──► enough? ──► answer (with citations)
```

The agent can decompose a multi-part question, search different sources for different parts, notice a gap, and go back.

| | Classic | Agentic |
|---|---|---|
| Latency | One round trip | Several |
| Cost | Low, predictable | Higher, variable |
| Multi-hop questions | Poor | Good |
| Vague questions | Poor | Good - it can narrow |
| Simple lookup | **Better** | Wasteful |

### Rule of thumb

> Route by question shape: one hop and well specified goes to classic RAG; multi-hop or vague earns the loop.

---

## 2. One question, two architectures

*"Why was my last order more expensive than usual?"*

```text
CLASSIC RAG (one shot)
  embed the whole question → search → generate
  retrieved: three help-centre articles about pricing
  answer:    a generic explanation of how pricing works
             ← it never found out anything about THIS user's orders
```

```text
AGENTIC (retrieval as an action)
  step 1  "last" and "usual" are not searchable. Resolve them first.
          search_orders(user="u_8812", limit=5)
          → [{id:441, total:64.00, date:"2026-03-02"},
             {id:438, total:41.50, date:"2026-02-11"}, ...]

  step 2  "So the last one is $64 against a usual ~$42. What changed?"
          get_order_lines(order_id=441)
          → [{sku:"A-22", qty:2, unit:18.00}, {sku:"SHIP-EXP", amount:28.00}]

  step 3  "Expedited shipping is $28 of the difference. Was it chosen, or defaulted?"
          get_policy(topic="expedited_shipping")
          → {auto_applied_when:"delivery_under_48h", ...}

  answer  "$28 of it is expedited shipping, applied automatically because you
           chose delivery within 48 hours. The items themselves cost $36, in
           line with your usual orders."
```

The loop wins here for one specific reason: **the second query could not be written before seeing the first result.** No amount of query rewriting up front gets you to `get_order_lines(441)`, because `441` did not exist until step 1 ran.

### Rule of thumb

That is also the test for when the loop is worth its extra round trips. If the whole question can be answered by one well-formed search, the loop is just a more expensive way to do it.

---

## 3. What the retrieval tool must return

```json
{"results": [
   {"text": "...", "source": "policy.pdf", "section": "4.2 Refunds",
    "updated": "2026-01-14", "score": 0.81}],
 "query_used": "refund window exceptions",
 "total_found": 3}
```

Three non-negotiables:

1. **Provenance** on every passage - without it the agent cannot cite and you cannot debug.
2. **The query actually used**, so the trace shows what was searched.
3. **An explicit empty result**: `{"results": [], "message": "No matches for X. Try broader terms or a different source."}`

### Common issue

That third one is where hallucination starts. An empty string leaves the model to produce the most plausible continuation, which is an invented citation.

---

## 4. Query reformulation is the real win

```text
user: "why was my last order more expensive than usual?"

agent: search_orders(customer, limit=2)        ← resolve "last" and "usual"
       → two concrete order IDs
       search_pricing(sku, date_range)         ← now searchable terms exist
       → a promotional price on the earlier order
```

### Intuition

Note that the first "retrieval" is a structured lookup, not a search by meaning. Agents that can only search by meaning will turn "more expensive than usual" into a numeric fingerprint (an **embedding** - two lessons from here) and retrieve nothing useful, because the phrase does not resemble any stored text. Give the agent both structured filters and semantic search.

---

## 5. Grounding the answer

```text
answer must cite ──► citations checked against retrieved passages ──► fail ⇒ revise
```

A cheap post-check - does every cited source appear in what was actually retrieved, and does the quoted text exist in it - catches the most damaging class of RAG error at almost no cost. This is grounded reflection, and it belongs in any production answer.

**Knowing when to stop searching.** Give the agent a stopping rule and a budget. Something like: stop once two independent sources agree, or after four searches - then say what you could not find.

Without one you get the search-forever failure. Every query looks defensible, and none of them conclude.

---

## What matters most

- **Route by question shape.** A single-hop, well-specified lookup should take the cheap one-shot path; multi-hop or vague questions earn the loop.
- **The agentic version's real gain is reformulation** - it reads what came back, notices the gap, and searches again with better words.
- **The retrieval tool must return provenance, the query it actually used, and an explicit "no results" message.** A blank result is where invented citations begin.
- **Give the agent structured filters alongside semantic search.** Questions like "my last order" need a lookup, not a similarity match.
- **Check citations after the fact** - that every cited source was really retrieved - which catches the most damaging RAG failure for almost nothing.
- **Give it a stopping rule,** or every query stays defensible and none of them conclude.

Next topic is **Chunking and indexing**.
