# Attention masks

## 1. Control information access

An **attention mask** specifies which query–key pairs are allowed. A **causal mask** lets a position read its current and earlier input positions while blocking later ones.

This prevents a next-token predictor from consulting future input states during training.

## 2. Mask scores before softmax

\[
A=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}+M\right)
\]
Q and K contain queries and keys; \(d_k\) is key width; M is zero for allowed pairs and negative infinity for blocked pairs; A holds attention weights. Blocked entries receive zero weight.

## 3. Read the triangle

```genai-visual
causal-mask
```

Rows are queries and columns are keys. The diagonal is allowed: at the “cats” input position, predict the next token “sleep.” The input token itself is already known.

## 4. Handle padding separately

**Padding** adds filler tokens so examples fit a common tensor shape. A key-padding mask prevents real tokens from reading those fillers.

A **loss mask** instead decides which predictions contribute to the training objective. Excluding a target from loss does not remove its corresponding input from attention.

## 5. Preserve sequence boundaries

When several examples share one packed array, reset attention boundaries unless their interaction is intentionally part of the task. Otherwise one document can use another document’s text as extra evidence.

A low training loss after a masking mistake can reflect leakage rather than better modeling.

## 6. Check implementation conventions

Libraries can interpret boolean masks differently. Verify the documented meaning of true, broadcast dimensions, and whether causal masking is applied separately.

Avoid a query row with no allowed keys: softmax over all negative infinities can produce non-finite values.
