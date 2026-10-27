# Defining examples, features, and labels

## 1. State what one example represents

A **training example** is one input used for learning. **Features** represent that input; its supervised **target** states the answer to predict.

“One row per message” differs from “one row per conversation.” The unit changes available evidence, target structure, and dependence between examples.

## 2. Match examples to outputs

| Unit | Input | Target |
|---|---|---|
| Document | Article text | Topic category |
| Token position | Sentence and position | Entity tag |
| Text pair | Question and candidate answer | Relevance judgement |
| Source sequence | English sentence | French sequence |

A **schema** is the contract describing these fields, types, and meanings. Record it before choosing a model.

## 3. Put the prediction on a timeline

```text
messages received so far → route conversation now → later resolution
```

A future agent reply cannot be an input when routing the conversation now. A feature may exist in today’s warehouse while remaining unavailable at the historical prediction time.

Specify what is available, not merely what can eventually be retrieved.

## 4. Make the label reproducible

For routing, define what “billing” includes and how mixed requests are handled. A conversation about a late delivery and a refund may need several labels or a clearly prioritized one.

For extraction, decide whether “New York City” includes “City,” and whether punctuation belongs to the span. Label boundaries are part of the task, not cosmetic formatting.

## 5. Represent uncertain evidence honestly

**Label noise** is error or inconsistency in the recorded target. Human disagreement can expose a vague policy, missing context, or a genuinely ambiguous example.

Keep an uncertain or unresolved status where appropriate. Do not silently treat unreviewed cases as negative outcomes.

## 6. Keep source alignment

An **offset** locates a boundary in the original text under a specified indexing convention. Byte, code-point, and tokenizer positions can differ.

Store source text and alignment information when predictions must highlight exact evidence. A correct entity type with the wrong boundary is still an extraction error.

## 7. Interview reasoning

**Question:** Can an agent’s eventual resolution category directly label an earlier message?

**Answer:** It can supply an outcome target if that matches the goal, but future replies must remain outside the earlier input. Also check whether the resolution reflects the original request or later changes in the conversation.
