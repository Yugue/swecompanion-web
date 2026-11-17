# Next-token targets and teacher forcing

## 1. Create the supervision

**Causal language modeling** predicts the next token from its prefix. It is **self-supervised learning** because the text supplies its own labels.

**Teacher forcing** supplies true preceding tokens during training rather than the model’s earlier generated choices.

## 2. Shift by one position

```llm-visual
shifted-targets
```

For [BOS, cats, sleep, EOS], score [cats, sleep, EOS] from input states [BOS, cats, sleep]. **BOS** is a beginning marker; **EOS** is an end marker. Tokenizer conventions can differ.

Some libraries shift labels internally. Shifting again in the data pipeline accidentally trains a two-token-ahead target.

## 3. Score only intended positions

Loss masking selects scored predictions without hiding input tokens. Ignore padding targets; response-only training may score assistant targets while keeping user tokens visible.

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

**Exposure bias** is the mismatch between true training prefixes and the model’s imperfect generated prefixes. Test free-running repetition and stopping as well as teacher-forced loss.

> **Reason it through:** Two microbatches have unequal supervised-token counts. Why can averaging their mean losses change the intended objective?
