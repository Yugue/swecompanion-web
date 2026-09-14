## Part III — Core Architectures  
### Topic 6: Long Short-Term Memory (LSTM) / Gated Recurrent Unit (GRU)

The problem we just ended with was:

> A vanilla Recurrent Neural Network (RNN) repeatedly transforms its hidden state, so old information and gradients can fade over long sequences.

**Long Short-Term Memory (LSTM)** and **Gated Recurrent Unit (GRU)** networks solve this by adding **gates** that explicitly control what information should be remembered, forgotten, or exposed.

---

# 1. The core LSTM idea

A vanilla RNN has essentially one state:

\[
h_t
\]

An LSTM introduces **two states**:

\[
\boxed{c_t = \text{cell state / long-term memory}}
\]

\[
\boxed{h_t = \text{hidden state / current exposed representation}}
\]

Mental picture:

```text
               LONG-TERM MEMORY
cₜ₋₁ ───────────────────────────────► cₜ
                ▲             │
                │ update      │
                │             ▼
xₜ ───────► [ gates ] ───────► hₜ
                 ▲
                 │
               hₜ₋₁
```

The important innovation is the **horizontal path for \(c_t\)**.

Think of it as a memory highway:

```text
c₁ ───────► c₂ ───────► c₃ ───────► c₄ ───────► c₅
```

Instead of completely recomputing memory at every step, the LSTM can make relatively small controlled modifications to it.

---

# 2. The three gates

An LSTM essentially asks three questions at every time step:

```text
1. What should I FORGET?
2. What new information should I WRITE?
3. What part of memory should I OUTPUT?
```

These correspond to:

- **forget gate**
- **input gate**
- **output gate**

Let's take them one at a time.

---

# 3. Forget gate

Suppose we previously read:

> "Alex grew up in Canada..."

and now the topic suddenly changes:

> "Sarah was born in France..."

The network may no longer need some information about Alex.

The forget gate decides what part of the old cell state \(c_{t-1}\) to keep:

\[
f_t =
\sigma(W_f[x_t,h_{t-1}] + b_f)
\]

Because sigmoid outputs values between 0 and 1:

```text
0   → forget it
0.2 → mostly forget
0.8 → mostly keep
1   → keep it
```

Then:

\[
f_t\odot c_{t-1}
\]

selectively preserves old memory.

Mental picture:

```text
Old memory cₜ₋₁
     │
     ▼
[ forget gate ]
     │
     ├── 1.0 → keep
     ├── 0.7 → mostly keep
     ├── 0.1 → mostly erase
     └── 0.0 → erase
```

---

# 4. Input gate: what should we write?

Now the LSTM asks:

> What new information from \(x_t\) should enter memory?

First it creates candidate information:

\[
\tilde c_t
=
\tanh(W_c[x_t,h_{t-1}]+b_c)
\]

Then an input gate determines how much of that candidate to write:

\[
i_t =
\sigma(W_i[x_t,h_{t-1}]+b_i)
\]

So:

```text
candidate information
        c̃ₜ
         │
         ×  ← input gate iₜ
         │
         ▼
new information written to memory
```

---

# 5. Updating the cell state

Now combine:

\[
\boxed{
c_t =
f_t\odot c_{t-1}
+
i_t\odot\tilde c_t
}
\]

This equation is the heart of the LSTM.

Read it in English:

> New memory = old information I decided to keep + new information I decided to write.

Visual:

```text
                   old memory
                      cₜ₋₁
                        │
                     × fₜ
                        │
                        ▼
                       (+) ─────────► cₜ
                        ▲
                        │
                     × iₜ
                        │
                       c̃ₜ
                 new candidate
```

This is the most important LSTM mental picture.

---

# 6. Why this helps gradients

Notice something special:

\[
c_t =
f_t c_{t-1} + \text{new stuff}
\]

Therefore:

\[
\frac{\partial c_t}{\partial c_{t-1}}
\approx f_t
\]

If the network learns:

\[
f_t \approx 1
\]

then:

\[
c_t \approx c_{t-1}
\]

and gradients can flow backward along the memory path without repeatedly passing through a complicated nonlinear transformation.

Compare:

### Vanilla RNN

```text
h₁ → tanh → h₂ → tanh → h₃ → tanh → h₄
```

Many repeated nonlinear transformations.

### LSTM

```text
c₁ ───×f₂──► c₂ ───×f₃──► c₃ ───×f₄──► c₄
```

If the forget gates stay near 1:

```text
gradient ≈ 1 × 1 × 1 × ...
```

So long-term dependencies become much easier to learn.

This doesn't make vanishing gradients impossible—it makes the path **far better controlled**.

---

# 7. Output gate: what should we expose?

The cell state may contain lots of memory, but the LSTM doesn't necessarily expose all of it.

It computes:

\[
o_t =
\sigma(W_o[x_t,h_{t-1}]+b_o)
\]

and then:

\[
h_t =
o_t\odot\tanh(c_t)
\]

Mental model:

```text
Full memory cₜ
     │
     ▼
   tanh
     │
     ×  ← output gate
     │
     ▼
     hₜ
```

So:

> \(c_t\) = what I remember  
> \(h_t\) = what I currently reveal/use

This distinction is frequently important.

---

# 8. Full LSTM mental picture

Don't memorize the spaghetti diagrams you often see online.

Remember this simpler version:

```text
                         ┌──────────────────────┐
                         │     cell state       │
cₜ₋₁ ──────── × ───────► + ──────────────────► cₜ
                ▲          ▲                     │
                │          │                     │
             forget      write                   │
              gate         │                     ▼
                │       candidate              tanh
                │          ▲                     │
                │          │                     × ◄── output gate
                │          │                     │
                └────┐ ┌───┘                     ▼
                     │ │                         hₜ
                     ▼ ▼
                  [xₜ, hₜ₋₁]
```

At each step:

\[
\boxed{
\text{forget old}
\rightarrow
\text{write new}
\rightarrow
\text{expose useful memory}
}
\]

That's LSTM.

Minimal PyTorch:

```python
lstm = torch.nn.LSTM(input_size=128, hidden_size=256, batch_first=True)
```

---

# 9. Now Gated Recurrent Unit (GRU)

The **Gated Recurrent Unit (GRU)** came later and simplifies the LSTM.

Main idea:

> Keep the gating idea, but use fewer gates and no separate cell state.

Instead of:

\[
(c_t,h_t)
\]

the GRU primarily maintains:

\[
h_t
\]

So:

```text
LSTM:
cell state cₜ + hidden state hₜ
3 gates

GRU:
hidden state hₜ
2 gates
```

---

# 10. GRU has two main gates

The two are:

### Update gate

\[
z_t
\]

asks roughly:

> How much of my old state should I keep versus replace?

### Reset gate

\[
r_t
\]

asks:

> How much previous information should I use when creating the new candidate?

---

# 11. Update gate — the most important GRU idea

Conceptually, a GRU does something like:

\[
h_t
=
z_t h_{t-1}
+
(1-z_t)\tilde h_t
\]

Exact conventions can swap which term gets \(z_t\), so don't obsess over the convention.

The important idea is:

```text
             old memory hₜ₋₁
                   │
                   │
                   ▼
                 blend
                /     \
               /       \
       keep old         use new
               \       /
                \     /
                  hₜ
```

The update gate controls this blend.

If it decides:

> "The old information is still useful"

then \(h_t\) stays close to \(h_{t-1}\).

That gives GRUs the same basic long-memory advantage.

---

# 12. Reset gate

The reset gate controls how much previous history is used when calculating the new candidate state.

Conceptually:

```text
hₜ₋₁ ──► reset gate ──► candidate state
                           ▲
                           │
                           xₜ
```

If:

\[
r_t\approx0
\]

the GRU can effectively say:

> Ignore much of the past; start fresh using the current input.

Useful when the context changes.

---

# 13. LSTM vs GRU

This is very interview-relevant.

| | LSTM | GRU |
|---|---|---|
| States | \(c_t\) + \(h_t\) | mainly \(h_t\) |
| Gates | forget, input, output | reset, update |
| Parameters | more | fewer |
| Computation | somewhat heavier | somewhat cheaper |
| Long-term memory | strong | strong |
| Complexity | more complex | simpler |

There's no universal:

> "LSTM is always better."

GRUs often perform similarly while being simpler and cheaper.

A reasonable rule:

> Try GRU when you want a simpler recurrent model; use LSTM when the explicit cell-state mechanism is useful or established for the task.

Minimal PyTorch:

```python
gru = torch.nn.GRU(input_size=128, hidden_size=256, batch_first=True)
```

---

# 14. A concrete example: remembering negation

Sentence:

> "The movie was **not** at all enjoyable despite the beautiful cinematography."

When the model encounters:

```text
"not"
```

an LSTM might learn:

```text
input gate:
"This information matters → store it."

cell state:
"NEGATION ACTIVE"
```

Then while reading:

```text
at → all → enjoyable → despite → ...
```

the forget gate may keep that information:

```text
f ≈ 1
```

until it's no longer relevant.

A vanilla RNN simply keeps rewriting its hidden state every step, making such information easier to lose.

---

# 15. An important misconception

LSTMs do **not** contain manually programmed rules like:

```text
if word == "not":
    remember_negation()
```

The gates are learned.

Backpropagation teaches the network:

> When certain patterns occur, opening or closing particular gates reduces future loss.

So the entire memory strategy is learned from data.

---

# 16. Why Transformers largely replaced RNN/LSTM for NLP

RNN/LSTM:

```text
x₁ → x₂ → x₃ → x₄ → x₅
```

must process sequence positions sequentially.

You cannot fully compute \(h_5\) until you've computed:

\[
h_1,h_2,h_3,h_4
\]

That makes parallelization difficult.

Transformers later changed this by allowing tokens to interact using attention largely in parallel during training.

But LSTMs/GRUs are still useful for:

- streaming data
- time series
- resource-constrained environments
- some online sequential tasks

And historically they are essential for understanding why attention and Transformers emerged.

---

## Interview mental model

If asked:

> How does LSTM improve on vanilla RNN?

Strong answer:

> LSTM introduces a separate cell state and learned forget, input, and output gates. The gates let the network selectively preserve, write, and expose information. Because the cell state can propagate through mostly additive updates with forget gates near one, information and gradients can travel across many more time steps than in a vanilla RNN, reducing the long-term dependency problem.

If asked:

> GRU vs LSTM?

Answer:

> A GRU simplifies the LSTM by combining memory into a single hidden state and using update and reset gates instead of three LSTM gates. It has fewer parameters and is computationally cheaper while often achieving similar performance.

The one picture to remember is:

```text
Vanilla RNN:
old state ──► completely transform ──► new state

LSTM:
old memory ──────────────────────────► new memory
               × forget       +
                           new info
```

That **memory highway** is the fundamental reason LSTM works.

**Next topic: Sequence-to-sequence models** — we'll connect these RNN/LSTM blocks into an **encoder → fixed representation → decoder**, see the bottleneck that creates, and then attention will emerge naturally as the solution.
