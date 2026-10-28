# Evaluating generated text

## 1. Match the metric to the task

A **text-generation metric** measures a selected property of generated text. No single automatic score captures correctness, usefulness, style, and safety across all tasks.

Exact extraction, open-ended explanation, translation, and summarization need different evidence of success.

## 2. Measure token prediction

**Perplexity** exponentiates average negative log likelihood:
\[
\operatorname{PPL}=\exp\left(-\frac{1}{N}\sum_{t=1}^{N}\log p_\theta(x_t\mid x_{<t})\right)
\]
N is evaluated target-token count; \(x_t\) the observed target; θ the model. Lower is better on the same data and tokenization. Average loss log 2 gives perplexity 2.

## 3. Do not overinterpret perplexity

A model can predict common continuations well while failing to answer instructions. Scores across different tokenizers are not directly comparable because both units and token counts change.

Evaluate the behavior of the final adapted model, not only its pretrained token loss.

## 4. Compare surface overlap

| Metric | Measures | Common limitation |
|---|---|---|
| Exact match | Equality under stated normalization | Rejects valid alternate wording |
| BLEU | Clipped n-gram precision with brevity penalty | Limited semantic and factual checking |
| ROUGE | Reference overlap, often recall-oriented | Rewards copied words without verifying claims |

An **n-gram** is a contiguous sequence of n tokens. For overlap, **precision** measures which generated n-grams match the reference; **recall** measures which reference n-grams were covered. Clipping caps credited repetitions at reference counts.

## 5. Check meaning and facts

Embedding-based metrics compare learned representations rather than exact words. They can recognize paraphrases while still missing negation, quantities, or unsupported details.

“Arrives Friday” and “arrives Tuesday” share most words but disagree on the key fact. Inspect task-critical attributes explicitly.

## 6. Use multiple references carefully

Several valid references can reduce penalties for legitimate variation. They still cannot enumerate every acceptable answer in an open-ended task.

Combine inexpensive automatic metrics with targeted human checks and failure slices. Explain what each reported score establishes and what it leaves unresolved.
