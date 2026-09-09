## ML fundamentals

For your Google L4–L5 ML domain interview, “ML fundamentals” means you should be able to reason about **how learning works, how models fail, and how to evaluate them**.

### 1. Supervised vs unsupervised vs self-supervised

**Supervised learning** uses labeled examples:

\[
(x, y)
\]

Examples:
- image → cat/dog
- email → spam/not spam
- house features → price

Goal:

\[
f(x) \approx y
\]

Main tasks:
- classification
- regression

**Unsupervised learning** has no target \(y\).

Examples:
- clustering customers
- dimensionality reduction
- discovering structure in data

**Self-supervised learning** creates supervision from the data itself.

Example in LLMs:

Input:

> The capital of France is

Target:

> Paris

No human needs to manually label each example.

This is how a lot of modern deep learning pretraining works.

---

## 2. Parameters vs hyperparameters

**Parameters** are learned during training.

For a neural network:

\[
y = Wx+b
\]

\(W\) and \(b\) are parameters.

**Hyperparameters** are chosen by us.

Examples:

- learning rate
- batch size
- number of layers
- hidden dimension
- dropout rate
- optimizer

Simple distinction:

> **Parameters are learned. Hyperparameters control learning.**

---

## 3. Train / validation / test sets

You normally divide data into:

### Training set
Used to optimize parameters.

### Validation set
Used to make decisions such as:

- hyperparameters
- architecture
- early stopping
- model selection

### Test set
Used only at the end to estimate real-world/generalization performance.

Important:

If you repeatedly tune your model based on test performance, the test set is no longer truly unseen.

So:

\[
\text{train} \rightarrow \text{validation} \rightarrow \text{test}
\]

---

# 4. Loss function vs evaluation metric

This distinction is important.

### Loss

The quantity training directly minimizes.

Example:

\[
L=-\sum_i y_i \log(\hat y_i)
\]

Cross-entropy for classification.

It usually needs to be differentiable so gradient descent can optimize it.

### Metric

Used to measure whether the model is actually useful.

Examples:

- accuracy
- precision
- recall
- F1
- AUC

You might:

> train using cross-entropy  
> evaluate using F1

because F1 itself isn't convenient for gradient-based optimization.

---

# 5. Underfitting vs overfitting

### Underfitting

The model performs poorly even on training data.

Example:

- training accuracy: 65%
- validation accuracy: 63%

Usually means the model cannot capture the underlying relationship.

Possible causes:

- model too simple
- insufficient training
- bad features
- learning rate problems

### Overfitting

The model learns training data extremely well but fails to generalize.

Example:

- training accuracy: 99%
- validation accuracy: 75%

The model may be learning:

- noise
- accidental correlations
- details specific to the training examples

Potential fixes:

- more data
- regularization
- dropout
- data augmentation
- simpler model
- early stopping

This is extremely important in interviews.

---

# 6. Generalization

This is one of the central ideas of ML.

The actual goal is **not to minimize training error**.

The goal is:

> perform well on unseen data drawn from the real-world distribution.

Suppose:

\[
L_{train}=0.001
\]

That means almost nothing by itself.

If:

\[
L_{test}=3.7
\]

you have a terrible model.

Generalization asks:

> How well does what the model learned transfer beyond the examples it trained on?

---

# 7. Bias–variance tradeoff

This is closely related.

### High bias

The model's assumptions are too restrictive.

Result:

- training performance poor
- validation performance poor

Usually underfitting.

Example:

Trying to fit:

\[
y=x^2
\]

using:

\[
y=ax+b
\]

The model literally cannot represent the relationship well.

---

### High variance

The model is overly sensitive to its training dataset.

Result:

- excellent training performance
- poor validation performance

Usually overfitting.

A high-capacity neural network can memorize training examples.

The core tradeoff is:

> More model capacity usually reduces bias but can increase variance.

Modern deep learning complicates this simple picture somewhat because large models can generalize surprisingly well, but the concept is still fundamental.

---

# 8. Data leakage

This is when information enters training that would not legitimately be available at inference time.

Example:

You're predicting whether someone will default on a loan.

You accidentally include:

> `account_closed_due_to_default`

as an input feature.

Your model gets amazing results.

But the feature only exists **after default happened**.

Your model hasn't learned to predict default. It has learned to cheat.

Other common leakage:

- normalization using the entire dataset before splitting
- duplicate samples across train/test
- using future information to predict the past
- selecting features based on test-set performance

In an interview, suspiciously high evaluation numbers should make you think:

> Could there be leakage?

---

# 9. Distribution shift

Training assumes future data resembles training data.

But reality changes.

Suppose a fraud model was trained on:

\[
P_{train}(X,Y)
\]

Then attackers change behavior.

Now production data follows:

\[
P_{production}(X,Y)
\]

and these distributions differ.

That's **distribution shift**.

Examples:

- new slang breaks NLP model
- camera hardware changes image distribution
- COVID changes purchasing behavior
- fraudsters adapt
- user demographics change

This is why production ML needs monitoring and retraining.

---

# 10. Classification vs regression

### Classification

Predict discrete classes.

Example:

\[
\text{cat, dog, horse}
\]

Usually outputs probabilities:

\[
P(y=k|x)
\]

### Regression

Predict continuous values.

Example:

\[
\$523,000
\]

Typical losses:

Classification:

\[
\text{CrossEntropy}
\]

Regression:

\[
MSE=\frac1N\sum(y-\hat y)^2
\]

---

# 11. Precision and recall

Suppose we're detecting cancer.

There are four outcomes:

| | Actually positive | Actually negative |
|---|---:|---:|
| Predict positive | TP | FP |
| Predict negative | FN | TN |

### Precision

Of things we predicted positive, how many were actually positive?

\[
Precision=\frac{TP}{TP+FP}
\]

High precision means:

> Few false alarms.

---

### Recall

Of actual positives, how many did we find?

\[
Recall=\frac{TP}{TP+FN}
\]

High recall means:

> Few positives were missed.

For cancer screening, recall may matter a lot because false negatives are costly.

For spam detection, precision may matter more because accidentally hiding an important email is bad.

---

# 12. F1 score

Balances precision and recall:

\[
F1=2\frac{Precision\cdot Recall}{Precision+Recall}
\]

Useful especially when classes are imbalanced.

---

# 13. Class imbalance

Suppose:

- 99.9% transactions are legitimate
- 0.1% are fraud

A model predicting:

> always legitimate

gets:

\[
99.9\%
\]

accuracy.

Yet it is completely useless.

This is why accuracy can be misleading.

Better metrics might include:

- precision
- recall
- F1
- PR-AUC

---

# 14. Baselines

Before building a complicated neural network, establish a baseline.

Examples:

- majority class
- logistic regression
- simple heuristic
- previous production model

Why?

Suppose:

Neural network accuracy:

\[
84.2\%
\]

Looks good.

But logistic regression gives:

\[
84.1\%
\]

Now the complexity probably isn't justified.

Google interviewers care about this kind of reasoning.

---

# 15. Offline evaluation vs production evaluation

Your validation/test set gives **offline metrics**.

But production success may depend on something different.

Example recommender:

Offline:

\[
NDCG
\]

Production:

- click-through rate
- watch time
- user retention

So you might eventually run an **A/B test**.

Control:

> existing model

Treatment:

> new model

Then compare actual user outcomes.

---

# The mental model I want you to keep

Machine learning is basically:

\[
\boxed{\text{Data} \rightarrow \text{Model} \rightarrow \text{Loss} \rightarrow \text{Optimization}}
\]

Then ask:

\[
\boxed{\text{Does it generalize?}}
\]

That leads to:

- train/validation/test
- overfitting
- bias/variance
- regularization
- metrics
- distribution shift

Those ideas appear again and again throughout deep learning.

### For Google, you should be able to answer these without hesitation

- What's the difference between training/validation/test?
- Loss vs metric?
- Underfitting vs overfitting?
- High bias vs high variance?
- How would you diagnose overfitting?
- Why can accuracy be misleading?
- Precision vs recall?
- What is data leakage?
- What happens if production data differs from training data?
- Why establish a baseline?

If all of that feels solid, **ML fundamentals is sufficiently covered for now**. The next curriculum topic is **Linear algebra essentials**.
