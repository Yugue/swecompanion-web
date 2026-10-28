# Learning from verifiable rewards

## 1. Use an executable check

**Reinforcement learning with verifiable rewards (RLVR)** uses an automatically checkable outcome as feedback, such as passing code tests or matching a mathematical answer.

A **verifier** is the procedure implementing that check. Its coverage determines what “correct” means operationally.

## 2. Separate outcome and process

An **outcome reward** scores the final result. A **process reward** scores intermediate steps. Outcome checks are often cheaper but may not identify which reasoning step caused failure.

A correct final answer can come from invalid reasoning or accidental cancellation.

## 3. Compare a response group

**Group-relative policy optimization (GRPO)** samples several responses for a prompt and estimates relative advantages from their rewards, avoiding a separately learned value baseline in its common formulation.

```genai-visual
group-rewards
```

For rewards [0,1,1,0], subtracting the group mean gives [−0.5,0.5,0.5,−0.5].

## 4. Normalize with care

\[
\hat A_i=\frac{R_i-\bar R}{s_R+\epsilon}
\]
\(R_i\) is response i’s reward; R̄ the group mean; \(s_R\) the chosen reward standard deviation; ε a small positive stabilizer. Normalization conventions vary between implementations.

If every reward is equal, centered advantages are zero; sampling more copies of the same outcome gives little learning signal.

## 5. Design representative checks

Include hidden cases, varied difficulty, and checks that resist superficial answer formatting. Make reward computation reproducible and bound expensive tool execution.

A narrow checker can reward hardcoded outputs, test detection, or unsafe shortcuts. Stronger reward optimization makes these weaknesses more consequential.

## 6. Measure transfer

Evaluate on held-out problems, alternate verifiers, and tasks requiring different solution paths. Track reward alongside accuracy, output length, and resource consumption.

Passing a verifier demonstrates success on its checks. It does not establish general reasoning or a faithful account of internal computation.
