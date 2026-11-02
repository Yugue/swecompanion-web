# 6.5 Reliable evaluation, generalization, and simulation-to-reality gaps

## 1. Evaluate the behavior that will actually run

Training uses changing exploratory behavior. Deployment may use a frozen policy with different action selection or resets.

Specify action sampling, initial conditions, retries, limits, and success criteria before comparing scores.

## 2. Separate selection from final testing

Training data learns parameters; validation selects checkpoints and settings; the final test assesses fixed choices. Repeated test-driven changes turn the test into validation.

Split meaningful maps, scenarios, objects, or workflows—not nearby frames from one trajectory.

## 3. Training seeds and evaluation episodes answer different questions

Many episodes from one frozen policy estimate that policy’s performance. Independent training seeds measure how reliably the training procedure produces good policies.

Report multiple independently trained seeds, each with sufficient evaluation episodes. A lucky seed does not represent average training reliability.

## 4. Report uncertainty at the right level

Summarize independent training runs:

\[
\bar J=\frac1K\sum_{k=1}^K\widehat J_k,\qquad
\operatorname{SE}(\bar J)=\frac{s_J}{\sqrt K}
\]

K is seed count; Ĵk seed k’s estimated performance; sJ their sample standard deviation. SE measures uncertainty in their average; few seeds make approximations fragile.

A **hierarchical bootstrap** resamples seeds, then episodes within selected seeds, and recomputes results. It captures both variation levels under that sampling model.

State the interval’s population. Resampling cannot quantify deployment conditions missing from the evaluation.

## 5. Reward is only one outcome

| Measurement | Why it matters |
|---|---|
| Mean and lower-tail return | Average outcomes and bad runs |
| Task success and abandonment | Actual completion behavior |
| Constraint violations and failures | Unacceptable outcomes hidden by averages |
| Interactions to reach a threshold | Sample efficiency |
| Wall-clock time and memory | Compute and operating feasibility |
| Cost or latency per completed task | Deployment tradeoff |

With independent binary failures, zero in 100 trials still gives a rough 95% upper failure-rate bound of 3% (the **rule of three**). Correlated or unrepresentative trials weaken that interpretation.

## 6. Compare learning curves fairly

Match interaction budgets for sample efficiency and resource/time budgets for operational speed. Model-based methods may save trials by spending compute.

Predefine checkpoint selection and report failed runs. Explain curve smoothing; it must not conceal instability or use future evidence in online claims.

## 7. Stress the assumptions that matter

Vary noise, delays, dynamics, starts, goals, and disturbances. Hold out relevant combinations as well as values.

**Domain randomization** varies simulator parameters during training. It helps when those variations represent useful deployment differences.

Check closed-loop behavior and controlled real tests where feasible; visual simulator realism is insufficient.

## 8. Interpret offline evaluation as one evidence source

Offline estimators and overlap diagnostics flag concerns before interaction. Weak support or dynamics assumptions still leave uncertainty.

Describe the remaining evidence gap, then use staged exposure to test specific deployment uncertainties.
