## Defining the agent task contract

A **task contract** defines goal, evidence, scope, success, limits, and escalation before architecture.

## 1. Observable goal

“Help with orders” is vague.

“Explain the verified shipping delay and draft a response” names an output. It does not grant permission to send it.

## 2. Inputs and sources

- Input: order identifier and authenticated customer.
- Authoritative evidence: order, payment, inventory, policy.
- Untrusted material: free text and attachments.

Define missing-input and conflicting-source behavior.

## 3. Scope boundary

| Operation | Example permission |
|---|---|
| Read order | Allowed |
| Draft explanation | Allowed |
| Propose escalation | Allowed |
| Modify order/refund | Excluded |
| Contact customer | Excluded |

Read, propose, and execute are separate capabilities.

## 4. Partial outcomes

Success needs verified cause, policy, and explanation.

```text
needs_information → exact missing input
blocked           → unavailable system or permission
conflict          → disagreeing evidence
```

## 5. Budgets

Illustrative limits: eight steps, 12 seconds, one retry per transient error, no writes.

If these cannot support the task, revise scope or interaction design.

## 6. Escalation and ownership

Name the trigger, recipient, and handoff information.

A policy conflict goes to a specialist with evidence. Missing input goes to the user as a focused question.

## 7. Worked contract

```text
Goal: Explain order 48812 delay.
May: Read internal status/policy; draft response.
Success: Cause + evidence + policy.
Limits: 8 steps, 12 seconds, read-only.
Escalate: Conflicting policy or unavailable evidence.
```

## What matters most

> The contract describes the destination and boundaries; architecture chooses a route.
