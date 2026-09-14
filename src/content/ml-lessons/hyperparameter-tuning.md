## Part VI — Practical ML Reasoning  
### Topic 1: Hyperparameter Tuning

This chapter shifts from:

> **“How does the model work?”**

to:

> **“How do I actually make an ML system perform well?”**

The first topic is **hyperparameter tuning**.

The core distinction is:

\[
\boxed{\text{Parameters are learned; hyperparameters are chosen}}
\]

---

## 1. Parameters vs hyperparameters

A neural network learns parameters such as:

\[
W,\;b
\]

through gradient descent.

```text
training data
     ↓
gradient descent
     ↓
W, b change automatically
```

These are **model parameters**.

Hyperparameters are choices we make about the training process or architecture:

```text
learning rate
batch size
number of layers
hidden dimension
dropout rate
weight decay
optimizer
```

They are not normally learned directly by backpropagation.

---

## 2. The most important hyperparameter: learning rate

Suppose:

\[
\theta_{t+1}
=
\theta_t-\eta\nabla L
\]

where:

\[
\eta=\text{learning rate}
\]

If \(\eta\) is too large:

```text
loss
 │      /\
 │  /\ /  \__
 │_/  V
 └──────────── training
```

training may:

- oscillate
- diverge
- destroy pretrained representations during fine-tuning

If \(\eta\) is too small:

```text
loss
│\
│ \
│  \
│   \
│    \____
└──────────── training
```

training can be extremely slow and may not reach a good solution within the compute budget.

So learning rate is often the **first hyperparameter I would investigate**.

---

## 3. Batch size

Batch size determines how many examples contribute to one gradient estimate.

Small batch:

\[
B=16
\]

gives noisier gradients:

```text
true direction
     ↘

batch gradients:
 ↘ ↓ → ↘ ↓
```

Large batch:

\[
B=4096
\]

gives a smoother gradient estimate.

Tradeoff:

```text
small batch
→ less memory
→ noisier updates
→ more optimizer steps

large batch
→ more memory
→ stable gradients
→ efficient hardware utilization
```

Importantly, learning rate and batch size often interact.

Changing batch size substantially may require retuning learning rate.

---

## 4. Weight decay

Weight decay penalizes large weights and acts as regularization.

Conceptually:

\[
L_{\text{total}}
=
L_{\text{data}}
+
\lambda\|W\|^2
\]

where:

\[
\lambda=\text{weight-decay strength}
\]

Too little regularization:

```text
training performance ↑
validation performance ↓
```

may mean overfitting.

Too much:

```text
training performance itself is poor
```

can mean underfitting.

You already know the regularization mechanism, so the tuning question is simply:

> How much regularization gives the best validation performance?

---

## 5. Dropout

Same principle.

Suppose:

\[
p=0.1
\]

means roughly 10% of selected activations are dropped during training.

Too little dropout:

> model may overfit.

Too much:

> optimization becomes difficult and useful capacity is suppressed.

Hyperparameter tuning is fundamentally about balancing these effects using **validation performance**.

---

# 6. Never tune using the test set

This is one of the most important practical ML rules.

Suppose:

```text
Train
  ↓
fit weights

Validation
  ↓
choose hyperparameters

Test
  ↓
final unbiased evaluation
```

You might try:

```text
LR = 1e-3 → validation accuracy 88%
LR = 3e-4 → validation accuracy 91%
LR = 1e-4 → validation accuracy 90%
```

Choose:

\[
3\times10^{-4}
\]

Then evaluate once on the test set.

If instead you repeatedly select hyperparameters based on test performance, you are effectively **overfitting the test set**.

---

# 7. Basic tuning procedure

Suppose we're choosing learning rate.

Don't start with:

```text
0.000315
0.000317
0.000319
```

Start with orders of magnitude:

\[
10^{-2},10^{-3},10^{-4},10^{-5}
\]

Because learning rates often behave on a logarithmic scale.

For example:

```text
1e-2  → diverges
1e-3  → validation loss 0.52
1e-4  → validation loss 0.41
1e-5  → validation loss 0.67
```

Now refine around:

\[
10^{-4}
\]

perhaps:

```text
3e-4
1e-4
3e-5
```

This is much more efficient.

---

# 8. Grid search

Suppose:

```text
learning rate = [1e-3, 1e-4, 1e-5]
dropout       = [0.0, 0.1, 0.3]
```

Grid search tries every combination:

\[
3\times3=9
\]

runs.

```text
              Dropout

           .0    .1    .3
LR 1e-3     ✓     ✓     ✓
   1e-4     ✓     ✓     ✓
   1e-5     ✓     ✓     ✓
```

Advantages:

> simple and systematic.

Problem:

> becomes extremely expensive as the number of hyperparameters increases.

If you have 6 hyperparameters with 5 values each:

\[
5^6=15,625
\]

training runs.

That's generally impractical for deep learning.

---

# 9. Random search

Instead of testing every combination, randomly sample configurations.

Why can this work better than grid search?

Imagine:

```text
learning rate → VERY important
dropout       → mildly important
```

Grid search might spend many runs changing dropout while testing only a few learning-rate values.

Random search samples more distinct values along every dimension.

Conceptually:

```text
Grid:

•  •  •  •
•  •  •  •
•  •  •  •
•  •  •  •
```

versus:

```text
Random:

  •       •
      •
 •            •
        •
```

For a fixed compute budget, random search can explore the important dimensions more effectively.

---

# 10. Bayesian optimization

A more sophisticated approach uses results from previous experiments.

Conceptually:

```text
try config
    ↓
observe validation performance
    ↓
build model of
hyperparameters → performance
    ↓
choose promising next config
```

Instead of randomly exploring forever, it tries to balance:

\[
\text{exploration}
\]

and:

\[
\text{exploitation}
\]

This can be useful when each training run is expensive.

For a Google ML interview, know the concept; you generally don't need to derive Gaussian processes or acquisition functions unless the role specifically calls for it.

---

# 11. Early stopping saves tuning compute

Suppose we run 50 configurations.

Some are clearly terrible after 5 epochs:

```text
Run A:
validation loss = 0.42

Run B:
validation loss = 2.8
```

Why continue Run B for another 100 epochs?

Hyperparameter-tuning systems often stop poor runs early.

```text
many configurations
       ↓
short initial training
       ↓
kill bad runs
       ↓
allocate compute to promising runs
```

Methods such as successive halving follow this principle.

---

# 12. Tune the biggest-impact parameters first

A practical priority might look roughly like:

```text
learning rate
      ↓
optimizer / schedule
      ↓
batch size
      ↓
regularization
      ↓
model capacity
      ↓
smaller architectural details
```

Not a universal ordering, but the important lesson is:

> Don't simultaneously search 20 hyperparameters blindly.

Start with the ones most likely to explain the observed behavior.

---

# 13. Hyperparameters interact

This is an important interview point.

Suppose:

\[
LR=10^{-3}
\]

works with:

\[
B=256
\]

It does not necessarily mean the same learning rate is optimal at:

\[
B=8192
\]

Similarly:

```text
model size ↔ dropout
learning rate ↔ batch size
optimizer ↔ learning-rate schedule
weight decay ↔ learning rate
```

So tuning each hyperparameter independently can miss interactions.

---

# 14. What metric should we optimize?

Suppose the product objective is fraud detection.

Maybe:

```text
accuracy = 99%
```

looks great simply because 99% of transactions aren't fraudulent.

Tuning should optimize the **validation metric that actually represents the task objective**.

For example:

\[
F_1,\;PR\text{-AUC},\;\text{recall at fixed precision}
\]

depending on the problem.

You already studied metrics, so the new reasoning is:

> The metric used for hyperparameter selection determines which model configuration you call “best.”

---

# 15. Don't over-tune the validation set either

There's another subtle problem.

Suppose you run:

\[
10,000
\]

experiments and repeatedly choose whatever performs best on the same validation set.

Eventually, you can overfit the validation set too.

Conceptually:

```text
training set → fit weights

validation set → repeated human/model-selection decisions
                       ↓
                 indirect overfitting
```

For serious experimentation, teams may use:

- multiple validation sets
- cross-validation where appropriate
- a final untouched holdout

to protect against this.

---

# 16. Hyperparameters vs architecture search

Suppose we're choosing:

```text
learning rate
dropout
weight decay
```

that's ordinary hyperparameter tuning.

But choosing:

```text
12 layers vs 24 layers
512 hidden units vs 1024
CNN vs Transformer
```

starts overlapping with architecture/model selection.

The boundary isn't strict.

The important thing is:

> parameters are learned inside one training run; hyperparameters govern the training/model configuration across runs.

---

## Minimal example

A simple tuning loop conceptually looks like:

```python
for lr in [1e-3, 3e-4, 1e-4]:
    train(lr)
    evaluate_on_validation()
```

Then choose the configuration with the best validation metric.

---

## Interview scenario

Suppose an interviewer asks:

> “Your Transformer isn't converging. What hyperparameters would you investigate?”

A strong reasoning sequence is:

> First inspect whether optimization itself is unstable. I would examine the learning rate and its schedule, gradient magnitudes, optimizer settings, and batch size. If training loss decreases normally but validation performance is poor, I would instead focus more on regularization such as weight decay or dropout and model capacity. I would tune against the validation set, preferably beginning with coarse logarithmic ranges rather than tiny incremental changes.

That's much stronger than simply saying:

> “Run grid search.”

---

## The mental model

Hyperparameter tuning is essentially an **outer optimization loop**:

```text
          HYPERPARAMETERS
                │
                ▼
        ┌──────────────┐
        │ Train model  │
        │              │
        │ inner loop:  │
        │ learn W,b    │
        └──────────────┘
                │
                ▼
        validation score
                │
                ▼
       choose next settings
```

So there are really two optimization processes:

\[
\boxed{
\text{inner loop: learn model parameters}
}
\]

\[
\boxed{
\text{outer loop: choose hyperparameters}
}
\]

### Interview takeaway

If asked **how you tune hyperparameters**:

> Define the validation metric first, search high-impact hyperparameters over sensible ranges—often logarithmic for quantities such as learning rate—use random or adaptive search when the space becomes large, stop clearly poor runs early, and keep the test set untouched until final evaluation.

**Next topic: Model selection** — given multiple models or checkpoints, how do you decide which one should actually be used?
