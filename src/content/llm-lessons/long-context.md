# Long context, positions, and evidence placement

## 1. Define the budget

The context window limits the token positions available under a model configuration. Prompt, conversation, retrieved evidence, and generated output often share that budget.

With an 8,000-token budget, 500 instruction tokens, 1,000 history tokens, and 1,500 reserved output tokens, at most 5,000 remain for evidence before additional formatting overhead.

## 2. Separate length from use

**Effective context use** means finding and combining the information needed for a task. Test decisive evidence at beginning, middle, and end, with distractors and conflicts.

## 3. Understand position extension

**Position interpolation** compresses position indices before applying RoPE. To extend an 8-position window to 16, a simple scheme maps position m to m/2: position 14 uses the old angle for 7.

This keeps positions near the trained range but compresses nearby separations too. Continued long-sequence training can adapt the model; changing the mapping alone does not establish reliable long-context use.

## 4. Choose a context strategy

| Strategy | Benefit | What can fail |
|---|---|---|
| Full relevant document | Preserves surrounding context | Cost and distractors |
| Retrieve selected passages | Reduces input size | Missed evidence |
| Summarize history | Compresses older context | Lost exact details |
| Truncate old messages | Simple fixed bound | Removes active constraints |

A **summary** is a lossy representation unless the needed information is explicitly preserved.

## 5. Preserve constraints

“20 MB, except enterprise accounts allow 100 MB” becomes wrong if the exception disappears. Preserve conditions, entities, dates, and source IDs during compression.

## 6. Measure quality and resources

Compare correctness, position sensitivity, input cost, first-token latency, and peak memory. Single-fact lookup does not establish multi-document reasoning.

> **Reason it through:** A summary drops an account-type exception. Why can a shorter, fluent context make the final answer wrong?
