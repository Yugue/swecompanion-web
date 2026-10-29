# Long context, positions, and evidence placement

## 1. Define the budget

The context window limits the token positions available under a model configuration. Prompt, conversation, retrieved evidence, and generated output often share that budget.

With an 8,000-token budget, 500 instruction tokens, 1,000 history tokens, and 1,500 reserved output tokens, at most 5,000 remain for evidence before additional formatting overhead.

## 2. Separate length from use

A model accepting a long input may still fail to locate or combine evidence inside it. **Effective context use** is the ability to solve the intended task with information at different positions and distances.

Test evidence at the beginning, middle, and end while keeping content fixed. Also test multiple required facts, contradictions, and distractors rather than one distinctive marker.

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

If a policy says “20 MB, except enterprise accounts allow 100 MB,” dropping the exception changes the answer. Preserve dates, entities, conditions, and source IDs alongside summaries.

A short exact record can be more useful than a long narrative memory. Re-evaluate summaries when downstream questions change.

## 6. Measure quality and resources

Compare task correctness, evidence position sensitivity, input cost, first-token latency, and peak memory at realistic lengths.

A successful single-fact lookup is insufficient evidence for multi-document synthesis. Increasing the window can add both helpful information and more opportunities for distraction.
