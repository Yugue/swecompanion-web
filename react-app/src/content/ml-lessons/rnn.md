## Part III — Core Architectures  
### Topic 4: Recurrent Neural Network (RNN) fundamentals

A **Recurrent Neural Network (RNN)** exists because some data has an important property that a normal feed-forward network does not naturally capture:

> **Order matters.**

For example, compare:

> “dog bites man”  
> “man bites dog”

Same words, completely different meaning.

A normal Multi-Layer Perceptron (MLP) processes an input without an inherent notion of **what came before**. An RNN introduces a **hidden state** that acts like a running memory of the sequence.

---

## 1. The core mental model: read one item at a time

Suppose the input sentence is:

> **I love deep learning**

An RNN processes it sequentially:

```text
          hidden state       hidden state       hidden state
              h₁                  h₂                  h₃
              │                   │                   │
              ▼                   ▼                   ▼

"I"  ───► [ RNN ] ───► "love" ─► [ RNN ] ───► "deep" ─► [ RNN ] ───► "learning"
            │                     │                     │
            ▼                     ▼                     ▼
           h₁                    h₂                    h₃
```

A better way to picture it is:

```text
x₁          x₂          x₃          x₄
"I"       "love"       "deep"    "learning"
 │           │           │           │
 ▼           ▼           ▼           ▼
┌───┐  h₁  ┌───┐  h₂  ┌───┐  h₃  ┌───┐
│RNN│ ───► │RNN│ ───► │RNN│ ───► │RNN│
└───┘      └───┘      └───┘      └───┘
 │           │           │           │
 ▼           ▼           ▼           ▼
h₁          h₂          h₃          h₄
```

The key idea is:

\[
h_t
=
\text{summary of what the network has seen up to time }t
\]

So after reading `"I love deep"`:

\[
h_3
\]

contains some learned representation of that prefix.

---

# 2. What exactly is the hidden state?

At time \(t\), the RNN receives:

- current input \(x_t\)
- previous hidden state \(h_{t-1}\)

and creates:

\[
h_t
\]

Conceptually:

\[
\boxed{
h_t = f(x_t,h_{t-1})
}
\]

For a simple RNN:

\[
h_t =
\tanh(
W_xx_t + W_hh_{t-1}+b
)
\]

This equation is worth understanding rather than memorizing.

There are two pieces:

\[
W_xx_t
\]

means:

> What does the **current input** tell me?

and

\[
W_hh_{t-1}
\]

means:

> What does my **previous memory** tell me?

Then combine them:

```text
Current information
       xₜ
       │
       ▼
     Wₓxₜ
       │
       ├──────┐
       │      │
              ▼
            + ──► tanh ──► hₜ
              ▲
       │      │
       ├──────┘
       │
    Wₕhₜ₋₁
       ▲
       │
Previous memory
     hₜ₋₁
```

That's essentially an RNN.

---

# 3. Concrete example

Imagine that the hidden state only has three numbers:

\[
h_t =
\begin{bmatrix}
?\\
?\\
?
\end{bmatrix}
\]

These numbers don't have predefined meanings, but conceptually the model might learn features somewhat like:

```text
hₜ[0] → subject seems positive
hₜ[1] → sentence is talking about ML
hₜ[2] → negation was recently encountered
```

After:

> I absolutely love

perhaps:

\[
h_t =
\begin{bmatrix}
0.9\\
0.1\\
0.0
\end{bmatrix}
\]

Then suppose the next word is:

> not

The state changes.

The network isn't literally storing English sentences. It stores a **continuous vector representation of relevant history**.

---

# 4. The most important RNN idea: recurrence

Look at this network:

```text
       ┌───────────────────┐
       │                   │
       ▼                   │
xₜ ──► RNN ──► hₜ ─────────┘
```

The output state comes back as input to the next step.

That's why it's called **recurrent**.

If we "unroll" it through time:

```text
       h₀
        │
        ▼
x₁ → [RNN] → h₁
              │
              ▼
x₂ →        [RNN] → h₂
                     │
                     ▼
x₃ →               [RNN] → h₃
                            │
                            ▼
x₄ →                      [RNN] → h₄
```

But these are **not four different RNNs**.

This is crucial.

They are the **same RNN cell reused four times**.

---

# 5. RNNs share weights across time

Suppose we process:

\[
x_1,x_2,x_3,\ldots,x_{100}
\]

We do **not** have:

\[
W_1,W_2,W_3,\ldots,W_{100}
\]

Instead:

\[
\boxed{
W_x,\;W_h
}
\]

are reused at every time step.

```text
time 1       time 2       time 3       time 4
  │            │            │            │
  ▼            ▼            ▼            ▼
same W       same W       same W       same W
```

This is analogous to CNN weight sharing.

CNN:

> Same filter reused across **space**.

RNN:

> Same transformation reused across **time**.

That's a nice interview comparison.

---

# 6. RNNs can handle variable-length sequences

Because the same recurrent cell is repeatedly applied, you can theoretically process:

```text
3 words
10 words
100 words
```

without changing the model's parameter count.

For example:

```text
"hello"
   ↓
1 step

"I really like this movie"
   ↓
5 steps
```

The same RNN works for both.

---

# 7. What does an RNN output?

There are several common patterns.

### Many-to-one

Example: sentiment classification.

```text
"This" → "movie" → "is" → "great"
   │       │        │        │
   ▼       ▼        ▼        ▼
 [RNN] → [RNN] → [RNN] → [RNN]
                            │
                            ▼
                         Positive
```

We might take the final hidden state:

\[
h_T
\]

and feed it to a classifier.

```python
logits = classifier(h[:, -1])
```

Conceptually:

\[
x_1,\ldots,x_T
\rightarrow
h_T
\rightarrow
\text{classification}
\]

---

### Many-to-many

Suppose we want a label for every word:

```text
Alex      works      at      Google
 │          │         │        │
 ▼          ▼         ▼        ▼
RNN ─────► RNN ─────► RNN ───► RNN
 │          │         │        │
 ▼          ▼         ▼        ▼
PERSON      O         O       ORG
```

Every hidden state produces an output:

\[
h_t \rightarrow y_t
\]

This historically appeared in tasks such as sequence labeling.

---

# 8. Shapes

Suppose:

- batch size = \(32\)
- sequence length = \(20\)
- embedding size = \(128\)

Input:

\[
X:
32\times20\times128
\]

Each sequence contains 20 tokens.

An RNN with hidden size 256 might produce:

\[
H:
32\times20\times256
\]

Meaning:

```text
32 sequences
      ×
20 time steps
      ×
256 hidden features
```

At each time step:

\[
x_t\in\mathbb{R}^{128}
\]

and

\[
h_t\in\mathbb{R}^{256}
\]

---

# 9. Where do the input vectors come from?

For language, we don't normally feed words directly.

Instead:

```text
"cat"
  │
  ▼
embedding
  │
  ▼
[0.18, -0.72, 0.34, ...]
  │
  ▼
 RNN
```

So typically:

\[
\text{token}
\rightarrow
\text{embedding}
\rightarrow
\text{RNN}
\]

We'll study embeddings more deeply later.

---

# 10. Initial hidden state

What does the first token use?

There is no \(h_{-1}\).

Usually:

\[
h_0 = 0
\]

So:

```text
h₀ = [0,0,...,0]
        │
        ▼
x₁ ───► RNN ───► h₁
```

Sometimes the initial state can be learned or supplied by another network, but zero initialization is the basic case.

---

# 11. Why use `tanh`?

The classic simple RNN uses:

\[
h_t =
\tanh(W_xx_t+W_hh_{t-1}+b)
\]

`tanh` compresses values into approximately:

\[
[-1,1]
\]

This helps keep hidden-state values bounded.

However, you've already encountered the downside:

> Repeated `tanh` derivatives can contribute to **vanishing gradients**.

And now we get to the major weakness of vanilla RNNs.

---

# 12. The fundamental problem: long-term memory

Consider:

> **The movie that I watched with my friends two weeks ago, despite the terrible reviews, was ____**

To predict the next word, information from much earlier may matter.

An RNN has to pass information through:

```text
h₁ → h₂ → h₃ → h₄ → h₅ → ... → h₅₀
```

That's a long chain.

Information and gradients must survive through every step.

So vanilla RNNs struggle with **long-range dependencies**.

Visualize it:

```text
Important information
       ↓
      h₁
       │
       ▼
      h₂
       │
       ▼
      h₃
       │
       ▼
      h₄
       │
       ▼
     ...
       │
       ▼
     h₅₀

"Do we still remember h₁?"
```

Often, not very well.

This is exactly why **Long Short-Term Memory (LSTM)** and **Gated Recurrent Unit (GRU)** architectures were created.

But before those, the next topic explains *why training through this chain causes the problem*:

> **Backpropagation Through Time (BPTT).**

---

## 13. Bidirectional RNN — one important variation

Sometimes the prediction can use both past and future context.

For the sentence:

> Alex works at Google

a forward RNN sees:

```text
Alex → works → at → Google
```

A backward RNN sees:

```text
Alex ← works ← at ← Google
```

Then we combine both representations:

```text
           forward RNN →
Alex     works      at      Google
 ← backward RNN
```

This is a **Bidirectional RNN (BiRNN)**.

It is useful when the full sequence is available.

But it cannot naturally be used for strict causal generation where future tokens don't exist yet.

---

# 14. Minimal PyTorch

```python
rnn = torch.nn.RNN(input_size=128, hidden_size=256, batch_first=True)
```

Given:

```python
x.shape == (32, 20, 128)
```

you get roughly:

```python
output.shape == (32, 20, 256)
```

where `output[:, t]` contains \(h_t\).

---

# The mental model to lock in

Think of an RNN as someone reading a sentence while maintaining a notebook:

```text
word
 ↓
┌──────────────────┐
│ Read new word    │
│        +         │
│ Read old notes   │
│        ↓         │
│ Update notebook  │
└──────────────────┘
        │
        ▼
      hₜ
```

Each new input updates the notebook.

Mathematically:

\[
\boxed{
h_t=f(x_t,h_{t-1})
}
\]

And the **same function and weights** are reused at every time step.

### Google-interview answer

If asked:

> What is an RNN and why use one?

A strong concise answer is:

> A Recurrent Neural Network processes a sequence one element at a time while maintaining a hidden state that summarizes previous inputs. The same weights are shared across time, allowing variable-length sequences to be processed. Vanilla RNNs are good at modeling sequential dependencies but struggle with long-range dependencies because gradients must propagate through many recurrent steps, which can cause vanishing or exploding gradients.

That's essentially everything I'd expect you to know before moving into **Backpropagation Through Time (BPTT)**.
