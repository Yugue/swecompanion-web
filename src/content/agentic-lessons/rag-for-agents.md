## Retrieval as a tool

**Retrieval** brings external evidence into context. An agent can decide whether to search again.

## 1. Fixed or adaptive retrieval

```text
fixed:    query → retrieve → generate
adaptive: retrieve → inspect gaps → reformulate ↺ → answer
```

A fixed workflow can also perform multiple searches. Adaptive retrieval earns its cost when evidence changes the next query.

## 2. Worked order question

“Why was my last order expensive?”

```text
resolve last order → read line items → compare prior order → relevant policy
```

Latest total: $64 = $36 items + $28 shipping. Prior total: $42 = $36 items + $6 shipping.

The **$22 increase** is shipping. Establish selection or application of that shipping service from actual records, not an assumption.

## 3. Return evidence with provenance

```json
{
  "results": [{"text": "...", "source": "policy", "section": "4.2"}],
  "query_used": "expedited shipping",
  "truncated": false
}
```

Include freshness and an explicit empty result when applicable.

## 4. Reformulate from observations

An order lookup supplies an ID for the next lookup. Structured filters resolve entities and dates; semantic search finds relevant text.

Embedding the whole question cannot replace required record retrieval and arithmetic.

## 5. Ground the answer

Check that cited sources were retrieved and claims are supported by their contents.

A real citation can still be misinterpreted. Verify contradictory evidence and important exceptions.

## 6. Stop retrieval

Stop when required claims have adequate evidence, a definitive missing-data result appears, or the search budget ends.

Return unresolved questions explicitly. Repeating near-identical searches is not completion.

## What matters most

> Search to close a named evidence gap, then reassess the gap.
