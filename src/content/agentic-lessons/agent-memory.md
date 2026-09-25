## Short-term and long-term memory

"The model remembers" is always false. Within a run, memory is the transcript you resend. Across runs, memory is a **store you deliberately write to and read from**. Everything else is an illusion produced by those two mechanisms.

Chapter 1 covered working context. This lesson is about persistence across runs: what deserves storage, how it is retrieved, and how stale or corrected facts stop influencing future work.

---

## 1. Three kinds, with different lifetimes

| Kind | Lives in | Lifetime | Example |
|---|---|---|---|
| Working | The context window | This turn | The observation just returned |
| Episodic | A store, keyed by session | Across runs | "Last week we tried plan A and it failed" |
| Semantic | A store, keyed by entity | Indefinite | "This user's timezone is CET" |

### Rule of thumb

Procedural knowledge - how this agent does things - lives in the system prompt and tools, not in memory. Keeping that separate avoids the common design where a memory store slowly becomes an un-versioned second prompt.

---

## 2. What "remembering" actually is

A user says something in one session and expects it to hold in the next. Here is what has to happen, because none of it is automatic:

```text
SESSION 1, Tuesday
  user:   "I'm vegetarian, don't suggest meat dishes."
          ↓
  YOU write a record:
          {type:"preference", subject:"user:8812", key:"diet",
           value:"vegetarian", source:"run:441:turn:3",
           confidence:"stated", updated:"2026-03-02"}

  --- the session ends. the model retains NOTHING. ---

SESSION 2, Friday
  user:   "What should I cook tonight?"
          ↓
  YOU retrieve records relevant to this task → the diet preference
          ↓
  YOU put it in the context window
          ↓
  model:  now behaves as though it "remembered"
```

Every step marked YOU is code you wrote. Skip the write and the preference is gone forever. Skip the retrieval and it sits in a database being ignored.

Now the same user in session 3: *"Actually I eat fish now."* The naive implementation appends a second record, and the next retrieval returns both:

```text
{diet: "vegetarian", updated: "2026-03-02"}
{diet: "pescatarian", updated: "2026-03-09"}
        ↑ two contradictory facts in the context, and the model picks one
```

### Common issue

Which is worse than having no memory at all, because it is confidently inconsistent. A correction has to **supersede** the old value, not sit beside it - and that is a design decision in the store, not something the model can resolve.

---

## 3. Writing is the hard part

Nothing persists unless you write it, and writing everything is as bad as writing nothing.

```text
write when:
  ✓ the user states a durable preference or constraint
  ✓ the user corrects the agent
  ✓ a run concludes with a decision or artifact worth resuming from
  ✗ every message (the store becomes noise, retrieval degrades)
```

Write **typed** records, not prose:

```json
{"type": "preference", "subject": "user:8812", "key": "timezone",
 "value": "Europe/Berlin", "source": "run:441:step:6",
 "confidence": "stated", "updated": "2026-09-14"}
```

The `source` field is what lets you audit a wrong memory back to where it came from.

### Rule of thumb

> If you cannot say which future run will read a memory, do not write it.

---

## 4. Reading is retrieval, not loading

```text
✗  load everything about this user into the context every run
✓  retrieve memories relevant to this task, capped, most recent first
```

### Core intuition

Loading everything reintroduces the exact problem memory was meant to solve - a full window of mostly irrelevant tokens. Retrieve by relevance to the current goal, cap the count, and prefer recent over old on ties.

---

## 5. Memory needs a lifecycle

```text
write ──► read ──► CORRECT ──► EXPIRE ──► DELETE
                     ↑            ↑          ↑
            user says otherwise   TTL    user request / policy
```

- **Correction**: a new value must supersede the old, not sit beside it. Two contradictory memories retrieved together is worse than having neither.
- **Expiry**: facts have different lifetimes. A shipping address is durable; "is currently debugging the payments service" is not.
- **Deletion**: users can ask for their data to be removed, and the store must support it - including anything derived from it.

**Memory is a safety surface.** Two specific risks worth naming:

1. **Poisoning.** A memory written from untrusted content becomes a persistent instruction the agent reads on every future run. Never write memories derived from content the agent merely *read*; write from what the user *said* or what a tool authoritatively returned.
2. **Leakage.** Memories must be scoped by user and tenant at the storage layer. Cross-user retrieval is a data breach, not a bug.

---

## What matters most

- **"The model remembers" is always false.** Within a run memory is the transcript you re-send; across runs it is a store you deliberately write to and read from.
- **Working, episodic, and semantic memory have different lifetimes** - and procedural knowledge belongs in the system prompt, not the store, or memory slowly becomes an un-versioned second prompt.
- **Writing is the hard part.** Write typed records with a source, on real triggers - a stated preference, a correction, a concluded run - not on every message.
- **Read by retrieval, not by loading everything,** or you reintroduce the problem memory was meant to solve.
- **Memory needs a lifecycle:** correction must supersede rather than sit beside the old value, facts need expiry, and deletion must reach derived records.
- **Never write memories from content the agent merely read** - an injection that lands in memory is re-read on every future run.

Next topic is **Summarization and compaction**.
