# Prompting, chat templates, and in-context learning

## 1. State a task contract

State the goal, supplied evidence, output fields, and behavior when information is missing. **In-context learning** is adapting behavior from examples in the prompt without updating model parameters.

**Zero-shot prompting** supplies instructions without worked demonstrations. **Few-shot prompting** includes examples. For date extraction: “Due June 2” → “June 2”; “No date stated” → null. These demonstrate both extraction and missing-information behavior.

## 2. Serialize a conversation

A **chat template** converts messages and roles into the exact token sequence expected by a model. Role markers, separators, and the assistant-start marker are part of training conventions.

A system message is an application-level instruction role, not an external authorization mechanism. Flattening all messages into plain text can change behavior even when their words are unchanged.

## 3. Keep evidence distinct

Delimit source text and specify whether to quote, summarize, or extract. An instruction inside a quoted document is data to analyze, not automatically a command to obey.

For “extract the invoice ID,” an example should show the literal ID, not a plausible completion. A required null value for absent evidence is often better than forced guessing.

## 4. Choose informative demonstrations

Use examples that teach the decision rule, not just surface wording. Include changed field order, distracting numbers, and absent targets for extraction.

Keep final evaluation examples out of the demonstrations. A prompt containing an evaluation answer can look like a capability gain while measuring copying instead.

## 5. Test whether the rule transfers

Hold the question set fixed and compare instructions alone, useful demonstrations, and irrelevant demonstrations. Test new wording and genuine missing-information cases.

If behavior depends on one example's phrasing or position, improve the examples and measure again. A longer prompt can add both guidance and distraction.
