# Retrieval-augmented question answering

## 1. Supply external evidence to an answer model

**Retrieval-augmented generation (RAG)** retrieves external material and uses it as context for generation. It can make relevant evidence available without encoding every update into model weights.

It does not guarantee that retrieved material is correct or that the answer faithfully uses it.

## 2. Separate indexing from answering

```nlp-visual
rag
```

Indexing prepares searchable documents or passages. At request time, retrieval selects candidates, optional reranking improves their order, and a context-selection step chooses what the answer model actually receives.

The generated answer is conditioned on the question, instructions, and selected evidence within its context budget.

## 3. Choose useful chunks

A **chunk** is a retrievable source segment. Small chunks can localize evidence but separate a rule from its exception. Large chunks preserve context while consuming more tokens and potentially diluting relevance.

Overlap can preserve boundary evidence but creates duplicates. Preserve document identity, section context, and source offsets so claims can be traced back to their origin.

## 4. Distinguish support from appearance

**Grounding** ties an answer to available evidence. **Attribution** identifies which source supports a claim.

A valid-looking citation can point to a passage that does not support the sentence. The model can also combine an accurate quotation with an unsupported conclusion.

Retrieved text is evidence, not automatically a trusted instruction. A passage containing commands should not silently override the task’s answering contract.

## 5. Diagnose the failing stage

| Observation | Investigate |
|---|---|
| Required fact absent from corpus | Source coverage |
| Fact exists but candidate missing | Chunking, retrieval, index |
| Candidate found but excluded | Reranking and context selection |
| Evidence supplied but answer wrong | Reading, generation, conflicts |

A strong standalone generator cannot reliably answer from evidence it never receives. More retrieved text can also introduce contradictions or hide the useful passage.

## 6. Evaluate retrieval and answers separately

Measure evidence recall, answer correctness, claim support, source attribution, and appropriate no-answer behavior. Fix the corpus snapshot and question set when comparing pipelines.

Test with missing evidence, relevant distractors, and conflicting passages. **Abstention** is a deliberate refusal to assert an unsupported answer; evaluate its costs alongside answer coverage.

Fine-tuning changes learned behavior; retrieval changes supplied evidence. They can be complementary interventions.

## 7. Interview reasoning

**Question:** The correct document was retrieved, but the answer is still wrong. Has retrieval been ruled out completely?

**Answer:** No. Check whether the needed passage survived chunking, reranking, and context assembly. Only after confirming that evidence reached the model should the diagnosis focus on its use during generation.
