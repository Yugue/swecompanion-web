## Content-based filtering

**Recommend things that resemble what this person already liked, judged by the items' own attributes.**

### Chapter goal

By the end of Chapter 2, you should be able to derive content and collaborative recommendations, select a similarity measure, explain matrix factorization and pairwise implicit objectives, and show how side features enter factorization machines.

```text
you watched:  two pasta recipes, one risotto
              ↓  what do they have in common?
              "Italian", "cooking", "30-45 min", creator "Luca"
              ↓  find other items like that
recommend:    more Italian cooking videos
```

No other user is involved. That is the defining property, and it is where both the strengths and the limits come from.

---

## 1. How it works

```text
1. describe each item by its features    → category, tags, text, price, creator
2. build a profile from what the user engaged with
3. score new items by similarity to that profile
4. show the closest
```

The profile is usually just an average of the feature vectors of the items they liked, weighted by how much they liked them.

---

## 2. Build a profile with a small example

Suppose item vectors have two features: cooking and travel. Two liked cooking items have vectors `[1, 0]`; one travel item has `[0, 1]`. Their average is `[2/3, 1/3]`.

A dot-product score gives a cooking candidate 2/3 and a travel candidate 1/3. Weighting recent travel interactions more strongly shifts the profile toward current interest. Normalize feature scales so a large price value does not overwhelm a category feature.

---

## 3. What it is good at

| Strength | Why |
|---|---|
| New items work immediately | An item's features exist before anyone touches it |
| No other users needed | Works for a brand-new product with one user |
| Explainable | "Because you watched X, which is also Italian cooking" |
| Niche tastes survive | Popularity plays no part in the score |

### Core intuition

That first row is the important one: content-based filtering can **represent new items without behavioral history** because it can represent a new item from its attributes. Collaborative methods, by contrast, need interaction history.

---

## 4. What it cannot do

```text
you watched Italian cooking
        ↓
you get      Italian cooking
             Italian cooking
             Italian cooking
```

It can only recommend inside the region the user has already explored. It cannot infer a co-purchase relationship merely from behavior it never uses. Rich semantic features may connect cooking and knives, but that is different evidence from observing users buy both.

Two further limits:

- **It is only as good as your item features.** With nothing but a title and a category, the similarity is crude.
- **It over-specializes.** Without deliberate variety, recommendations can narrow over time into a **filter bubble** that repeatedly reinforces the same interests.

### Rule of thumb

> Content-based filtering can tell you an item is similar. It cannot tell you an item is *good*.

---

## 5. Where the features come from

```text
structured   category, price, brand, duration, language
text         title and description → term frequency-inverse document frequency (TF-IDF), or a learned text embedding
image/audio  thumbnail or track → a pretrained model's output
graph        creator, seller, series, album
```

Modern systems mostly use learned text and image representations rather than hand-built tag lists, but the logic is unchanged: describe the item, compare the description.

---

## 6. Handle multiple interests rather than averaging everything

A single average can land between unrelated interests. Someone who enjoys both cooking and motorsport does not necessarily want an item halfway between them.

Keep several interest profiles, or retrieve neighbors of individual recently liked items and merge them. Measure relevance and variety; adding more profiles should cover real interests, not just increase duplicate candidates.

---

## 7. When to reach for it

- **A brand-new product** with almost no interaction data - it works on day one.
- **A fast-turning catalogue** - news, listings, auctions - where most items are always new.
- **As one retrieval source among several**, specifically to cover new and niche items.

### Rule of thumb

In a mature system it is rarely the whole answer, and it is almost always one of the candidate sources.

---

## What matters most

- **It recommends items similar to what the user already engaged with, using item attributes only.** No other users are involved.
- **It can represent new items from available attributes,** which is its main advantage and precisely the weakness of collaborative filtering.
- **It can over-specialize.** Similarity-based recommendations may narrow without deliberate variety or multiple interest profiles.
- **Its quality is capped by your item features,** so it suits catalogues with rich text or structured attributes.
- **In mature systems it survives as one retrieval source among several,** covering new and niche items.

Next topic is **Collaborative filtering**.
