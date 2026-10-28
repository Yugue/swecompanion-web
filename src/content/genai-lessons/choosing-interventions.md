# Choosing the right intervention

## 1. Match the intervention to the failure

An **intervention** is a deliberate change intended to improve observed behavior. Prompting, retrieval, adaptation, tools, and decoding affect different parts of a system.

An **ablation** removes or changes one component to test what it contributes.

## 2. Separate common needs

| Observed need | Candidate intervention |
|---|---|
| Unclear task or output format | Better prompt or structured output |
| Missing current/private evidence | Retrieval with access controls |
| Persistent task behavior mismatch | Relevant supervised adaptation |
| Exact calculation or state change | Validated external tool |
| Slow or expensive successful answers | Smaller model or serving optimization |

These are hypotheses to test, not automatic prescriptions.

## 3. Locate retrieval failures

Ask whether the source exists, parsed correctly, was authorized, entered the candidate set, survived reranking, and reached context.

Replacing the generator does not fix a source that ingestion omitted. Increasing context cannot recover an unauthorized or absent record.

## 4. Locate generation failures

An **oracle experiment** supplies idealized evidence to isolate downstream limits. Compare normal retrieval with the answer-bearing passages supplied directly.

| Controlled comparison | What a gain suggests |
|---|---|
| Verified supporting passages replace retrieved context | Evidence selection is limiting |
| Same passages, fewer distractors | Context interference matters |
| Same evidence, clearer task instructions | Prompt ambiguity matters |

These comparisons change specific inputs; none alone proves that model size is the cause.

## 5. Use controlled comparisons

Change one factor and evaluate the same held-out requests with matched budgets. Inspect examples where systems disagree.

A lower average cost can hide more retries or larger outputs. Include complete request cost and failure handling.

## 6. Prefer an actionable conclusion

A useful diagnosis identifies the failing stage, supporting evidence, and the next experiment. “Use a larger model” is incomplete without a tested capability gap.

Revisit the input and success definition if all variants fail in the same way. The requested outcome may be ambiguous or unsupported by available data.
