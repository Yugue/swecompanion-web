# Recurrent neural networks

## 1. Carry a state through the sequence

A **recurrent neural network (RNN)** updates a state from the current token representation and the previous state. The same update parameters are reused at every position.

The state is a learned numeric summary, not a literal buffer containing every earlier word.

## 2. Read the update

A simple recurrent layer uses:

\[
h_t=\tanh(Wx_t+Uh_{t-1}+b)
\]

\(x_t\) is token \(t\)'s input vector; \(h_t\) the new state; \(W,U,b\) shared parameters; \(h_0\) an initial state. **Tanh** maps each scalar to a value between −1 and 1.

If state width is \(m\) and input width \(d\), \(W\) is [m,d] and \(U\) is [m,m].

## 3. Follow the context

```nlp-visual
sequence
```

Processing “not very good” changes the state successively. A word’s resulting state can therefore differ across contexts even though its initial embedding lookup is static.

Reversing the input generally changes the sequence of state updates.

## 4. Choose an output interface

A sentence classifier can read the final valid state. A token tagger can attach a head at every position. A next-token model maps each prefix state to a vocabulary distribution.

With padded batches, select the real final state or handle lengths explicitly. Reading the last storage position can accidentally summarize padding instead of text.

## 5. Differentiate through repeated uses

Backpropagation through time sends gradients through the unrolled state updates. Repeated multiplication by local derivatives can shrink gradients toward zero or amplify them greatly.

**Vanishing gradients** make distant influences difficult to learn. **Exploding gradients** can destabilize updates. Clipping can limit large gradients but does not restore vanished information.

## 6. Decide what context is legal

A **bidirectional RNN** combines forward and backward states. It can use both sides of a complete available input for classification or tagging.

The backward state would reveal unseen future text in ordinary next-token prediction. Full-input understanding and causal generation therefore permit different information paths.

Recurrence also imposes a sequence of dependent updates, limiting parallelism across positions within a layer.

## 7. Interview reasoning

**Question:** Why can two occurrences of “bank” have the same input vector but different RNN states?

**Answer:** Lookup provides the same static vector, but each state also depends on a different preceding state. The recurrent computation combines token identity with available context.
