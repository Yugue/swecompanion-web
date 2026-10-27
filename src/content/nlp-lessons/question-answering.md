# Extractive question answering and answerability

## 1. Predict an answer grounded in a source

**Extractive question answering** selects an answer span from supplied context. A **reader** models the question together with that context.

For “Ada moved to Paris in 2020,” the question “Where did Ada move?” can be answered by selecting “Paris.” The output is a source span rather than newly generated wording.

## 2. Score start and end positions

A common head predicts a start distribution \(p_s\) and end distribution \(p_e\) over context positions.

For candidate start \(i\) and end \(j\), one simple decoding rule chooses the largest \(p_s(i)p_e(j)\), subject to valid context positions, \(i\le j\), and an optional length bound.

This independent-head form is one design. Other readers condition or score spans jointly.

## 3. Train aligned targets

For gold start \(i^*\) and end \(j^*\), a standard loss is:

\[
L=-\log p_s(i^*)-\log p_e(j^*)
\]

Both targets must use the tokenizer’s position convention, then map back to original text offsets. Question positions and artificial padding are not arbitrary answer candidates.

## 4. Represent missing answers

**Answerability** asks whether the supplied context supports an answer. “Where did Ben move?” is not answered by a sentence describing only Ada.

Train unanswerable examples explicitly, using a no-answer output or another declared mechanism. Compare no-answer evidence against candidate spans on validation data rather than always selecting the strongest available span.

A relevant-looking passage does not guarantee the requested fact is present.

## 5. Evaluate several kinds of correctness

**Exact match (EM)** checks answer equality under a declared normalization. **Token F1** measures overlap between answer tokens, using precision and recall.

A partly matching answer can get token credit while failing exact match. Reference alternatives, punctuation rules, and unanswerable scoring affect the result.

Report answerability errors as well as span quality.

## 6. Keep retrieval and reading separate

A reader cannot extract an answer missing from its context. Long contexts may need windows; verify that the answer survives truncation and span boundaries stay valid within a window.

The later retrieval-augmented lesson adds document selection and generative answering. An extractive system’s source constraint is useful, but can still return the wrong or misleading span.

## 7. Interview reasoning

**Question:** Does a high-probability start position guarantee a valid answer?

**Answer:** No. It must combine with a valid end, source alignment, and evidence that the question is answerable. A confident-looking span can still answer the wrong question.
