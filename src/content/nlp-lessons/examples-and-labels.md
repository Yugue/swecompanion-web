# Defining examples, features, and labels

## 1. Define one example

A **training example** supplies an input and, in supervised learning, its target. **Features** encode the input used for prediction.

“One row per message” and “one row per conversation” expose different evidence.

## 2. Match the unit to the output

| Unit | Input | Target |
|---|---|---|
| Document | Article | Topic |
| Position | Sentence and position | Entity tag |
| Pair | Question and passage | Relevance |
| Sequence | English text | French text |

A **schema** specifies these fields, types, and meanings.

## 3. Place prediction on a timeline

```text
messages so far → route now → later agent reply and resolution
```

Later replies cannot be inputs to the earlier decision. A field in today’s warehouse may not have existed at the historical prediction time.

## 4. Make labels reproducible

For routing, decide whether billing and delivery can both apply. For extraction, decide whether “New York City” includes “City.”

These policies define the answer; they are not formatting details.

## 5. Represent uncertainty

**Label noise** is error or inconsistency in recorded targets. Disagreement can reveal unclear rules, missing context, or ambiguous cases.

Keep unresolved cases distinct from confirmed negatives. Review disagreements before relabelling them automatically.

## 6. Preserve source alignment

An **offset** locates a source boundary under an indexing convention. Bytes, code points, and model-unit positions can differ.

Retain original text and mappings when outputs must highlight evidence. Correct type plus wrong boundary remains an extraction error.
