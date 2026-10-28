# Summarization and faithful generation

## 1. Keep important information

**Summarization** produces a shorter account under a purpose and length budget.

| Method | Operation | Risk |
|---|---|---|
| Extractive | Select source passages | Omit qualifications |
| Abstractive | Generate new wording | Add unsupported claims |

## 2. Separate quality requirements

**Coverage** retains important information. **Faithfulness** keeps claims supported by the source. **Concision** removes unnecessary content.

A faithful summary of an incorrect source can still be false in the wider world. State whether external verification is required.

## 3. Preserve evidence during learning

Source-summary pairs teach selection and style. Encoder-decoder or conditional-decoder training can model them.

Truncation can remove decisive facts. Chunked summaries can lose cross-section relationships; later stages cannot reliably recover omitted qualifications.

## 4. Measure reference overlap

**ROUGE** is a family of overlap measures. **ROUGE-N** compares n-grams; **ROUGE-L** uses longest common subsequences, which need not be contiguous.

```text
reference: parcel arrives in Paris Friday
candidate: parcel arrives in Paris Tuesday
ROUGE-1 recall = 4/5 = 0.8
```

The high overlap misses a wrong date. Declare precision/recall/F1, normalization, references, and aggregation.

## 5. Add semantic evidence

**BERTScore** aggregates similarities between contextual candidate/reference token representations. It can recognize paraphrases missed by exact matching.

Similar representations can still hide changed names, quantities, or negation.

A **model-based judge** evaluates outputs using another model. Check its consistency and agreement with relevant human judgements.

## 6. Inspect facts and constraints

Review unsupported claims, attribution, omitted caveats, and duplicates separately from grammar.

**Controlled generation** imposes format, length, or field requirements. Valid format does not establish support; shorter output can omit essential content.
