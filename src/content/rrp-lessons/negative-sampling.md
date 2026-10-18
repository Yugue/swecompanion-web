## Choosing negatives

## 1. Choose the practice opponents

**Negative sampling** selects training contrasts instead of comparing each positive with every catalogue item.

> Winning against weak opponents does not establish performance against the real field.

## 2. Compare the sources

| Source | Selection | Risk |
|---|---|---|
| Random | Sample eligible catalogue items | Many easy comparisons |
| In-batch | Reuse other rows' positives | Follows batch frequencies |
| Hard negative | Choose a high-scoring alternative | May be useful but unobserved |
| Exposed non-click | Use a displayed unclicked item | Meaning depends on examination |

A **false negative** is an item treated as negative despite being a plausible positive.

## 3. See the difference in one query

For a watched pasta video, engine repair tests broad separation. Another pasta video tests a finer distinction—or is an equally good unseen choice.

Harder competition can improve discrimination but also add contradictory labels.

## 4. Reuse a batch carefully

With \(B\) request–positive pairs, score every request against the batch's \(B\) items: a \(B\times B\) matrix.

Matched entries are positives; other entries are nominal contrasts. Repeated items and known positives need objective-appropriate masking or deduplication.

Item encodings are reused, but matrix computation still costs work.

## 5. Correct only for a stated objective

A **logit** is a score supplied to softmax. Some sampled-softmax schemes adjust it using \(-\log Q(i)\), where \(Q(i)\) is item \(i\)'s sampling probability.

The correction depends on the exact sampling scheme and desired objective. It is not a general popularity-bias remedy.

## 6. Test realistic competition

Keep evaluation candidates fixed across models. One positive among 99 easy distractors is a different task from retrieval over a million eligible items.

Refresh mined hard negatives as the model changes and inspect false negatives.

## 7. Interview reasoning

**Question:** Why can harder negatives make a model worse?

**Answer:** High-scoring alternatives may be real interests rather than errors. Sampling can also change the training objective or overemphasize an unrepresentative competition set.
