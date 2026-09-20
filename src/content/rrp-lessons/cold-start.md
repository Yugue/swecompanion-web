## Cold start

**Cold start is what happens when there is no history to learn from.** Every method built on interactions has nothing to work with, because the interactions do not exist yet.

### 1. Three different problems

```text
new ITEM    just uploaded, zero interactions      ← most common, most solvable
new USER    just signed up, zero history          ← common, partly solvable
new SYSTEM  launching, no logs at all             ← rare, hardest
```

They are usually lumped together and they have different fixes, so separating them is the first thing to say.

---

### 2. New items: use what the item already tells you

An item has attributes from the moment it exists - title, description, category, creator, price, thumbnail. None of that needs history.

```text
no interactions  →  but we DO know:
                    "40-minute pasta recipe video, by a creator
                     whose last 30 videos did well with this audience"
```

So a content-based approach, or any model that takes item *features* rather than item *ids*, can place a new item immediately. This is a concrete reason to prefer models that read features over ones that only learn a vector per id - the point returns in Chapter 3.

The creator or seller is often the single most useful attribute: a new video by a known creator is not really cold.

---

### 3. New users: context, onboarding, and speed

```text
minute 0    country, device, language, time, referrer   → popularity within that segment
minute 1    ask: pick three topics you like             → narrow it fast
minute 5    first few clicks                            → the session is now the signal
```

The first session matters disproportionately, because within a few interactions the user is no longer cold. Session-based recommendation - covered in Chapter 4 - exists largely for this, and for users who are never logged in at all.

### Rule of thumb

> A cold user stops being cold after a handful of interactions. Optimize for getting those interactions quickly, not for being clever with zero.

---

### 4. Cold start is also an exposure problem

A new item cannot gather data unless it is shown. But a model with no data about it will rank it low. That is circular:

```text
no data  →  ranked low  →  not shown  →  no data
```

Breaking the loop requires deliberately giving new items impressions they have not earned - which is exploration, in Chapter 6. It costs a little engagement and it is the only thing that gets new inventory off the ground.

Marketplaces feel this hardest: if new listings never surface, sellers leave, and the catalogue stops growing.

---

### 5. The practical pattern

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
