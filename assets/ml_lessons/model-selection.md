## Part VI — Practical ML Reasoning  
### Topic 2: Model Selection

**Model selection** asks:

> Given several trained candidate models, which one should we actually choose?

The key principle is:

\[
\boxed{\text{Choose using validation performance, not training performance}}
\]

But in a real system, “best” usually means more than simply the highest accuracy.

---

## 1. Model selection vs hyperparameter tuning

These are closely related, but not identical.

In hyperparameter tuning, we might compare:

```text
Transformer A:
LR = 1e-3

Transformer B:
LR = 3e-4

Transformer C:
LR = 1e-4
```

Same general model family, different configurations.

Model selection can be broader:

```text
Logistic regression
        vs
XGBoost
        vs
MLP
        vs
Transformer
```

or even:

```text
Transformer checkpoint at epoch 5
        vs
epoch 10
        vs
epoch 20
```

In both cases, the decision should generally be made using the **validation set**.

---

## 2. Why training performance is not enough

Suppose:

| Model | Train accuracy | Validation accuracy |
|---|---:|---:|
| A | 92% | 90% |
| B | 99.9% | 84% |

If you select based on training accuracy:

\[
B
\]

looks better.

But B is probably overfitting.

The goal isn't:

\[
\boxed{\text{fit the training data best}}
\]

It's:

\[
\boxed{\text{generalize best to unseen data}}
\]

So you would normally prefer A.

---

## 3. The basic selection pipeline

Think of the workflow as:

```text
Training set
    │
    ├──► train Model A
    ├──► train Model B
    └──► train Model C
              │
              ▼
         Validation set
              │
        compare candidates
              │
              ▼
        choose one model
              │
              ▼
           Test set
              │
              ▼
       final evaluation
```

Again, the test set should not repeatedly influence your model choice.

Otherwise it effectively becomes another validation set.

---

## 4. “Best model” depends on the metric

Suppose we're detecting cancer.

Two models:

| Model | Accuracy | Recall |
|---|---:|---:|
| A | 97% | 72% |
| B | 95% | 94% |

If missing a positive case is extremely costly, Model B may be preferable despite lower accuracy.

So before model selection, you need to decide:

\[
\boxed{\text{What does success actually mean?}}
\]

This is why model selection should optimize the metric that reflects the product or task objective.

---

## 5. Sometimes one metric isn't enough

Imagine two models:

| | Model A | Model B |
|---|---:|---:|
| Accuracy | 94.5% | 94.2% |
| Latency | 500 ms | 20 ms |
| Memory | 12 GB | 1 GB |

If you're deploying to a phone, B is probably much more attractive.

So model selection often involves constraints:

\[
\text{maximize quality}
\]

subject to:

\[
\text{latency} < 50\text{ ms}
\]

\[
\text{memory} < 2\text{ GB}
\]

This is a very important practical distinction:

> The model with the highest offline metric is not necessarily the best production model.

We'll go deeper into latency/memory/accuracy tradeoffs later.

---

## 6. Simpler model vs complex model

Suppose:

```text
Logistic regression:
validation accuracy = 91%

Huge Transformer:
validation accuracy = 91.3%
```

Would you automatically choose the Transformer?

No.

That extra:

\[
0.3\%
\]

might not justify:

- dramatically higher inference cost
- slower latency
- greater operational complexity

A strong interviewer answer should acknowledge that model selection includes **cost-benefit reasoning**.

---

## 7. Checkpoint selection

Model selection can happen even during one training run.

Suppose validation loss behaves like:

```text
Epoch 1   0.80
Epoch 5   0.51
Epoch 10  0.39  ← best
Epoch 15  0.44
Epoch 20  0.53
```

Training loss may still be decreasing:

```text
training loss
↓
↓
↓
↓
```

but validation loss begins rising.

You generally restore the checkpoint with the best validation performance:

\[
\boxed{\text{best validation checkpoint}}
\]

not necessarily the final checkpoint.

This is closely related to early stopping.

---

## 8. Don't select based on one lucky run

Deep-learning training can be stochastic.

Different:

- random initialization
- minibatch ordering
- dropout masks

can produce slightly different results.

Suppose:

```text
Model A:
92.1%, 92.0%, 92.2%

Model B:
91.8%, 93.0%, 91.7%
```

If you looked only at B's lucky 93.0% run, you might incorrectly conclude B is superior.

For important comparisons, evaluate across multiple random seeds when feasible.

The more useful question becomes:

\[
\boxed{\text{Is the improvement reproducible?}}
\]

rather than:

> Did one run get a better number?

---

## 9. Cross-validation

If the dataset is small, a single validation split may be noisy.

Then **k-fold cross-validation** can help.

For example, with 5 folds:

```text
Fold 1: validate on 1, train on 2–5
Fold 2: validate on 2, train on 1,3–5
Fold 3: validate on 3, ...
...
```

Each candidate model gets evaluated across several different validation subsets.

Then compare average performance.

Important:

> We do not combine the weights of those models.

Cross-validation is primarily used to estimate performance and select configurations more reliably.

After selection, you commonly retrain the chosen configuration on the available training data.

---

## 10. Distribution matters

Suppose your validation dataset is:

```text
90% desktop users
10% mobile users
```

but production is:

```text
20% desktop
80% mobile
```

You might select the wrong model even if your validation procedure is mathematically correct.

So:

\[
\boxed{\text{validation data should represent deployment conditions}}
\]

Model selection is only as reliable as the validation distribution.

---

## 11. Look beyond aggregate performance

Suppose:

\[
\text{overall accuracy}=95\%
\]

But:

```text
English examples      98%
French examples       96%
Japanese examples     72%
```

A single average can hide important failure modes.

So before selecting the model, it is often useful to inspect performance across important slices:

```text
different classes
different domains
different input lengths
different user groups
different difficulty levels
```

This naturally leads into our next topic: **error analysis**.

---

## 12. Statistical significance / practical significance

Suppose:

\[
A=91.70\%
\]

\[
B=91.73\%
\]

Is B meaningfully better?

Maybe not.

The difference:

\[
0.03\%
\]

could just be statistical noise.

Even if it is statistically real, it might not be **practically important**.

So ask two separate questions:

\[
\boxed{\text{Is the improvement reliable?}}
\]

and:

\[
\boxed{\text{Is the improvement large enough to matter?}}
\]

This is especially important when the supposedly better model costs much more.

---

## 13. Offline vs online selection

Offline validation is usually the first stage.

```text
candidate models
      ↓
offline evaluation
      ↓
best candidate
```

But for production systems, the final answer may require an online experiment such as an **A/B test**:

```text
Model A → some users
Model B → some users
           ↓
compare real product outcomes
```

Why?

Because an offline metric may not perfectly capture:

- engagement
- user satisfaction
- revenue
- downstream behavior

So production ML often looks like:

\[
\boxed{
\text{offline selection}
\rightarrow
\text{online validation}
}
\]

when online experimentation is feasible and appropriate.

---

## 14. A useful interview scenario

Suppose an interviewer asks:

> Model A has 94% accuracy and Model B has 95%. Which do you deploy?

Don't immediately answer B.

A stronger response is:

> I would first verify that accuracy is the right metric and that the difference is statistically/reproducibly meaningful. Then I'd compare performance on important data slices and consider deployment constraints such as latency, memory, and cost. If those checks still favor B, I'd select it based on validation performance and, if this is a production system where online testing is appropriate, verify the improvement with an A/B test.

That demonstrates practical ML judgment rather than merely metric chasing.

---

## Minimal Python intuition

Choosing the best validation checkpoint might be as simple as:

```python
best_model = min(models, key=lambda m: m.validation_loss)
```

The difficult part is not writing that line.

It's making sure:

\[
\boxed{\text{validation_loss actually represents what you care about}}
\]

---

## Interview takeaway

A strong definition is:

> Model selection is the process of choosing among candidate models or checkpoints based primarily on validation performance, while also considering robustness, deployment constraints, and the real task objective. The test set should remain untouched until the final evaluation to avoid selection bias.

The mental pipeline is:

```text
Train candidates
      ↓
Validation
      ↓
compare quality + constraints
      ↓
select model
      ↓
Test once
      ↓
possibly online evaluation
```

The most important principle is:

\[
\boxed{
\text{Best model} \neq \text{highest training score}
}
\]

and often:

\[
\boxed{
\text{Best production model} \neq \text{highest offline score}
}
\]

**Next topic: Error analysis** — once a model is underperforming, how do we systematically inspect its mistakes and decide what to fix next?
