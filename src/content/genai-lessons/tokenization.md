# Tokens and tokenization

## 1. Choose model units

A **tokenizer** splits text into model units called **tokens** and maps them to integer IDs in a **vocabulary**, the finite inventory of allowed tokens. Tokens can be words, characters, bytes, or subword fragments.

An ID is an address in a table. Token 100 is not semantically twice token 50.

## 2. Use subwords

**Subword tokenization** shares recurring fragments across words. A rare compound can be represented by several familiar pieces instead of one unknown word.

**Byte-pair encoding (BPE)** starts from small units and repeatedly merges frequent adjacent pairs during tokenizer training.

```genai-visual
subwords
```

## 3. Distinguish other schemes

**WordPiece** also builds a subword vocabulary, using a different vocabulary-construction criterion and typically greedy segmentation at encoding time. A **Unigram tokenizer** scores candidate pieces and selects a likely segmentation.

These methods differ in training and segmentation; the final token IDs still select learned model inputs.

## 4. Balance vocabulary and length

A larger vocabulary may shorten common sequences but enlarge the vocabulary-indexed parameter tables. Smaller units improve coverage while increasing sequence length and computation.

Byte-level coverage avoids many unknown-character problems, but unfamiliar scripts can require many more tokens per word.

## 5. Handle boundaries explicitly

**Special tokens** mark structural information such as sequence boundaries, padding, or chat roles. Their IDs and interpretation are part of the trained model’s input contract.

Changing tokenizer settings without matching model weights changes which vectors text selects.

## 6. Measure the actual workload

Count tokens on representative languages, code, and formatting. Character count alone is a weak proxy for context usage and generation cost.

Normalization can remove meaningful distinctions. Preserve original text when offsets, citations, or exact reconstruction matter.
