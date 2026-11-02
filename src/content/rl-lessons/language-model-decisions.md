# 5.6 Language-model decisions, verifiable rewards, and tool use

## 1. Text can participate in a real interaction loop

A language-model policy can call a tool, observe its result, and choose again. Final reward may arrive only after the workflow succeeds.

Sequential RL matters when choices alter future information or opportunities. Fixed-context response comparisons may need only a simpler preference objective.

## 2. Choose the action granularity

| Action unit | Useful view | Main cost |
|---|---|---|
| Token | Fine-grained generation policy | Long credit-assignment horizon |
| Whole response | Contextual decision | Hides internal generation choices |
| Tool call | Environment-changing decision | Structured validity and execution feedback |
| Multi-step skill | Temporal abstraction | Variable duration and termination |

Choose the unit of action before comparing algorithms. Coarser actions shorten credit horizons but can hide the internal decision that failed.

## 3. Observations are transcripts, not omniscience

The transcript contains observations, not necessarily full state. Databases, permissions, and delayed effects can remain hidden.

Truncation, stale tool outputs, and summaries can discard needed information. A longer transcript is not automatically a Markov representation.

## 4. Verifiable outcomes can provide rewards

An **outcome reward** scores final success, such as a test result. A **process reward** scores intermediate decisions or steps.

Outcome signals can be sparse; process signals can reward plausible but incorrect steps. Passing a test suite establishes only the covered behavior.

```text
prompt → generated decision → tool execution → observation
               ↑                              ↓
               └──── next decision ← updated context
                                      ↓
                            final task verification
```

## 5. Include cost in the decision problem

Include interaction cost explicitly:

\[
J(\pi)=\mathbb E_\pi\left[R_{\mathrm{task}}-\lambda_c\sum_t C_t\right]
\]

Rtask is final reward; Cₜ step cost; λc its weight. Fix units for token use, latency, or tool charges.

A penalty controls a tradeoff, not a strict budget. Variable-duration tools need wall-clock accounting; token discounting is not necessarily time discounting.

## 6. Attribute terminal outcomes carefully

Log transitions to distinguish wrong decisions, invalid arguments, external failures, and missing observations. Each suggests a different correction.

Terminal returns can update earlier actions. Critics or process signals may improve attribution, but faulty intermediate rewards can encourage convincing failures.

Sampling several answers and selecting one is inference-time search. It becomes RL training when outcomes update policy parameters through a learning objective.

## 7. Separate training environments from evaluation evidence

Hold out task templates, tools, or environments as needed. Near-duplicate tasks and exposed tests can exaggerate improvement.

Measure hidden-check success, valid actions, recovery, tool cost, and retries. Success after many attempts differs from first-attempt reliability.

## 8. Bound the deployed action interface

Validate tool arguments and enforce allowed actions externally. Cost penalties do not enforce permissions or irreversible-action constraints.

Log policy/tool versions, observations, outcomes, and budget use. Tool changes can shift the environment without changing model weights.
