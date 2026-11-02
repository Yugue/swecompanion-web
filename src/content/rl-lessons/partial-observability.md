# 3.4 Partial observability: observations, memory, and belief

## 1. The same image can require different actions

One image of a centered ball cannot reveal whether it moves left or right. Interception needs different actions.

**State aliasing** maps different underlying situations to the same observation. More network width cannot recover absent information.

## 2. The POMDP extension

A **partially observable MDP (POMDP)** has hidden Markov state S and an observation rule producing measurements O.

Observation/action history can reveal what the latest frame omits. Include actions when interpreting their consequences requires knowing what was commanded.

## 3. Beliefs summarize uncertain hidden state

A **belief state** is a distribution over current hidden states given history. With known dynamics and sensors:

\[
b_{t+1}(s')\propto P(o_{t+1}\mid s')\sum_s P(s'\mid s,a_t)b_t(s)
\]

bₜ(s) is current belief; aₜ the action; s′ the successor; oₜ₊₁ the new observation. Sum predicted probabilities, multiply by observation likelihood, then normalize across s′.

This version assumes observations depend on successor state. Exact belief updates can be intractable in large systems.

## 4. Practical approximations

| Representation | Useful when | Main limit |
|---|---|---|
| One observation | Measurements already summarize dynamics | Hidden ambiguity remains |
| Stack recent observations | Short-term motion matters | Fixed history length |
| Hand-built state estimate | Dynamics and sensors are understood | Modeling error |
| Recurrent learned memory | Relevant context spans varying lengths | Training and hidden-state complexity |

**Recurrent memory** is a learned summary updated over time. It may retain useful information without being a calibrated belief distribution.

## 5. How recurrent memory works

A recurrent policy updates its memory before choosing:

\[
h_t=f_\theta(h_{t-1},o_t,a_{t-1}),\qquad
\pi_t=\pi_\theta(\cdot\mid h_t)
\]

```text
previous memory + action → memory update ← new observation
                                  ↓
                          policy and value heads
```

h is memory; fθ its learned update; o observation; a previous action; πθ the policy. Gated recurrent updates learn what to retain or overwrite.

Backpropagation follows unrolled memory updates. Shorter training sequences save memory but limit the gradient’s temporal reach.

## 6. Recurrent replay needs context

Recurrent replay needs sequences, not isolated transitions. A **burn-in** prefix reconstructs memory before the main loss is computed.

Stored memory becomes stale as weights change. Use padding masks to exclude invalid positions and reset masks to prevent cross-episode memory.

## 7. Training and deployment must share information

Reset memory on genuine task reset; preserve it across chunks of one continuing episode. Define behavior after missing measurements.

A training critic may use privileged simulator information under explicit assumptions. The deployed actor must still use available observations.
