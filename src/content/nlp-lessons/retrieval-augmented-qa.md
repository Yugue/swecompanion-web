# Retrieval-augmented question answering

## 1. Supply external evidence

**Retrieval-augmented generation (RAG)** retrieves material and conditions generation on it. Updated documents can supply facts without changing model weights.

The answer can still misuse or contradict its sources.

## 2. Separate indexing and answering

```nlp-visual
rag
```

Indexing prepares documents/passages. A request retrieves candidates, optionally reranks them, and assembles selected context for generation.

The generator sees that selected context, not the whole index.

## 3. Keep evidence intact

A **chunk** is a retrievable source segment.

| Chunk choice | Benefit | Failure |
|---|---|---|
| Small | Precise matching | Rule separated from exception |
| Large | More context | Dilution; token cost |
| Overlapping | Preserves boundary evidence | Duplicate candidates |

Retain document identity, section context, and source offsets.

## 4. Check support and attribution

**Grounding** ties an answer to evidence. **Attribution** identifies the supporting source.

A citation can point to an unrelated passage. Check whether the passage supports the actual claim.

Retrieved commands are source content, not permission to change the answering instructions.

## 5. Locate the failed stage

| Observation | Inspect |
|---|---|
| Fact absent from corpus | Source coverage |
| Fact present; candidate missing | Chunking, retrieval, index |
| Candidate found; evidence excluded | Reranking, context selection |
| Evidence supplied; answer wrong | Reading, generation, conflicting sources |

## 6. Evaluate the components

Measure evidence recall, answer correctness, claim support, and attribution.

**Abstention** deliberately avoids asserting an unsupported answer. Test missing/conflicting evidence and compare answer coverage with error costs.

Retrieval changes evidence; fine-tuning changes learned behavior. Both can contribute.
