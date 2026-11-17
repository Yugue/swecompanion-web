# Retrieval-augmented generation and grounding

## 1. Supply external evidence

**Retrieval-augmented generation (RAG)** searches external information and places selected evidence into the model context. **Grounding** ties an answer to available evidence rather than relying solely on parameterized knowledge.

## 2. Follow the pipeline

```llm-visual
rag-stages
```

Retrieve authorized evidence, select context, generate, then check support. Access filtering must happen before exposing text to the model or user.

## 3. Construct useful context

Preserve entity/date qualifiers and cover all required facts within the token budget. Duplicates can crowd out a necessary second source.

```genai-visual
chunk-boundaries
```

Retain source IDs so citations resolve to the supplied passages.

## 4. Require support

**Faithfulness** means support in supplied evidence; **answer correctness** means the right task result. Outdated evidence can make them diverge.

Validate cited spans, entities, dates, and qualifications. Citation presence alone earns no support credit.

## 5. Locate the failure

Provide verified evidence directly: if the answer improves, inspect retrieval, chunking, reranking, and truncation. If it stays wrong, inspect instructions and evidence use.

**Oracle evidence** is an ideal or manually verified evidence set used diagnostically. It estimates what better retrieval could enable; it is not a production retrieval method.

> **Reason it through:** Verified context fixes an answer that ordinary retrieval gets wrong. Which pipeline stages remain plausible causes?
