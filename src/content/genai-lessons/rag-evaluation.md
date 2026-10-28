# Evaluating grounded answers

## 1. Evaluate the complete evidence chain

A **RAG evaluation** measures evidence retrieval, context selection, and answer generation separately as well as end to end. The goal is to distinguish where unsupported or incorrect answers arise.

A relevant document appearing somewhere in the index is not evidence that the generator received it.

## 2. Measure retrieval coverage

Define relevant evidence for each question. Recall@k measures how much of that relevant set appears among the first k candidates. **Reciprocal rank** is 1/r, where r is the first relevant item’s rank, starting at one.

For multi-document questions, finding one passage may be insufficient. Include all evidence needed for the answer.

## 3. Measure context quality

Check whether selected context retains complete supporting passages and avoids obsolete, contradictory, or unauthorized material.

An oracle-context comparison supplies ideal evidence directly. Its improvement estimates a retrieval/context bottleneck, not achievable production performance by itself.

## 4. Separate correctness and faithfulness

| Answer condition | Correct? | Faithful? |
|---|---|---|
| Repeats a false source accurately | No | Yes |
| Gives a true claim absent from evidence | Possibly | No under evidence-only rules |
| Accurately uses an authoritative current source | Yes under the task standard | Yes |

State the truth source and evidence-use policy explicitly.

## 5. Evaluate citations and abstention

Check whether each citation resolves, refers to the correct version, and supports its associated claim. Count unsupported claims even when they cite a generally relevant document.

For unanswerable questions, evaluate appropriate abstention separately from incorrect refusal on answerable ones.

## 6. Test robustness

Move evidence, introduce distractors, change key values, and update source versions. Measure whether answers respond to the change.

Track stage metrics alongside end-to-end correctness, latency, and access-control failures. Optimizing retrieval relevance alone can still worsen complete answers.
