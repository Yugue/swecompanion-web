# Named-entity recognition and span extraction

## 1. Locate and type mentions

**Named-entity recognition (NER)** identifies source spans and assigns types such as person, location, or organization.

Specify boundaries: “New York” and “York” are different extractions.

## 2. Encode boundaries

**BIO encoding** uses B for beginning, I for continuation, and O for outside, with entity types attached.

“Ada visits New York” → [B-PER,O,B-LOC,I-LOC]. New and York form one location.

## 3. Align model pieces

**First-piece supervision** scores one piece per source word. **All-piece supervision** labels every piece, converting repeated beginnings into continuations.

```nlp-visual
bio-spans
```

Copying B-PER to both pieces would falsely mark two beginnings. Scoring every piece can give heavily split words more weight; choose loss averaging deliberately.

## 4. Train and reconstruct

Apply token cross-entropy to aligned labels, excluding padding and deliberately ignored pieces.

In “Ada visits New York.”, code-point offsets [11,19) recover the location without the period. Convert indexing conventions explicitly when needed.

## 5. Evaluate whole entities

An **exact entity match** requires the same start, end, and type under the evaluation policy.

Three correct spans, four predicted spans, five gold spans → precision 0.75, recall 0.60, F1≈0.667.

Many O tokens can hide entity failures in token accuracy.

## 6. Know the representation limits

Flat BIO assigns one label per token, so it cannot directly encode nested or overlapping spans.

Independent predictions can also produce invalid continuations. Transition-aware decoding addresses that separate problem.

## 7. Interview reasoning

**Question:** Is “York” a correct location extraction for gold “New York”?

**Answer:** Not under exact span matching. Correct type does not repair an incomplete boundary.
