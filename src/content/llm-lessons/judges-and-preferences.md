# Human evaluation and model judges

## 1. Write an operational rubric

Make the rubric operational: “2 = correct result and all material claims supported; 1 = correct result with an unsupported claim; 0 = wrong result.” Add boundary examples so judges apply the same rule.

**Human evaluation** uses people to apply these criteria. Disagreement may reveal ambiguity in the task rather than careless annotators.

## 2. Choose a judgment format

An absolute score grades one answer against anchors. A pairwise comparison chooses between answers to the same prompt; permit a tie when neither is meaningfully better.

For 60 wins, 20 losses, and 20 ties, excluding ties gives 60/80=75%; awarding half a win per tie gives 70/100=70%. State the convention. A preference win rate still does not establish factual correctness.

## 3. Control presentation bias

Hide model identity, randomize response order, and repeat selected comparisons with the order swapped. Keep formatting equivalent where formatting is not the criterion.

**Position bias** favors an answer because it appears first or last. **Verbosity bias** favors length independently of useful content.

## 4. Use model judges cautiously

A **model judge** is a model prompted or trained to assess outputs. It can scale evaluation, but may share blind spots with the model being judged.

Supply the task, evidence, rubric, and accepted alternatives. Ask for criterion-level scores rather than only a vague overall preference.

Use deterministic checks for verifiable properties and human review for ambiguous or consequential cases. A judge's persuasive explanation is not proof that its score is correct.

Version the judge model and prompt. A judge update can move reported quality even when the candidate system has not changed.

## 5. Validate the evaluator

Compare judge decisions against an independently labeled set, including concise correct answers, polished wrong ones, missing evidence, and adversarial text inside candidates.

Inspect disagreement by error type. Agreement on easy examples can conceal failure on the rare cases that matter most.
