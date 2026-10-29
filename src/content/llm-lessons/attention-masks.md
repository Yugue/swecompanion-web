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

During training, the true input prefix at every position is already known. Matrix operations compute all positions together, while the causal mask prevents each position from reading its own future target.

At generation, the next input token is unknown until a token is selected from the previous distribution. Parallel scoring of a known sequence does not remove this dependency.

## 4. Distinguish access from supervision

A **loss mask** selects predictions that contribute to the objective; an attention mask selects information the model may read.

Prompt tokens may be visible but not directly supervised in instruction tuning. A future target must remain hidden from the position predicting it even if that target's own loss is ignored.

## 5. Diagnose leakage and padding

A suddenly excellent training loss after removing the mask often indicates target leakage, not better reasoning. Check which input position predicts which target.

Padding errors may create batch-length-dependent behavior. Compare a sequence alone and in padded batches before blaming model capacity.
