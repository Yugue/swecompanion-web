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

**Pointwise mutual information (PMI)** compares observed co-occurrence with what you would expect by chance:

\[
\text{PMI}(A,B) = \log \frac{P(A, B)}{P(A)\,P(B)}
\]

### Common issue

PMI is the sharpest at surfacing genuinely surprising pairs, and the noisiest for rare items - so it is usually damped or floored by a minimum count.

---

## 3. A numerical comparison

Let 100 users engage with A, 400 with B, and 20 with C. Suppose 20 users engage with both A and B, while 10 engage with A and C.

Raw overlap prefers B: 20 versus 10. Cosine gives `20 / √(100 × 400) = 0.10` for B and `10 / √(100 × 20) ≈ 0.224` for C. Normalization reveals that C overlaps much more strongly relative to its audience size.

---

## 4. Picking one

| Situation | Reach for |
|---|---|
| General "related items" | cosine on the interaction vectors |
| Sets, with no strength of preference | Jaccard |
| You want surprising, non-obvious pairs | PMI, with a minimum-count floor |
| Heavy popularity skew | PMI, or cosine with extra popularity damping |

### Rule of thumb

None of these is subtle. The mistake is skipping the normalization step, not choosing the wrong formula.

---

## 5. Small samples need less confidence

Two obscure items touched by the same single user can have perfect cosine similarity. That is not strong evidence of a reliable recommendation.

Require a minimum overlap or **shrink** the score toward zero when support is small. For example, multiply similarity by `overlap / (overlap + 10)`: one shared user retains only 1/11 of the score, while 100 retain 100/110. The constant is a validation choice, not a universal setting.

---

## 6. Similarity inherits every bias in the log

```text
the system showed A and B together on the same page
        ↓
people engaged with both because both were on screen
        ↓
A and B look similar
        ↓
the system shows A and B together even more
```

That is a **feedback loop** disguised as a similarity score: frequently displayed pairs collect more interactions and then appear even more similar. It is a common reason "related items" lists stop changing.

Practical guards: a minimum interaction count before an item may enter a similarity list, a cap on how often any single item may appear across lists, and periodic recomputation from a window rather than from all history.

**Beyond co-occurrence.** A model can also learn an **embedding**, a short numeric vector for each item. Embeddings handle sparsity better because two items can end up close even if no person engaged with both, as long as their interaction patterns are similar.

That is the step from counting to learning, and it is the point of the rest of this chapter.

---

## What matters most

- **The similarity measure is the model.** Everything about a neighbourhood method follows from it.
- **Raw co-occurrence counts measure popularity,** which is the classic cause of "the same bestsellers everywhere".
- **Cosine, Jaccard, and PMI are all ways of dividing out popularity;** PMI surfaces the most surprising pairs and is the noisiest on rare items.
- **Similarity inherits the logs' biases,** including items that only look related because they were shown together.
- **Guard with minimum counts, per-item caps, and recomputation from a recent window.**

Next topic is **Matrix factorization**.
