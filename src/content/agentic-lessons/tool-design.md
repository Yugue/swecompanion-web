## Designing tools a model can use

Most agent reliability problems that look like prompting problems are tool-design problems. Granularity and wording are the two biggest levers you have, and they are cheaper to change than the model.

### 1. Granularity

```text
too fine:   http_request(url, method, headers, body)
            → agent spends 6 steps assembling what one tool could do
            → it must know your API surface, which it doesn't

too coarse: handle_customer_request(text)
            → the agent can't express anything specific
            → you've moved the whole problem inside one opaque tool

right:      get_order(order_id)
            search_orders(customer_email, date_range)
            issue_refund(order_id, amount, reason)
```

The test: **one tool call should correspond to one thing a human would say they did.** "Looked up the order." "Issued the refund." Not "sent a POST."

---

### 2. The description is a prompt

| Weak | Strong |
|---|---|
| "Searches the database." | "Search orders by customer email and date range. Use when the user does not know the order ID. Returns at most 20 orders, newest first." |
| "Refunds an order." | "Issue a refund for a verified order. Requires verify_identity to have succeeded in this session. Irreversible." |

Include, in order: what it does, **when to use it**, when *not* to, what it returns, and whether it is irreversible. The "when not to" line is the one that stops near-duplicate tools being picked at random.

---

### 3. Make wrong arguments impossible

```text
✗  status: string                  → "shipped", "Shipped", "in transit", "SHIPPED?"
✓  status: enum[pending|shipped|delivered|cancelled]

✗  timeout: number                 → 30? 30000?
✓  timeout_seconds: number

✗  date: string                    → "last Tuesday"
✓  date: string, format YYYY-MM-DD, description "absolute date; resolve relative dates first"

✗  limit: number (required)        → the model invents a number
✓  limit: number, default 20, optional
```

Every required field the model cannot derive from context is a guess waiting to happen.

### Rule of thumb

> If an argument can be expressed as an enum, it must be.

---

### 4. Return observations, not payloads

The return value goes straight into the context window, on every subsequent turn.

```text
✗  full API response: 4,200 tokens of nested metadata, links, and audit fields
✓  {"order_id": "48812", "status": "delivered", "total": 240.00,
     "delivered_on": "2026-03-02", "refundable": true}
```

Return what the agent's next decision needs. Include a `truncated: true` flag and a way to fetch more rather than pre-emptively dumping everything. A single fat tool is often the entire reason a run costs what it does.

---

### 5. Tools are an interface for a model, not for you

Three habits that follow from that:

1. Name them by intent (`find_available_slots`), not by implementation (`slots_v2_query`).
2. Collapse sequences the agent always performs together into one tool.
3. Read your own traces: if the agent consistently misuses a tool, the tool is wrong, not the agent.

---

## What you should say in an interview

For "your agent calls search five times with near-identical queries":

> That's a tool problem before it's a prompt problem. Three things I'd change. First, the return value: if search returns a hundred truncated snippets, the agent can't tell whether it found the answer, so it tries again with slightly different wording - returning fewer, fuller, ranked results with a clear "no results" case usually ends the repetition on its own. Second, the description: it should say when to use search and, crucially, when not to - "use get_order when the user has an ID; use search only when they don't." Third, the arguments: if the query is free text, the model keeps rephrasing; adding structured filters for email, date range, and status gives it a way to narrow that isn't rewording. I'd also add a mechanical guard that detects repeated calls with near-identical arguments and returns an observation saying so, so the loop can't silently burn its budget.

Next topic is **Errors, retries, and idempotency**.
