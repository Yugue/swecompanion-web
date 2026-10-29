# Synthetic data and instruction-data quality

## 1. Generate useful examples

**Synthetic instruction data** pairs generated task inputs with generated or checked desired responses. Select examples covering missing task types, languages, and failure cases.

For extracting dates, generate both explicit dates and genuine “not provided” cases. Filtering away every difficult example can train a model that never learns to express missing information.

## 2. Separate sources of correctness

Generating both a question and its answer with the same model can reproduce a shared misconception. Agreement between the pair is not independent verification.

For arithmetic, run the calculation. For extraction, check the source span. For tool tasks, validate arguments and expected outputs using a controlled environment.

## 3. Filter without contaminating

Deduplicate outputs, check required fields and types, run available verifiers, and inspect examples independently of the generator. Preserve source and generation metadata.

Do not generate training variants from the final evaluation answers. A synthetic paraphrase can still leak the exact information intended to test generalization.

## 4. Balance the mixture

Deduplication and sampling determine how much generated material affects training. Thousands of paraphrases of one easy template can overwhelm rare but important real cases.

Retain difficult examples when their targets can be verified. Mix representative real data and evaluate whether the model is learning the desired task rather than the generator's style.

## 5. Measure new capability

Compare a fixed training budget with and without the generated data on independent examples. Report changes by task, language, and difficulty, including genuine missing-information cases.

If gains appear only on generator-like wording, test new templates and real requests. More fluent training text does not establish more useful supervision.
