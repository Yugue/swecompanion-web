# Human evaluation and model judges

## 1. Judge properties a simple metric misses

A **human evaluator** applies a rubric to outputs. A **model judge** uses a trained model to score or compare outputs under instructions. Both can make systematic errors.

Model-based evaluation can scale review, but its scores are predictions rather than ground truth.

## 2. Choose the judgment format

**Pointwise scoring** rates one answer. **Pairwise evaluation** compares two answers to the same request. **Inter-rater agreement** measures consistency between evaluators.

Allow ties or uncertainty when appropriate. Forced preferences can turn negligible differences into confident-looking wins.

## 3. Make the rubric concrete

Specify correctness criteria, allowed evidence, required format, and treatment of unsupported claims. Include judged examples representing clear passes, failures, and borderline cases.

A rubric saying only “choose the better answer” lets style dominate unstated priorities.

## 4. Probe judge biases

**Position bias** favors an answer based on display order. **Verbosity bias** favors longer answers even without more useful content. **Self-preference** can favor a model’s own style.

Swap answer order, hide model names, and compare matched-length outputs to test these effects.

## 5. Validate against independent review

Compare judge decisions with expert human judgments across important slices. Inspect disagreements rather than reporting only one correlation.

A judge can agree on easy cases while missing rare, consequential errors. Use verified task outcomes when available.

## 6. Protect the evaluation boundary

Candidate text can contain instructions aimed at the judge. Keep it clearly separated as material to evaluate, and test adversarial examples.

Avoid optimizing a generator only against one fixed judge. It can learn superficial scoring shortcuts while independent quality stagnates.
