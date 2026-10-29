# 3.4 Partial observability: observations, memory, and belief

## 1. The same image can require different actions

A ball at the center of an image may be moving left or right. A memoryless policy sees the same input but needs opposite actions to intercept it.

This is **state aliasing**: distinguishable underlying situations collapse into one observation. More network width cannot reconstruct information absent from that input.

## 2. The POMDP extension

A **Partially Observable Markov Decision Process (POMDP)** includes an underlying Markov state and an observation rule. The agent receives observation O rather than necessarily seeing state S.

The history of observations and actions can contain information that the latest observation omits. Include past actions when they help interpret measurements; movement after a strong motor command means something different from movement after no command.

## 3. Beliefs summarize uncertain hidden state

A **belief state** is a probability distribution over possible current states conditioned on history. With known dynamics and observation probabilities, it can be updated by prediction and conditioning:

\[
b_{t+1}(s')\propto P(o_{t+1}\mid s')\sum_s P(s'\mid s,a_t)b_t(s)
\]

B is the belief, a is the chosen action, and o is the new observation. Normalize across successor states so probabilities sum to one. This simplified observation model conditions on successor state; some environments also condition observations on actions.

Belief-state reasoning turns incomplete measurements into a fully informed distributional representation, but exact computation is often intractable in large systems.

## 4. Practical approximations

| Representation | Useful when | Main limit |
|---|---|---|
| One observation | Measurements already summarize dynamics | Hidden ambiguity remains |
| Stack recent observations | Short-term motion matters | Fixed history length |
| Hand-built state estimate | Dynamics and sensors are understood | Modeling error |
| Recurrent learned memory | Relevant context spans varying lengths | Training and hidden-state complexity |

A recurrent representation is not automatically a calibrated belief distribution. It is a learned summary that may retain useful information.

## 5. How recurrent memory works

\[
h_t=f_\theta(h_{t-1},o_t,a_{t-1}),\qquad
\pi_t=\pi_\theta(\cdot\mid h_t)
\]

H is a hidden memory vector, f a learned update, and pi the resulting policy distribution. A simple recurrent update combines the previous memory and current input with an affine map and nonlinearity; gated variants learn what to retain or overwrite.

```text
previous memory + action → memory update ← new observation
                                  ↓
                          policy and value heads
```

Training backpropagates through an unrolled sequence of memory updates. Cutting the sequence limits gradient length and memory use but can also limit learned long-range credit.

## 6. Recurrent replay needs context

Random isolated transitions do not provide a valid hidden state for a recurrent learner. Sample sequences and use stored context or a **burn-in** prefix to reconstruct memory before computing the main losses.

Stored hidden states can become stale as model parameters change. Burn-in reduces this mismatch but adds computation. Padding masks exclude invalid sequence positions; episode reset masks prevent memory from crossing between unrelated tasks.

## 7. Training and deployment must share information

Reset memory when the task resets, preserve it when one continuing episode is merely split into chunks, and define how it behaves after missing observations.

A critic can sometimes use privileged simulator state during training while the actor uses deployable observations, but the architecture and training assumptions must make that asymmetry explicit. Accidentally feeding hidden state into the actor creates a policy that cannot run as evaluated.
