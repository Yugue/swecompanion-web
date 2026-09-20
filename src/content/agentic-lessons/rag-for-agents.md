## Retrieval as a tool

Classic RAG retrieves once, before generation. An agent turns retrieval into an **action** it can take repeatedly, with queries it writes after seeing what the last attempt returned. That difference fixes the single-shot query's biggest weakness and costs you round trips.

### 1. The two shapes

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

### 2. What the retrieval tool must return

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

That third one is where hallucination starts. An empty string leaves the model to produce the most plausible continuation, which is an invented citation.

---

### 3. Query reformulation is the real win

```text
user: "why was my last order more expensive than usual?"

agent: search_orders(customer, limit=2)        ← resolve "last" and "usual"
       → two concrete order IDs
       search_pricing(sku, date_range)         ← now searchable terms exist
       → a promotional price on the earlier order
```

Note that the first "retrieval" is a structured lookup, not a vector search. Agents that only have semantic search will embed "more expensive than usual" and retrieve nothing useful. Give the agent both structured filters and semantic search.

---

### 4. Grounding the answer

```text
answer must cite ──► citations checked against retrieved passages ──► fail ⇒ revise
```

A cheap post-check - does every cited source appear in what was actually retrieved, and does the quoted text exist in it - catches the most damaging class of RAG error at almost no cost. This is grounded reflection, and it belongs in any production answer.

---

### 5. Knowing when to stop searching

Give the agent a stopping rule and a budget: "stop when you can answer with at least two independent sources, or after four searches - then say what you could not find." Without one you get the search-forever failure, where every query is defensible and none of them conclude.

---

## What you should say in an interview

For "when is single-shot RAG strictly better?":

> When the question is single-hop and well specified - "what's the refund window?" One retrieval and one generation answers it in one round trip at predictable cost, while an agentic loop spends several model calls deciding to do the same thing. I'd route by question shape rather than picking one architecture: classify the query, send simple lookups down the cheap path, and reserve the loop for multi-hop or vague questions where the second query depends on what the first returned. When I do use the loop, the retrieval tool has to return provenance on every passage, the query it actually used, and an explicit "no results" message rather than an empty string - that last one is where invented citations come from. I'd also give the agent structured filters alongside semantic search, since questions like "my last order" need a lookup rather than an embedding, and I'd add a citation check that verifies every cited source was actually retrieved.

Next topic is **Chunking and indexing**.
