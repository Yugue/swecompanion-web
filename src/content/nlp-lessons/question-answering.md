# Extractive question answering and answerability

## 1. Select an answer from evidence

**Extractive question answering** returns a source span. A **reader** models the question and supplied context together.

“Ada moved to Paris in 2020.” + “Where did Ada move?” → select “Paris.”

## 2. Score start and end

A common head predicts start distribution \(p_s\) and end distribution \(p_e\) over context positions.

Choose span (i,j) maximizing \(p_s(i)p_e(j)\), subject to valid source positions, i≤j, and any length limit.

Other designs score starts and ends jointly.

## 3. Train aligned positions

For gold start i* and end j*:

\[
L=-\log p_s(i^*)-\log p_e(j^*)
\]

L is the loss. Use tokenizer-aligned targets and map predictions back to original offsets.

Question tokens and padding are not ordinary answer candidates.

## 4. Model missing answers

**Answerability** asks whether context supports an answer. The Ada sentence cannot answer “Where did Ben move?”

Include unanswerable training cases and a no-answer mechanism. Select the span-versus-no-answer policy on validation data.

## 5. Compare evaluation units

| Metric | Checks |
|---|---|
| Exact match (EM) | Answer equality after declared normalization |
| Token F1 | Overlap using answer-token precision/recall |

Partial answers can earn overlap credit while failing exact match. State alternative-reference and unanswerable-case policies.

## 6. Check evidence delivery

A reader cannot extract missing evidence. Long inputs may need windows; verify that the answer survives truncation and remains a valid within-window span.

Extraction can still select a misleading or unrelated source phrase.

## 7. Interview reasoning

**Question:** Does a high start probability guarantee a correct answer?

**Answer:** No. It needs a compatible end, correct source alignment, and evidence that the question is answerable.
