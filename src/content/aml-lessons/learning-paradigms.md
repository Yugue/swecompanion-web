## Supervised, unsupervised, and self-supervised learning

These three names answer a single question: **do your examples come with the right answer attached?**

```text
you have the answers          → supervised       "these 50,000 emails are marked spam / not spam"
you have no answers           → unsupervised     "here are 50,000 emails, find some structure"
the data contains its own     → self-supervised  "hide a word, predict it from the rest"
```

So the paradigm is not a preference. It is decided for you by what is already in your data.

### 1. The three cases in one line each

```text
supervised       (x, y)        learn to predict a known target
unsupervised     (x)           find structure with no target
self-supervised  (x, y = g(x)) invent the target from the input itself
```

Reinforcement learning is the fourth family: no fixed dataset at all, but an agent taking actions and receiving rewards. It is its own Google domain, so recognize it and move on.

---

### 2. Supervised learning

You have inputs paired with outcomes.

\[
D = \{(x_1,y_1),\dots,(x_n,y_n)\}
\]

Training minimizes the gap between \(\hat y\) and \(y\).

```python
model.fit(X_train, y_train)
```

Almost every production ML system you will be asked to design is supervised, because businesses care about predicting a specific, named outcome.

The hard part is rarely the algorithm. It is that **labels are expensive, delayed, or noisy** - which is why the data chapter exists.

---

### 3. Unsupervised learning

Only \(x\). The algorithm looks for structure:

- clustering: which points group together (k-means, DBSCAN),
- density estimation: what is normal (GMM, anomaly detection),
- dimensionality reduction: what are the important directions (PCA).

```python
labels = KMeans(n_clusters=6).fit_predict(X)
```

There is no accuracy here, because there is nothing to be accurate against. Quality is judged by stability and by whether the output is useful downstream.

### Rule of thumb

> Unsupervised results are a hypothesis, not an answer. Someone has to look at the clusters and decide they mean something.

---

### 4. Self-supervised learning

The target is constructed from the input by a rule \(g\):

- hide a word, predict it from the rest of the sentence,
- hide a patch of an image, reconstruct it,
- take two augmentations of the same row and pull their representations together.

No human labels, but a genuine prediction task - which is why it trains like supervised learning and scales to enormous unlabelled datasets. It is the engine behind every pretrained model.

In applied ML, its practical role is: **pretrain on the cheap unlabelled data, fine-tune on the expensive labelled data**.

---

### 5. Semi-supervised and weak supervision

The realistic middle ground, and a great interview answer because it matches real projects:

| Situation | Approach |
|---|---|
| 2k labels, 10M unlabelled rows | Pretrain / cluster on all of it, fine-tune on the 2k |
| Labels are expensive but a heuristic exists | Weak/programmatic labels, then clean the noisy ones |
| Labelling budget can be spent selectively | Active learning: label the examples the model is least sure about |
| Labels arrive later | Train on older data, validate as the labels mature |

---

### 6. Choosing, in practice

Work from the data, not from the algorithm you like:

```text
Do I have outcomes for my rows?
├── yes, enough of them  → supervised
├── yes, but very few    → semi-supervised / pretrain + fine-tune
└── no
    ├── I want groups    → clustering
    ├── I want "unusual" → anomaly detection
    └── I want features  → self-supervised representations
```

### Rule of thumb

> "We have no labels" almost never means "use unsupervised learning." It usually means *go find the implicit label* - a click, a return, a chargeback, a cancellation.

---

## What matters most

- **The data picks the paradigm, not your preference.** Ask what supervision signal your rows actually contain.
- **"We have no labels" usually means "find the implicit label"** - a click, a return, a chargeback - before reaching for unsupervised learning.
- **Unsupervised output is a hypothesis.** There is nothing to be accurate against, so a person has to decide the clusters mean something.
- **Self-supervised learning is the bridge for scarce labels:** pretrain on cheap unlabelled data, then fine-tune on the expensive labelled data.

Next topic is **Features, labels, and a training example**.
