## Workflows versus autonomous agents

A **workflow** follows code-defined control flow. An **agent** uses model decisions to choose a path.

## 1. Workflow patterns

```text
chain:    extract → validate → format
route:    classify → select handler
parallel: independent checks → merge
revise:   draft → evaluate → bounded revision
```

A fixed path can contain model calls without autonomous control.

## 2. Uncertain paths

```text
order → payment_review → inspect payment
      → out_of_stock   → inspect inventory
      → shipped        → inspect carrier
```

Stable branches are easy to encode. Changing cases requiring interpretation can justify an agent.

## 3. Deterministic shell

```text
authenticate → validate → investigation → validate result → format
```

Code owns predictable work and permissions. The agent handles uncertain decisions.

## 4. Tradeoffs

| Workflow | Agentic stage |
|---|---|
| Known branches | Flexible path |
| Easier budget estimates | Variable steps/cost |
| Branch tests | Repeated outcome/path evaluation |
| Explicit failure points | Errors can cascade |

Compare against the same task contract.

## 5. Move repeated paths into code

If most runs use **order → payment → policy**, make it a workflow. Keep autonomy for exceptions.

Trajectories reveal which flexibility matters.

## 6. Architecture check

Can code express the branch reliably? Does fresh evidence require judgment? Does flexibility justify cost?

Keep autonomy where evidence supports that choice.

## What matters most

> Put a predictable shell around the smallest useful area of autonomy.
