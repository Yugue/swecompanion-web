## Handoffs and shared state

Agents coordinate in one of two ways: they pass messages, or they share a workspace. Each has a characteristic failure mode, and naming both is what makes a design answer credible.

### 1. The two models

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

### 2. What a handoff must carry

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

### 3. Typed messages, always

```text
✗  free text: "hey can you double check the pricing thing"
✓  {"type": "verify_request", "claim_id": 7, "claim": "...",
     "source": "...", "requested_by": "w1", "deadline_steps": 5}
```

Free-form inter-agent chatter is unparseable, unloggable, and unfixable. It also drifts: agents start negotiating about the task instead of doing it. A closed set of message types keeps the protocol testable.

---

### 4. Making a shared workspace safe

```text
1. ownership     one writer per file or per record
2. append-only   where possible - conflicts become merges, not overwrites
3. versioning    optimistic concurrency: write fails if the version moved
4. locks         short-lived, with timeouts, for genuinely exclusive edits
5. announce      writes are logged so other agents can notice staleness
```

Note these are ordinary distributed-systems controls. Agents are concurrent writers with unusually poor judgment, so the standard tools apply, more strictly.

---

### 5. Don't let agents read everything

The shared workspace reintroduces the context problem if every agent loads the whole thing. Give agents a **query** interface - read the section you need - rather than a dump, exactly as you would with retrieval.

---

## What you should say in an interview

For "two agents edit the same file in a shared workspace":

> I'd treat them as ordinary concurrent writers, because that's what they are - with worse judgment. The minimum is single ownership: one writer per file or per record, with the other agent submitting a change request rather than writing directly. If they genuinely must both write, I'd use optimistic concurrency - each read carries a version, and a write fails if the version has moved, which forces a re-read and a merge instead of a silent overwrite. Append-only structures help a lot here, since conflicts become merges rather than lost updates. I'd also log every write so a stale reader can notice, cap any lock with a timeout so a crashed agent can't block the system, and give agents a query interface into the workspace rather than letting them load the whole thing, which would undo the context isolation. And I'd make the alternative explicit: if the coordination is getting elaborate, that's evidence these were one task that got split wrongly.

Next topic is **Workflows versus autonomous agents**.
