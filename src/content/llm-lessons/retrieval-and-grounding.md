# Retrieval-augmented generation and grounding

## 1. Supply external evidence

**Retrieval-augmented generation (RAG)** searches external information and places selected evidence into the model context. **Grounding** ties an answer to available evidence rather than relying solely on parameterized knowledge.

## 2. Follow the pipeline

```llm-visual
rag-stages
```

Keep qualifications with the claims they modify. Duplicated chunks can consume the evidence budget without adding coverage. Filter access before exposing text to the model or user.

## 3. Construct useful context

Select passages that jointly cover the answer, preserve entity/date qualifiers, and fit the token budget. Near-duplicate results can crowd out a necessary second source.

```genai-visual
chunk-boundaries
```

Store source IDs with evidence so generated citations can resolve to the exact passages used.

## 4. Require support

**Faithfulness** means generated claims are supported by the supplied evidence. **Answer correctness** asks whether the answer is right for the task. They can diverge if the evidence itself is outdated.

A citation’s presence does not establish support. Check the cited span, entity, date, and qualification. Conflicting evidence may require an explicit uncertainty statement.

## 5. Locate the failure

Provide verified evidence directly: if the answer improves, inspect retrieval, chunking, reranking, and truncation. If it stays wrong, inspect instructions and evidence use.

**Oracle evidence** is an ideal or manually verified evidence set used diagnostically. It estimates what better retrieval could enable; it is not a production retrieval method.
