## Collaborative filtering

**Use other people's behavior instead of the item's description.** If lots of people who watched A also watched B, then B is a good recommendation for someone who just watched A - and you never needed to know what A or B are *about*.

```text
Ann   watched  A  B  C
Ben   watched  A  B
Cara  watched  A     C

Ben has not watched C, and the people most like Ben did.  →  recommend C
```

---

## 1. Working it out by hand

Five users, five films. `·` means they have not watched it.

```text
            Heat   Alien   Amélie   Up    Ratatouille
   Ann        1      1        ·      ·         ·
   Ben        1      1        ·      ·         ·
   Cara       1      ·        ·      ·         ·
   Dan        ·      ·        1      1         1
   Eve        ·      ·        1      1         ·
```

**What should we recommend to Cara?**

User-based: who resembles Cara? She watched Heat. Ann and Ben also watched Heat, so they are her neighbours. What did they watch that she has not? **Alien.**

Item-based: what is watched alongside Heat? Heat and Alien co-occur twice (Ann, Ben); Heat and Amélie co-occur zero times. So Alien is the nearest item to Heat. **Recommend Alien.**

Same answer, different route - and notice that nothing in this calculation knows what either film is *about*. No genre, no cast, no description. The signal came entirely from who watched what.

**And for Eve?** She watched Amélie and Up. Dan watched both plus Ratatouille, so **recommend Ratatouille**. The system has discovered two clusters of taste without ever being told they exist.

### Core intuition

That is the property content-based filtering cannot reproduce, and it is why these two methods are complements rather than competitors.

---

## 2. Two directions

**User-based** - find people similar to you, recommend what they liked.

```text
find users whose history overlaps yours → recommend items they engaged with and you have not
```

**Item-based** - find items similar to the ones you liked, where "similar" means *co-consumed*.

```text
find items frequently engaged with by the same people as the item you just used
```

They sound symmetric. In production they are not.

---

## 3. Why item-based methods are convenient to serve

| | User-based | Item-based |
|---|---|---|
| Similarities change | constantly - users act every day | slowly - item-item relations are stable |
| Precompute? | hard | yes, offline, refreshed nightly |
| Number of entities | often more users than items | usually fewer items |
| Explains itself | "people like you" (vague, slightly creepy) | "because you watched X" (concrete) |

The stability point is the one to say out loud. Your taste changes every session; the fact that two films are watched together does not. So item-item similarities can be computed offline in a batch job and looked up in microseconds at request time - which is exactly what retrieval needs.

### Rule of thumb

> Item-based neighborhood lists are convenient to precompute; the best method still depends on entity counts, freshness, and traffic.

---

## 4. Convert neighbors into a recommendation score

For each item in the user's recent history, look up its similar items. Add their similarity contributions, optionally weighted by recency or interaction strength, then remove ineligible candidates.

If a candidate has similarity 0.6 to one watched item and 0.3 to another, its simple score is 0.9. A rival matching only the first at 0.7 scores lower. This combines evidence rather than taking just one neighbor's list.

---

## 5. What makes it powerful

It finds relationships that no attribute captures.

```text
content-based  : "both are cooking videos"          ← obvious from the features
collaborative  : "people who buy this printer       ← invisible in any attribute,
                  also buy that specific cable"        but completely real
```

### Intuition

That is the whole appeal. You get patterns out of behavior that nobody thought to encode.

---

## 6. What breaks it

```text
new item      → nobody has interacted with it → it appears in no co-occurrence → invisible
sparse data   → few overlaps between users    → similarities are noise
popular items → co-occur with everything      → they swamp every similarity list
```

The first is the mirror image of content-based filtering's strength, which is why real systems run both. The third is **popularity bias**: frequently used items overlap with many users and can dominate unless similarity scores are normalized.

**The shape that survives today.** Neighbourhood methods are simple and are still used, mostly as a **retrieval source**: for each item, precompute its top few hundred co-occurring items, store the list, look it up when that item appears in the user's history.

It is cheap, explainable, and needs no training in the usual sense. That is why modern systems still use it alongside an **embedding index**, which retrieves items represented by similar learned vectors.

---

## 7. Control noisy histories and overlaps

Count distinct users or sessions when repeated events would inflate co-occurrence. Exclude bots and accidental refreshes, require enough shared observations, and use a recent window when relationships change quickly.

Whether to remove already-consumed items depends on the surface: it makes sense for a discovery feed, but can be wrong for repeat purchases or continue-watching recommendations.

---

## What matters most

- **It uses behavior rather than item attributes,** which is how it finds relationships no feature encodes.
- **Item-based methods are often convenient to serve** because neighbor lists can be precomputed; their stability depends on the catalogue.
- **It needs no item features at all** - its strength - and it cannot touch an item nobody has interacted with - its weakness.
- **Popular items co-occur with everything** and will dominate every similarity list unless you normalize.
- **It survives in modern systems as a cheap, explainable retrieval source** next to the learned models.

Next topic is **Similarity and co-occurrence**.
