## Part V — Modern Deep-Learning Fundamentals  
### Topic 6: Decoding Strategies — Greedy, Beam Search, Temperature, Top-k, Top-p

A decoder-only model gives us **logits for every vocabulary token**.

The remaining question is:

> Given those probabilities, **which token do we actually choose?**

That choice is called **decoding**.

```text
Transformer
    │
    ▼
logits over vocabulary
    │
    ▼
probabilities
    │
    ▼
DECODING STRATEGY
    │
    ▼
chosen next token
```

The model and decoding strategy are separate concepts.

---

## 1. Start with an example

Suppose the model predicts:

| Token | Probability |
|---|---:|
| `cat` | 0.40 |
| `dog` | 0.30 |
| `rabbit` | 0.15 |
| `car` | 0.05 |
| others | 0.10 |

There are several ways to choose the next token.

---

## 2. Greedy decoding

**Greedy decoding** always chooses the token with highest probability:

\[
\boxed{x_{t+1}=\arg\max_i P(i)}
\]

So here:

```text
cat = 0.40  ← choose
dog = 0.30
rabbit = 0.15
```

Then append `"cat"` and repeat.

```text
"The"
   ↓
highest probability = "cat"

"The cat"
   ↓
highest probability = "sat"

"The cat sat"
   ↓
...
```

### Advantage

Very simple and deterministic.

### Problem

The locally best token is not necessarily part of the globally best sequence.

For example:

```text
            A (0.60)
           /
start ────
           \
            B (0.40)
```

Greedy chooses A.

But perhaps:

```text
A → terrible continuation probabilities
B → excellent continuation probabilities
```

The sequence beginning with B could ultimately have higher total probability.

That motivates beam search.

Minimal code:

```python
next_token = logits.argmax(dim=-1)
```

---

# 3. Beam search

Instead of keeping only one sequence, **beam search keeps the best \(k\) candidate sequences**.

Suppose beam width:

\[
k=2
\]

At the first step:

```text
                    cat
                  / 0.40

Prompt ────────── dog
                  \ 0.30

                  rabbit
                    0.15
```

Keep:

```text
cat
dog
```

Then expand both:

```text
cat ── sat
    └─ sleeps

dog ── ran
    └─ sleeps
```

Score all complete partial sequences and retain the best two.

Conceptually:

```text
Step 1:
keep best 2

Step 2:
expand both
keep best 2

Step 3:
expand both
keep best 2

...
```

So beam search performs a limited search through the sequence tree.

---

## 4. Sequence probability

If a generated sequence is:

\[
y_1,y_2,\dots,y_T
\]

its probability is:

\[
P(y_1,\dots,y_T)
=
\prod_t P(y_t\mid y_{<t})
\]

In practice, we use log probabilities:

\[
\log P(y)
=
\sum_t \log P(y_t\mid y_{<t})
\]

because multiplying many tiny probabilities is numerically inconvenient.

Beam search keeps candidates with high cumulative scores.

---

## 5. Why beam search works well for some tasks

Beam search is especially natural when there may be a relatively constrained correct output.

For example:

```text
translation
speech recognition
structured sequence generation
```

You want a high-probability sequence rather than lots of creativity.

However, for open-ended conversational generation, large beam search can produce text that is overly generic or repetitive.

Modern conversational LLMs therefore often rely heavily on **sampling-based decoding** instead.

---

# 6. Sampling

Instead of always choosing:

\[
\arg\max
\]

we can sample according to the predicted distribution.

Example:

```text
cat       40%
dog       30%
rabbit    15%
car        5%
...
```

Then `"dog"` can sometimes be selected even though `"cat"` has the highest probability.

This introduces diversity.

```python
next_token = torch.multinomial(probs, 1)
```

The next question becomes:

> How random should the distribution be?

That's where **temperature** comes in.

---

# 7. Temperature

Temperature changes the logits before softmax:

\[
\boxed{
P_i=
\operatorname{softmax}
\left(\frac{z_i}{T}\right)
}
\]

where:

- \(z_i\) = logit
- \(T\) = temperature

---

## 8. Low temperature

Suppose:

\[
T<1
\]

Dividing by something smaller makes differences between logits larger.

Example logits:

\[
[4,3,1]
\]

with:

\[
T=0.5
\]

become:

\[
[8,6,2]
\]

Softmax becomes more concentrated.

```text
before:

cat   ████████     55%
dog   █████        35%
car   ██           10%


low temperature:

cat   ███████████  86%
dog   ██           13%
car                1%
```

Therefore:

\[
\boxed{T\downarrow\Rightarrow\text{more deterministic}}
\]

---

# 9. High temperature

If:

\[
T>1
\]

logit differences shrink.

For:

\[
T=2
\]

our logits:

\[
[4,3,1]
\]

become:

\[
[2,1.5,0.5]
\]

The probability distribution becomes flatter.

```text
cat   ██████       48%
dog   █████        34%
car   ███          18%
```

Therefore:

\[
\boxed{T\uparrow\Rightarrow\text{more randomness/diversity}}
\]

But too high a temperature increases the chance of selecting unlikely or incoherent tokens.

---

# 10. Temperature = 0?

Mathematically, dividing by zero isn't defined.

In APIs and common terminology, `"temperature = 0"` is usually treated conceptually as:

> choose the highest-probability token / make decoding maximally deterministic.

So interview-level intuition:

```text
low T   → focused
high T  → diverse
```

---

# 11. The problem with unrestricted sampling

Suppose vocabulary size is:

\[
V=100{,}000
\]

There may be thousands of tokens with tiny probabilities.

Even though each is unlikely individually, unrestricted sampling can occasionally choose a bizarre token.

Example:

```text
cat         0.30
dog         0.25
rabbit      0.15
...
spaceship   0.00003
banana      0.00002
```

We may want to remove the long tail before sampling.

That gives us **top-k** and **top-p**.

---

# 12. Top-k sampling

With **top-k**, keep only the \(k\) highest-probability tokens.

Suppose:

\[
k=3
\]

Original:

```text
cat       .40
dog       .30
rabbit    .15
car       .05
house     .04
...
```

Keep:

```text
cat       .40
dog       .30
rabbit    .15
```

Discard everything else.

Then renormalize:

```text
cat       47%
dog       35%
rabbit    18%
```

and sample.

So:

\[
\boxed{\text{top-k = fixed number of candidate tokens}}
\]

---

# 13. Weakness of top-k

The best number of reasonable choices changes depending on context.

Consider:

> `"The capital of France is"`

The distribution might be:

```text
Paris      0.97
Lyon       0.01
London     0.005
...
```

Keeping 50 tokens is unnecessary.

But consider:

> `"My favorite thing to do on vacation is"`

There may be many plausible continuations:

```text
swimming
hiking
reading
traveling
eating
exploring
...
```

Here, a larger candidate set makes sense.

Top-k always keeps exactly \(k\), regardless of the distribution.

Top-p solves this more adaptively.

---

# 14. Top-p / nucleus sampling

**Top-p sampling**, also called **nucleus sampling**, keeps the smallest set of highest-probability tokens whose cumulative probability reaches \(p\).

Suppose:

\[
p=0.90
\]

Distribution:

```text
cat       .40   cumulative .40
dog       .30   cumulative .70
rabbit    .15   cumulative .85
mouse     .08   cumulative .93  ← stop
car       .03
...
```

Keep:

```text
cat
dog
rabbit
mouse
```

because their cumulative probability reaches at least:

\[
0.90
\]

Then renormalize and sample.

So:

\[
\boxed{\text{top-p = adaptive candidate-set size}}
\]

---

# 15. Why top-p is attractive

If the model is highly confident:

```text
Paris = .97
```

the nucleus might contain only one or two tokens.

If the model is uncertain:

```text
A = .15
B = .14
C = .12
D = .10
...
```

many tokens may enter the nucleus.

So top-p adapts to the uncertainty of the model.

That's the core advantage over fixed top-k.

---

# 16. Temperature vs top-k/top-p

These solve related but different problems.

### Temperature

Changes the **shape of the probability distribution**.

```text
T↓ → sharper
T↑ → flatter
```

### Top-k / top-p

Change **which tokens are allowed to be sampled**.

```text
top-k → retain k tokens
top-p → retain probability mass p
```

They are commonly combined.

Conceptually:

```text
logits
   │
   ▼
temperature
   │
   ▼
probabilities
   │
   ▼
top-k / top-p filtering
   │
   ▼
renormalize
   │
   ▼
sample
```

---

# 17. Greedy vs beam vs sampling

This is the key comparison:

| Method | Strategy | Deterministic? | Natural use |
|---|---|---|---|
| Greedy | Best next token | Yes | Simple/focused output |
| Beam search | Keep best sequences | Usually yes | Translation / constrained generation |
| Sampling | Sample distribution | No | Diverse generation |
| Temperature | Adjust randomness | — | Control distribution sharpness |
| Top-k | Sample among top \(k\) | No | Remove low-probability tail |
| Top-p | Sample from cumulative probability mass | No | Adaptive diversity |

---

# 18. An important interview distinction

Greedy decoding optimizes:

> **the best next token at each step.**

Beam search approximates:

> **a high-probability complete sequence.**

Sampling instead says:

> **Don't necessarily choose the maximum-probability sequence; generate plausible sequences according to the distribution.**

These represent different goals.

---

# 19. Why not always choose the highest-probability sequence?

For creative/open-ended language, maximum probability can favor safe and generic outputs.

For example:

```text
User:
Tell me a story.

High-probability continuation:
"Once upon a time..."
```

There may be many valid outputs.

Sampling gives the model access to lower-probability but still reasonable alternatives.

That's why generative applications generally need a balance between:

\[
\boxed{\text{coherence}}
\]

and:

\[
\boxed{\text{diversity}}
\]

---

## Minimal PyTorch

Temperature:

```python
probs = torch.softmax(logits / temperature, dim=-1)
```

Top-k:

```python
values, indices = torch.topk(probs, k)
```

Sampling:

```python
next_token = torch.multinomial(probs, 1)
```

---

## Interview answer

If asked:

> What decoding strategies are commonly used for language models?

A strong answer is:

> Greedy decoding selects the highest-probability token at every step, while beam search maintains several high-probability partial sequences to approximate a globally better sequence. Sampling instead draws tokens from the model's probability distribution, which gives more diverse output. Temperature controls the sharpness of that distribution: lower temperature makes it more deterministic and higher temperature increases diversity. Top-k restricts sampling to the \(k\) most likely tokens, while top-p or nucleus sampling dynamically keeps the smallest set of tokens whose cumulative probability reaches a threshold \(p\).

The compact mental model:

\[
\boxed{
\text{Greedy = best token}
}
\]

\[
\boxed{
\text{Beam = search best sequence}
}
\]

\[
\boxed{
\text{Temperature = reshape probabilities}
}
\]

\[
\boxed{
\text{Top-k = fixed candidate count}
}
\]

\[
\boxed{
\text{Top-p = adaptive candidate probability mass}
}
\]

**Next and final Part V topic: Key-Value (KV) cache basics** — we already touched it in the Transformer chapter, so this should be a short, inference-focused lesson on exactly what gets cached, the shapes involved, and why it speeds up autoregressive generation.
