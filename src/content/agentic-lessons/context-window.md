## The context window as working memory

The **context window** is the information available to one model call. The application assembles it.

## 1. What enters the window

| Block | Purpose |
|---|---|
| Instructions | Goal and behavior |
| Tools | Available actions |
| Task state | Current facts and constraints |
| Recent history | Calls and observations |
| Evidence | Relevant documents |
| Current request | Latest direction |

Stored information helps only when supplied through context or tools.

## 2. More is not always better

Irrelevant text consumes capacity, processing time, and attention.

> A desk full of every document makes the current task harder to find.

## 3. Allocate the budget

Illustrative 32k-token total budget:

```text
instructions/tools  5k
state               2k
evidence           10k
recent history      8k
output reserve      4k
margin              3k
```

Allocation depends on model limits and the task.

## 4. State versus transcript

Transcript: what was said. State: what is currently true.

```json
{
  "goal": "Explain order 48812 delay",
  "facts": ["payment_review"],
  "open_questions": ["review age"],
  "constraints": ["read-only"]
}
```

Store authoritative state outside the prompt.

## 5. Evict deliberately

Remove duplicates, externalize payloads, retrieve smaller extracts, then summarize older history.

Keep IDs, amounts, constraints, approvals, and active errors exact.

## 6. Check before calling

Is evidence findable and current? Are constraints explicit? Is anything duplicated?

Pointers help only when the agent can retrieve their content.

## 7. Reserve headroom

Reserve response capacity and room for later observations. Compact before a subsequent call would overflow.

Emergency truncation can remove the original goal.

## 8. Diagnose context failures

Was the needed fact **present, findable, current, and trustworthy**?

Measure evidence recall, constraint retention, and unnecessary tokens.

## What matters most

> Supply the smallest complete set of information needed for the next decision.
