# Next-token targets and teacher forcing

## 1. Create the supervision

**Causal language modeling** trains a model to predict the next token from its prefix. The text supplies its own targets, making this **self-supervised learning**: labels are derived from the data itself.

**Teacher forcing** supplies the true preceding tokens during training, rather than earlier model-generated choices.

## 2. Shift by one position

```llm-visual
shifted-targets
```

For [BOS, cats, sleep, EOS], score [cats, sleep, EOS] from input states [BOS, cats, sleep]. **BOS** is a beginning marker; **EOS** is an end marker. Tokenizer conventions can differ.

Some libraries shift labels internally. Shifting again in the data pipeline accidentally trains a two-token-ahead target.

## 3. Score only intended positions

The loss mask, introduced with attention masking, selects scored predictions without changing which input tokens remain visible.

Padding targets should be ignored. For causal pretraining, most real continuation tokens contribute. In instruction tuning, user tokens may remain visible while only assistant targets are scored.

## 4. Pack examples deliberately

**Sequence packing** fills a training window with multiple examples to reduce padding. An EOS marker indicates an end but does not itself block attention across that boundary.

```llm-visual
packed-attention
```

A block-diagonal causal mask keeps documents independent. Also avoid scoring an unintended target across their boundary. Other pipelines permit cross-document context deliberately; document which objective you train.

## 5. Normalize the actual objective

Batch A has 100 scored tokens with mean loss 1; batch B has 10 with mean loss 3. Averaging batch means gives 2, while the token mean is (100×1+10×3)/110≈1.182.

When accumulating gradients, weight by intended token counts. Incorrect normalization can make short sequences or heavily masked examples dominate updates.

## 6. Check generation separately

**Exposure bias** is the mismatch between training on true prefixes and generation from the model's own imperfect outputs. An early mistake can send later predictions into unfamiliar contexts.

A lower teacher-forced loss is useful but not sufficient. Inspect free-running continuations, end behavior, and repeated-token failures too.
