# Knowledge in weights versus context

## 1. Supply external evidence

**Retrieval-augmented generation (RAG)** retrieves relevant information and includes it in a generative model’s context. It combines an evidence-finding stage with an answer-generation stage.

The retrieved text changes the current input. Ordinary RAG does not update model weights during the request.

## 2. Separate three knowledge sources

| Source | Strength | Limitation |
|---|---|---|
| Model weights | Broad learned patterns | Hard to inspect or update precisely |
| Supplied context | Explicit current evidence | Limited space and possible contradictions |
| External tool | Current records or exact operations | Requires correct calls and permissions |

These sources can complement each other.

## 3. Follow the evidence path

Split sources into passages called **chunks** and build an **index**, a structure for efficient lookup. At request time, retrieve candidates, select evidence, construct the prompt, and generate an answer.

```genai-visual
rag-pipeline
```

If a crucial passage never reaches the prompt, the generator cannot use it as supporting evidence.

## 4. Define an evidence contract

State which sources count, their effective dates, access permissions, and whether answers must cite them.

The system should distinguish absent evidence from evidence that explicitly rules out an answer.

## 5. Use retrieval when it fits

For a small authorized corpus that fits the prompt, supplying all documents is a useful baseline: it avoids retrieval misses. Larger or frequently changing corpora make selective retrieval more valuable.

Compare complete answer quality, freshness, latency, and input cost. A long context limit does not ensure that a model uses every relevant passage.

## 6. Preserve trust boundaries

Retrieve only documents the requester may access. Treat document content as evidence, not as instructions granting new permissions.

Check retrieval coverage separately from evidence use by the generator. A search improvement can still produce a worse answer if it adds contradictory or distracting text.
