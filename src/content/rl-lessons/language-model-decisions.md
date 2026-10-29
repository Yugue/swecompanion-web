# 5.6 Language-model decisions, verifiable rewards, and tool use

## 1. Text can participate in a real interaction loop

A language model can choose a tool, receive its result, revise a plan, and act again. The relevant outcome may arrive only when the workflow succeeds.

The RL formulation is most useful when choices influence future observations or opportunities. An ordinary fixed-context response-comparison task can use a simpler preference objective; a multi-step workflow may require explicit temporal reasoning.

## 2. Choose the action granularity

| Action unit | Useful view | Main cost |
|---|---|---|
| Token | Fine-grained generation policy | Long credit-assignment horizon |
| Whole response | Contextual decision | Hides internal generation choices |
| Tool call | Environment-changing decision | Structured validity and execution feedback |
| Multi-step skill | Temporal abstraction | Variable duration and termination |

A coarse action can shorten a decision horizon but also conceal which internal choice caused failure. State what is actually optimized before comparing algorithms.

## 3. Observations are transcripts, not omniscience

The policy may observe a conversation, tool outputs, and selected environment fields. The real environment can retain hidden database state, permissions, file contents, or delayed effects that the transcript does not fully reveal.

A long transcript is not automatically a sufficient Markov state. Context truncation and summaries can discard relevant facts; tool responses can be stale or incomplete. Apply the partial-observability reasoning from 3.4 rather than assuming text removes state uncertainty.

## 4. Verifiable outcomes can provide rewards

An executable unit test, a solved puzzle checker, or a confirmed workflow outcome can supply an **outcome reward**. A **process reward** instead scores intermediate steps or decisions.

Outcome rewards are closer to final success but can be sparse. Intermediate rewards give denser feedback but can introduce proxy errors. A test suite checks the behaviors it covers; passing visible tests is not a proof of general correctness.

```text
prompt → generated decision → tool execution → observation
               ↑                              ↓
               └──── next decision ← updated context
                                      ↓
                            final task verification
```

## 5. Include cost in the decision problem

\[
J(\pi)=\mathbb E_\pi\left[R_{\mathrm{task}}-\lambda_c\sum_t C_t\right]
\]

R task is the final task reward, C each step's cost, and lambda c its weight. Cost can represent tool charges, latency, or a token budget, but these quantities need chosen units and scaling.

A penalty trades average reward against average cost. A strict budget is instead an explicit constraint. Track wall-clock time if tool durations vary; a per-token discount is not automatically a time-based discount.

## 6. Attribute terminal outcomes carefully

A failed workflow may come from a poor action, an invalid argument, an external service failure, or an observation that omitted essential context. Logging the whole transition sequence makes these causes distinguishable.

Return-based updates can distribute a terminal signal to earlier sampled actions. A critic or process signal can improve estimation, but wrongly rewarding plausible-looking intermediate steps can encourage convincing failures.

Repeated sampling and selecting a successful answer is a search or inference procedure. It becomes RL training when outcomes change policy parameters through a defined learning objective; keep that distinction clear.

## 7. Separate training environments from evaluation evidence

Split tasks by underlying templates, instances, tools, or environments where needed. If near-duplicate tasks or exposed test cases drive both training and evaluation, success can reflect memorization or reward exploitation.

Evaluate hidden checks, held-out workflows, action validity, unnecessary tool usage, completion cost, and recovery after errors. Report the number of attempts allowed: success within many retries differs from first-attempt reliability.

## 8. Bound the deployed action interface

Use validated tool schemas, explicit action availability, controlled execution environments, and task-appropriate fallback behavior. A learned cost penalty alone does not enforce a tool permission boundary or an irreversible-action constraint.

Log policy version, tool version, observations, decisions, outcomes, and budget use. Changes in tool behavior can shift the environment even when the model stays fixed.
