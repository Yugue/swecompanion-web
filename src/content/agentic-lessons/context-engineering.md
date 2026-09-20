## Context engineering

Context engineering is deciding **what occupies the window on each turn**. It has quietly replaced prompt wording as the main lever on agent quality, because in a long-running agent the prompt is a small and stable part of what the model actually reads.

---

## 1. The window is assembled, not written

```text
every turn:
  [ system prompt + rules ]      stable, cacheable, never evicted
  [ tool schemas ]               pruned by relevance
  [ task state / plan ]          small, structured, never evicted
  [ retrieved evidence ]         re-selected for THIS turn
  [ recent steps, verbatim ]     sliding window
  [ compacted older steps ]      summarized
  [ headroom ]                   room for the next observation
```

### Core intuition

Every one of those lines is a design decision with a token budget. "Prompt engineering" tunes line one; context engineering tunes the whole list.

---

## 2. Two ways to fill the same window

Same task, same model, same 32k budget. Only the assembly differs:

```text
NAIVE - "give it everything, it has a big window"
  system + rules                    1.5k
  all 40 tool schemas               6.0k
  every document we retrieved      18.0k     ← 30 passages, 3 are relevant
  full transcript, verbatim         6.0k
                                   ─────
                                    31.5k    headroom: 500 tokens
```

```text
ENGINEERED
  system + rules                    1.5k
  12 retrieved tool schemas         1.8k     ← only plausible ones this turn
  5 reranked passages               3.0k     ← the 3 relevant ones, plus 2
  task state: goal + constraints    0.4k     ← pinned, never evicted
  last 6 steps verbatim             5.0k
  compacted earlier steps           2.0k
                                   ─────
                                    13.7k    headroom: 18k
```

The second is less than half the size, and it is not merely cheaper. The three relevant passages now compete with two distractors instead of twenty-seven, the tool choice is between twelve options rather than forty, and there is room for the next observation without an emergency truncation.

### Common issue

The naive version also has a subtler problem: at 31.5k of 32k, the very next tool result forces a truncation mid-run, and whatever falls off the end is whatever happened to be oldest - usually the goal.

---

## 3. Relevance beats volume

Adding context is not free even when it fits:

| Adding 20k tokens of "maybe relevant" docs | Effect |
|---|---|
| Cost | Higher, on every subsequent turn |
| Latency | Higher - attention is quadratic in length |
| Accuracy | **Lower** - the needed fact competes with plausible distractors |

This is the counter-intuitive one, and it is worth stating explicitly: a larger context window does not remove the need for selection. It raises the ceiling on what you *can* include and does not change what you *should*.

### Rule of thumb

> Include what the next decision needs. "Just in case" is a cost on three axes at once.

---

## 4. Eviction policy, decided up front

```text
never evict:   goal, hard constraints, user corrections, open plan steps
compact:       old reasoning, superseded observations, long tool payloads
externalize:   large artifacts → file + pointer
drop:          duplicate retrievals, failed attempts already summarized
```

### Rule of thumb

Write this down before the first long run, not after the first truncation incident. The single most common production bug in this area is a user constraint stated at turn 2 that is gone by turn 40.

---

## 5. Order for the cache, and for attention

```text
[system][tools][static docs] ←─ identical each turn → cacheable prefix
[compacted history][recent steps][current turn] ←─ volatile
```

### Rule of thumb

Stable first, volatile last. This maximizes prompt-cache hits and puts the most decision-relevant material closest to the generation point.

---

## 6. Prefer pointers to payloads

```text
✗  observation: 30,000 tokens of CSV
✓  observation: {"rows": 48210, "columns": [...], "path": "/scratch/orders.csv",
                 "preview": "first 5 rows ..."}
```

### Intuition

The agent can then run code against the file. The content is still fully available; it just isn't occupying the window on every subsequent turn.

---

## What matters most

- **The window is assembled every turn,** and deciding what goes in drives quality more than prompt wording does.
- **Relevance beats volume.** Irrelevant context costs money, latency, *and* accuracy at the same time, so a bigger window raises what you *can* include, not what you *should*.
- **Decide the eviction policy before the first long run:** what is never dropped (goal, constraints, user corrections), what gets compacted, what gets externalized.
- **Order stable content first and volatile content last,** so prefix caching can hit and the most decision-relevant material sits nearest the generation point.
- **Prefer pointers to payloads.** A path plus a short preview replaces thirty thousand tokens of CSV, and the content stays fully available.

Next topic is **Retrieval as a tool**.
