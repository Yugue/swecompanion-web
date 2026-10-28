# Preparing documents for retrieval

## 1. Create useful evidence units

**Document ingestion** converts source material into retrievable records. **Chunking** splits documents into pieces that can be retrieved and placed in context.

A chunk should preserve enough meaning to support an answer while avoiding unnecessary surrounding material.

## 2. Parse structure before splitting

A **parser** extracts text and structure from the original format. Preserve headings, lists, table relationships, code boundaries, and page references where relevant.

If a table becomes a shuffled list of numbers, retrieval may return its topic while losing the evidence needed to interpret it.

## 3. Choose boundaries and overlap

A fixed token window is simple but can cut a definition from its qualification. Structural boundaries preserve sections but produce variable sizes.

**Overlap** repeats some adjacent content across chunks to protect boundary information. Excessive overlap creates redundant candidates and consumes context.

## 4. Keep metadata

**Metadata** describes a record beyond its text: source ID, version, section, timestamp, and access permissions. Keep these fields attached through retrieval so a citation can identify the exact source and applicable conditions.

```genai-visual
chunk-boundaries
```

A stable source identifier should survive changes in chunk numbering.

## 5. Update without mixing versions

When a document changes, replace or version its chunks and representations consistently. Remove stale records from both retrieval and downstream caches.

A new policy and its obsolete predecessor may look equally relevant. Similarity alone does not determine which is authoritative.

## 6. Evaluate answerability

Sample real questions and inspect whether individual chunks contain the complete necessary evidence. Measure boundary failures, parse corruption, and duplicated context.

There is no universally optimal chunk size. Choose using retrieval coverage, answer quality, and context cost on the intended corpus.
