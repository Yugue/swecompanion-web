## Defining the agent task contract

Before choosing tools or prompts, define the job the system is allowed to perform. A task contract turns an open request into a bounded engineering problem.

```text
task contract = goal + inputs + scope + success + limits + escalation
```

This is not a legal document or a model prompt. It is the design agreement used by the product, runtime, and evaluation.

---

## 1. Start with an observable goal

```text
vague:   Help with customer orders.
bounded: Identify the verified reason an order is delayed and draft
         a policy-compliant explanation for the customer.
```

The bounded version identifies an output and a domain. It does not yet grant permission to change the order, issue money, or contact the customer.

### Rule of thumb

Write the outcome without naming the implementation. “Produce a verified explanation” is a goal; “use three agents and RAG” is a design choice.

---

## 2. Name the inputs and trusted sources

For the order task:

```text
required input: order identifier or enough information to find one
authoritative sources: order, payment, inventory, and policy systems
untrusted input: customer free text and external attachments
```

If a required input is missing, the contract should say whether the agent may search for it, ask the user, or stop.

This prevents the prompt from quietly becoming responsible for filling data gaps.

---

## 3. Draw the scope boundary

A clear contract distinguishes read, propose, and execute:

| Capability | In scope? |
|---|---|
| Read order and payment status | Yes |
| Draft a customer explanation | Yes |
| Propose an escalation | Yes |
| Escalate the case automatically | No |
| Issue a refund | No |
| Send the message | No |

Later chapters cover permission enforcement. At the foundation level, the important step is naming the boundary before implementation.

---

## 4. Define success and acceptable partial results

A successful investigation might require:

- a cause supported by authoritative evidence,
- the policy that applies,
- a concise customer-facing explanation,
- no unsupported claims.

But some valid runs cannot complete. Define useful partial outcomes:

```text
needs_information → identify exactly what the user must provide
blocked            → name the unavailable system or permission
no_match           → state that no record was found
conflict           → show which authoritative sources disagree
```

A bounded incomplete result is better than a confident invented answer.

---

## 5. Set budgets before building

Budgets shape the architecture:

```text
maximum steps:        8
wall-clock deadline:  12 seconds
cost ceiling:         $0.08
tool retry limit:     1 per transient failure
write operations:     none
```

These are product decisions, not cleanup work. If the task cannot succeed within them, narrow the task or choose a different interaction model.

---

## 6. Define escalation and ownership

The contract should say who owns the task when the agent stops:

```text
missing customer input → ask one focused question
temporary tool outage  → return retryable status
policy conflict        → route to support specialist
requested side effect  → prepare proposal for approval
budget exhausted       → return verified findings and open questions
```

“Human in the loop” is too vague. Name the trigger, the person or system receiving the handoff, and the information they need.

---

## 7. A compact contract for order 48812

```text
Goal: Explain the verified cause of the shipping delay.
Inputs: Order ID and authenticated customer identity.
May: Read relevant internal status and policy; draft a response.
May not: Modify the order, issue money, or contact the customer.
Success: Cause + evidence + applicable policy + concise draft.
Limits: 8 steps, 12 seconds, read-only.
Escalate: Conflicting policy, missing access, or requested side effect.
```

This contract makes the later workflow-versus-agent decision much easier because the task is no longer vague.

---

## What matters most

- **Define the job before choosing the architecture.**
- **Separate the goal from implementation choices.**
- **Name authoritative inputs and what happens when they are missing.**
- **Distinguish read, propose, and execute permissions.**
- **Define successful and useful incomplete outcomes.**
- **Set budgets and escalation ownership before the first prototype.**

Next topic is **Workflows versus autonomous agents**.
