## What an agent actually is

An **agent** is a system where a model chooses an action, observes the result, and decides what to do next.

## 1. Model call versus agent

```text
model call: input → response
workflow:   input → predefined steps → response
agent:      input → choose → act → observe ↺ → response
```

A model can draft an answer. An agent can look up an order and choose a follow-up lookup.

## 2. Delegated control

For “Why hasn't order 48812 shipped?”:

```text
get_order → payment_review → inspect payment
          → shipped        → inspect carrier
```

The observation changes the next action.

> Code defines the roads; the model chooses the next turn.

## 3. What the engineer controls

| Runtime owns | Model proposes |
|---|---|
| Tools and permissions | Selection and arguments |
| Validation | Answer or action |
| Step, time, cost limits | More investigation |
| Success checks | Completion |

A generated refund request does not move money. Authorized execution does.

## 4. Autonomy has several controls

A three-tool, read-only agent with a five-step limit is still agentic.

Tune tool breadth, run length, and write permissions separately. Expand a boundary when measured failures show a need.

## 5. Agent does not mean reliable

Evaluate accuracy, recovery, cost, and safety.

A loop can repeat a mistake as easily as correct it. Useful autonomy needs evidence, understandable tools, and observable completion.

## What matters most

> Delegated control chooses the next step. The runtime keeps authority over execution.
