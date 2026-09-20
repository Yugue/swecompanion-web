## Supervised, unsupervised, and self-supervised learning

These three names answer a single question:

> **Do your examples come with the right answer attached?**

```text
you have the answers        → supervised       "50,000 emails, marked spam or not"
you have no answers         → unsupervised     "50,000 emails, find some structure"
the data contains its own   → self-supervised  "hide a word, predict it from the rest"
```

The paradigm is not a preference. It is decided by what is already in your data.

---

## 1. The three cases in one line each

```text
supervised       (x, y)         learn to predict a known target
unsupervised     (x)            find structure with no target
self-supervised  (x, y = g(x))  invent the target from the input itself
```

Reinforcement learning is a fourth family — no fixed dataset, an agent taking actions for rewards. It is its own Google domain; recognize it and move on.

---

## 2. Supervised learning

\[
D = \{(x_1,y_1),\dots,(x_n,y_n)\}
\]

Training minimizes the gap between \(\hat y\) and \(y\).

```python
model.fit(X_train, y_train)
```

### Intuition

Almost every production system you will be asked to design is supervised, because businesses care about predicting one specific named outcome.

### Common issue

The hard part is rarely the algorithm. It is that **labels are expensive, delayed, or noisy** — which is what the data chapter is about.

---

## 3. Unsupervised learning

Only \(x\). The algorithm looks for structure:

- **clustering** — which points group together,
- **density estimation** — what counts as normal,
- **dimensionality reduction** — which directions matter.

```python
labels = KMeans(n_clusters=6).fit_predict(X)
```

### Intuition

There is no accuracy here, because there is nothing to be accurate against.

### Rule of thumb

> Unsupervised results are a hypothesis, not an answer. Someone has to look at the clusters and decide they mean something.

---

## 4. Self-supervised learning

The target is built from the input by a rule \(g\):

- hide a word, predict it from the rest of the sentence,
- hide a patch of an image, reconstruct it,
- take two augmentations of one row and pull them together.

### Core intuition

No human labels, but a genuine prediction task — which is why it trains like supervised learning and scales to enormous unlabelled datasets.

It is the engine behind every pretrained model.

### Rule of thumb

In applied ML its role is: **pretrain on the cheap unlabelled data, fine-tune on the expensive labelled data.**

---

## 5. Semi-supervised and weak supervision

The realistic middle ground, and a strong interview answer because it matches real projects.

| Situation | Approach |
|---|---|
| 2k labels, 10M unlabelled rows | Pretrain on all of it, fine-tune on the 2k |
| Labels expensive, a heuristic exists | Programmatic labels, then clean the noisy ones |
| Budget to label selectively | Active learning — label what the model is least sure about |
| Labels arrive later | Train on older data, validate as labels mature |

---

## 6. Choosing, in practice

Work from the data, not from the algorithm you like:

```text
Do I have outcomes for my rows?
├── yes, enough      → supervised
├── yes, very few    → semi-supervised / pretrain + fine-tune
└── no
    ├── want groups   → clustering
    ├── want "unusual"→ anomaly detection
    └── want features → self-supervised representations
```

### Rule of thumb

> "We have no labels" almost never means "use unsupervised learning." It usually means *go find the implicit label* — a click, a return, a chargeback, a cancellation.

---

## What matters most

- **The data picks the paradigm, not your preference.** Ask what supervision signal your rows actually contain.
- **"We have no labels" usually means "find the implicit label"** - a click, a return, a chargeback - before reaching for unsupervised learning.
- **Unsupervised output is a hypothesis.** There is nothing to be accurate against, so a person has to decide the clusters mean something.
- **Self-supervised learning is the bridge for scarce labels:** pretrain on cheap unlabelled data, then fine-tune on the expensive labelled data.

Next topic is **Features, labels, and a training example**.
