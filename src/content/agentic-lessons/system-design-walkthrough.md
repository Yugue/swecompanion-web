## An agentic system design answer

A design answer connects the product outcome to the loop, evidence, execution, and measurement.

## 1. Answer outline

```text
task → autonomy? → tools/loop → context → controls → evaluation → budget → failures
```

Make assumptions explicit.

## 2. Worked task: refunds

Success: correct eligibility decision and authorized amount applied, or a useful explained escalation.

Also measure incorrect or duplicate refunds. A polite reply is not the product outcome.

## 3. Where autonomy belongs

If common cases have stable rules, use a workflow. Use bounded investigation for ambiguous records or policy exceptions requiring interpretation.

Estimate traffic proportions from data rather than asserting a fixed 80/20 split.

## 4. Loop and tools

```text
search/read order → read policy → check eligibility
                              → propose refund or escalate
```

Separate investigation from authorized execution. Set stop conditions, deadline, and step/cost limits.

## 5. Context

Include request, verified order fields, relevant policy clauses, current task state, and recent observations.

Pin order IDs, amounts, currency, constraints, and pending operations through compaction.

## 6. Controls

Authenticate ownership from trusted session state. Check remaining refundable amount, current policy, required approval, and stable operation idempotency.

Revalidate after edits or stale approvals. Customer text cannot grant permissions.

## 7. Evaluation

Cover eligible/ineligible requests, ambiguity, partial refunds, duplicates, outages, and injection attempts.

Run repeated cases. Check outcomes, forbidden effects, critical slices, resource limits, and escalation usefulness.

## 8. Budget arithmetic

At hypothetical $2/M input and $8/M output, 42,000 input plus 1,500 output costs:

\[
C=42000(2/10^6)+1500(8/10^6)=\$0.096
\]

This exceeds an $0.08 token budget before other costs. Reduce calls/context or choose another route, then recheck quality.

Measure latency separately.

## 9. Leading failure

A refund can target the wrong order despite a valid ID.

Check customer ownership, match the request to the record, clarify ambiguity, and verify actual effects. Merely seeing the ID earlier is insufficient.

## 10. Common omissions

Architecture before requirements, no stopping check, prompt-only permissions, one-run evaluation, missing budget, and unsupported completion.

## Interview mental model

> Follow one request through the whole system and show where each claim or action is checked.
