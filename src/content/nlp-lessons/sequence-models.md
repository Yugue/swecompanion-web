# Recurrent neural networks

## 1. Carry a state

A **recurrent neural network (RNN)** updates a numeric state using the current token and previous state. It reuses the same parameters at every position.

The state summarizes earlier evidence; it is not a literal word buffer.

## 2. Read the update

\[
h_t=\tanh(Wx_t+Uh_{t-1}+b)
\]

x_t is token input; h_t new state; h_0 initial state; W,U,b shared parameters. **Tanh** maps scalars between −1 and 1.

With input width d and state width m, W is [m,d], U [m,m].

## 3. Follow changing context

```nlp-visual
sequence
```

“Not very good” successively changes the state. A **contextual representation** depends on surrounding evidence; the same lookup vector can lead to different states.

Reversing the tokens changes the update sequence.

## 4. Choose the output

| Task | State/head interface |
|---|---|
| Sentence classification | Final valid state |
| Token tagging | Head at every valid position |
| Next-token prediction | Prefix state → vocabulary scores |

Read the real final state, not the last padded storage position.

## 5. Differentiate repeated updates

**Backpropagation through time** differentiates the unrolled state computations. Shared weights receive contributions from many positions.

Repeated local derivatives can create **vanishing gradients** that shrink distant learning signals or **exploding gradients** that destabilize updates.

Clipping limits large gradients; it does not restore vanished signals.

## 6. Choose legal context

A **bidirectional RNN** combines forward and backward states. It suits complete-input tagging, but the backward path reveals future text in causal next-token prediction.

Recurrence also limits within-layer parallelism because later states depend on earlier ones.
