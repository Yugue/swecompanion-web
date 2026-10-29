# 6.5 Reliable evaluation, generalization, and simulation-to-reality gaps

## 1. Evaluate the behavior that will actually run

Training reward is collected under a changing and often exploratory policy. Deployment may use a frozen deterministic action rule, different resets, or a different environment.

Specify evaluation behavior, initial conditions, action selection, allowed retries, time limits, and success criteria. Otherwise apparently comparable scores can measure different tasks.

## 2. Separate selection from final testing

Use training environments to learn and validation environments or scenarios to choose hyperparameters and checkpoints. Preserve a final test population until those choices are fixed.

Repeatedly inspecting a test set and modifying the policy or reward turns it into a validation set. Split on meaningful units such as maps, scenario families, object instances, or tool workflows rather than nearby frames from the same trajectory.

## 3. Training seeds and evaluation episodes answer different questions

A thousand episodes from one frozen policy estimate that policy's performance across episode randomness. Several independent training runs estimate how reliably the training procedure produces competent policies.

To report algorithm performance, summarize across independently trained seeds, with enough evaluation episodes for each. A lucky successful seed should not stand in for the procedure's average reliability.

## 4. Report uncertainty at the right level

\[
\bar J=\frac1K\sum_{k=1}^K\widehat J_k,\qquad
\operatorname{SE}(\bar J)=\frac{s_J}{\sqrt K}
\]

K is the number of independent training seeds, J hat k the estimated evaluation performance of seed k, and s J their sample standard deviation. With few seeds, uncertainty remains large and normal approximations can be poor.

Hierarchical resampling can account for both seed and episode variation. Resampling individual transitions as independent observations generally underestimates uncertainty. State which population the interval describes.

For a simple hierarchical bootstrap, repeatedly sample training seeds with replacement, then sample evaluation episodes within each selected seed and recompute the summary. The resulting summaries describe sampling uncertainty under that hierarchy; they do not account for an unrepresented deployment population.

## 5. Reward is only one outcome

| Measurement | Why it matters |
|---|---|
| Mean and lower-tail return | Average outcomes and bad runs |
| Task success and abandonment | Actual completion behavior |
| Constraint violations and failures | Unacceptable outcomes hidden by averages |
| Interactions to reach a threshold | Sample efficiency |
| Wall-clock time and memory | Compute and operating feasibility |
| Cost or latency per completed task | Deployment tradeoff |

In a toy independent binary-failure setting, zero failures in 100 trials still gives an approximate 95% upper failure-rate bound near 3%, using the rule of three. Zero observed failures is not evidence of zero risk, especially with correlated or unrepresentative trials.

## 6. Compare learning curves fairly

Use the same environment-interaction budget when comparing sample efficiency and the same resource or wall-clock budget when comparing operational speed. Report both if a model-based method saves interactions by spending more compute.

Prespecify checkpoint selection rather than reporting the highest noisy test return. Include variability and failed runs. Smooth curves for readability only when the smoothing rule does not hide material instability or use unavailable future information in an online decision claim.

## 7. Stress the assumptions that matter

Vary observation noise, actuator delay, dynamics parameters, starts, goals, and disturbances. Hold out combinations, not merely individual parameter values, when deployment can encounter new combinations.

**Domain randomization** varies simulator parameters during training to encourage robustness. It helps only to the extent that the variations cover useful deployment differences and do not remove necessary task structure.

A simulator with attractive graphics can still have wrong control dynamics. Evaluate closed-loop behavior under relevant variation and, where permitted, controlled real-system tests.

## 8. Interpret offline evaluation as one evidence source

Importance-weight diagnostics, fitted-value estimates, and model agreement can reveal concerns before interaction. They do not replace direct validation when assumptions about support or dynamics are weak.

Document the remaining gap between logged evidence, simulation, and deployment. A staged rollout can then test a concrete uncertainty rather than merely repeat an aggregate benchmark.
