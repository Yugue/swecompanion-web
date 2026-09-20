## Similarity and co-occurrence

**Every neighbourhood method comes down to one question: what counts as "similar"?** That choice is the model. Get it wrong and your "related items" widget shows the same three bestsellers on every page.

---

## 1. The raw signal, and why it fails

The obvious measure is co-occurrence - how many people engaged with both items:

```text
count(A and B)  = 14,000
count(A and C)  =    180
```

So A is more similar to B? Not necessarily. If B is the single most popular item in the catalogue, then B co-occurs with *everything*:

```text
count(B) = 8,000,000        B appears with every item, always
count(C) =    12,000        C appearing with A 180 times may be far more meaningful
```

Raw counts measure popularity, not similarity. This is the classic bug behind "every product page recommends the same bestseller".

### Rule of thumb

> Any similarity built on raw counts will rank popular items first. Normalize, always.

---

## 2. Normalizing

**Cosine similarity** divides out the overall magnitude, so a heavy item does not automatically look similar to everything:

\[
\text{cosine}(A, B) = \frac{\text{count}(A \text{ and } B)}{\sqrt{\text{count}(A)}\,\sqrt{\text{count}(B)}}
\]

**Jaccard** divides the overlap by the union - how much of everything touching either item touches both:

\[
\text{Jaccard}(A, B) = \frac{|A \cap B|}{|A \cup B|}
\]

**Pointwise mutual information** compares observed co-occurrence with what you would expect by chance:

\[
\text{PMI}(A,B) = \log \frac{P(A, B)}{P(A)\,P(B)}
\]

### Common issue

PMI is the sharpest at surfacing genuinely surprising pairs, and the noisiest for rare items - so it is usually damped or floored by a minimum count.

---

## 3. Picking one

| Situation | Reach for |
|---|---|
| General "related items" | cosine on the interaction vectors |
| Sets, with no strength of preference | Jaccard |
| You want surprising, non-obvious pairs | PMI, with a minimum-count floor |
| Heavy popularity skew | PMI, or cosine with extra popularity damping |

### Rule of thumb

None of these is subtle. The mistake is skipping the normalization step, not choosing the wrong formula.

---

## 4. Similarity inherits every bias in the log

```text
the system showed A and B together on the same page
        ↓
people engaged with both because both were on screen
        ↓
A and B look similar
        ↓
the system shows A and B together even more
```

That is a feedback loop dressed up as a similarity score. It is a real reason "related items" lists ossify, and it is why Chapter 5 spends a lesson on the effect.

Practical guards: a minimum interaction count before an item may enter a similarity list, a cap on how often any single item may appear across lists, and periodic recomputation from a window rather than from all history.

**Beyond co-occurrence.** Co-occurrence is one way to get a similarity. The next lesson gets one by *learning* a vector per item, which handles sparsity far better - two items can end up close even if no single person engaged with both, as long as they relate to the same third things.

That is the step from counting to learning, and it is the point of the rest of this chapter.

---

## What matters most

- **The similarity measure is the model.** Everything about a neighbourhood method follows from it.
- **Raw co-occurrence counts measure popularity,** which is the classic cause of "the same bestsellers everywhere".
- **Cosine, Jaccard, and PMI are all ways of dividing out popularity;** PMI surfaces the most surprising pairs and is the noisiest on rare items.
- **Similarity inherits the logs' biases,** including items that only look related because they were shown together.
- **Guard with minimum counts, per-item caps, and recomputation from a recent window.**

Next topic is **Matrix factorization**.
