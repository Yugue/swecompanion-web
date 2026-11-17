# Tokens and tokenization

## 1. Choose model units

A **tokenizer** maps text pieces (**tokens**) to IDs in a **vocabulary**, its allowed inventory. Pieces may be words, subwords, characters, or bytes.

An ID is a table address, not a numerical measure of meaning.

## 2. Use subwords

**Subword tokenization** shares recurring fragments across words. A rare compound can be represented by several familiar pieces instead of one unknown word.

**Byte-pair encoding (BPE)** starts from small units and repeatedly merges frequent adjacent pairs during tokenizer training. The learned **merge ranks** give pairs a priority order when encoding new text.

```genai-visual
subwords
```

## 3. Distinguish other schemes

**WordPiece** usually selects the longest matching piece from left to right. A **Unigram tokenizer** chooses a segmentation using learned piece probabilities.

Encoding applies the fitted vocabulary and rules; it does not retrain them per prompt.

## 4. Balance vocabulary and length

Larger vocabulary → potentially shorter sequences, larger vocabulary-indexed parameter tables. Smaller units → broader coverage, longer sequences.

Byte coverage avoids many unknown characters but can make unfamiliar scripts expensive in tokens.

## 5. Handle boundaries explicitly

**Special tokens** mark boundaries, padding, or chat roles. Their IDs must match the model’s training contract.

Changing tokenizer IDs without matching weights selects the wrong learned vectors.

## 6. Measure the actual workload

Count tokens on representative languages and code; characters are a weak cost proxy.

**Text normalization** changes case or Unicode forms before encoding. Preserve originals when exact characters or source offsets matter.

> **Reason it through:** A tokenizer update preserves displayed text but changes IDs. Why can the old model now behave differently?
