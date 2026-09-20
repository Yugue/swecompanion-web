## Collaborative filtering

**Use other people's behavior instead of the item's description.** If lots of people who watched A also watched B, then B is a good recommendation for someone who just watched A - and you never needed to know what A or B are *about*.

```text
Ann   watched  A  B  C
Ben   watched  A  B
Cara  watched  A     C

Ben has not watched C, and the people most like Ben did.  →  recommend C
```

### 1. Two directions

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

### 2. Why production uses item-based

| | User-based | Item-based |
|---|---|---|
| Similarities change | constantly - users act every day | slowly - item-item relations are stable |
| Precompute? | hard | yes, offline, refreshed nightly |
| Number of entities | often more users than items | usually fewer items |
| Explains itself | "people like you" (vague, slightly creepy) | "because you watched X" (concrete) |

The stability point is the one to say out loud. Your taste changes every session; the fact that two films are watched together does not. So item-item similarities can be computed offline in a batch job and looked up in microseconds at request time - which is exactly what retrieval needs.

### Rule of thumb

> User-based is easier to explain in a lecture. Item-based is what gets shipped.

---

### 3. What makes it powerful

It finds relationships that no attribute captures.

```text
content-based  : "both are cooking videos"          ← obvious from the features
collaborative  : "people who buy this printer       ← invisible in any attribute,
                  also buy that specific cable"        but completely real
```

That is the whole appeal. You get patterns out of behavior that nobody thought to encode.

---

### 4. What breaks it

```text
new item      → nobody has interacted with it → it appears in no co-occurrence → invisible
sparse data   → few overlaps between users    → similarities are noise
popular items → co-occur with everything      → they swamp every similarity list
```

The first is the mirror image of content-based filtering's strength, which is why real systems run both. The third is a real, common bug and it gets its own treatment in the next lesson.

---

### 5. The shape that survives today

Neighbourhood methods are simple and are still used, mostly as a **retrieval source**: for each item, precompute its top few hundred co-occurring items, store the list, look it up when that item appears in the user's history.

It is cheap, it is explainable, it needs no training in the usual sense, and it covers cases the learned models miss. That is why a modern system still has it, sitting alongside the embedding index from Chapter 3.

---

## What matters most

- **It uses behavior rather than item attributes,** which is how it finds relationships no feature encodes.
- **Item-based beats user-based in production** because item-item similarity is stable over time and can be precomputed.
- **It needs no item features at all** - its strength - and it cannot touch an item nobody has interacted with - its weakness.
- **Popular items co-occur with everything** and will dominate every similarity list unless you normalize.
- **It survives in modern systems as a cheap, explainable retrieval source** next to the learned models.

Next topic is **Similarity and co-occurrence**.
