## Tool selection at scale

A large tool menu consumes context and can make similar operations hard to distinguish.

## 1. Why selection gets harder

If 200 schemas average 150 tokens, the menu alone is about 30,000 tokens.

This is illustrative, not a universal tool-count threshold. Measure size and confusion on your actual catalogue.

## 2. Retrieve before exposing

```text
intent → tool index → candidate schemas → model selection
```

```python
candidates = tool_index.search(task_description, k=12)
response = model(context, tools=[t.schema for t in candidates])
```

Keep a discovery/escalation path available when candidates miss the required tool.

## 3. Other options

Namespace by system, route to a domain menu, delegate deep domains, or consolidate near-duplicates.

Removing confusing unused tools may be cheaper than adding retrieval machinery.

## 4. Measure stages separately

- Candidate recall: was a valid required tool retrieved?
- Selection accuracy: did the model choose a valid tool?
- Argument correctness: did it supply supported values?

An omitted tool cannot be selected.

## 5. Example: 300 APIs

Group by intent/system, index descriptions and examples, retrieve a small candidate set, and enforce authorization at execution.

Tune candidate count using recall, selection quality, and token cost.

## 6. Safe miss

```text
no fit → reformulate discovery → clarify → unsupported/escalate
```

Do not substitute a nearby write tool just to produce an action.

## 7. Version the catalogue

Keep index, exposed schemas, and runtime definitions compatible. Record versions and evaluate changes on the same selection cases.

## What matters most

> First find the right shelf, then choose the right tool. Neither stage grants permission.
