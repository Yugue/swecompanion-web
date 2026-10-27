# Summarization and faithful generation

## 1. Select important source information

**Summarization** produces a shorter account of source material under a stated purpose and output budget.

**Extractive summarization** selects source passages. **Abstractive summarization** generates new wording. Extraction constrains wording, but can still mislead by omitting qualifications or selecting an unrepresentative passage.

## 2. Separate the quality requirements

**Coverage** concerns important information retained. **Faithfulness** means claims are supported by the source. **Concision** avoids unnecessary content while meeting the task.

A faithful account of an incorrect source is not automatically true in the wider world. Define whether the system summarizes supplied evidence or also verifies it externally.

## 3. Learn and preserve the intended evidence

An encoder-decoder or conditional decoder can learn from source-summary pairs. The target summary reflects annotation choices about importance and style.

Long-source truncation can remove the decisive fact. Chunked or staged summaries can lose relationships across sections or compound earlier mistakes. Verify what evidence each stage receives.

## 4. Measure overlap with ROUGE

**ROUGE** is a family of reference-comparison measures. **ROUGE-N** compares n-gram overlap; **ROUGE-L** uses longest common subsequences, which need not be contiguous.

State whether recall, precision, or F1 is reported, with tokenization, normalization, aggregation, and reference policy.

```text
reference: parcel arrives in Paris Friday
candidate: parcel arrives in Paris Tuesday
ROUGE-1 recall = 4/5 = 0.8
```

The high overlap still changes the crucial date.

## 5. Add semantic and factual evidence

**BERTScore** compares contextual token representations between candidate and reference and aggregates matching similarities. It can recognize some paraphrases missed by exact overlap.

Semantic similarity is not a complete factuality test: a changed person, date, or negation can leave substantial similarity.

A **model-based judge** uses another model to assess outputs under instructions. Its bias, consistency, and agreement with relevant human judgments need evaluation too.

## 6. Inspect the errors the score misses

Check unsupported claims, changed entities, quantities, attribution, omitted caveats, and duplicated content. A useful human rubric distinguishes these from grammar or style preferences.

**Controlled generation** adds constraints such as length, format, or required fields. Satisfying a format does not establish factual support; shorter output is not always a better summary.

## 7. Interview reasoning

**Question:** Why should a summary metric not reward every reduction in length?

**Answer:** Removing important facts or qualifications can make the text shorter while less useful or misleading. Evaluate the required information and support alongside the output budget.
