# Distillation: transferring teacher behavior

## 1. Transfer behavior

**Distillation** trains a **student** to imitate a **teacher** using distributions, responses, or verified demonstrations. Transfer depends on student capacity and example coverage.

## 2. Compare hard and soft targets

A hard target says token A is correct. A **soft target** provides a distribution, such as [0.6,0.3,0.1], which also communicates that B is more plausible than C.

For teacher probabilities p and student probabilities q, minimize −Σp_i log q_i over tokens i. Unlike a hard target, every teacher probability contributes. Compared distributions need compatible token outcomes; different tokenizers require additional alignment.

## 3. Soften deliberately

**Temperature** divides logits before softmax. Higher positive temperature makes the distribution flatter; lower temperature concentrates it.

For distillation, a softened teacher distribution can expose alternatives. Teacher and student should use a consistent temperature convention for the matching loss; temperature scaling changes the signal and its magnitude.

## 4. Choose transfer coverage

Cover difficult and rare deployment cases. Chosen answers discard alternatives; full distributions retain them but require teacher scores and compatible tokens.

## 5. Measure transferred utility

Use independently verified tasks, including teacher failures. Count retries and escalation: half-price calls with three attempts can cost more per solved task.

> **Reason it through:** A student matches its teacher on easy prompts. What held-out cases would test whether rare capabilities transferred?
