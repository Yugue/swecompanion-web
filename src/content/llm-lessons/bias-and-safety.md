# Bias, harmful behavior, and over-refusal

## 1. Define the harm

**Bias** here means systematic differences that matter under a stated task or harm criterion, such as unequal error rates or stereotyping. Define the criterion before measuring it.

Compare equivalent requests across relevant groups, languages, and dialects. A single aggregate score can hide a subgroup with consistently worse performance.

## 2. Construct controlled comparisons

Compare matched requests that differ only in the attribute being investigated, while also testing realistic examples for each group. A matched template isolates one effect; a representative set measures broader task experience.

For example, equivalent password-reset questions in two dialects should not receive systematically different levels of assistance solely because of phrasing.

## 3. Check refusal quality

**Over-refusal** means declining legitimate requests. A model that refuses everything can appear safe under an attack-only measure while being unusable.

Distinguish a justified refusal, a safe limited answer, a clarification request, and an unnecessary rejection. The appropriate action depends on the task and available evidence.

## 4. Keep several measures visible

Report task accuracy, harmful completions, refusal appropriateness, and important group or language slices. A single weighted score can hide a severe local failure.

Evaluate translated or paraphrased inputs too. Passing one language's templates does not establish equivalent behavior elsewhere.

## 5. Inspect the source of a regression

A biased or harmful result can originate in training data, retrieval, the instruction template, a preference judge, or the surrounding workflow. Change one component at a time and re-evaluate.

Check whether remediation improves the targeted harm while preserving supported, authorized assistance. Model tuning and application controls solve different parts of the problem.
