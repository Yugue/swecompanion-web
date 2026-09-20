## Context engineering

Context engineering is deciding **what occupies the window on each turn**. It has quietly replaced prompt wording as the main lever on agent quality, because in a long-running agent the prompt is a small and stable part of what the model actually reads.

### 1. The window is assembled, not written

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

Every one of those lines is a design decision with a token budget. "Prompt engineering" tunes line one; context engineering tunes the whole list.

---

### 2. Relevance beats volume

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

### 3. Eviction policy, decided up front

```text
never evict:   goal, hard constraints, user corrections, open plan steps
compact:       old reasoning, superseded observations, long tool payloads
externalize:   large artifacts → file + pointer
drop:          duplicate retrievals, failed attempts already summarized
```

Write this down before the first long run, not after the first truncation incident. The single most common production bug in this area is a user constraint stated at turn 2 that is gone by turn 40.

---

### 4. Order for the cache, and for attention

```text
[system][tools][static docs] ←─ identical each turn → cacheable prefix
[compacted history][recent steps][current turn] ←─ volatile
```

Stable first, volatile last. This maximizes prompt-cache hits and puts the most decision-relevant material closest to the generation point.

---

### 5. Prefer pointers to payloads

```text
✗  observation: 30,000 tokens of CSV
✓  observation: {"rows": 48210, "columns": [...], "path": "/scratch/orders.csv",
                 "preview": "first 5 rows ..."}
```

The agent can then run code against the file. The content is still fully available; it just isn't occupying the window on every subsequent turn.

---

## What you should say in an interview

For "100k tokens of relevant docs, 32k budget - what's your selection policy?":

> I'd budget the window by line item before thinking about retrievers. System prompt, rules, and the task state are fixed and never evicted - maybe 2k. Tool schemas get pruned to what's plausibly needed this turn. Then I'd reserve roughly a third for retrieved evidence, re-selected per turn rather than loaded once, because what's relevant at step 3 isn't what's relevant at step 15. Recent steps stay verbatim in a sliding window, older ones get compacted into a structured summary that preserves identifiers and user constraints exactly, and I'd keep explicit headroom so the next observation can't overflow. The principle underneath is that relevance beats volume: irrelevant context measurably lowers accuracy as well as costing money and latency, so a bigger window wouldn't change the policy. And for anything large I'd store a pointer rather than the payload - write the data to a file and let the agent run code against it, so the content stays available without occupying the window every turn.

Next topic is **Retrieval as a tool**.
