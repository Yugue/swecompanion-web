## Choosing negatives

**Negative sampling** chooses training contrasts instead of comparing every positive with every possible item. The chosen pool and sampling probabilities shape the learning problem.

An unobserved item can be a useful contrast without being a confirmed negative preference.

## 1. Different sources ask different questions

| Source | How it is chosen | Main consideration |
|---|---|---|
| Random catalogue item | Sample from an eligible reference pool | Broad coverage; some comparisons are easy |
| In-batch item | Reuse positives from other rows in the batch | Efficient, but reflects the batch's item frequencies |
| Hard negative | Choose a high-scoring or plausibly relevant alternative | Informative competition; greater false-negative risk |
| Exposed non-click | Use a displayed item without a click | Evidence depends on examination and outcome definition |

For a watched pasta video, an engine-repair contrast may test broad topic separation. Another pasta video may test a finer distinction—or be an equally good item the user never encountered.

## 2. Make in-batch comparisons correctly

A batch of \(B\) paired requests and positive items can produce a \(B\times B\) score matrix. Each request's matched item is a positive; other columns are nominal contrasts.

Those contrasts need no extra item-encoding pass, but the score matrix still costs computation and memory. Repeated items or known positives can create contradictory comparisons. Deduplicate or mask them according to the objective.

Batch construction matters: grouping by time, geography, or user can change the negative distribution substantially.

## 3. Distinguish the objective from a correction

Sampled training need not equal full-catalogue likelihood training. A **logit** is a score fed into a softmax probability calculation. Under some sampled-softmax constructions, adjusted logits use a term based on \(-\log Q(i)\), where \(Q\) is the item sampling probability.

The exact correction depends on the sampling scheme, inclusion counts, and treatment of positives. It is not a universal recipe that removes popularity or exposure bias.

If negatives are deliberately sampled more often from difficult regions, decide whether that changes the intended task weighting or requires correction for the target objective.

## 4. Test realistic competition

Mix sources when they address demonstrated weaknesses. Refresh mined negatives as the model changes, and inspect plausible false negatives rather than assuming the highest-scoring unclicked item is wrong.

Keep evaluation candidates fixed across models. One positive among 99 easy distractors can yield a much easier recall task than retrieval from a million eligible items. Report full-catalogue evaluation where feasible or document the pool and its limitations.

> **Mental image:** negatives are the practice opponents. Winning against weak opponents does not establish performance against the real field.
