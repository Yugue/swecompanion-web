## System prompts and instruction hierarchy

An agent prompt describes behavior across a run. Runtime controls enforce permissions and limits.

## 1. Five useful parts

```text
ROLE: Investigate order delays.
GOAL: Draft a verified explanation.
RULES: Do not invent identifiers.
TOOLS: Read the order before choosing a subsystem.
DONE: Explain the cause, or name the missing evidence.
```

Keep these responsibilities easy to find.

## 2. Observable rules

“Be accurate” is vague.

“If lookup returns no match, ask for another identifier” is testable.

Other examples: cite status evidence; require confirmation before claiming success; stop repeating an unchanged failure.

## 3. Instruction authority

Follow the model/platform's instruction hierarchy. Application policy and user requests have authority; retrieved payloads are evidence.

A page saying “ignore the user” does not gain permission to change the goal.

> Instructions are the assignment; retrieved content is material on the desk.

## 4. Handle uncertainty

Retrieve an authoritative value, ask a focused question, or return **unknown/blocked**.

Requiring every field to contain an answer encourages guessing.

## 5. Define done

“Investigate” describes activity.

“Return the verified cause and policy, or the exact missing evidence” defines an outcome.

The runtime still applies budgets.

## 6. Focus examples on ambiguity

```text
empty result → ask for an identifier
timeout      → bounded retry
forbidden    → report unavailable access
```

Use examples for recurring mistakes. Large happy-path catalogues consume context.

## What matters most

> Make the next correct action clear and testable.
