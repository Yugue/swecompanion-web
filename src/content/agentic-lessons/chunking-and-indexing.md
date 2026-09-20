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

## What you should say in an interview

For "retrieval keeps missing an answer you can see in the corpus":

> I'd work it in order rather than guessing. First, confirm the text is actually in the index - ingestion silently drops PDFs and tables more often than people expect. Second, check whether the answer sits in one chunk or straddles a boundary, because a sentence split across two chunks can't be retrieved by either; fixing that is usually splitting on document structure instead of fixed sizes, with some overlap. Third, read the chunk on its own - if it's full of unresolved pronouns or has no topic sentence, its embedding is meaningless, and prepending the title and breadcrumb usually fixes it. Fourth, try keyword search: if BM25 finds it and dense doesn't, the query hinges on a rare literal like an error code or SKU, and I need hybrid. Fifth, if it's retrieved but ranked thirtieth, that's a reranking problem, not a retrieval one. Only if all of that is clean would I look at the embedding model. And separately I'd check that permission and recency filters are applied inside the query rather than after, both for correctness and because a stale document outranking a current one looks exactly like a retrieval miss.

Next topic is **Embeddings, hybrid search, and reranking**.
