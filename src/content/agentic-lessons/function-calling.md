## Function calling mechanics

The single most important sentence about function calling: **the model does not execute anything.** It emits a structured request. Your runtime decides whether that request is allowed, runs it, and reports back. Every security property of an agent lives in that gap.

### 1. What actually happens

```text
1.  tool schemas are serialized into the prompt
2.  model emits:  {"tool": "get_order", "args": {"id": "48812"}, "call_id": "c1"}
3.  runtime AUTHORIZES the call          ← your code, your rules
4.  runtime EXECUTES it                  ← with timeout, limits, scoped creds
5.  result appended as an observation tied to call_id "c1"
6.  model reads the observation and decides again
```

Steps 3 and 4 are ordinary backend engineering. The model has no more privilege than a form submission from an untrusted client.

---

### 2. Tools live in the prompt

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

### 3. The security boundary

| Enforced in the prompt | Enforced in the runtime |
|---|---|
| "Only look up the current user's orders" | `WHERE user_id = session.user_id` |
| "Don't refund more than $500" | Reject the call if `amount > 500` |
| "Use the staging database" | Credentials that only reach staging |

The left column is a suggestion with a good success rate. The right column is a guarantee. In a design answer, say explicitly that authorization happens in the runtime using the **session's** identity, never an identifier the model supplied.

### Rule of thumb

> Treat every tool call as a request from an untrusted client that happens to be very good at formatting.

---

### 4. Binding results to calls

Each call carries an id, and the observation must be attached to that id:

```text
call_id c1 → get_order → {...}   ┐
call_id c2 → get_user  → {...}   ├─ may return out of order
call_id c3 → search    → error   ┘
```

If results are appended in completion order without ids, the model silently attributes one tool's output to another. This is a real and hard-to-spot bug in hand-rolled loops.

---

### 5. What the model is actually good and bad at

Good: picking a plausible tool, filling arguments that appear in the context, following enum constraints.

Bad: inventing values not present in context (IDs, dates, amounts), knowing whether a tool has side effects, and judging whether it is permitted to run.

That last item is why the answer to "how do you stop it doing X" is never "tell it not to."

---

## What you should say in an interview

For "where do you enforce that a user can only read their own records?":

> In the tool implementation, using the identity from the session - not from the model's arguments and not from the prompt. The model emits a request; my runtime authorizes and executes it, so the tool should take the caller's user id from the authenticated session and scope the query to it, ignoring any user id the model supplied. It can't live in the prompt for two reasons: the model produces likely text rather than obeying policy, so it'll be right most of the time and wrong occasionally; and anything the agent reads - a document, a web page, a tool result - can contain text that argues for a different behavior. Prompt rules are worth having as a first filter, but the guarantee has to be code that would reject the call even if the model were fully compromised.

Next topic is **Designing tools a model can use**.
