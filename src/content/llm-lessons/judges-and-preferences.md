# Human evaluation and model judges

## 1. Write an operational rubric

Make the rubric operational: “2 = correct result and all material claims supported; 1 = correct result with an unsupported claim; 0 = wrong result.” Add boundary examples so judges apply the same rule.

**Human evaluation** uses people to apply these criteria. Disagreement may reveal ambiguity in the task rather than careless annotators.

## 2. Choose a judgment format

An absolute score grades one answer against anchors. A pairwise comparison chooses between answers to the same prompt; permit a tie when neither is meaningfully better.

For 60 wins, 20 losses, and 20 ties, excluding ties gives 60/80=75%; awarding half a win per tie gives 70/100=70%. State the convention. A preference win rate still does not establish factual correctness.

## 3. Control presentation bias

Hide model identity and swap candidate order. **Position bias** favors placement; **verbosity bias** favors length independent of useful content.

## 4. Use model judges cautiously

A **model judge** assesses outputs using a task, evidence, and rubric. It can share the candidate model’s blind spots.

Use deterministic checks where possible, humans for ambiguous cases, and criterion-level scores. Version the judge and prompt.

## 5. Validate the evaluator

Compare with independent labels on concise correct answers, polished wrong ones, missing evidence, and adversarial candidate text. Inspect disagreements by error type.

> **Reason it through:** Swapping candidate order reverses a judge’s preference. What does that imply about the reported model comparison?
