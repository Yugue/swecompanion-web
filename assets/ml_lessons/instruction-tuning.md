## Part V — Modern Deep-Learning Fundamentals  
### Topic 4: Instruction Tuning

A pretrained language model already knows a lot, but that does **not automatically mean it is good at following instructions**.

The core idea is:

\[
\boxed{\text{Instruction tuning = fine-tuning a pretrained model on instruction-response examples}}
\]

so that it learns a behavioral pattern like:

```text
Instruction:
"Summarize this paragraph."

Response:
<good summary>
```

---

## 1. Why pretraining alone is not enough

A base decoder-only model is trained mainly to continue text.

Given:

```text
User: Explain gradient descent simply.
Assistant:
```

a pretrained model may continue reasonably, but its core objective was still:

\[
\boxed{\text{predict the next token}}
\]

It was not explicitly trained to interpret:

> “This text is an instruction that I should obey.”

Instruction tuning teaches that relationship.

---

## 2. What the training data looks like

A dataset might contain examples such as:

```text
Instruction:
Translate "hello" to French.

Response:
Bonjour.
```

or:

```text
Instruction:
Write a Python function that reverses a string.

Response:
def reverse_string(s):
    return s[::-1]
```

or:

```text
Instruction:
Classify this review as positive or negative:
"The movie was excellent."

Response:
Positive
```

Training then uses ordinary next-token prediction on the desired response.

So technically, the language-model machinery remains the same.

What changes is:

\[
\boxed{\text{the training examples}}
\]

---

## 3. What behavior is being learned?

Before instruction tuning, the model learns:

```text
What text tends to come next?
```

After instruction tuning, it becomes much better at:

```text
What response appropriately satisfies this instruction?
```

So the model learns patterns such as:

```text
"Summarize..."       → produce summary
"Translate..."       → translate
"Explain..."         → explanation
"Write code..."      → code
"Return JSON..."     → structured output
```

This makes one model usable across many tasks without training a separate model for every task.

---

## 4. Instruction tuning is still fine-tuning

This relationship is important:

\[
\boxed{\text{Instruction tuning is a specific kind of fine-tuning}}
\]

Fine-tuning broadly means:

> adapt a pretrained model using additional training data.

Instruction tuning specifically means:

> fine-tune it on examples of instructions paired with desired responses.

So:

```text
Pretrained model
      ↓
instruction-response dataset
      ↓
instruction tuning
      ↓
instruction-following model
```

---

## 5. Why not just fine-tune on one task?

Suppose you fine-tune only on sentiment classification.

Then the model gets specialized:

```text
review → positive / negative
```

Instruction tuning instead deliberately mixes many tasks:

```text
translation
summarization
question answering
coding
classification
reasoning
format following
...
```

This teaches a more general meta-pattern:

> “Read the instruction and infer what task is being requested.”

That is more general than specializing on one narrow task.

---

## 6. Generalization to unseen instructions

This is one of the interesting effects.

Suppose training contains:

```text
Summarize this article...
```

and:

```text
Rewrite this paragraph formally...
```

Later the model receives:

```text
Condense this email into two bullet points.
```

Even if that exact instruction never appeared in training, it may generalize.

Why?

Because the model has learned:

- language representations during pretraining
- many instruction→response mappings during instruction tuning

Together, those support generalization to new tasks phrased in natural language.

---

## 7. Zero-shot and few-shot behavior

Instruction-tuned models are often much better at **zero-shot** tasks.

Zero-shot means:

```text
instruction
    ↓
model performs task
```

with no examples included in the prompt.

Few-shot means you give a few examples:

```text
Input: great movie
Output: positive

Input: awful movie
Output: negative

Input: very enjoyable
Output:
```

The model infers the pattern from context.

Instruction tuning generally makes both behaviors more reliable.

---

## 8. Base model vs instruction-tuned model

A useful distinction:

| Base pretrained model | Instruction-tuned model |
|---|---|
| Optimized mainly for text continuation | Optimized to respond to instructions |
| May continue prompts unpredictably | More likely to obey the requested task |
| Often requires careful prompting | Usually easier to interact with |
| Strong language model | Stronger assistant behavior |

The underlying architecture may be essentially the same.

The difference is largely in **post-pretraining training**.

---

## 9. Instruction tuning does not replace pretraining

You would not usually start from random weights and instruction-tune on a relatively small instruction dataset.

That dataset is nowhere near enough to teach:

- language
- world knowledge
- syntax
- broad semantics

Instead:

```text
massive pretraining
       ↓
general language model
       ↓
instruction tuning
       ↓
instruction-following model
```

Pretraining learns broad capability.

Instruction tuning shapes how that capability is used.

---

## 10. What loss is used?

For a decoder-only language model, often still standard token-level cross-entropy.

Suppose:

```text
Instruction:
Explain convolution.

Response:
A convolution applies...
```

The model predicts response tokens autoregressively.

Conceptually:

\[
L=
-\sum_t
\log P(y_t\mid x,y_{<t})
\]

where:

- \(x\) = instruction
- \(y\) = desired response

The optimization is familiar.

Again:

> The important change is the **data distribution and target behavior**, not a completely new neural-network algorithm.

---

## 11. Do we compute loss on the instruction tokens too?

Often, implementations focus loss primarily or entirely on the **assistant response**, because that is the behavior being optimized.

Conceptually:

```text
User instruction:
Explain backpropagation.
        ↓
usually context

Assistant response:
Backpropagation computes...
        ↓
training target
```

This prevents wasting learning signal on simply reproducing the prompt.

Exact implementation varies, but this is a useful practical detail.

---

## 12. Where do the instruction-response examples come from?

They can come from different sources, such as:

- human-written demonstrations
- curated datasets
- synthetic examples generated by stronger models
- transformed existing datasets

The central requirement is that the responses represent behavior we want the model to imitate.

---

## 13. Instruction tuning vs alignment

These terms overlap but are not identical.

Instruction tuning mainly teaches:

> **follow the requested task.**

Broader alignment may additionally teach things like:

> which responses are preferred, safer, more helpful, or more appropriate.

For example, later training might involve preference comparisons:

```text
Prompt
  ↓
Response A
Response B
  ↓
which is better?
```

That leads into methods such as preference optimization.

For your current curriculum, the important point is simply:

\[
\boxed{\text{instruction tuning is not the entire alignment pipeline}}
\]

---

## 14. Why instruction tuning is powerful

A pretrained model may already contain the capability to translate, summarize, or classify.

Instruction tuning often does not create all of those capabilities from scratch.

Instead, it helps the model **access and express them in response to natural-language commands**.

A useful mental model is:

```text
Pretraining:
learn many capabilities

Instruction tuning:
learn when and how to use them
```

That distinction is very useful.

---

## Minimal training intuition

Conceptually:

```python
loss = model(input_ids=prompt_and_response, labels=response_labels).loss
```

The model is still doing next-token prediction, but now the sequence is structured around an instruction and a desired answer.

---

## Interview answer

If asked:

> What is instruction tuning?

A strong answer is:

> Instruction tuning is a form of supervised fine-tuning where a pretrained language model is trained on diverse instruction-response pairs. The goal is to teach the model to interpret natural-language instructions and produce responses that satisfy them. The underlying language-model objective is often still next-token cross-entropy, but the training data is structured around desired assistant behavior rather than generic text continuation. This improves zero-shot and general instruction-following ability.

The key distinction to remember is:

\[
\boxed{\text{Pretraining learns capabilities}}
\]

\[
\boxed{\text{Instruction tuning teaches how to use those capabilities on command}}
\]

**Next topic: Low-Rank Adaptation (LoRA) and parameter-efficient fine-tuning** — how to adapt a huge model without updating all of its weights.
