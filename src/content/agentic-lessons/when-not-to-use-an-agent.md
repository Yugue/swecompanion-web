## When not to build an agent

Choose the simplest architecture that meets the task's quality and resource requirements.

## 1. Lowest useful autonomy

```text
one transformation       → model call
known steps/branches     → workflow
fixed search/retry logic → deterministic loop
adaptive investigation  → bounded agent
```

## 2. Simpler tasks

Known-form extraction, fixed eligibility rules, and drafting one message often need a call or workflow.

“Format these fields as JSON” does not require choosing external actions.

## 3. Poor-fit constraints

| Constraint | Problem |
|---|---|
| Tight deadline/cost | Variable step count |
| Missing trusted data | No basis for verification |
| Unobservable completion | No stopping check |
| Consequential broad writes | Permission boundaries needed |
| No usable traces | Difficult diagnosis |

A read-only investigator may fit where autonomous execution does not.

## 4. Questions before designing

Ask for three real examples, error consequences, and time/cost budgets. Define observable completion.

Similar paths suggest a workflow; changing investigations suggest an agentic stage.

## 5. Order-delay example

```text
authenticate → known status?
                 ├→ yes: response workflow
                 └→ no: bounded investigation
                            ↓
                    validate evidence + draft
```

The uncertain stage earns autonomy.

## 6. Part 1 checkpoint

Explain control, model versus runtime, the loop, context, schemas, and scope.

Then identify the decision requiring model-selected actions. If none exists, start simpler.

## What matters most

> Use autonomy for a demonstrated need for adaptive decisions.
