# Prompt injection and unsafe tool use

## 1. Recognize an instruction attack

**Prompt injection** places instructions in model input to redirect behavior away from the intended task. **Indirect prompt injection** arrives through external material such as retrieved pages, documents, images, or tool results.

The attacker attempts to promote untrusted content into governing instructions. This can corrupt an ordinary text answer even when no tools are available.

## 2. Separate evidence from authority

A support article may legitimately describe an email workflow. It does not authorize sending private records to an address written inside the article.

```genai-visual
trust-boundary
```

Keep instructions, user requests, and external data distinguishable. Clear delimiters help interpretation but are not a complete security boundary.

## 3. Restrict the executor

**Least privilege** grants only the access and actions needed for the current task. Validate tool names, argument types, allowed destinations, and requester permissions outside the model.

A generated call proposes an action. The executor must independently decide whether that action is authorized.

## 4. Control retrieved access

Apply document permissions before exposing content to the model. Enforce tenant separation and authorization on underlying record fetches, not only in the user interface.

Post-generation filtering cannot undo a disclosure that already entered logs or an external call.

## 5. Test realistic attacks

Include instructions hidden in quoted text, source formatting, tool errors, and image text. Measure whether the system follows them, leaks data, or executes unauthorized actions.

Use controlled test data and restricted tools. An attack success rate needs an explicit threat model and definition of success.

## 6. Use layered controls

Combine input handling, restricted tools, validation, output checks, and human approval for actions that require it under the product’s permission model.

A stronger prompt or more instruction tuning can reduce failures, but neither replaces access control. Track false alarms as well as missed attacks.
