# 3.3 Label-dependent recognition: transducers and attention encoder-decoders

## 1. Model previously emitted labels

CTC's output factorization is convenient but limited. Two major alternatives explicitly use output history: **Recurrent Neural Network Transducers (RNN-T)** and **Attention Encoder-Decoders (AED)**.

Both can learn from audio–transcript pairs. Their mechanisms for connecting time to output differ, which changes decoding and streaming behavior.

## 2. A transducer has three components

An encoder maps acoustic frames to representations ht. A prediction network maps previously emitted nonblank labels to gu. A joint network combines ht and gu to predict a next label or blank.

The prediction network can use architectures other than a recurrent network; “RNN-T” commonly names the transducer family rather than requiring every component to be recurrent.

```text
audio → encoder h[t] ──────┐
                           joint → label or blank
prior labels → predictor ─┘
```

## 3. The transducer alignment lattice

A lattice position (t,u) means t acoustic steps consumed and u labels emitted. A blank advances time; a nonblank emits a label and advances u at the same acoustic position under the standard formulation.

Unlike CTC, several labels can be emitted at one acoustic step. Output dependence is carried through the prediction network.

## 4. Transducer training and inference

\[
P(y\mid x)=\sum_{a\in\mathcal A(x,y)}
\prod_{(t,u)\in a}P(a_{t,u}\mid h_t,g_u)
\]

A is the set of valid monotonic paths and a specifies their moves. Training sums paths with dynamic programming; inference explores candidate label prefixes and encoder times.

Prediction-network state must be associated with each hypothesis. Repeated nonblank emissions can increase decoding cost, so serving implementations use explicit search budgets.

## 5. Attention encoder-decoder recognition

An audio encoder produces a representation sequence. An autoregressive text decoder predicts:

\[
P(y\mid x)=\prod_{u=1}^{U}P(y_u\mid y_{<u},\operatorname{Enc}(x))
\]

u is output position and U includes the chosen sequence termination convention. Cross-attention lets each output position consult encoded audio.

Training often uses **teacher forcing**: the decoder sees correct preceding tokens. At inference it sees its own predictions, creating a distribution mismatch.

## 6. Alignment is flexible but less constrained

Standard attention can inspect the whole recording without a monotonic lattice. This supports flexible sequence mapping, but unconstrained attention can skip, repeat, or lose alignment on long or unfamiliar inputs.

Monotonic or chunked attention can impose more structure. A full-context encoder remains nonstreaming even if output tokens are generated incrementally.

## 7. Compare the families

| Family | Output history | Alignment mechanism | Streaming requirement |
|---|---|---|---|
| CTC | No explicit emitted-label history | Blank/collapse paths | Causal or bounded-context encoder |
| Transducer | Prediction network | Monotonic time–label lattice | Streaming encoder and maintained states |
| Attention decoder | Autoregressive token history | Learned cross-attention | Restricted future context and incremental policy |

Loss choice alone does not determine latency; frontend, encoder, and decoding policy also matter.

## 8. Typical failure modes

Transducers can emit late or struggle with search and endpoint policy. Attention decoders can produce linguistically plausible but acoustically unsupported text, especially on nonspeech or mismatch.

Length limits, silence checks, confidence evaluation, and strong coverage tests help, but no heuristic is a universal fix.
