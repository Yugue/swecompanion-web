## Supervised, unsupervised, and self-supervised learning

## 1. Identify the learning signal

A **learning paradigm** describes where the signal for learning comes from: supplied answers, structure in inputs, or targets constructed from inputs.

## 2. Supervised learning

**Supervised learning** learns from input–label pairs.

| Input | Label | Prediction |
|---|---|---|
| Email | Spam or legitimate | Category |
| Checkout details | Delivery minutes | Number |

Recorded outcomes can supply labels too. A click records a response to something shown, rather than a judgement about every unseen alternative.

## 3. Unsupervised learning

**Unsupervised learning** finds structure without a supplied target for each example.

- **Clustering:** group similar examples.
- **Density estimation:** model where observations concentrate.
- **Dimensionality reduction:** represent inputs with fewer coordinates.

Customer groups need evidence of stability and usefulness; cluster numbers carry no inherent business meaning.

## 4. Self-supervised learning

**Self-supervised learning** creates prediction targets from the data itself:

```text
input:  the parcel arrived on [MASK]
target: Tuesday
```

Withhold the hidden answer from the input. The learned **representation**, or reusable feature description, can support another task. **Fine-tuning** adapts that model using the later task's training signal.

## 5. Other label strategies

| Setup | Mechanism |
|---|---|
| Semi-supervised | Combine labelled and unlabelled examples for a target task |
| Weak supervision | Use noisy or indirect labels, such as rules |
| Active learning | Choose examples for human labelling |
| Reinforcement learning | Learn actions from rewards received through interaction |

These approaches can be combined. Check whether the available signal actually supports the intended task.

## 6. Interview reasoning

**Question:** You have millions of sessions but only 2,000 reviewed outcomes. Must you use unsupervised learning?

**Answer:** No. Start with a supervised baseline on the reviewed data; consider self-supervised representations or semi-supervised learning, and evaluate on trustworthy held-out outcomes.
