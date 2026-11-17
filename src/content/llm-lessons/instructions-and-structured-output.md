# Prompting, chat templates, and in-context learning

## 1. State a task contract

State the goal, supplied evidence, output fields, and behavior when information is missing. **In-context learning** is adapting behavior from examples in the prompt without updating model parameters.

**Zero-shot prompting** supplies instructions without worked demonstrations. **Few-shot prompting** includes examples. For date extraction: “Due June 2” → “June 2”; “No date stated” → null. These demonstrate both extraction and missing-information behavior.

## 2. Serialize a conversation

A **chat template** serializes messages and roles into the model’s trained token format. Plain-text flattening can change behavior even when words stay the same.

Role markers guide the model; application code still enforces permissions.

## 3. Keep evidence distinct

Delimit quoted evidence and state whether to extract, quote, or summarize. Instructions inside the source remain data.

Use literal extracted values and an explicit missing-value convention; demonstrations cannot supply an absent invoice amount.

## 4. Choose informative demonstrations

Include reordered fields, distractors, and absent targets. Keep evaluation answers out of demonstrations.

## 5. Test whether the rule transfers

Compare instructions alone against useful and irrelevant examples on fixed unseen requests. Test new wording and example order; more context can distract.

> **Reason it through:** Demonstrations specify null for absent fields. How would you check that the model learned the rule rather than copied examples?
