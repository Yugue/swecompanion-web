# Byte-pair encoding

## 1. Reuse adjacent pieces

**Byte-pair encoding (BPE)** learns ranked merges of adjacent symbols. NLP variants start from characters or bytes.

“Lower” can use [low, er] without requiring a whole-word vocabulary entry.

## 2. Learn merges from counts

Toy corpus: “low” twice and “lower” once. Start with characters.

Pairs l+o and o+w each occur three times. Choose l+o under a fixed tie rule, merge its occurrences, and recount. Then lo+w occurs three times.

Boundaries, preprocessing, and tie rules are part of the tokenizer.

## 3. Follow the changed boundaries

```nlp-visual
subwords
```

The selected merges are l+o, lo+w, and e+r. At the last step, the toy tie rule chooses e+r over an equally frequent alternative.

The characters stay the same; their grouping changes.

## 4. Encode with fixed ranks

At inference, start from base symbols and apply available merges in learned rank order until none remains.

Training chooses the merges. Encoding reuses them; it does not relearn pair frequencies from each request.

## 5. Check what is covered

**Byte-level BPE** supplies byte representations before merging. Character-based NLP BPE does not automatically cover every unseen symbol.

A piece need not match a word or morpheme. It represents a useful fitted text fragment, not a guaranteed unit of meaning.

## 6. Choose a budget

More merges add vocabulary entries and usually shorten familiar text. Rare scripts can still fragment heavily.

Inspect segmentation and length distributions on actual inputs. A vocabulary that compresses one language well may truncate another language’s evidence more often.
