## The agent loop

Every agent framework reduces to the same cycle: give the model the current context, let it request one of the allowed actions, execute that action in the runtime, and return the observation.

```text
context → decide → act → observe
   ↑                         │
   └─────────────────────────┘
```

The loop ends when the task succeeds or the runtime stops it.

---

## 1. The smallest useful implementation

```python
context = [system_instructions, user_goal]

for step in range(MAX_STEPS):
    decision = model(context, tools=TOOLS)

    if decision.is_final:
        return validate_final(decision.answer)

    call = validate_and_authorize(decision.tool_call)
    observation = execute(call)
    context += [call, observation]

raise StepBudgetExceeded
```

The model decides which allowed action to request. The runtime validates, authorizes, executes, and records it. Keeping those responsibilities separate is the central design rule.

---

## 2. One iteration in detail

```text
model reads current context
          ↓
emits a tool request or final answer
          ↓
runtime validates arguments and permissions
          ↓
runtime executes with time and resource limits
          ↓
result is normalized into an observation
          ↓
observation is appended for the next decision
```

The model never executes the action directly. Function calling and tool-runtime design are covered in Chapter 2; for now, remember that the request and the execution are different events.

---

## 3. A complete short run

Goal: *“Find out why order 48812 has not shipped and tell the customer.”*

```text
step 1
  call: get_order(order_id="48812")
  observation: {shipment_id:null, status:"payment_review"}

step 2
  decision: there is no shipment to track; inspect payment review
  call: get_payment_review(order_id="48812")
  observation: {state:"manual_review", age_hours:36}

step 3
  decision: obtain the approved customer-facing explanation
  call: get_policy(topic="payment_review_delay")
  observation: {message:"Payment verification is in progress",
                escalate_after_hours:72}

step 4
  final: explain the delay and state when escalation becomes available
```

The first observation changed the path. A fixed “track the shipment” sequence would have failed because no shipment existed.

---

## 4. Every run needs three ways to stop

| Stop type | Example | Owner |
|---|---|---|
| Success | Required answer or artifact is complete | Model proposes; runtime validates |
| Budget | Step, time, token, or cost limit reached | Runtime |
| Safety | Permission failure, repeated action, or policy violation | Runtime |

### Rule of thumb

A step limit is a safety boundary, not a solution to looping. If normal runs often hit the limit, diagnose the task, instructions, or available actions.

---

## 5. Common loop failures

```text
repetition:   same tool and arguments called again
oscillation:  search → read → same search → same read
ignored result: tool says "not found"; model acts as if it succeeded
premature stop: final answer claims an action that never happened
goal drift:   the run starts solving a nearby, easier task
```

These failures are visible in the sequence of calls and observations. That sequence is the agent’s **trajectory** and later becomes the main debugging artifact.

A simple runtime can already detect repeated calls and impossible completion claims without asking another model.

---

## 6. Persist the boundary, not private reasoning

For each step, record:

- the action requested,
- validated arguments,
- the observation returned,
- timestamps and resource usage,
- the run status.

That is enough to replay and diagnose behavior. Do not treat generated reasoning text as a faithful internal explanation; observable actions and evidence are the reliable record.

---

## What matters most

- **The loop is decide → act → observe, repeated.**
- **The model requests; the runtime validates, authorizes, and executes.**
- **New observations can change the path, which is the reason to use an agent.**
- **Every run needs success, budget, and safety stopping conditions.**
- **Debug from the trajectory:** calls, observations, and state transitions.

Next topic is **The context window as working memory**.
