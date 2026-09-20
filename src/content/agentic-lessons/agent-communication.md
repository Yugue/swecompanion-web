## Handoffs and shared state

**Two agents can only work together in one of two ways: send each other messages, or write into the same shared place.**

```text
message passing   → explicit and traceable, but whatever is not in the message is lost
shared workspace  → nothing is lost, but they can overwrite each other
```

Each has a characteristic failure mode, and naming both is what makes a design answer credible.

---

## 1. The two models

```text
message passing:            shared state:

 A ──{findings}──► B         A ──┐
                              ├──► /workspace/notes.md ◄── B
 explicit, traceable          C ──┘
 lossy at the boundary        everything available, concurrent writes
```

| | Message passing | Shared workspace |
|---|---|---|
| Traceability | Every transfer is logged | Must diff the store |
| Loss | High - what isn't in the message is gone | Low |
| Conflicts | None | Lost updates, stale reads |
| Context cost | Bounded by the message | Unbounded if agents read everything |
| Best for | Fan-out/fan-in, handoffs | Collaborative artifacts, long-running state |

---

## 2. What a handoff must carry

```json
{"goal": "...",
 "constraints": ["..."],
 "findings": [{"claim": "...", "source": "...", "confidence": "high"}],
 "already_tried": ["..."],
 "deliverable": {"schema": "..."},
 "budget": {"steps": 10, "usd": 0.20}}
```

`already_tried` and `constraints` are the two fields that get dropped and the two whose absence causes the most waste - repeated dead-end work, and a downstream agent violating a rule it was never told.

### Rule of thumb

> Everything not in the handoff does not exist for the receiving agent. Write it as a spec, not a note.

---

## 3. Typed messages, always

```text
✗  free text: "hey can you double check the pricing thing"
✓  {"type": "verify_request", "claim_id": 7, "claim": "...",
     "source": "...", "requested_by": "w1", "deadline_steps": 5}
```

### Common issue

Free-form inter-agent chatter is unparseable, unloggable, and unfixable. It also drifts: agents start negotiating about the task instead of doing it. A closed set of message types keeps the protocol testable.

---

## 4. Making a shared workspace safe

```text
1. ownership     one writer per file or per record
2. append-only   where possible - conflicts become merges, not overwrites
3. versioning    optimistic concurrency: write fails if the version moved
4. locks         short-lived, with timeouts, for genuinely exclusive edits
5. announce      writes are logged so other agents can notice staleness
```

Note these are ordinary distributed-systems controls. Agents are concurrent writers with unusually poor judgment, so the standard tools apply, more strictly.

**Don't let agents read everything.** The shared workspace reintroduces the context problem if every agent loads the whole thing. Give agents a **query** interface - read the section you need - rather than a dump, exactly as you would with retrieval.

---

## What matters most

- **Message passing is traceable but lossy; a shared workspace loses nothing and invites write conflicts.** Pick knowing which failure you prefer.
- **A handoff must carry goal, constraints, findings, what was already tried, the deliverable shape, and a budget.** The two that get dropped - constraints and already-tried - cause the most waste.
- **Type every message.** Free-text chatter between agents is unloggable, untestable, and drifts into negotiating about the task instead of doing it.
- **A shared workspace needs ordinary distributed-systems controls** - single ownership, append-only where possible, optimistic versioning, timeout-bounded locks - applied more strictly, because agents are concurrent writers with poor judgment.
- **Give agents a query interface into the workspace, not a dump,** or you undo the context isolation.

Next topic is **Context isolation across agents**.
