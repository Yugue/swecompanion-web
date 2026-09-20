## Cold start

**Cold start is what happens when there is no history to learn from.** Every method built on interactions has nothing to work with, because the interactions do not exist yet.

---

## 1. Three different problems

```text
new ITEM    just uploaded, zero interactions      ← most common, most solvable
new USER    just signed up, zero history          ← common, partly solvable
new SYSTEM  launching, no logs at all             ← rare, hardest
```

### Rule of thumb

They are usually lumped together and they have different fixes, so separating them is the first thing to say.

---

## 2. What each method can and cannot do on day one

A video uploaded sixty seconds ago, zero interactions:

```text
method                        can it rank this video?   why
collaborative filtering              NO                 appears in no co-occurrence
matrix factorization                 NO                 no id vector was learned
two-tower with ID-only towers        NO                 same problem
two-tower with FEATURE towers        YES                title, category, creator exist
content-based filtering              YES                same reason
popularity                           NO                 no engagement yet
creator's recent performance         YES                the creator is not cold
```

Read the "why" column. Every method that fails does so for one reason: **it learns a vector per id, and this id has no history.** Every method that works reads *features* instead.

That is the concrete argument for feeding real features into the item tower, made earlier in Chapter 3 - it is not a refinement, it is what determines whether a day-old catalogue is reachable at all.

### Core intuition

And note the last row. A new video by a creator with 200 previous uploads is barely cold: you have a strong prior from the creator, the category, and the length before a single person watches it.

---

## 3. New items: use what the item already tells you

An item has attributes from the moment it exists - title, description, category, creator, price, thumbnail. None of that needs history.

```text
no interactions  →  but we DO know:
                    "40-minute pasta recipe video, by a creator
                     whose last 30 videos did well with this audience"
```

So a content-based approach, or any model that takes item *features* rather than item *ids*, can place a new item immediately. This is a concrete reason to prefer models that read features over ones that only learn a vector per id - the point returns in Chapter 3.

The creator or seller is often the single most useful attribute: a new video by a known creator is not really cold.

---

## 4. New users: context, onboarding, and speed

```text
minute 0    country, device, language, time, referrer   → popularity within that segment
minute 1    ask: pick three topics you like             → narrow it fast
minute 5    first few clicks                            → the session is now the signal
```

The first session matters disproportionately, because within a few interactions the user is no longer cold. Session-based recommendation - covered in Chapter 4 - exists largely for this, and for users who are never logged in at all.

### Rule of thumb

> A cold user stops being cold after a handful of interactions. Optimize for getting those interactions quickly, not for being clever with zero.

---

## 5. Cold start is also an exposure problem

A new item cannot gather data unless it is shown. But a model with no data about it will rank it low. That is circular:

```text
no data  →  ranked low  →  not shown  →  no data
```

Breaking the loop requires deliberately giving new items impressions they have not earned - which is exploration, in Chapter 6. It costs a little engagement and it is the only thing that gets new inventory off the ground.

### Common issue

Marketplaces feel this hardest: if new listings never surface, sellers leave, and the catalogue stops growing.

---

## 6. The practical pattern

```text
        item age
        │
   new  │  content features + forced exposure
        │            ↓ blend as data arrives
mature  │  learned behavioral signals
```

Most production systems blend the two by confidence, leaning on features while the interaction count is low and shifting to learned signals as it grows. Saying that blending happens gradually - rather than flipping a switch - is the experienced-sounding version of this answer.

---

## What matters most

- **Three separate problems:** new item, new user, new system. Say which one you mean.
- **New items are solved with content features,** which is a real argument for models that read features rather than ids alone.
- **New users are solved with context, a short onboarding, and speed** - a few interactions and they are no longer cold.
- **Cold start is circular:** no data means ranked low means never shown means no data. Only deliberate exposure breaks it.
- **Blend gradually by confidence,** from content signals to behavioral ones, rather than switching over at a threshold.

That completes **Chapter 1 — Foundations**. Next topic is **Content-based filtering**.
