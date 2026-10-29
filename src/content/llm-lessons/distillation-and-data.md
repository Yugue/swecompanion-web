# Distillation: transferring teacher behavior

## 1. Transfer behavior

**Distillation** trains a **student** model to imitate a **teacher** model. The teacher may provide full token distributions, chosen responses, or checked demonstrations.

The student does not inherit all teacher capabilities automatically. Transfer depends on student capacity, data coverage, and the objective.

## 2. Compare hard and soft targets

A hard target says token A is correct. A **soft target** provides a distribution, such as [0.6,0.3,0.1], which also communicates that B is more plausible than C.

For teacher probabilities p and student probabilities q, minimize −Σp_i log q_i over tokens i. Unlike a hard target, every teacher probability contributes. Compared distributions need compatible token outcomes; different tokenizers require additional alignment.

## 3. Soften deliberately

**Temperature** divides logits before softmax. Higher positive temperature makes the distribution flatter; lower temperature concentrates it.

For distillation, a softened teacher distribution can expose alternatives. Teacher and student should use a consistent temperature convention for the matching loss; temperature scaling changes the signal and its magnitude.

## 4. Choose transfer coverage

A teacher can supply token distributions, complete answers, or verified demonstrations. Match the transfer data to the intended student workload, including difficult and rare cases.

Imitating one chosen answer loses information about alternatives. Matching full distributions communicates more but may require access to teacher scores and compatible tokenization.

## 5. Measure transferred utility

Compare accuracy and robustness on held-out cases, including where the teacher fails. Track retries, output length, and escalation to a larger model.

A student costing half as much per call but requiring three attempts per solved task can lose the cost advantage. Distillation should be judged at the application’s quality and latency target.
