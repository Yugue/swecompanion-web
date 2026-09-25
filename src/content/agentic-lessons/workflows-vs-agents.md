## Workflows versus autonomous agents

A workflow and an agent can use the same model and tools. The difference is who determines the control flow.

```text
workflow: code selects the next step
agent:    model selects the next step from allowed actions
```

Most production systems combine both: deterministic code around one bounded agentic stage.

---

## 1. Start with the common workflow shapes

```text
chain:      extract → validate → format
route:      classify → choose one handler
parallel:   run independent checks → combine results
evaluate:   draft → check → revise, with a fixed limit
```

These patterns may contain model calls, but they are not agents when the sequence and branches are written in code.

Use them when the path is known because they are easier to test, observe, and cost.

---

## 2. Use an agent for a genuinely unknown path

The order-delay task may need different investigations:

```text
order status
  ├─ payment_review → inspect payment and policy
  ├─ out_of_stock   → inspect inventory and restock estimate
  ├─ shipped        → inspect carrier tracking
  └─ cancelled      → inspect cancellation reason
```

You could write every branch as code. An agent becomes useful when the branches are numerous, change often, and require judgment after each observation.

### Core intuition

An agent earns its complexity when new evidence changes which action is sensible next.

---

## 3. Put autonomy inside a deterministic shell

A practical architecture:

```text
authenticate
  → validate request
  → route simple cases to fixed workflows
  → bounded read-only investigation agent
  → validate evidence and output
  → require approval for any side effect
  → format response
```

The shell owns predictable work. The agent handles only the part whose path is hard to enumerate.

### Rule of thumb

Autonomy is usually one component, not the entire architecture.

---

## 4. Compare the tradeoff honestly

| Property | Workflow | Agentic stage |
|---|---|---|
| Path | Known in code | Chosen at runtime |
| Cost and latency | Predictable | Variable |
| Testing | Exact branches and outputs | Repeated runs and path properties |
| Unexpected cases | Only coded branches | Can adapt using available actions |
| Failure location | Usually local and explicit | May be spread across a trajectory |
| Best use | Stable repeatable process | Open investigation or recovery |

Do not choose an agent because it appears more advanced. Choose it because the task contract contains a decision path that cannot be maintained reasonably as code.

---

## 5. Convert repeated behavior back into code

Agent trajectories reveal which paths are common. If most runs perform the same sequence:

```text
get order → check payment → read policy
```

promote that sequence into a workflow and keep the agent for unusual cases. This reduces steps and variation without removing flexibility where it is still needed.

This is an important lifecycle: start with bounded autonomy when the space is unclear, then make learned regularities deterministic.

---

## 6. A simple architecture test

For each stage, ask:

- Are the possible next steps known?
- Can the branch condition be expressed reliably in code?
- Does unexpected evidence require judgment?
- Is the action reversible?
- Does the benefit of flexibility justify variable cost and failure modes?

Only the stages that require runtime judgment should remain agentic.

---

## What matters most

- **Workflow control flow lives in code; agent control flow is chosen by the model.**
- **Model calls inside a fixed sequence do not make it an agent.**
- **Use autonomy where evidence changes the path in ways that are difficult to enumerate.**
- **Wrap the agentic stage in deterministic validation, budgets, and approval gates.**
- **Move common trajectories back into code as the system matures.**

Next topic is **When not to build an agent**.
