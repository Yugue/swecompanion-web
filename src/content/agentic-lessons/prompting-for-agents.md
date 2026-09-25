## System prompts and instruction hierarchy

A chat prompt asks for an answer. An agent prompt defines behavior across a sequence of decisions. It acts as a persistent operating policy for the run.

A useful agent prompt should make the next correct action easier to identify. It should not attempt to replace permissions, validation, or other runtime controls.

---

## 1. Give the prompt five clear parts

```text
ROLE        what the agent is responsible for
GOAL        what outcome it should produce
RULES       behavior that must hold throughout the run
TOOLS       when available actions should or should not be used
DONE        what must be true before returning a final answer
```

Example:

```text
Role: Investigate order delays using read-only customer-support tools.
Goal: Explain the verified cause and the next available action.
Rules: Never invent identifiers. Distinguish missing data from tool failure.
Tools: Check the order before choosing a subsystem to inspect.
Done: The cause is supported by tool evidence, or the missing evidence is named.
```

This is easier to follow and test than a long paragraph of mixed instructions.

---

## 2. Write observable rules

```text
weak:   Be careful and helpful.
strong: If the order lookup returns no match, ask for another identifier.
```

The strong rule describes behavior that can be seen in a trace. The weak rule describes a personality.

Other useful patterns:

- “Do not claim an external action succeeded without a successful tool result.”
- “Ask for clarification when two customer records match.”
- “Stop after two identical failures and explain the blocker.”
- “Use only evidence present in the context or returned by a tool.”

### Rule of thumb

If you cannot write a test for an instruction, make it more concrete.

---

## 3. Understand the instruction hierarchy

Agent inputs do not all have equal authority:

```text
system and developer policy
        ↓
user request
        ↓
retrieved documents and tool results
```

Retrieved content is evidence, not policy. A document may contain text that looks like an instruction, but it should not redefine the agent’s goal or permissions.

This distinction is introduced here because it affects prompt structure. The security consequences and architectural defenses are covered later in the safety chapter.

---

## 4. Tell the agent how to handle uncertainty

A prompt that demands an answer at all costs encourages guessing. Give the model honest alternatives:

```text
If evidence is missing:
1. use an appropriate read tool if available,
2. ask one focused clarification question,
3. return an explicit unknown or blocked result.
```

Do not make every output field mandatory when the model may not know it. The next lesson covers how schemas can represent uncertainty cleanly.

---

## 5. Define completion, not just activity

“Investigate the order” describes work. It does not define when the work is finished.

A better completion condition is:

```text
Finish when:
- the verified cause is identified,
- the relevant customer policy is retrieved,
- the response contains no unsupported claim,
OR the exact missing evidence and next required action are stated.
```

The runtime still enforces step and time limits. The prompt tells the model what successful completion means.

---

## 6. Use examples only for recurring ambiguity

A short example can teach a decision boundary more clearly than another paragraph:

```text
Tool returns empty → ask for another identifier
Tool returns timeout → retry once
Tool returns forbidden → do not retry; report lack of access
```

Examples cost context on every turn, so use them for decisions the model repeatedly gets wrong. Do not include a large catalogue of happy paths.

---

## What matters most

- **An agent prompt is a persistent operating policy, not a one-time request.**
- **Separate role, goal, rules, tool guidance, and completion conditions.**
- **Write observable behavior instead of personality traits.**
- **Retrieved content is evidence, not a source of higher-priority instructions.**
- **Give the model explicit ways to handle missing information without guessing.**
- **Use examples sparingly to clarify difficult decision boundaries.**

Next topic is **Structured output and schemas**.
