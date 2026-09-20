## Chunking and indexing

Chunk boundaries decide what can ever be retrieved as a unit. Most "the retriever is bad" complaints are really "the chunks were wrong," and that is the more useful thing to say in an interview.

### 1. Structure first, size second

```text
✗  fixed 512 tokens, ignoring the document
   → "...the refund window is 30 days unless" | "the item was final sale..."
      two chunks, neither of which answers the question

✓  split on the document's own boundaries
   → sections, subsections, functions, table rows, log events
```

Split on headings for documents, on functions or classes for code, on rows for tables, and only fall back to fixed sizes for unstructured prose.

---

### 2. The size tradeoff

| Too small (~100 tokens) | Too large (~4,000 tokens) |
|---|---|
| Loses the context that makes it interpretable | Embedding is an average of many topics |
| Pronouns lose referents | Retrieves a lot of irrelevant text with the answer |
| Precise embeddings, fragmentary content | Wastes the window; dilutes relevance |

Typical working range is 200-800 tokens with 10-20% overlap, but the honest answer is that it depends on document structure and should be tuned against a retrieval eval set.

### Rule of thumb

> A chunk should be the smallest piece of text that still answers a question on its own.

---

### 3. Make chunks self-describing

```text
chunk text = "Refund Policy > 4.2 Exceptions > Final sale items\n\n" + body
```

Prepending the title and breadcrumb does two things: it improves the embedding, because the topic is now in the text, and it makes the retrieved passage readable to the agent without the surrounding document. Add a short contextual sentence generated at index time if the source is especially fragmentary.

---

### 4. Index the metadata you will filter on

```json
{"text": "...", "embedding": [...],
 "source": "policy.pdf", "section": "4.2",
 "updated": "2026-01-14", "tenant": "acme", "acl": ["billing"],
 "doc_type": "policy"}
```

Filtering usually beats a better embedding:

- **Recency** - stale policies outrank current ones on similarity alone.
- **Tenant and ACL** - must be enforced in the query, not after retrieval, or you leak.
- **Doc type** - "policy only" removes a whole class of confusion.

Permissions in particular have to be a filter on the search itself. Retrieving then filtering means the passage already entered your pipeline.

---

### 5. Diagnosing a retrieval miss, in order

```text
1. Is the answer in the corpus at all?            → ingestion problem
2. Is it in ONE chunk, or split across two?       → chunking problem
3. Does the chunk read sensibly standalone?       → context/enrichment problem
4. Does lexical search find it but dense doesn't? → need hybrid
5. Is it retrieved but ranked 30th?               → need reranking
6. Retrieved and ranked well, still unused?       → prompt/context assembly problem
```

Working the list in order is the answer. Jumping to "fine-tune the embedding model" at step 1 is the mistake.

---

## Interview mental model

Most "the retriever is bad" complaints are chunking complaints. Work the diagnosis in order rather than guessing:

```text
1. is the text in the index at all?        → ingestion (PDFs and tables get dropped)
2. is the answer split across two chunks?  → split on document structure, add overlap
3. does the chunk read standalone?         → prepend title + breadcrumb
4. does keyword search find it?            → you need hybrid, not a better embedding
5. retrieved but ranked 30th?              → reranking, not retrieval
6. retrieved, ranked well, unused?         → context assembly
```

- **A chunk should be the smallest piece of text that still answers a question on its own.**
- **Index the metadata you will filter on,** and apply permission and recency filters *inside* the query - filtering afterwards means the passage already entered your pipeline.
- **Jumping to "fine-tune the embedding model" at step 1 is the mistake.**

Next topic is **Embeddings, hybrid search, and reranking**.
