# Tokens and tokenization

## 1. Choose model units

A **tokenizer** converts text into **tokens** with IDs from a **vocabulary**. This is the text-side representation contract of a multimodal model.

An ID is an address in a table. Token 100 is not semantically twice token 50.

## 2. Use subwords

**Subword tokenization** represents words through reusable fragments. An image caption's rare object name can remain representable as several pieces.

**Byte-pair encoding (BPE)** starts from small units and repeatedly merges frequent adjacent pairs during tokenizer training.

```genai-visual
subwords
```

## 3. Distinguish other schemes

**WordPiece** also builds a subword vocabulary, using a different vocabulary-construction criterion and typically greedy segmentation at encoding time. A **Unigram tokenizer** scores candidate pieces and selects a likely segmentation.

These methods differ in training and segmentation; the final token IDs still select learned model inputs.

## 4. Balance vocabulary and length

Vocabulary size trades shorter text sequences against larger input/output tables. Image representation length creates an additional, separate sequence budget.

Byte-level coverage avoids many unknown-character problems, but unfamiliar scripts can require many more tokens per word.

## 5. Handle boundaries explicitly

**Special tokens** designate structure, such as boundaries or modality markers where supported. Their semantics must match the model's actual training format.

Changing tokenizer settings without matching model weights changes which vectors text selects.

## 6. Measure the actual workload

Measure the complete conditioned sequence, including represented media and text. Text character counts alone omit a multimodal request's input burden.

Normalization can remove meaningful distinctions. Preserve original text when offsets, citations, or exact reconstruction matter.

Text units and compressed image units are not interchangeable symbols. A multimodal interface must specify each representation's boundaries and meaning before a shared sequence model can learn relationships between them.
