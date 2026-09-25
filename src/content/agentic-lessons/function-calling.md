## Function calling mechanics

**Function calling is how a model asks for something to happen in the real world.** It cannot look up an order or send an email itself. It writes down which tool it wants and what arguments to use, and your code decides whether to actually run it.

```text
model writes:  {"tool": "get_order", "args": {"id": "48812"}}
your code:     is this allowed?  →  run it  →  hand the result back
```

So the single most important sentence here is: **the model does not execute anything.** Every security property of an agent lives in that gap.

### Chapter goal

By the end of Chapter 2, you should be able to trace a tool call across the model/runtime boundary, design arguments and observations the model can use, handle failures safely, choose sequential or parallel execution, and keep a growing tool catalogue understandable.

---

## 1. What actually happens

```text
1.  tool schemas are serialized into the prompt
2.  model emits:  {"tool": "get_order", "args": {"id": "48812"}, "call_id": "c1"}
3.  runtime AUTHORIZES the call          ← your code, your rules
4.  runtime EXECUTES it                  ← with timeout, limits, scoped creds
5.  result appended as an observation tied to call_id "c1"
6.  model reads the observation and decides again
```

### Core intuition

Steps 3 and 4 are ordinary backend engineering. The model has no more privilege than a form submission from an untrusted client.

---

## 2. What crosses the wire

The model does not call anything. It emits text in a structured shape, and your runtime does the rest:

```text
1. you send                  [system][tool schemas][conversation]

2. model returns             {"tool_calls": [{
                                "id": "call_a7",
                                "name": "issue_refund",
                                "arguments": {"order_id":"48812","amount":240.00}
                             }]}
                             ↑ this is DATA. nothing has happened yet.

3. YOUR RUNTIME decides      is this user allowed to refund this order?
                             is 240.00 within policy?
                             has verify_identity run in this session?
                             → any of these may reject the call outright

4. you execute               refunds.issue(order_id, amount, key=...)

5. you append the result     {"role":"tool","tool_call_id":"call_a7",
                              "content":"{\"status\":\"refunded\"}"}
                             ↑ bound back to call_a7, not just appended

6. model sees it next turn   and decides what to do
```

Step 3 is the entire security story. The model's output is a *request from an untrusted client* that happens to be well formatted - and your runtime is the only thing standing between that request and your database.

### Common issue

Step 5 matters more than it looks: results carry the call id because parallel calls come back out of order, and appending by completion order silently attributes one tool's output to a different call.

---

## 3. Tools live in the prompt

Tool definitions are not a side channel. They are text prepended to every request:

```json
{"name": "get_order",
 "description": "Look up one order by id. Use when the user names an order.",
 "parameters": {"type": "object",
                "properties": {"id": {"type": "string"}},
                "required": ["id"]}}
```

Three consequences worth stating in an interview:

1. Tools cost **input tokens on every turn** - 40 tools can be 6,000 tokens per step.
2. The description is a **prompt**, and wording changes selection behavior.
3. More tools means a harder selection problem, so accuracy falls as the catalogue grows.

---

## 4. The security boundary

| Enforced in the prompt | Enforced in the runtime |
|---|---|
| "Only look up the current user's orders" | `WHERE user_id = session.user_id` |
| "Don't refund more than $500" | Reject the call if `amount > 500` |
| "Use the staging database" | Credentials that only reach staging |

The left column is a suggestion with a good success rate. The right column is a guarantee. In a design answer, say explicitly that authorization happens in the runtime using the **session's** identity, never an identifier the model supplied.

### Rule of thumb

> Treat every tool call as a request from an untrusted client that happens to be very good at formatting.

---

## 5. Binding results to calls

Each call carries an id, and the observation must be attached to that id:

```text
call_id c1 → get_order → {...}   ┐
call_id c2 → get_user  → {...}   ├─ may return out of order
call_id c3 → search    → error   ┘
```

If results are appended in completion order without ids, the model silently attributes one tool's output to another. This is a real and hard-to-spot bug in hand-rolled loops.

**What the model is actually good and bad at.** Good: picking a plausible tool, filling arguments that appear in the context, following enum constraints.

Bad: inventing values not present in context (IDs, dates, amounts), knowing whether a tool has side effects, and judging whether it is permitted to run.

### Rule of thumb

That last item is why the answer to "how do you stop it doing X" is never "tell it not to."

---

## What matters most

- **The model never executes anything.** It emits a structured request; your runtime authorizes, executes, and returns an observation. Every security property lives in that gap.
- **Authorize from the session's identity,** never from an identifier the model supplied, and never in the prompt - prompt rules are a first filter, not a guarantee.
- **Tool schemas are prompt text re-sent every turn,** so 40 tools can cost thousands of input tokens per step, and a bigger catalogue makes selection harder.
- **Bind every result to its call id.** Parallel results return out of order, and appending by completion order silently misattributes one tool's output to another.
- **The model is good at picking a plausible tool and filling arguments it can see;** it is bad at knowing whether a tool has side effects or whether it is allowed to run.

Next topic is **Designing tools a model can use**.
