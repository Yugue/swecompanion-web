# LSTMs, GRUs, and long-range dependencies

## 1. Control retained information

A **gate** is a learned vector that scales information coordinatewise, commonly using sigmoid outputs.

**Long short-term memory (LSTM)** separates a hidden output from a **cell state**, the carried memory. Gates control retention, addition, and exposure.

## 2. Read the memory update

\[
c_t=f_t\odot c_{t-1}+i_t\odot g_t,\qquad h_t=o_t\odot\tanh(c_t)
\]

c is memory; h hidden output; f,i,o forget/input/output gates; g candidate; t position. The symbol ⊙ means coordinatewise multiplication.

Gates and candidate depend on current input and prior hidden state. Candidates can be negative.

## 3. Trace one coordinate

```nlp-visual
lstm-cell
```

Previous memory 4, f=0.75, i=0.5, g=−0.4:

```text
new memory = 0.75×4 + 0.5×(−0.4) = 2.8
output, with o=0.8: 0.8×tanh(2.8) ≈ 0.794
```

Carried memory and exposed output differ.

## 4. Explain the gradient route

The additive path can retain a direct sensitivity when forget gates stay near one. A plain RNN repeatedly transforms its whole state.

Gates improve control; they do not guarantee perfect memory. Gradients still follow the full graph, including gate dependencies.

## 5. Compare a GRU

A **gated recurrent unit (GRU)** uses one main state:

| Gate | Role |
|---|---|
| Update | Mix retained state and candidate |
| Reset | Control old-state influence on candidate |

There is no separate LSTM-style cell state. Update-gate formula conventions differ across descriptions.

## 6. Choose by task and cost

Both remain recurrent and summarize evidence in fixed-width states. Compare quality, stability, state size, and latency on the same task.
