# Byte-pair encoding

## 1. Reuse pieces across words

**Byte-pair encoding (BPE)** learns a ranked list of adjacent-symbol merges. NLP variants start from characters or bytes and build frequently useful pieces.

A fixed set of pieces can express “lower” as “low” plus “er” without storing every whole word.

## 2. Learn merges from a corpus

Start a toy corpus with “low” twice and “lower” once, represented as characters. Count adjacent pairs, weighted by word frequency.

The pairs l+o and o+w each occur three times. Choose l+o under the toy tie rule, replace its occurrences, and count again. Then lo+w occurs three times.

Real training also specifies boundaries, preprocessing, and tie handling.

## 3. Follow the segmentation

```nlp-visual
subwords
```

The displayed three merges are l+o, lo+w, and e+r. For the last step, the toy tie rule selects e+r over another equally frequent pair.

The same symbol sequence remains underneath; the boundaries change.

## 4. Encode with fixed ranks

At inference, begin from the tokenizer’s base symbols and apply available learned merges according to their ranks until none applies.

Do not relearn pair frequencies on each request. Encoding is the application of fitted rules; training is the process that chose them.

A newly encountered word can be composed from existing pieces if its base symbols are supported.

## 5. State what the name does not guarantee

The NLP algorithm is often called BPE even when its initial units are characters. **Byte-level BPE** specifically supplies a byte representation before merges.

A piece need not be a complete word or morpheme. “low” and “er” are readable here because the example is chosen for clarity; real pieces can cross less intuitive linguistic boundaries under their tokenizer convention.

## 6. Choose a useful vocabulary budget

More merges usually produce larger pieces and fewer tokens on familiar text, while adding vocabulary entries. Rare scripts or domains may still fragment heavily.

Inspect segmentation, length distributions, and source alignment. Compression of frequent strings is not proof that the pieces preserve every distinction important to the task.

## 7. Interview reasoning

**Question:** Why should BPE vocabulary training be separated from final evaluation data?

**Answer:** Otherwise the evaluated procedure can adapt its representation to held-out text. Define the intended training and external-pretraining resources, then assess that fixed procedure independently.
