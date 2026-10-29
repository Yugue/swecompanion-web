# 2.4 Sequence modeling and variable-length audio

## 1. Context changes interpretation

A short acoustic fragment may be ambiguous until neighboring frames arrive. Sequence models carry or compute context rather than classifying each frame independently.

A **Recurrent Neural Network (RNN)** updates a state h as it reads inputs x:

\[
h_t=\tanh(W_xx_t+W_hh_{t-1}+b)
\]

Wx and Wh are learned matrices, b a bias, and t the time index. State summarizes earlier inputs but has finite capacity.

## 2. Gated recurrence controls memory

A **Long Short-Term Memory (LSTM)** network uses gates to control writing, retaining, and exposing a memory state. A **Gated Recurrent Unit (GRU)** uses a related, simpler gated update.

The important mechanism is learned information retention. Gates improve long-range gradient flow relative to a basic recurrent update, but do not guarantee unlimited memory.

## 3. Unidirectional versus bidirectional context

A forward RNN uses past and current inputs. A bidirectional network combines forward and backward states, so each position can depend on future audio.

Bidirectional encoders can help offline recognition. A conventional full-sequence backward pass cannot operate with zero future context; bounded-chunk alternatives trade delay for context.

## 4. Training through time

Unroll recurrence across steps and apply backpropagation through the resulting graph. Repeated Jacobian multiplication can shrink or amplify gradients: vanishing or exploding gradients.

Truncated backpropagation cuts the training graph into shorter spans, reducing memory but limiting gradient propagation. Reset state at actual sequence boundaries unless continuity is intentional.

## 5. Padding is not silence

Batching variable durations often pads to the longest example. Padding is a computational placeholder, whereas silence is a meaningful observed interval.

Carry lengths or masks through pooling, attention, recurrent processing, and losses. A zero-valued padded frame can become nonzero after biases or normalization.

```text
example A: real real real real pad pad
example B: real real real real real real
mask A:      1    1    1    1   0   0
```

## 6. Length-aware batching saves work

Group recordings of similar durations to reduce padding. Set budgets in samples or frames rather than only number of examples.

For encoded features h shaped B × T × D and a Boolean mask shaped B × T:

```python
weights = mask.unsqueeze(-1).to(h.dtype)
pooled = (h * weights).sum(1) / weights.sum(1).clamp_min(1)
```

The result is B × D. Empty recordings still need explicit rejection or a defined fallback; clamping avoids division by zero but does not create evidence.

## 7. State creates serving obligations

Streaming inference may reuse hidden state across chunks. State must stay associated with the correct stream, reset on termination, and follow model version and timeout rules.

Reusing state across unrelated callers leaks context and corrupts predictions. Resetting state on every chunk loses the continuity the model was designed to exploit.
