## Short-term and long-term memory

"The model remembers" is always false. Within a run, memory is the transcript you resend. Across runs, memory is a **store you deliberately write to and read from**. Everything else is an illusion produced by those two mechanisms.

### 1. Three kinds, with different lifetimes

| Kind | Lives in | Lifetime | Example |
|---|---|---|---|
| Working | The context window | This turn | The observation just returned |
| Episodic | A store, keyed by session | Across runs | "Last week we tried plan A and it failed" |
| Semantic | A store, keyed by entity | Indefinite | "This user's timezone is CET" |

Procedural knowledge - how this agent does things - lives in the system prompt and tools, not in memory. Keeping that separate avoids the common design where a memory store slowly becomes an un-versioned second prompt.

---

### 2. Writing is the hard part

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

### 3. Reading is retrieval, not loading

```text
✗  load everything about this user into the context every run
✓  retrieve memories relevant to this task, capped, most recent first
```

Loading everything reintroduces the exact problem memory was meant to solve - a full window of mostly irrelevant tokens. Retrieve by relevance to the current goal, cap the count, and prefer recent over old on ties.

---

### 4. Memory needs a lifecycle

```text
write ──► read ──► CORRECT ──► EXPIRE ──► DELETE
                     ↑            ↑          ↑
            user says otherwise   TTL    user request / policy
```

- **Correction**: a new value must supersede the old, not sit beside it. Two contradictory memories retrieved together is worse than having neither.
- **Expiry**: facts have different lifetimes. A shipping address is durable; "is currently debugging the payments service" is not.
- **Deletion**: users can ask for their data to be removed, and the store must support it - including anything derived from it.

---

### 5. Memory is a safety surface

Two specific risks worth naming:

1. **Poisoning.** A memory written from untrusted content becomes a persistent instruction the agent reads on every future run. Never write memories derived from content the agent merely *read*; write from what the user *said* or what a tool authoritatively returned.
2. **Leakage.** Memories must be scoped by user and tenant at the storage layer. Cross-user retrieval is a data breach, not a bug.

---

## What you should say in an interview

For "a user changes their address - how does it propagate?":

> The write path has to supersede rather than append. When the user states the new address, I write a typed record - entity, key, value, source pointing at the run and step, and a timestamp - and the store marks the previous value as superseded rather than leaving both retrievable, because two contradictory memories retrieved together is worse than having neither. The old value stays in history for auditing but is excluded from retrieval. On the read side I'm retrieving by relevance to the current task and capping the count, not loading the user's whole profile, since that would reintroduce the context problem memory was supposed to solve. I'd also want an expiry policy, because facts have different lifetimes, and a genuine delete path that covers derived records for data-deletion requests. And I'd only write memories from what the user said or what a tool authoritatively returned - never from content the agent merely read, because that's how a web page turns into a permanent instruction.

Next topic is **Summarization and compaction**.
