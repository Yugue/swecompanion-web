# LSTMs, GRUs, and long-range dependencies

## 1. Control what passes through memory

A **gate** is a learned vector, commonly produced by sigmoid, that scales information coordinate by coordinate.

**Long short-term memory (LSTM)** separates a recurrent hidden output from a **cell state**, a carried memory vector. Gates regulate retention, new content, and exposed output.

## 2. Update memory additively

\[
c_t=f_t\odot c_{t-1}+i_t\odot g_t,\qquad h_t=o_t\odot\tanh(c_t)
\]

\(c_t\) is cell memory; \(h_t\) hidden output; \(f_t,i_t,o_t\) forget, input, and output gates; \(g_t\) a candidate update. The symbol \(\odot\) means coordinatewise multiplication.

Gates and candidates are learned functions of the current input and prior hidden state. Candidate entries can be negative; they are not probabilities.

## 3. Trace one memory coordinate

```nlp-visual
lstm-cell
```

With previous memory 4, forget gate 0.75, input gate 0.5, and candidate −0.4, the new memory is 2.8. Output gate 0.8 exposes approximately \(0.8\tanh(2.8)=0.794\).

Memory magnitude and hidden output are different quantities.

## 4. Explain the gradient advantage

The additive memory path can preserve a direct sensitivity when forget gates are near one. A plain RNN repeatedly transforms its whole state through a nonlinear update.

This creates a more controllable route for retained information; it does not guarantee perfect memory or eliminate all gradient problems. The full graph still includes learned gates and other paths.

## 5. Compare a GRU

A **gated recurrent unit (GRU)** uses update and reset gates with one main recurrent state rather than a separate LSTM cell state.

| Mechanism | Main effect |
|---|---|
| Update gate | Mix retained state with proposed content |
| Reset gate | Control prior-state influence on the candidate |

Formula conventions differ in which mixture term receives the update gate. Read the implementation’s definition before comparing gate values.

## 6. Respect the operational limit

Both mechanisms still process dependent recurrent steps. Gates help choose what to retain, but a fixed-width state remains a learned summary.

Compare accuracy, state size, training stability, and latency. There is no universal task-independent winner between LSTM and GRU.

## 7. Interview reasoning

**Question:** Does a forget gate near zero always mean the model made a mistake?

**Answer:** No. Discarding stale information can be useful. Evaluate whether the memory policy preserves the evidence needed for the task, rather than assuming every earlier token should remain.
