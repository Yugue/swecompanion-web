## Chunking and indexing

A **chunk** is the unit retrieved from a document. Its boundaries determine which evidence arrives together.

## 1. Preserve structure

```text
bad split: “30 days unless” | “the item is final sale”
useful:    refund rule + relevant exception
```

Prefer meaningful sections, functions, or table groups. Preserve enough context for interpretation.

## 2. Size tradeoff

Small chunks improve focus but may lose referents or exceptions. Large chunks preserve context but can mix topics and waste input.

Tune size/overlap on retrieval cases. There is no universal token count.

## 3. Self-describing chunks

Include title and breadcrumb:

```text
Refund Policy > Exceptions > Final sale
[body of the clause]
```

Keep enrichment distinguishable from source text. Do not let generated context invent facts.

## 4. Useful metadata

Store source ID, section, version/date, tenant, access policy, and document type.

```json
{"source": "policy.pdf", "section": "4.2", "tenant": "acme", "version": 3}
```

Apply permissions throughout indexing/retrieval so unauthorized text never reaches the caller's context.

## 5. Diagnose misses in order

Is the answer in the corpus? Is its context preserved? Is it searchable? Was it retrieved? Was it ranked highly? Did generation use it?

Fix the earliest failing stage.

## Interview mental model

> A chunk is a page torn from a book: it needs enough surrounding meaning to remain useful.
