## Planning strategies

Planning decides how much of the route to commit to before acting.

## 1. Three shapes

```text
plan first:   plan → execute steps
interleaved:  decide → act → observe ↺
hierarchical: coarse plan → adaptive work inside each step
```

Predictable work favors explicit scheduling. Investigation needs replanning when evidence changes.

## 2. Same task, different routes

“Why did checkout conversion fall?”

A broad plan might inspect devices, regions, deployments, and payment providers.

First evidence: one payment method in one country fell sharply. Focus next on provider incidents **and relevant code/configuration**; the slice alone does not establish a cause.

Confirm timing and alternatives before concluding.

## 3. Useful decomposition

Each step needs a verifiable artifact.

“Research competitors” is broad.

“Return five competitors with revenue year and sources” can be checked. Pricing extraction then depends on that list.

Choose independent boundaries without splitting tightly coupled reasoning into needless coordination.

## 4. Replanning triggers

Replan when required evidence is unavailable, an assumption is contradicted, a user constraint changes, or the budget no longer fits.

Cap replans. Continually rewriting a plan can become its own loop.

## 5. Validate before executing

Check coverage, dependencies, permissions, completion tests, and budgets.

A reviewable plan should expose assumptions and unresolved inputs, especially before consequential actions.

## What matters most

> A plan is a map with assumptions. Update it when the terrain contradicts them.
