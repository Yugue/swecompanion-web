## Context engineering

**Context engineering** assembles the evidence, state, and tools needed for each decision.

## 1. Assemble each turn

```text
policy + selected tools + current state + evidence + recent history → model
```

Prompt wording is one component; selection and budgeting govern the whole window.

## 2. Same capacity, different contents

A 32k budget with 31.5k input leaves little output space.

Selecting relevant tools/passages and compacting history might reduce input to 13.7k. The benefit comes from retaining required evidence, not merely deleting tokens.

## 3. Relevance versus volume

Three relevant passages among 30 compete with 27 distractors.

Select enough evidence to answer completely. Fewer passages are not always better if exceptions or contrary evidence disappear.

Measure input processing and decision quality.

## 4. Eviction policy

| Keep exact | Compact/externalize | Drop |
|---|---|---|
| Goal, constraints, approvals, IDs | Older narrative, artifacts | Duplicates, irrelevant extracts |

Decide this before long runs. Preserve user corrections.

## 5. Stable and changing blocks

Put reusable instructions before changing task content when the interface's caching rules support it.

Tool retrieval may change the prefix. Balance selection savings against cache reuse.

## 6. Pointers instead of payloads

```json
{"artifact": "orders.csv", "rows": 48210, "preview_rows": 5}
```

The agent can use a read/code tool to inspect the file. A pointer without access is missing evidence.

## 7. Trust and provenance

Label each block with source, scope, freshness, and authority.

A fetched policy and customer attachment are different kinds of evidence. Labels aid interpretation; permissions still require enforcement.

## 8. Evaluate assembly

Measure required-evidence recall, tool availability, distractors, constraint retention, and headroom.

If the fact never entered context, test retrieval/assembly before changing the model.

## What matters most

> Arrange the desk for the next decision, keeping the assignment and necessary evidence visible.
