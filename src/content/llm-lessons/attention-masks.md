# Causal masks, padding, and information leakage

## 1. Block future information

A **causal mask** allows position t to read positions up to t. Forbidden attention logits receive negative infinity before softmax, making their weights zero.

```genai-visual
causal-mask
```

A **padding mask** instead excludes filler positions used to align batch lengths. Real end-of-sequence tokens and padding serve different roles.

## 2. Calculate the effect

Suppose raw source scores are [log 3,0,log 8], but the last source is a forbidden future position. Replacing its score with negative infinity gives attention weights [0.75,0.25,0].

Mask before normalization. Simply zeroing a value vector after softmax leaves the other weights incorrectly normalized.

## 3. Separate training from generation

Training knows every true prefix, so it scores positions in parallel under the causal mask.

Generation must select the next token before that token can become input.

## 4. Distinguish access from supervision

A **loss mask** selects predictions that contribute to the objective; an attention mask selects information the model may read.

Prompt tokens may be visible but not directly supervised in instruction tuning. A future target must remain hidden from the position predicting it even if that target's own loss is ignored.

## 5. Diagnose leakage and padding

Unexpectedly excellent loss after removing a mask suggests future-target leakage. Padding bugs often appear only in mixed-length batches; compare a sequence alone and padded.

| Prompt position | May supply context? | Must contribute loss? |
|---|---|---|
| Instruction prefix | Yes | Not in response-only training |
| Supervised answer token | Under the causal rule | Yes |

> **Reason it through:** A batch improves suspiciously when future positions become visible. Why can ignoring their loss still leave leakage?
