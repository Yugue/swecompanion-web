## Content-based filtering

**Recommend things that resemble what this person already liked, judged by the items' own attributes.**

```text
you watched:  two pasta recipes, one risotto
              ↓  what do they have in common?
              "Italian", "cooking", "30-45 min", creator "Luca"
              ↓  find other items like that
recommend:    more Italian cooking videos
```

No other user is involved. That is the defining property, and it is where both the strengths and the limits come from.

### 1. How it works

```text
1. describe each item by its features    → category, tags, text, price, creator
2. build a profile from what the user engaged with
3. score new items by similarity to that profile
4. show the closest
```

The profile is usually just an average of the feature vectors of the items they liked, weighted by how much they liked them.

---

### 2. What it is good at

| Strength | Why |
|---|---|
| New items work immediately | An item's features exist before anyone touches it |
| No other users needed | Works for a brand-new product with one user |
| Explainable | "Because you watched X, which is also Italian cooking" |
| Niche tastes survive | Popularity plays no part in the score |

That first row is the important one: content-based filtering has **no item cold-start problem at all**, which is exactly the weakness of the method in the next lesson.

---

### 3. What it cannot do

```text
you watched Italian cooking
        ↓
you get      Italian cooking
             Italian cooking
             Italian cooking
```

It can only recommend inside the region the user has already explored. It will never discover that people who cook Italian food also buy a particular knife, because nothing in the *features* connects those two.

Two further limits:

- **It is only as good as your item features.** With nothing but a title and a category, the similarity is crude.
- **It over-specializes.** Without deliberate variety the recommendations narrow over time - the filter-bubble mechanism in Chapter 5.

### Rule of thumb

> Content-based filtering can tell you an item is similar. It cannot tell you an item is *good*.

---

### 4. Where the features come from

```text
structured   category, price, brand, duration, language
text         title and description → TF-IDF, or a learned text embedding
image/audio  thumbnail or track → a pretrained model's output
graph        creator, seller, series, album
```

Modern systems mostly use learned text and image representations rather than hand-built tag lists, but the logic is unchanged: describe the item, compare the description.

---

### 5. When to reach for it

- **A brand-new product** with almost no interaction data - it works on day one.
- **A fast-turning catalogue** - news, listings, auctions - where most items are always new.
- **As one retrieval source among several** (Chapter 3), specifically to cover new and niche items.

In a mature system it is rarely the whole answer, and it is almost always one of the candidate sources.

---

## What matters most

- **It recommends items similar to what the user already engaged with, using item attributes only.** No other users are involved.
- **It has no item cold-start problem,** which is its main advantage and precisely the weakness of collaborative filtering.
- **It cannot surprise anyone.** Recommendations stay inside the region already explored, and narrow over time without deliberate variety.
- **Its quality is capped by your item features,** so it suits catalogues with rich text or structured attributes.
- **In mature systems it survives as one retrieval source among several,** covering new and niche items.

Next topic is **Collaborative filtering**.
