# Synthetic data and instruction-data quality

## 1. Generate useful examples

**Synthetic instruction data** pairs generated requests with desired responses. Target identified gaps, including difficult and genuine “not provided” cases.

## 2. Separate sources of correctness

One model generating both question and answer can repeat a misconception. Verify with calculations, source spans, or controlled execution—not their agreement.

## 3. Filter without contaminating

Deduplicate outputs, check required fields and types, run available verifiers, and inspect examples independently of the generator. Preserve source and generation metadata.

Do not generate training variants from the final evaluation answers. A synthetic paraphrase can still leak the exact information intended to test generalization.

## 4. Balance the mixture

Many paraphrases of one easy template can overwhelm rare real cases. Deduplicate by source and mix representative data. Retain difficult examples when their targets are verifiable.

## 5. Measure new capability

At fixed training budget, compare held-out results with/without synthetic data by task, language, and difficulty. Gains only on generator-like wording suggest template imitation.

> **Reason it through:** Thousands of generated examples paraphrase one seed. What should an independent test split keep separate?
